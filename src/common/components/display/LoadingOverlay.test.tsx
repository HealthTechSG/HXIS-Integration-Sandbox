import { render } from '@testing-library/react';
import { test, expect } from 'vitest';

import LoadingOverlay from './LoadingOverlay';

// TODO: Remove this hardcoded string?
const ERROR_TEXT = 'Error loading data.';

//* ----------------------------------------------------------------------------
test('Render error.', async () => {
  const output = render(<LoadingOverlay isError>Content</LoadingOverlay>);
  expect(await output.findByText(ERROR_TEXT)).toBeVisible();
});

//* ----------------------------------------------------------------------------
test('Render no error.', async () => {
  const output = render(<LoadingOverlay>Content</LoadingOverlay>);
  expect(output.queryByText(ERROR_TEXT)).not.toBeInTheDocument();
});

//* ----------------------------------------------------------------------------
