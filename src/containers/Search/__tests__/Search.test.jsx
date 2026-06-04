import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Mocks — must be declared before the component import
// ---------------------------------------------------------------------------

jest.mock('@noriginmedia/norigin-spatial-navigation', () => ({
  useFocusable: () => ({ ref: { current: null }, focusKey: 'mock-key', focused: false }),
  setFocus: jest.fn(),
  getCurrentFocusKey: jest.fn(() => ''),
  FocusContext: { Provider: ({ children }) => children },
}));

jest.mock('@src/hooks/useBackKey', () => ({
  useBackKey: jest.fn(),
}));

jest.mock('@src/utils/uiStorage', () => ({
  uiStorage: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clearKeys: jest.fn(),
  },
}));

// Replace the heavy keyboard component with a lightweight stub
jest.mock('@src/components/Keyboard/KeyBoardWithCaret', () =>
  function KeyboardStub({ onEnter }) {
    return <div data-testid="keyboard-stub" />;
  },
);

// ---------------------------------------------------------------------------
// Import under test (after mocks)
// ---------------------------------------------------------------------------

import Search from '../Search';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Search', () => {
  test('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('keyboard-stub')).toBeInTheDocument();
  });

  test('renders the search content container', () => {
    const { container } = render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>,
    );
    expect(container.querySelector('.search-content')).toBeInTheDocument();
  });
});
