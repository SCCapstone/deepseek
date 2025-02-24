from flask import Blueprint, request, make_response

from db import User, Event
from utils.auth_utils import *
from utils.data_utils import *


event_router = Blueprint('event_router', __name__)


@event_router.route('/addevent', methods=['POST'])
@login_required
@require_data('title', 'description', 'start_time', 'end_time')
def add_event(current_user):
    event_data = request.json
    event_data['user_id'] = current_user._id
    Event.create(**event_data)
    return make_response({'message': 'Event created'}, 201)


@event_router.route('/get-events', methods=['GET'])
@login_required
def get_events(current_user):
    events = current_user.events
    event_data = [x.dict() for x in events]
    return make_response({'message': 'Events retrieved', 'data': event_data})


@event_router.route('/get-event/<event_id>', methods=['GET'])
@login_required
def get_event(current_user, event_id):
    event = Event.find(_id=ObjectId(event_id), user_id=current_user._id)
    return jsonify({'message': 'Event retrieved', 'data': loads(dumps(event))})
    

@event_router.route('/update-event/<event_id>', methods=['POST'])
@login_required
def update_event(current_user, event_id):
    data = request.json
    event = Event.find(_id=ObjectId(event_id), user_id=current_user._id)
    event.update(data)
    return make_response({'message': 'Event updated'})