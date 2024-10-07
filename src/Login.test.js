import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Login from './Login';
import '@testing-library/jest-dom/extend-expect';

// Here we test that we recognize using the wrong username and password:
test('displays incorrect username or password message when both are wrong', () => {
    render(<Login />);

    const usernameInput = screen.getByPlaceholderText('שם משתמש');
    const passwordInput = screen.getByPlaceholderText('סיסמה');
    const loginButton = screen.getByText('התחברות');

    fireEvent.change(usernameInput, { target: { value: '1' } });
    fireEvent.change(passwordInput, { target: { value: '1' } });
    fireEvent.click(loginButton);

    expect(screen.getByText('incorrect username or password')).toBeInTheDocument();
});

// Here we test that we recognize using the right username but the wrong password:
test('displays incorrect username or password message when only the password is wrong', () => {
    render(<Login />);

    const usernameInput = screen.getByPlaceholderText('שם משתמש');
    const passwordInput = screen.getByPlaceholderText('סיסמה');
    const loginButton = screen.getByText('התחברות');

    fireEvent.change(usernameInput, { target: { value: 'user name' } });
    fireEvent.change(passwordInput, { target: { value: '1' } });
    fireEvent.click(loginButton);

    expect(screen.getByText('incorrect username or password')).toBeInTheDocument();
});
