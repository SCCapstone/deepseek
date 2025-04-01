from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from datetime import datetime
from bson import ObjectId
from db import User, Event

# TODO find a better way to store the google secret file, kinda just chilling in a JSON in the app directory
class GoogleCalendar:
    def __init__(self, client_secrets_file, scopes, redirect_uri):
        self.client_secrets_file = client_secrets_file
        self.scopes = scopes
        self.redirect_uri = redirect_uri

    def get_authorization_url(self, session):
        flow = Flow.from_client_secrets_file(
            self.client_secrets_file,
            scopes=self.scopes,
            redirect_uri=self.redirect_uri,
        )
        authorization_url, state = flow.authorization_url(
            access_type="offline", include_granted_scopes="true"
        )
        session["state"] = state
        return authorization_url

    def exchange_code_for_credentials(self, session, authorization_response):
        state = session.get("state")
        if not state:
            raise ValueError("Missing OAuth state in session.")
        
        flow = Flow.from_client_secrets_file(
            self.client_secrets_file,
            scopes=self.scopes,
            redirect_uri=self.redirect_uri,
            state=state,
        )
        
        flow.fetch_token(authorization_response=authorization_response)
        credentials = flow.credentials
        session["credentials"] = self._credentials_to_dict(credentials)
        return self._credentials_to_dict(credentials)

    def parse_calendar_event(self, event):
        try:
            start = event.get('start', {})
            end = event.get('end', {})
            
            # Extract date:
            # 1. If 'date' is directly available in start, use it (all-day event)
            # 2. Otherwise extract date portion from dateTime if available
            date = None
            if 'date' in start:
                # All-day event
                date = start.get('date')
            elif 'dateTime' in start:
                # Event with specific time
                dt = datetime.fromisoformat(start.get('dateTime').replace('Z', '+00:00'))
                date = dt.strftime('%Y-%m-%d')

            # Extract times:
            start_time = None
            end_time = None
            
            # Only extract time if dateTime is available (not an all-day event)
            if 'dateTime' in start:
                dt = datetime.fromisoformat(start.get('dateTime').replace('Z', '+00:00'))
                start_time = dt.strftime('%H:%M')
                
            if 'dateTime' in end:
                dt = datetime.fromisoformat(end.get('dateTime').replace('Z', '+00:00'))
                end_time = dt.strftime('%H:%M')

            event_data = {
                "title": event.get('summary', 'Untitled Event'),
                "description": event.get('description', ''),
                "date": date,
                "start_time": start_time,
                "end_time": end_time,
                "location": event.get('location', None),
                "public": event.get('visibility', 'default') == 'public',
                "set_reminder": False,
                "reminder_sent": False,
                "created_at": None
            }
            
            return event_data
        except Exception as e:
            print(f"Error parsing event: {e}")
            return None

    # pulls events from the user's primary google calendar and returns them
    # parsed into our format
    def fetch_calendar_events(self, session, max_results=10):
        if "credentials" not in session:
            raise ValueError("Missing credentials in session.")
        
        credentials = Credentials(**session["credentials"])
        service = build("calendar", "v3", credentials=credentials)

        events_result = service.events().list(
            calendarId="primary",
            maxResults=max_results,
            singleEvents=True,
            orderBy="startTime",
        ).execute()

        events = events_result.get("items", [])
        if not events:
            print("Warning: No events found in the calendar.")
        
        parsed_events = []
        
        for event in events:
            parsed_event = self.parse_calendar_event(event)
            if parsed_event:
                parsed_events.append(parsed_event)
        
        return parsed_events

    @staticmethod
    def _credentials_to_dict(credentials):
        return {
            "token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_uri": credentials.token_uri,
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
            "scopes": credentials.scopes,
        }

    def handle_callback(self, session, request_url, user_id):
        try:
            credentials = self.exchange_code_for_credentials(session, request_url)
            events = self.fetch_calendar_events(session)

            current_user = User.find_one(_id=ObjectId(user_id))
            if not current_user:
                return None, user_id

            if not events:
                return 0, "No events found"

            events_added = self.import_events(events, current_user)
            return events_added, None
            
        except Exception as e:
            return None, str(e)

    def import_events(self, google_events, current_user):
        existing_events = Event.find(user_id=ObjectId(current_user._id))
        existing_titles = {event.title for event in existing_events}
        
        events_added = 0
        for event in google_events:
            title = event['title']
            if title in existing_titles:
                continue

            event_data = {
                "title": title,
                "description": event['description'],
                "start_time": event['start_time'],
                "end_time": event['end_time'],
                "date": event['date'],
                "public": event['public'],  
                "set_reminder": event['set_reminder'],  
                "reminder_sent": event['reminder_sent'],  
                "location": event['location'],  
                "user_id": ObjectId(current_user._id)  
            }
            
            Event.create(**event_data)  # Create the event using the Event class
            events_added += 1
            existing_titles.add(title)
            
        return events_added
