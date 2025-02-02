import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '../pages/Profile.js';
import { AppContextProvider } from '../lib/context.js';
import api from '../lib/api.js';
import { BrowserRouter } from 'react-router-dom';

// Mock API
jest.mock('../lib/api.js', () => ({
    get: jest.fn(),
}));

describe('Profile Page', () => {
    test('displays loading message initially', () => {
        api.get.mockResolvedValueOnce({ data: { user: { username: '', email: '' } }, error: null });
        
        render(
            <AppContextProvider>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </AppContextProvider>
        );
        
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('renders user data after fetching', async () => {
        api.get.mockResolvedValueOnce({
            data: { user: { username: 'testuser', email: 'test@example.com' } },
            error: null,
        });

        render(
            <AppContextProvider>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </AppContextProvider>
        );

        await waitFor(() => expect(screen.getByLabelText('Username')).toHaveValue('testuser'));
        expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
    });

    test('handles API error', async () => {
        api.get.mockResolvedValueOnce({ data: null, error: 'Failed to load profile' });

        render(
            <AppContextProvider>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </AppContextProvider>
        );

        await waitFor(() => expect(screen.getByText('Error: Failed to load profile')).toBeInTheDocument());
    });
});
