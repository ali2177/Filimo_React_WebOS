import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('@noriginmedia/norigin-spatial-navigation', () => ({
  useFocusable: () => ({ ref: { current: null }, focusKey: 'mock-key', focused: false }),
  setFocus: jest.fn(),
  getCurrentFocusKey: jest.fn(() => ''),
  FocusContext: { Provider: ({ children }) => children },
}));

// Also mocked because NetworkError uses norigin
jest.mock('react-js-spatial-navigation', () => ({
  Focusable: ({ children }) => <div>{children}</div>,
}));

jest.mock('@src/hooks/useBackKey', () => ({
  useBackKey: jest.fn(),
}));

jest.mock('@src/hooks/useDisableKeyboardWhileLoading', () => ({
  useDisableKeyboardWhileLoading: jest.fn(),
}));

jest.mock('@src/utils/uiStorage', () => ({
  uiStorage: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clearKeys: jest.fn(),
  },
}));

// Stub child components that bring in heavy deps of their own
// Note: forwardRef stubs are not needed because <Loader /> is rendered before
// these are ever mounted (isLoading starts as true).
jest.mock('../PlayBotton', () => () => <button data-testid="play-btn" />);
jest.mock('../ActionButtons', () => () => <div data-testid="action-buttons" />);
// TabBar is imported for both its default export and `tabFocusKey`.
jest.mock('../tabs/TabBar', () => ({
  __esModule: true,
  default: () => <div data-testid="tab-bar" />,
  tabFocusKey: () => 'tab-0',
}));
jest.mock('../tabs/EpisodesPanel', () => () => <div data-testid="episodes-panel" />);
jest.mock('../tabs/DetailPanel', () => () => <div data-testid="detail-panel" />);
jest.mock('../tabs/RecommPanel', () => () => <div data-testid="recomm-panel" />);
jest.mock('@src/components/HeroBadge/HeroBadge', () => () => null);
jest.mock('@src/components/Alert/Alert', () => () => null);

// fetch — keep it pending so the async getData() effect never resolves
beforeEach(() => {
  global.fetch = jest.fn(() => new Promise(() => {}));
  localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Import under test (after mocks)
// ---------------------------------------------------------------------------

import MovieInfo from '../MovieInfo';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

const renderMovieInfo = (id = '123') =>
  render(
    <MemoryRouter initialEntries={[`/movie/${id}`]}>
      <Routes>
        <Route path="/movie/:id" element={<MovieInfo />} />
      </Routes>
    </MemoryRouter>,
  );

describe('MovieInfo', () => {
  test('renders Loader on initial load', () => {
    renderMovieInfo();
    // isLoading starts as true → component returns <Loader /> immediately
    expect(document.querySelector('.loader')).toBeInTheDocument();
  });

  test('renders without crashing for any movie id', () => {
    expect(() => renderMovieInfo('999')).not.toThrow();
  });

  test('initiates a fetch for the movie data', () => {
    renderMovieInfo('456');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/movie/movie/one/uid/456'),
      expect.any(Object),
    );
  });
});
