import { render } from '@testing-library/react';
import { test, expect } from 'vitest';

import SingleItemCollapse from './SingleItemCollapse';

//* ----------------------------------------------------------------------------
test('Render title and content.', async () => {
  const title = 'Test Title';
  const content = 'Test Content';

  const output = render(
    <SingleItemCollapse defaultOpen title={title}>
      {content}
    </SingleItemCollapse>,
  );

  expect(await output.findByText(title)).toBeInTheDocument();
  expect(await output.findByText(content)).toBeInTheDocument();
});

//* ----------------------------------------------------------------------------
