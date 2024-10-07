import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TopBar from './TopBar';
import '@testing-library/jest-dom/extend-expect';

// Test TopBar renders correctly:
test('renders TopBar component', () => {
    render(<TopBar />);

    const profileDropdownButton = screen.getByRole('button', { name: /button/i });
    expect(profileDropdownButton).toBeInTheDocument();

    const settingsIcon = screen.getByAltText(/settings/i);
    expect(settingsIcon).toBeInTheDocument();

    const logoutIcon = screen.getByAltText(/logout/i);
    expect(logoutIcon).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/חיפוש/i);
    expect(searchInput).toBeInTheDocument();
});

test('clicking on the logout button calls the logOut function', () => {
    const mockLogOut = jest.fn();
    render(<TopBar logOut={mockLogOut} />);

    // Click on the logout button
    const logoutButton = screen.getByAltText(/logout/i);
    userEvent.click(logoutButton);

    // Check if the logOut function is called
    expect(mockLogOut).toHaveBeenCalledTimes(1);
});
