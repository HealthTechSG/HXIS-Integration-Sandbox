import { vi } from 'vitest';
import '@testing-library/jest-dom';

/**
 * == GLOBAL MOCKS ==
 *
 * Global mocks for every test case. Run for every test suite in every test file.
 * Use this in order to mock implementation details of module dependencies which
 * don't need to be tested.
 */
global.matchMedia =
  global.matchMedia ||
  // eslint-disable-next-line func-names
  function () {
    return {
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    };
  };

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<Record<string, unknown>>('react-router-dom')),
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
  }),
}));
