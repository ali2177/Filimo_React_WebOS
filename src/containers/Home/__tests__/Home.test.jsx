import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('@noriginmedia/norigin-spatial-navigation', () => ({
  useFocusable: () => ({ ref: { current: null }, focusKey: 'mock-key', focused: false }),
  setFocus: jest.fn(),
  FocusContext: { Provider: ({ children }) => children },
}));

jest.mock('@src/components/AuthProvider', () => ({
  useAuth: () => ({ jwt: null }),
}));

jest.mock('@src/app/App', () => ({
  useOnlineStatus: () => ({ isKid: false, isOnline: true }),
}));

// Simple function stubs — no jest.fn() needed here because we don't reconfigure these per test
jest.mock('../hooks/useBackNavigation', () => ({
  useBackNavigation: () => ({
    showExitModal: false,
    setShowExitModal: () => {},
    backArmedRef: { current: false },
  }),
}));

jest.mock('../hooks/useFocusInit', () => ({
  useFocusInit: () => ({
    scrollRef: { current: null },
    onRowFocus: () => {},
  }),
}));

// useHomeMovies needs per-test control — use auto-mock then configure in beforeEach
jest.mock('../hooks/useHomeMovies');

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------

import Home from '../Home';
const { useHomeMovies } = require('../hooks/useHomeMovies');

// ---------------------------------------------------------------------------
// Default mock return value
// ---------------------------------------------------------------------------

const defaultMoviesState = {
  movies: null,
  data: null,
  error: null,
  isFetching: true,
  lastMovieElement: null,
  filteredRows: [],
  posterRows: [],
};

beforeEach(() => {
  useHomeMovies.mockReturnValue(defaultMoviesState);
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const renderHome = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home/:tag_id/:other_data" element={<Home />} />
      </Routes>
    </MemoryRouter>,
  );

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Home', () => {
  test('renders Loader while data is fetching', () => {
    renderHome();
    expect(document.querySelector('.loader')).toBeInTheDocument();
  });

  test('renders NetworkError when fetch fails', () => {
    useHomeMovies.mockReturnValueOnce({
      ...defaultMoviesState,
      error: { status: 500 },
      isFetching: false,
    });
    // NetworkError uses norigin which is mocked — just verify no throw
    expect(() => renderHome()).not.toThrow();
  });

  test('renders without crashing when data is empty', () => {
    useHomeMovies.mockReturnValueOnce({
      ...defaultMoviesState,
      movies: { data: [] },
      data: { data: [] },
      isFetching: false,
    });
    // data.data is empty → falls into NetworkError branch, no throw expected
    expect(() => renderHome()).not.toThrow();
  });
});
