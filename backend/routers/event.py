"""
Flask routes for event-related API endpoints
"""
import logging
from bson.objectid import ObjectId
from flask import Blueprint, request, make_response

from db import Event, User, Notification
from utils.auth_utils import *
from utils.data_utils import *
from utils.error_utils import *


event_router = Blueprint('event_router', __name__)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


@event_router.route('/add-event', methods=['POST'])
@login_required
@data_filter({
    'title': {'type': str, 'required': True},
    'date': {'type': str, 'required': True},
    'start_time': {'type': str, 'required': True},
    'end_time': {'type': str, 'required': True},
    'description': {'type': str},
    'location': {'type': str},
    'set_reminder': {'type': bool},
    'public': {'type': bool},
    'created_at': {'type': datetime},
})
def add_event(current_user: User):
    event_data = request.json
    event_data['user_id'] = current_user._id
    event_data['created_at'] = datetime.now()
    Event.create(**event_data)
    return make_response({'message': 'Event created'}, 201)


@event_router.route('/get-events')
@login_required
def get_events(current_user: User):
    events = current_user.events
    event_data = [x.to_dict() for x in events]
    return make_response({'message': 'Events retrieved', 'data': event_data})


@event_router.route('/get-user-events/<username>')
def get_user_events(username: str):
    user = User.find_one(username=username)
    if not user:
        raise NotFoundError('No user with that username')
    
    public_events = Event.find(user_id=user._id, public=True)
    event_data = [x.to_dict() for x in public_events]
    return make_response({'data': event_data})


@event_router.route('/get-event/<event_id>')
@login_required
def get_event(current_user: User, event_id: str):
    # finding event in database
    event = Event.find_one(_id=ObjectId(event_id))
    if not event:
        logger.error('Invalid event id `%s`' % event_id)
        raise NotFoundError('Invalid event id `%s`' % event_id)
    
    # making sure user has read access
    event_user = User.find_one(_id=event.user_id)
    if event_user != current_user:
        # if the event is not owned by the user, then the user can only
        # view if it is owned by a friend
        friend_status = current_user.get_friend_status(event_user)
        if friend_status != 'friend':
            raise ForbiddenError('You do not have access to this event')
    
    event_user_data = event_user.profile
    event_data = event.to_dict()
    event_data['user'] = event_user_data
    # for frontend to check if the current user has liked the event
    event_data['liked_by_current_user'] = event._id in current_user.liked_events
    return make_response({'data': event_data})


@event_router.route('/update-event/<event_id>', methods=['POST'])
@login_required
@data_filter({
    'title': {'type': str},
    'start_time': {'type': str},
    'end_time': {'type': str},
    'description': {'type': str},
    'location': {'type': str},
    'set_reminder': {'type': bool},
    'public': {'type': bool},
})
def update_event(current_user: User, event_id: str):
    data = request.json
    event = Event.find_one(_id=ObjectId(event_id), user_id=current_user._id)
    if not event:
        logger.error('Invalid event id `%s`' % event_id)
        raise NotFoundError('Invalid event id `%s`' % event_id)
    event.update(**data)
    logger.info('Event updated: %s' % event_id)
    return make_response({'message': 'Event updated'})


@event_router.route('/delete-event/<event_id>', methods=['POST'])
@login_required
def delete_event(current_user: User, event_id: str):
    event = Event.find_one(_id=ObjectId(event_id), user_id=current_user._id)
    if not event:   
        raise NotFoundError('Invalid event id `%s`' % event_id)
    event.delete()
    logger.info('Event deleted: %s' % event_id)
    notifications = current_user.notifications
    for notif in notifications:
        if notif.event_id == event._id:
            notif.delete()
            logger.info('Notification deleted: %s' % notif._id)
    return make_response({'message': 'Event deleted'})

@event_router.route('/get-event-comments/<event_id>')
@login_required
def get_event_comments(current_user: User, event_id: str):
    event = Event.find_one(_id=ObjectId(event_id))
    if not event:
        raise NotFoundError('Invalid event id `%s`' % event_id)
    
    event_user = User.find_one(_id=event.user_id)
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
    
    data = request.json
    body = data['body']
    event.add_comment(current_user._id, body)
    return make_response({'message': 'Successfully commented on event'}, 201)


@event_router.route('/events/notifications')
@login_required
def get_notifications(current_user: User):
    notifications = current_user.notifications
    notification_data = [x.to_dict() for x in notifications]
    logger.info('Notifications retrieved: %s' % notification_data)
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


@event_router.route('/events/notifications/clear/<notification_id>', methods=['POST'])
@login_required
def clear_notification(current_user: User, notification_id: str):
    notifications = current_user.notifications
    for x in notifications:
        if x._id == ObjectId(notification_id):
            x.delete()
            return make_response({'message': 'Notification cleared'})
    raise NotFoundError('Invalid notification id `%s`' % notification_id)

@event_router.route('/get-friends-events')
@login_required
def get_friends_events(current_user: User):
    # getting user's friends
    friends = current_user.friends

    # finding events that belong to user's friends
    friend_events = []
    for friend in friends:
        friend_events.extend(friend.events)
    
    # serializing event data
    event_data = [x.to_dict() for x in friend_events]

    # serializing user data for each event
    for (event, _event_data) in zip(friend_events, event_data):
        user = User.find_one(_id=ObjectId(event.user_id))
        user_data = user.profile
        _event_data['user'] = user_data

    return make_response({'message': 'Friends events retrieved', 'data': event_data})


@event_router.route('/event/<event_id>/like', methods=['POST'])
@login_required
def like_event(current_user: User, event_id: str):
    try:
        event_object_id = ObjectId(event_id)
    except Exception:
        raise NotFoundError('Invalid event id `%s`' % event_id)

    # Check if the event exists and user has access (similar logic to get_event)
    event = Event.find_one(_id=event_object_id)
    if not event:
        raise NotFoundError('Invalid event id `%s`' % event_id)
    
    event_user = User.find_one(_id=event.user_id)
    if event_user != current_user:
        friend_status = current_user.get_friend_status(event_user)
        # Allow liking public events or events of friends
        if not event.public and friend_status != 'friend':
             raise ForbiddenError('You do not have permission to like this event')

    current_user.like_event(event_object_id)
    return make_response({'message': 'Event liked successfully'}, 200)


@event_router.route('/event/<event_id>/unlike', methods=['POST'])
@login_required
def unlike_event(current_user: User, event_id: str):
    try:
        event_object_id = ObjectId(event_id)
    except Exception:
        raise NotFoundError('Invalid event id `%s`' % event_id)
        
    # Basic check if event exists, User.unlike_event handles the rest
    event = Event.find_one(_id=event_object_id)
    if not event:
        raise NotFoundError('Invalid event id `%s`' % event_id)
        
    current_user.unlike_event(event_object_id)
    return make_response({'message': 'Event unliked successfully'}, 200)