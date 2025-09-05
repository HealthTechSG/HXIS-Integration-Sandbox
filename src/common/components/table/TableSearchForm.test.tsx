import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { test, expect, vi } from 'vitest';

import TableSearchForm from './TableSearchForm';

//* ----------------------------------------------------------------------------
test('Enter input text and click search.', async () => {
  const onSearch = vi.fn();
  const user = userEvent.setup();

  const output = render(
    <BrowserRouter>
      <TableSearchForm onSearch={onSearch} />
    </BrowserRouter>,
  );

  const textbox = await output.findByRole('textbox');
  const button = await output.findByRole('button');

  await user.click(textbox);
  await user.keyboard('Test Search Text');
  await user.click(button);

  expect(onSearch).toBeCalledWith('Test Search Text');
});

//* ----------------------------------------------------------------------------
