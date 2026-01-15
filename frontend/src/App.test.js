import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock fetch API
global.fetch = jest.fn();

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders search header', () => {
    render(<App />);
    const headerElement = screen.getByText(/Wyszukiwarka Produktów/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders search input', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Wyszukaj produkty.../i);
    expect(searchInput).toBeInTheDocument();
  });

  test('renders search button', () => {
    render(<App />);
    const searchButton = screen.getByText(/Szukaj/i);
    expect(searchButton).toBeInTheDocument();
  });

  test('allows user to type in search input', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Wyszukaj produkty.../i);
    fireEvent.change(searchInput, { target: { value: 'laptop' } });
    expect(searchInput.value).toBe('laptop');
  });

  test('fetches suggestions when user types more than 1 character', async () => {
    const mockSuggestions = ['laptop', 'laptop gaming', 'laptop dell'];
    fetch.mockResolvedValueOnce({
      json: async () => mockSuggestions,
    });

    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Wyszukaj produkty.../i);
    fireEvent.change(searchInput, { target: { value: 'lap' } });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/suggestions?q=lap'
      );
    });
  });

  test('displays suggestions when available', async () => {
    const mockSuggestions = ['laptop', 'laptop gaming', 'laptop dell'];
    fetch.mockResolvedValueOnce({
      json: async () => mockSuggestions,
    });

    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Wyszukaj produkty.../i);
    fireEvent.change(searchInput, { target: { value: 'lap' } });

    await waitFor(() => {
      expect(screen.getByText('laptop')).toBeInTheDocument();
      expect(screen.getByText('laptop gaming')).toBeInTheDocument();
      expect(screen.getByText('laptop dell')).toBeInTheDocument();
    });
  });

  test('does not fetch suggestions when query is 1 character or less', async () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Wyszukaj produkty.../i);
    fireEvent.change(searchInput, { target: { value: 'l' } });

    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  test('handles suggestion click', async () => {
    const mockSuggestions = ['laptop'];
    fetch.mockResolvedValueOnce({
      json: async () => mockSuggestions,
    });

    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Wyszukaj produkty.../i);
    fireEvent.change(searchInput, { target: { value: 'lap' } });

    await waitFor(() => {
      expect(screen.getByText('laptop')).toBeInTheDocument();
    });

    const suggestion = screen.getByText('laptop');
    fireEvent.click(suggestion);

    expect(searchInput.value).toBe('laptop');
  });

  test('performs search when search button is clicked', async () => {
    const mockResults = [
      {
        id: 1,
        title: 'Laptop Dell',
        description: 'Wysokiej jakości laptop',
        category: 'Elektronika',
        price: 2999,
        quantity: 5,
      },
    ];

    fetch.mockResolvedValueOnce({
      json: async () => mockResults,
    });

    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Wyszukaj produkty.../i);
    const searchButton = screen.getByText(/Szukaj/i);

    fireEvent.change(searchInput, { target: { value: 'laptop' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/search?q=laptop'
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Wyniki wyszukiwania:')).toBeInTheDocument();
      expect(screen.getByText('Laptop Dell')).toBeInTheDocument();
      expect(screen.getByText('Wysokiej jakości laptop')).toBeInTheDocument();
      expect(screen.getByText(/Kategoria:/i)).toBeInTheDocument();
      expect(screen.getByText('Elektronika')).toBeInTheDocument();
      expect(screen.getByText(/Cena:/i)).toBeInTheDocument();
      expect(screen.getByText('2999 PLN')).toBeInTheDocument();
      expect(screen.getByText(/Ilość:/i)).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  test('performs search when Enter key is pressed', async () => {
    const mockResults = [
      {
        id: 1,
        title: 'Laptop Dell',
        description: 'Wysokiej jakości laptop',
        category: 'Elektronika',
        price: 2999,
        quantity: 5,
      },
    ];

    fetch.mockImplementation((url) => {
      if (url.includes('/api/search')) {
        return Promise.resolve({
          json: async () => mockResults,
        });
      }
      return Promise.resolve({
        json: async () => [],
      });
    });

    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Wyszukaj produkty.../i);

    fireEvent.change(searchInput, { target: { value: 'laptop' } });
    
    // Wait a bit for any debounce
    await new Promise(resolve => setTimeout(resolve, 350));
    
    // Clear previous calls to focus on Enter key press
    fetch.mockClear();
    fetch.mockImplementation((url) => {
      if (url.includes('/api/search')) {
        return Promise.resolve({
          json: async () => mockResults,
        });
      }
      return Promise.resolve({
        json: async () => [],
      });
    });

    // Press Enter
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
      const searchCalls = fetch.mock.calls.filter(call => 
        call[0].includes('/api/search')
      );
      expect(searchCalls.length).toBeGreaterThan(0);
      expect(searchCalls[0][0]).toBe('http://localhost:3001/api/search?q=laptop');
    });
  });

  test('shows loading state during search', async () => {
    const mockResults = [
      {
        id: 1,
        title: 'Laptop Dell',
        description: 'Wysokiej jakości laptop',
        category: 'Elektronika',
        price: 2999,
        quantity: 5,
      },
    ];

    fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ json: async () => mockResults }), 100)
        )
    );

    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Wyszukaj produkty.../i);
    const searchButton = screen.getByText(/Szukaj/i);

    fireEvent.change(searchInput, { target: { value: 'laptop' } });
    fireEvent.click(searchButton);

    expect(screen.getByText(/Szukam.../i)).toBeInTheDocument();
    expect(searchButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText(/Szukaj/i)).toBeInTheDocument();
    });
  });

  test('does not search when query is empty', () => {
    render(<App />);
    const searchButton = screen.getByText(/Szukaj/i);

    fireEvent.click(searchButton);

    expect(fetch).not.toHaveBeenCalled();
  });

  test('displays multiple search results', async () => {
    const mockResults = [
      {
        id: 1,
        title: 'Laptop Dell',
        description: 'Wysokiej jakości laptop',
        category: 'Elektronika',
        price: 2999,
        quantity: 5,
      },
      {
        id: 2,
        title: 'Laptop HP',
        description: 'Laptop biznesowy',
        category: 'Elektronika',
        price: 2499,
        quantity: 3,
      },
    ];

    fetch.mockResolvedValueOnce({
      json: async () => mockResults,
    });

    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Wyszukaj produkty.../i);
    const searchButton = screen.getByText(/Szukaj/i);

    fireEvent.change(searchInput, { target: { value: 'laptop' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Laptop Dell')).toBeInTheDocument();
      expect(screen.getByText('Laptop HP')).toBeInTheDocument();
    });
  });

  test('hides suggestions after search', async () => {
    const mockSuggestions = ['laptop'];
    const mockResults = [
      {
        id: 1,
        title: 'Laptop Dell',
        description: 'Wysokiej jakości laptop',
        category: 'Elektronika',
        price: 2999,
        quantity: 5,
      },
    ];

    fetch
      .mockResolvedValueOnce({
        json: async () => mockSuggestions,
      })
      .mockResolvedValueOnce({
        json: async () => mockResults,
      });

    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Wyszukaj produkty.../i);
    const searchButton = screen.getByText(/Szukaj/i);

    fireEvent.change(searchInput, { target: { value: 'lap' } });

    await waitFor(() => {
      expect(screen.getByText('laptop')).toBeInTheDocument();
    });

    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.queryByText('laptop')).not.toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    fetch.mockRejectedValueOnce(new Error('API Error'));

    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Wyszukaj produkty.../i);
    const searchButton = screen.getByText(/Szukaj/i);

    fireEvent.change(searchInput, { target: { value: 'laptop' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled();
    });

    consoleError.mockRestore();
  });

  test('handles empty search results', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => [],
    });

    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Wyszukaj produkty.../i);
    const searchButton = screen.getByText(/Szukaj/i);

    fireEvent.change(searchInput, { target: { value: 'xyz123' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    expect(screen.queryByText('Wyniki wyszukiwania:')).not.toBeInTheDocument();
  });

  test('debounces suggestion requests', async () => {
    jest.useFakeTimers();
    fetch.mockResolvedValue({
      json: async () => ['laptop'],
    });

    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Wyszukaj produkty.../i);

    fireEvent.change(searchInput, { target: { value: 'l' } });
    fireEvent.change(searchInput, { target: { value: 'la' } });
    fireEvent.change(searchInput, { target: { value: 'lap' } });

    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    jest.useRealTimers();
  });
});
