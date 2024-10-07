import { render, screen } from '@testing-library/react';
import FeedPost from './FeedPost';
import '@testing-library/jest-dom/extend-expect';

// Here we test that posts are displayed correctly:
test('renders FeedPost component with provided text parameters', () => {
    const post = {
        id: 1,
        author_name: 'Ori Jer',
        author_img: 'author_real_image',
        post_text_dir: 'LTR',
        post_text: 'Bla Bla Bla',
        post_img: 'post_real_image',
        date: '2024-02-05',
        updatePost: jest.fn(),
        deletePost: jest.fn(),
        userShowName: 'orijer'
    };

    render(<FeedPost {...post} />);

    expect(screen.getByText('orijer')).toBeInTheDocument();

    expect(screen.getByText('Bla Bla Bla')).toBeInTheDocument();

    expect(screen.getByText('2024-02-05')).toBeInTheDocument();
});
