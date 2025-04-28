import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import DayViewEventColumn from '../components/calendar/day/DayViewEventColumn'; 
import { AppContextProvider } from '../lib/context'; 
import '@testing-library/jest-dom';
import api from '../lib/api'


describe('DayViewEventColumn', () => {
    beforeAll(() => {
        // Mock window.matchMedia
        global.matchMedia = vi.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          addListener: vi.fn(),
          removeListener: vi.fn(),
        }));
      });

      it('renders an event title if the event matches the selected date and hour', () => {
        const selectedDate = new Date(2024, 3, 27); // April 27, 2024
        const events = [
          {
            title: 'Test Event',
            date: '2024-04-27', // match the selectedDate
            start_time: '14:00', // 2 PM
            end_time: '15:00',
          }
        ];
    
        render(
          <AppContextProvider>
            <DayViewEventColumn 
              selectedDate={selectedDate}
              events={events}
              onEventClick={() => {}}
              hour={14} // match the start_time hour
            />
          </AppContextProvider>
        );
    
        expect(screen.getByText(/Test Event/i)).toBeTruthy();
      });

      it('calls onEventClick when an event is clicked', () => {
        const selectedDate = new Date(2024, 3, 27); // April 27, 2024
        const mockOnEventClick = vi.fn();
        const events = [
          {
            title: 'Clickable Event',
            date: '2024-04-27',
            start_time: '10:00',
            end_time: '11:00',
          }
        ];
    
        render(
          <AppContextProvider>
            <DayViewEventColumn 
              selectedDate={selectedDate}
              events={events}
              onEventClick={mockOnEventClick}
              hour={10}
            />
          </AppContextProvider>
        );
    
        const eventElement = screen.getByText(/Clickable Event/i);
        fireEvent.click(eventElement);
    
        expect(mockOnEventClick).toHaveBeenCalledTimes(1);
        expect(mockOnEventClick).toHaveBeenCalledWith(events[0]);
      });

      it('renders no events if none match the selected date and hour', () => {
        const selectedDate = new Date(2024, 3, 27); // April 27, 2024
        const events = [
          {
            title: 'Another Event',
            date: '2024-04-28', // Different date
            start_time: '09:00',
            end_time: '10:00',
          }
        ];
    
        render(
          <AppContextProvider>
            <DayViewEventColumn 
              selectedDate={selectedDate}
              events={events}
              onEventClick={() => {}}
              hour={10}
            />
          </AppContextProvider>
        );
    
        // The event "Another Event" should NOT be in the document
        expect(screen.queryByText(/Another Event/i)).not.toBeInTheDocument();
      });

      it('renders multiple overlapping events in the same hour', () => {
        const selectedDate = new Date(2024, 3, 27); // April 27, 2024
        const events = [
          {
            title: 'Event One',
            date: '2024-04-27',
            start_time: '10:00',
            end_time: '11:00',
          },
          {
            title: 'Event Two',
            date: '2024-04-27',
            start_time: '10:00',
            end_time: '11:00',
          }
        ];
    
        render(
          <AppContextProvider>
            <DayViewEventColumn 
              selectedDate={selectedDate}
              events={events}
              onEventClick={() => {}}
              hour={10}
            />
          </AppContextProvider>
        );
    
        // Check if both events are rendered
        expect(screen.getByText(/Event One/i)).toBeInTheDocument();
        expect(screen.getByText(/Event Two/i)).toBeInTheDocument();
      });
});
