import React, { useState } from 'react';
import NavBar from './NavBar';
import './App.css';

const CreateEvent = () => {
  const [eventDetails, setEventDetails] = useState({
    title: '',
    description: '',
    day: '',
    location: '',
    startTime: '',
    endTime: '',
    reminder: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventDetails({
      ...eventDetails,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Event Details:', eventDetails);
  };

  const handleCancel = () => {
    setEventDetails({
      title: '',
      description: '',
      day: '',
      location: '',
      startTime: '',
      endTime: '',
      reminder: false,
    });
  };

  return (
    <div className="create-event-container">
      <h1>Create an Event</h1>
      <NavBar/>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={eventDetails.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={eventDetails.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="day">Day:</label>
          <input
            type="date"
            id="day"
            name="day"
            value={eventDetails.day}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={eventDetails.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="startTime">Start Time:</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={eventDetails.startTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endTime">End Time:</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={eventDetails.endTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="reminder"
              checked={eventDetails.reminder}
              onChange={handleChange}
            />
            Set Reminder
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save Event
          </button>
          <button type="button" onClick={handleCancel} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
