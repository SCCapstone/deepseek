"""
Flask routes for event-related API endpoints
"""
import logging
from flask import Blueprint, request, make_response

from db import Event
from utils.auth_utils import *
from utils.data_utils import *
from utils.error_utils import *


event_router = Blueprint('event_router', __name__)
logger = logging.getLogger(__name__)


@event_router.route('/add-event', methods=['POST'])
@login_required
@data_filter({
    'title': {'type': str, 'required': True},
    'start_time': {'type': str, 'required': True},
    'end_time': {'type': str, 'required': True},
    'description': {'type': str},
    'location': {'type': str},
    'reminder': {'type': bool},
    'public': {'type': bool},
})
def add_event(current_user):
    event_data = request.json
    event_data['user_id'] = current_user._id
    Event.create(**event_data)
    return make_response({'message': 'Event created'}, 201)


@event_router.route('/get-events', methods=['GET'])
@login_required
def get_events(current_user):
    events = current_user.events
    event_data = [x.to_dict() for x in events]
    return make_response({'message': 'Events retrieved', 'data': event_data})


@event_router.route('/get-event/<event_id>', methods=['GET'])
@login_required
def get_event(current_user, event_id):
    # finding event in user's own events
    user_event = Event.find_one(_id=ObjectId(event_id), user_id=current_user._id)
    if user_event:
        return make_response({'data': user_event.to_dict()})

    # getting ids of all user's friends    
    user_friends = current_user.friends
    friend_ids = [x._id for x in user_friends]

    # finding event within friend events
    friend_event = Event.find_one(_id=ObjectId(event_id), user_id=friend_ids)
    if friend_event:
        return make_response({'data': friend_event.to_dict()})
    
    # event not found
    raise NotFoundError('Invalid event id `%s`' % event_id)
    

@event_router.route('/update-event/<event_id>', methods=['POST'])
@login_required
@data_filter({
    'title': {'type': str},
    'start_time': {'type': str},
    'end_time': {'type': str},
    'description': {'type': str},
    'location': {'type': str},
    'reminder': {'type': bool},
    'public': {'type': bool},
})
def update_event(current_user, event_id):
    data = request.json
    event = Event.find_one(_id=ObjectId(event_id), user_id=current_user._id)
    event.update(data)
    return make_response({'message': 'Event updated'})


@event_router.route('/events/notifications')
@login_required
def get_notifications(current_user):
    notifications = current_user.notifications
    notification_data = [x.to_dict() for x in notifications]
    return make_response({'message': 'Notifications retrieved', 'data': notification_data})


@event_router.route('/events/notifications/clear', methods=['POST'])
@login_required
def clear_notifications(current_user):
    notifications = current_user.notifications
    if len(notifications) == 0:
        return make_response({'message': 'No notifications to clear'})
    for x in notifications:
        x.delete()
    return make_response({'message': 'Notifications cleared'})


@event_router.route('/get-friends-events', methods=['GET'])
@login_required
def get_friends_events(current_user):
    friends = current_user.friends
    friend_events = []
    for friend in friends:
        friend_events.extend(friend.events)
    event_data = [x.data for x in friend_events]
    return make_response({'message': 'Friends events retrieved', 'data': event_data})