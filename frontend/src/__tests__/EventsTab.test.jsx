import { render, screen, waitFor } from '@testing-library/react';
import EventsTab from '../components/profile/EventsTab';
import { AppContextProvider } from '../lib/context';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import api from '../lib/api';
import { MemoryRouter } from 'react-router-dom';


vi.mock('../lib/api', () => ({
    default: {
      get: vi.fn()
    }
  }));
beforeAll(() => {
    // Mock window.matchMedia
    global.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));
  });

describe('EventsTab', () => {
  it('shows loading spinner initially', () => {
    render(
      <AppContextProvider>
        <EventsTab username="testuser" />
      </AppContextProvider>
    );

    // Should find something indicating loading
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('displays "Nothing to see here!" when no events are returned', async () => {
    // Mock the API to return no events (empty array) and no error
    api.get.mockResolvedValue({
      data: [], // Mocking an empty event list
      error: null // No error in this case
    });

    render(
      <AppContextProvider>
        <EventsTab username="testuser" />
      </AppContextProvider>
    );

    // Wait for the "Nothing to see here!" message to appear
    await waitFor(() => {
      expect(screen.getByText(/Nothing to see here!/i)).toBeInTheDocument();
    });
  });

  it('displays an error message if fetching fails', async () => {
    // Mock the API to return an error
    api.get.mockResolvedValue({ data: null, error: 'Failed to fetch events' });

    render(
      <AppContextProvider>
        <EventsTab username="testuser" />
      </AppContextProvider>
    );

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch events/i)).toBeInTheDocument();
    });
  });

  it('displays an event if it is passed successfully', async () => {
    // Mock the API to return an event
    const mockEvent = [{ title: 'Test Event', date: '2025-04-28', start_time: '10:00', end_time: '11:00' }];
    api.get.mockResolvedValue({ data: mockEvent, error: null });

    render(
      <MemoryRouter> {/* Wrap with MemoryRouter */}
        <AppContextProvider>
          <EventsTab username="testuser" />
        </AppContextProvider>
      </MemoryRouter>
    );

    // Wait for the event to appear
    await waitFor(() => {
      // Use screen.getByText or any query to ensure it's correctly rendered
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
  });
  
});
