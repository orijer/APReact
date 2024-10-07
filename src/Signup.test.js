import {checkUsernameValid, checkPasswordValid } from './Signup.js';

//The first function we test:
test('checkPasswordValid returns true for valid password', () => {
    expect(checkPasswordValid('Abc12345')).toBe(true);
});

test('checkPasswordValid returns false for invalid password because of length', () => {
    expect(checkPasswordValid('Abc123')).toBe(false);
});

test('checkPasswordValid returns false for invalid password because no chars', () => {
    expect(checkPasswordValid('1234567890')).toBe(false);
});

test('checkPasswordValid returns false for invalid password because no numbers', () => {
    expect(checkPasswordValid('abcdefghijklmnop')).toBe(false);
});

//The second function we test:
test('checkUsernameValid returns true for valid username', () => {
    expect(checkUsernameValid("Orijer")).toBe(true);
});

test('checkUsernameValid returns false for empty username', () => {
    expect(checkUsernameValid("")).toBe(false);
});

test('checkUsernameValid returns false for banned username', () => {
    expect(checkUsernameValid("stupid")).toBe(false);
});