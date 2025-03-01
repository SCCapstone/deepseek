"""
Flask routes for event-related API endpoints
"""
from flask import Blueprint, request, make_response

from db import Event
from utils.auth_utils import *
from utils.data_utils import *


event_router = Blueprint('event_router', __name__)


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
    event_data = [x.data for x in events]
    return make_response({'message': 'Events retrieved', 'data': event_data})


@event_router.route('/get-event/<event_id>', methods=['GET'])
@login_required
def get_event(current_user, event_id):
    event = Event.find(_id=ObjectId(event_id), user_id=current_user._id)
    return jsonify({'message': 'Event retrieved', 'data': loads(dumps(event))})
    

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
    event = Event.find(_id=ObjectId(event_id), user_id=current_user._id)
    event.update(data)
    return make_response({'message': 'Event updated'})