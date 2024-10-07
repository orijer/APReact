import { render, screen, fireEvent } from '@testing-library/react';
import FeedPostCreation from './FeedPostCreation';
import '@testing-library/jest-dom/extend-expect';

//Test that we can open the post creation modal:
test('displays post creation window after clicking the open button', () => {
    // Render the FeedPostCreation component
    render(<FeedPostCreation feedPostsList={{}} setFeedPostsList={jest.fn} currentUser={{"showName" : "me"}} isDarkMode={true} />);

    const openButton = screen.getByRole('button', { name: 'על מה אתם חושבים?' });

    fireEvent.click(openButton);

    const postCreationWindowText = screen.getByText('יצירת פוסט');
    expect(postCreationWindowText).toBeInTheDocument();
});
