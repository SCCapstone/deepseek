import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';  // Needed for Link
import FriendsTab from '../components/profile/FriendsTab';
import '@testing-library/jest-dom';
import { AppContextProvider } from '../lib/context';
import api from '../lib/api';

// Mock the api module
vi.mock('../lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
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

describe('FriendsTab', () => {
  it('displays "Nothing to see here!" if there are no friends', async () => {
    // Mock the API to return an empty array of friends
    api.get.mockResolvedValue({ data: [], error: null });

    render(
      <MemoryRouter>
        <AppContextProvider>
          <FriendsTab />
        </AppContextProvider>
      </MemoryRouter>
    );

    // Wait for the loading state to finish
    await waitFor(() => expect(screen.queryByText('Nothing to see here!')).toBeInTheDocument());
  });

  it('displays a list of friends if the user has friends', async () => {
    // Mock the API to return a list of friends
    const mockFriends = [
      { username: 'john_doe', name: 'John Doe', profile_picture: 'john.jpg' },
      { username: 'jane_smith', name: 'Jane Smith', profile_picture: 'jane.jpg' },
    ];
    api.get.mockResolvedValue({ data: mockFriends, error: null });

    render(
      <MemoryRouter>
        <AppContextProvider>
          <FriendsTab />
        </AppContextProvider>
      </MemoryRouter>
    );

    // Wait for the loading state to finish and the friends list to appear
    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});
