import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { CreateVideoForm } from '@/features/video/components/CreateVideoForm';
import * as db from '@/db/videos';
import '@testing-library/jest-dom';

jest.mock('@/db/videos');
jest.mock('@/prisma', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    video: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  })),
}));
jest.mock('@/components/query/QueryProvider', () => ({
  QueryProvider: ({ children }: { children: React.ReactNode }) => children,
  queryClient: {
    invalidateQueries: jest.fn(),
  },
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
}));

const mockTags = ['tutorial', 'beginner', 'advanced'];

function setup() {
  render(<CreateVideoForm tags={mockTags} />);
}

describe('CreateVideoForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all fields and the submit button', () => {
    setup();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/thumbnail url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/views/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/duration/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create video/i })
    ).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    setup();
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/title/i), {
        target: { value: '' },
      });
      fireEvent.change(screen.getByLabelText(/thumbnail url/i), {
        target: { value: '' },
      });
      fireEvent.change(screen.getByLabelText(/duration/i), {
        target: { value: '' },
      });
      fireEvent.click(screen.getByRole('button', { name: /create video/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/Invalid URL/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Invalid input: expected number, received undefined/i)
      ).toBeInTheDocument();
    });
  });

  it('submits valid data', async () => {
    (db.createVideo as jest.Mock).mockResolvedValue({
      id: '1',
      title: 'Test',
      duration: 10,
      thumbnail_url: 'https://example.com',
      views: 0,
      created_at: '',
      updated_at: '',
      tags: [],
    });

    setup();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/title/i), {
        target: { value: 'Test Video' },
      });
      fireEvent.change(screen.getByLabelText(/thumbnail url/i), {
        target: { value: 'https://example.com/image.jpg' },
      });
      fireEvent.change(screen.getByLabelText(/views/i), {
        target: { value: '123' },
      });
      fireEvent.change(screen.getByLabelText(/duration/i), {
        target: { value: '60' },
      });
      // Trigger blur to ensure validation
      fireEvent.blur(screen.getByLabelText(/duration/i));
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create video/i }));
    });

    await waitFor(() => {
      expect(db.createVideo).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Video',
          thumbnailUrl: 'https://example.com/image.jpg',
          views: 123,
          duration: 60,
        })
      );
    });
  });

  it('shows server error if createVideo fails', async () => {
    (db.createVideo as jest.Mock).mockRejectedValue(new Error('Server error'));

    setup();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/title/i), {
        target: { value: 'Test Video' },
      });
      fireEvent.change(screen.getByLabelText(/thumbnail url/i), {
        target: { value: 'https://example.com/image.jpg' },
      });
      fireEvent.change(screen.getByLabelText(/views/i), {
        target: { value: '123' },
      });
      fireEvent.change(screen.getByLabelText(/duration/i), {
        target: { value: '60' },
      });
      fireEvent.blur(screen.getByLabelText(/duration/i));
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create video/i }));
    });

    const errorMessages = await screen.findAllByText(
      /Please make sure all the required fields are filled in correctly/i
    );
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it('disables submit button while submitting', async () => {
    let resolvePromise: (value: PromiseLike<unknown> | unknown) => void;
    (db.createVideo as jest.Mock).mockImplementation(
      () => new Promise(res => (resolvePromise = res))
    );

    setup();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/title/i), {
        target: { value: 'Test Video' },
      });
      fireEvent.change(screen.getByLabelText(/thumbnail url/i), {
        target: { value: 'https://example.com/image.jpg' },
      });
      fireEvent.change(screen.getByLabelText(/views/i), {
        target: { value: '123' },
      });
      fireEvent.change(screen.getByLabelText(/duration/i), {
        target: { value: '60' },
      });
      fireEvent.blur(screen.getByLabelText(/duration/i));
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create video/i }));
    });

    const submitBtn = await screen.findByRole('button', { name: /creating/i });
    expect(submitBtn).toBeDisabled();

    await act(async () => {
      resolvePromise({
        id: '1',
        title: 'Test',
        duration: 10,
        thumbnail_url: 'https://example.com',
        views: 0,
        created_at: '',
        updated_at: '',
        tags: [],
      });
    });
  });
});
