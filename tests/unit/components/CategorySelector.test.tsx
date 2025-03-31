import { act } from 'react';
import {render, screen, fireEvent, waitFor, within} from '@testing-library/react';
import CategorySelector from '../../../src/components/CategorySelector';
import '@testing-library/jest-dom';


describe('CategorySelector', () => {

  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ name: 'Technology' }, { name: 'Philosophy' }])
    }));
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(<CategorySelector onChange={jest.fn()} />);
    });
    await waitFor(() => expect(screen.getByTestId('category-select')).toBeInTheDocument());
  });

  it('displays categories fetched from API', async () => {
    await act(async () => {
      render(<CategorySelector onChange={jest.fn()} />);
    });

    const categorySelect = screen.getByTestId('category-select');

    const combobox = within(categorySelect).getByRole('combobox');
    fireEvent.mouseDown(combobox);

    const options = screen.getAllByRole('option');
    const optionValues = options.map((li) => li.getAttribute('data-value'));

    expect(optionValues).toEqual([
      'random',
      'technology',
      'philosophy',
    ]);
  });

  it('calls onChange with selected category', async () => {
    const handleChange = jest.fn();

    await act(async () => {
      render(<CategorySelector onChange={handleChange} />);
    });

    const categorySelect = screen.getByTestId('category-select');

    const combobox = within(categorySelect).getByRole('combobox');
    fireEvent.mouseDown(combobox);

    const options = screen.getAllByRole('option');

    fireEvent.click(options[1]);
    expect(handleChange).toHaveBeenCalledWith('technology');
  });

  it('handles API errors gracefully', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.reject(new Error('API Error'))
    }));

    await act(async () => {
      render(<CategorySelector onChange={jest.fn()} />);
    });

    await waitFor(() => expect(screen.queryByLabelText(/Category/i)).not.toBeInTheDocument());
  });

  it('displays "Random" as default selected category', async () => {
    await act(async () => {
      render(<CategorySelector onChange={jest.fn()} />);
    });

    const categorySelect = screen.getByTestId('category-select');

    const combobox = within(categorySelect).getByRole('combobox');

    expect(combobox).toHaveTextContent('Random');
  });
});