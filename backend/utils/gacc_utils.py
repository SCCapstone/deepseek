from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from datetime import datetime
from bson import ObjectId
from db import User, Event
# TODO find a better way to store the google secret file, kinda just chilling in a JSON in the app directory
class GoogleCalendar:
    def __init__(self, client_secrets_file, scopes, redirect_uri):
        """
            client_secrets_file (str): Path to the client secrets JSON file. should really find a better way to this
            scopes (list): List of OAuth 2.0 scopes.
            redirect_uri (str): Redirect URI for the OAuth flow.
        """
        self.client_secrets_file = client_secrets_file
        self.scopes = scopes
        self.redirect_uri = redirect_uri

    def get_authorization_url(self, session):
        """
        Generates the Google OAuth 2.0 authorization URL and stores the state in the session.
            session (dict): The Flask session object to store the OAuth state.
        Returns:
            str: The authorization URL for the user to visit.
        """
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
        """
        Exchanges the authorization code for OAuth 2.0 credentials and saves them to the session.
            session (dict): The Flask session object to store credentials.
            authorization_response (str): The full URL of the authorization response.
        Returns:
            dict: A dictionary representation of the credentials.
        """
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
        """Parse Google Calendar event into our app's format."""
        try:
            # Get start and end times, handling both dateTime and date formats
            start = event.get('start', {})
            end = event.get('end', {})
            
            start_time = start.get('dateTime') or start.get('date')
            end_time = end.get('dateTime') or end.get('date')

            # If datetime includes seconds, strip them and adjust time (-1 hour)
            if start_time and 'T' in start_time:
                dt = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
                start_time = dt.strftime('%Y-%m-%dT%H:%M')

            if end_time and 'T' in end_time:
                dt = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
                end_time = dt.strftime('%Y-%m-%dT%H:%M')

            event_data = {
                "title": event.get('summary', 'Untitled Event'),
                "description": event.get('description', ''),
                "start_time": start_time,
                "end_time": end_time,
                "visibility": event.get('visibility', 'default') == 'public'
            }
            
            return event_data
        except Exception as e:
            print(f"Error parsing event: {e}")
            return None

    def fetch_calendar_events(self, session, max_results=10):
        """
        Fetches and parses events from the user's primary Google Calendar.
        """
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
        """
        Converts OAuth 2.0 credentials into a dictionary.
            credentials (Credentials): The OAuth 2.0 credentials object.
        Returns:
            dict: A dictionary representation of the credentials.
        """
        return {
            "token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_uri": credentials.token_uri,
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
            "scopes": credentials.scopes,
        }

    def handle_callback(self, session, request_url, user_id):
        """Handle the OAuth callback and event import."""
        try:
            credentials = self.exchange_code_for_credentials(session, request_url)
            events = self.fetch_calendar_events(session)
            
            # Log the auth_token for debugging
            print(f"Debug: user_id received: {user_id}")

            # Get current user based on auth_token
            current_user = User.find_one(_id=ObjectId(user_id))  # Assuming User class has a method to find by token
            if not current_user:
                print("Error: User not found for the provided auth_token.")
                return None, user_id

            if not events:
                print("Warning: No events found for the user.")
                return 0, "No events found"

            # Import events
            events_added = self.import_events(events, current_user)
            return events_added, None
            
        except Exception as e:
            print(f"Error in Google callback: {e}")
            return None, str(e)

    def import_events(self, events, current_user):
        """Import Google Calendar events for a user."""
        # Get existing event titles
        existing_events = Event.find(user_id=ObjectId(current_user._id))  # Assuming Event class has a method to find by user_id
        existing_titles = {event.title for event in existing_events}
        
        events_added = 0
        for event in events:
            title = event['title']
            if title in existing_titles:
                continue

            event_data = {
                "title": title,
                "description": event['description'],
                "start_time": event['start_time'],
                "end_time": event['end_time'],
                "public": False,  
                "reminder": False,  
                "reminder_sent": False,  
                "location": event.get('location', None),  
                "user_id": ObjectId(current_user._id)  
            }
            
            Event.create(**event_data)  # Create the event using the Event class
            events_added += 1
            existing_titles.add(title)
            
        return events_added
