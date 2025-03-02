"""
Flask routes for event-related API endpoints
"""
import logging
from flask import Blueprint, request, make_response

from db import Event, User
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
def add_event(current_user: User):
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
def get_event(current_user: User, event_id: str):
    # finding event in database
    event = Event.find_one(_id=ObjectId(event_id))
    if not event:
        raise NotFoundError('Invalid event id `%s`' % event_id)
    
    # making sure user has read access
    event_user = User.find_one(_id=event.user_id)
    if event_user != current_user:
        # if the event is not owned by the user, then the user can only
        # view if it is owned by a friend
        friend_status = current_user.get_friend_status(event_user)
        if friend_status != 'friend':
            raise ForbiddenError('You do not have access to this event')
    
    return make_response({'data': event.to_dict()})


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
def update_event(current_user: User, event_id: str):
    data = request.json
    event = Event.find_one(_id=ObjectId(event_id), user_id=current_user._id)
    if not event:
        raise NotFoundError('Invalid event id `%s`' % event_id)
    event.update(**data)
    return make_response({'message': 'Event updated'})


@event_router.route('/get-event-comments/<event_id>')
@login_required
def get_event_comments(current_user: User, event_id: str):
    event = Event.find_one(_id=ObjectId(event_id))
    if not event:
        raise NotFoundError('Invalid event id `%s`' % event_id)
    
    event_user = User.find_one(_id=event_id)
    if current_user != event_user:
        friend_status = current_user.get_friend_status(event_user)
        if friend_status != 'friend':
            raise ForbiddenError('You do not have access to this event')
    
    comments = event.comments
    comment_data = [x.to_dict() for x in comments]
    for x in comment_data:
        comment_user = User.find_one(_id=x['user_id'])
        x['user'] = comment_user.profile
        del x['user_id']
        
    return make_response({'data': comment_data})


@event_router.route('/add-event-comment/<event_id>', methods=['POST'])
@login_required
@data_filter({'body': {'type': str}})
def add_event_comment(current_user: User, event_id: str):
    event = Event.find_one(_id=ObjectId(event_id))
    if not event:
        raise NotFoundError('Invalid event id `%s`' % event_id)
    
    event_user = User.find_one(_id=event.user_id)
    if current_user != event_user:
        friend_status = current_user.get_friend_status(event_user)
        if friend_status != 'friend':
            raise ForbiddenError('You do not have access to this event')
    
    event.add_comment(current_user._id, body)
    return make_response({'message': 'Successfully commented on event'}, 201)


@event_router.route('/events/notifications')
@login_required
def get_notifications(current_user: User):
    notifications = current_user.notifications
    notification_data = [x.to_dict() for x in notifications]
    return make_response({'message': 'Notifications retrieved', 'data': notification_data})


@event_router.route('/events/notifications/clear', methods=['POST'])
@login_required
def clear_notifications(current_user: User):
    notifications = current_user.notifications
    if len(notifications) == 0:
        return make_response({'message': 'No notifications to clear'})
    for x in notifications:
        x.delete()
    return make_response({'message': 'Notifications cleared'})


@event_router.route('/get-friends-events', methods=['GET'])
@login_required
def get_friends_events(current_user: User):
    friends = current_user.friends
    friend_events = []
    for friend in friends:
        friend_events.extend(friend.events)
    event_data = [x.to_dict() for x in friend_events]
    return make_response({'message': 'Friends events retrieved', 'data': event_data})