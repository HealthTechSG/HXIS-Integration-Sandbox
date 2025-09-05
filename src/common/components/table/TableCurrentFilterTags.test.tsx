import { render } from '@testing-library/react';
import { test, expect } from 'vitest';

import TableCurrentFilterTags from './TableCurrentFilterTags';

//* ----------------------------------------------------------------------------
test('Render empty list.', async () => {
  const output = render(<TableCurrentFilterTags filters={undefined} />);
  expect(await output.findByText('None')).toBeInTheDocument();
});

//* ----------------------------------------------------------------------------
test('Render normally.', async () => {
  const filters = {
    Test_Key_1: 'Test_Value_1',
    Test_Key_2: 'Test_Value_2',
  };

  const output = render(<TableCurrentFilterTags filters={filters} />);

  expect(await output.findByText('Test_Key_1:')).toBeInTheDocument();
  expect(await output.findByText('Test_Value_1')).toBeInTheDocument();
  expect(await output.findByText('Test_Key_2:')).toBeInTheDocument();
  expect(await output.findByText('Test_Value_2')).toBeInTheDocument();
});

//* ----------------------------------------------------------------------------
test('Render empty value.', async () => {
  const filters = {
    Test_Key_1: 'Test_Value_1',
    Test_Key_2: 'Test_Value_2',
    Test_Empty_1: undefined,
    Test_Empty_2: '',
  };

  const output = render(<TableCurrentFilterTags filters={filters} />);

  expect(await output.findByText('Test_Key_1:')).toBeInTheDocument();
  expect(await output.findByText('Test_Value_1')).toBeInTheDocument();
  expect(await output.findByText('Test_Key_2:')).toBeInTheDocument();
  expect(await output.findByText('Test_Value_2')).toBeInTheDocument();

  expect(await output.queryByText('Test_Empty_1:')).not.toBeInTheDocument();
  expect(await output.queryByText('Test_Empty_2:')).not.toBeInTheDocument();
});

//* ----------------------------------------------------------------------------
test('Customize key and value renderer.', async () => {
  const filters = {
    Test_Key_1: 'Test_Value_1',
    Test_Key_2: 'Test_Value_2',
  };

  const output = render(
    <TableCurrentFilterTags
      filters={filters}
      renderLabel={(key) => (key === 'Test_Key_1' ? 'Change_Key_1' : key)}
      renderValue={(key, value) =>
        key === 'Test_Key_2' ? 'Change_Value_2' : value
      }
    />,
  );

  expect(await output.findByText('Change_Key_1:')).toBeInTheDocument();
  expect(await output.findByText('Test_Value_1')).toBeInTheDocument();
  expect(await output.findByText('Test_Key_2:')).toBeInTheDocument();
  expect(await output.findByText('Change_Value_2')).toBeInTheDocument();
});

//* ----------------------------------------------------------------------------
