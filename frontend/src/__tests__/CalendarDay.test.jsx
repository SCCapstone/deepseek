import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import CalendarDay from '../components/calendar/day/CalendarDay'; 
import { AppContextProvider } from '../lib/context'; 
import '@testing-library/jest-dom';

describe('CalendarDay', () => {

    beforeAll(() => {
        // Mock window.matchMedia
        global.matchMedia = vi.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          addListener: vi.fn(),
          removeListener: vi.fn(),
        }));
      });

  it('renders the correct day number and displays events', () => {
    const day = { date: new Date(2025, 3, 25) }; // April 25, 2025
    const events = [
      { title: 'Event One', date: '2025-04-25', start_time: '09:00', end_time: '10:00' },
      { title: 'Event Two', date: '2025-04-25', start_time: '11:00', end_time: '12:00' }
    ];
    const selectedDate = new Date(2025, 3, 25);
    const mockOnDayClick = vi.fn();
    const mockOnEventClick = vi.fn();
    const view = 'day'; // or 'week' depending on your view

    render(
      <AppContextProvider>
        <CalendarDay
          day={day}
          events={events}
          selectedDate={selectedDate}
          onDayClick={mockOnDayClick}
          view={view}
          onEventClick={mockOnEventClick}
        />
      </AppContextProvider>
    );

    // Check if the day number is rendered correctly
    expect(screen.getByText('25')).toBeInTheDocument();

    // Check if events are displayed
    expect(screen.getByText('Event One')).toBeInTheDocument();
    expect(screen.getByText('Event Two')).toBeInTheDocument();
  });

  it('calls onDayClick when the day is clicked', () => {
    const day = { date: new Date(2025, 3, 25) }; // April 25, 2025
    const events = [];
    const selectedDate = new Date(2025, 3, 25);
    const mockOnDayClick = vi.fn();
    const mockOnEventClick = vi.fn();
    const view = 'day';

    render(
      <AppContextProvider>
        <CalendarDay
          day={day}
          events={events}
          selectedDate={selectedDate}
          onDayClick={mockOnDayClick}
          view={view}
          onEventClick={mockOnEventClick}
        />
      </AppContextProvider>
    );

    // Simulate a click on the day
    const dayElement = screen.getByText('25');
    fireEvent.click(dayElement);

    // Check if the onDayClick function is called
    expect(mockOnDayClick).toHaveBeenCalledTimes(1);
    expect(mockOnDayClick).toHaveBeenCalledWith(day);
  });

  

});
