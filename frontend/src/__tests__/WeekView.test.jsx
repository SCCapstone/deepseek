import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import WeekViewDayColumn from '../components/calendar/week/WeekViewDayColumn'; 
import { AppContextProvider } from '../lib/context'; 
import '@testing-library/jest-dom';

describe('WeekViewDayColumn', () => {
  beforeAll(() => {
    // Mock window.matchMedia
    global.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));
  });

  it('renders an event title if the event matches the selected day and hour', () => {
    const selectedDate = new Date(2025, 3, 25); // April 25, 2025
    const events = [
      {
        title: 'Test Event',
        date: '2025-04-25', // match the selectedDate
        start_time: '12:00', // 12 PM
        end_time: '13:00',
      }
    ];

    render(
      <AppContextProvider>
        <WeekViewDayColumn
          day={selectedDate}
          events={events}
          onEventClick={() => {}}
          backgroundColor="white"
          borderColor="black"
          hour={12} // match the start_time hour
        />
      </AppContextProvider>
    );

    expect(screen.getByText(/Test Event/i)).toBeInTheDocument();
  });

  it('renders no events if none match the selected day and hour', () => {
    const selectedDate = new Date(2025, 3, 25); // April 25, 2025
    const events = [
      {
        title: 'Another Event',
        date: '2025-04-26', // Different day
        start_time: '12:00',
        end_time: '13:00',
      }
    ];

    render(
      <AppContextProvider>
        <WeekViewDayColumn
          day={selectedDate}
          events={events}
          onEventClick={() => {}}
          backgroundColor="white"
          borderColor="black"
          hour={12}
        />
      </AppContextProvider>
    );

    // The event "Another Event" should NOT be in the document
    expect(screen.queryByText(/Another Event/i)).not.toBeInTheDocument();
  });

  it('renders multiple events in the same hour', () => {
    const selectedDate = new Date(2025, 3, 25); // April 25, 2025
    const events = [
      {
        title: 'Event One',
        date: '2025-04-25', // Same date
        start_time: '10:00',
        end_time: '11:00',
      },
      {
        title: 'Event Two',
        date: '2025-04-25', // Same date
        start_time: '10:00',
        end_time: '11:00',
      }
    ];

    render(
      <AppContextProvider>
        <WeekViewDayColumn
          day={selectedDate}
          events={events}
          onEventClick={() => {}}
          backgroundColor="white"
          borderColor="black"
          hour={10}
        />
      </AppContextProvider>
    );

    // Check if both events are rendered
    expect(screen.getByText(/Event One/i)).toBeInTheDocument();
    expect(screen.getByText(/Event Two/i)).toBeInTheDocument();
  });

  it('calls onEventClick when an event is clicked', () => {
    const selectedDate = new Date(2025, 3, 25); // April 25, 2025
    const mockOnEventClick = vi.fn(); // Mock the onEventClick function
    const events = [
      {
        title: 'Test Event',
        date: '2025-04-25', // Same date
        start_time: '10:00',
        end_time: '11:00',
      }
    ];

    render(
      <AppContextProvider>
        <WeekViewDayColumn
          day={selectedDate}
          events={events}
          onEventClick={mockOnEventClick} // Pass the mock function
          backgroundColor="white"
          borderColor="black"
          hour={10}
        />
      </AppContextProvider>
    );

    const eventElement = screen.getByText(/Test Event/i); // Find the event by title
    fireEvent.click(eventElement); // Simulate a click on the event

    // Ensure the mock function was called once
    expect(mockOnEventClick).toHaveBeenCalledTimes(1);
    expect(mockOnEventClick).toHaveBeenCalledWith(events[0]); // Check if it was called with the correct event
  });
});
