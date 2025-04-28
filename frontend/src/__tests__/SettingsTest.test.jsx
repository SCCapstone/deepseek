import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import SettingsWindow from '../components/navbar/SettingsWindow'; // Adjust the import according to your file structure
import { AppContextProvider } from '../lib/context'; // Assuming you have a context provider for the app
import '@testing-library/jest-dom';
import api from '../lib/api'


describe('SettingsWindow', () => {
  beforeAll(() => {
    // Mock window.matchMedia
    global.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));
  });

  it('shows Loading initially when showWindow is true', () => {
    const hideWindow = vi.fn();
    const showWindow = true;

    render(
      <AppContextProvider>
        <SettingsWindow showWindow={showWindow} hideWindow={hideWindow} />
      </AppContextProvider>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
  });

  it('shows Settings after loading', async () => {
    const hideWindow = vi.fn();
    const showWindow = true;

    // mock the api.get('/get-settings') call
    vi.spyOn(api, 'get').mockResolvedValue({
      data: {
        email: 'test@example.com',
        default_event_visibility: true,
        default_reminder: false,
      },
    });

    render(
      <AppContextProvider>
        <SettingsWindow showWindow={showWindow} hideWindow={hideWindow} />
      </AppContextProvider>
    );

    // wait until "Settings" title appears
    expect(await screen.findByText(/Settings/i)).toBeInTheDocument();
  });

  it('calls update-settings API when Save Changes is clicked', async () => {
    const hideWindow = vi.fn();
    const showWindow = true;
  
    // Mock getting settings initially
    vi.spyOn(api, 'get').mockResolvedValue({
      data: {
        email: 'test@example.com',
        default_event_visibility: true,
        default_reminder: false,
      },
    });
  
    // Mock saving settings
    const postMock = vi.spyOn(api, 'post').mockResolvedValue({
      data: { message: 'Settings updated successfully!' },
    });
  
    render(
      <AppContextProvider>
        <SettingsWindow showWindow={showWindow} hideWindow={hideWindow} />
      </AppContextProvider>
    );
  
    // Wait for settings to load
    await screen.findByText(/Settings/i);
  
    // Find and click the Save button
    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    saveButton.click();
  
    // Wait for the API to be called
    await new Promise((resolve) => setTimeout(resolve, 0)); // let async calls happen
  
    expect(postMock).toHaveBeenCalledWith('/update-settings', {
      email: 'test@example.com',
      default_event_visibility: true,
      default_reminder: false,
    });
  });
  it('shows an Alert if loading settings fails', async () => {
    const hideWindow = vi.fn();
    const showWindow = true;
  
    // Mock API error
    vi.spyOn(api, 'get').mockRejectedValue(new Error('Server is down'));
  
    render(
      <AppContextProvider>
        <SettingsWindow showWindow={showWindow} hideWindow={hideWindow} />
      </AppContextProvider>
    );
  
    // After failure, the alert should show
    expect(await screen.findByText(/Failed to load settings/i)).toBeInTheDocument();
  });
    
});