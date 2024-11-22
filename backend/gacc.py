from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

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

    def fetch_calendar_events(self, session, max_results=10):
        """
        Fetches events from the user's primary Google Calendar. The credentials are stored in the session.
            session (dict): The Flask session object containing OAuth credentials.
            max_results (int): The maximum number of events to fetch (default is 10).
        Returns:
            list: A list of events from the user's Google Calendar.
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

        return events_result.get("items", [])

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
