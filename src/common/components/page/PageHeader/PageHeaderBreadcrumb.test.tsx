import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { test, expect } from 'vitest';

import PageHeaderBreadcrumb from './PageHeaderBreadcrumb';

const BASE_URL = `/`;

//* ----------------------------------------------------------------------------
test('Empty input => Render the home icon link.', async () => {
  const output = render(
    <BrowserRouter>
      <PageHeaderBreadcrumb breadcrumb={[]} />
    </BrowserRouter>,
  );

  const breadcumbElements = output.container.querySelectorAll(
    'a.ant-breadcrumb-link',
  );

  expect(breadcumbElements.length).toBe(1);
  expect(breadcumbElements[0].getAttribute('href')).toBe(`${BASE_URL}/`);
});

//* ----------------------------------------------------------------------------
test('Render breadcrumb link.', async () => {
  const title = 'Test Breadcrumb Title';
  const path = 'test-breadcrumb-path';

  const output = render(
    <BrowserRouter>
      <PageHeaderBreadcrumb breadcrumb={[{ title, path }]} />
    </BrowserRouter>,
  );

  const breadcumbElements = output.container.querySelectorAll(
    '.ant-breadcrumb-link',
  );

  expect(breadcumbElements.length).toBe(2);

  expect(breadcumbElements[0].getAttribute('href')).toBe(`${BASE_URL}/`);

  expect(await output.findByText(title)).toBeInTheDocument();
  expect(breadcumbElements[1].getAttribute('href')).toBe(`${BASE_URL}/${path}`);
});

//* ----------------------------------------------------------------------------
test('Render breadcrumb text (without link).', async () => {
  const title = 'Test Breadcrumb Title';

  const output = render(
    <BrowserRouter>
      <PageHeaderBreadcrumb breadcrumb={[{ title }]} />
    </BrowserRouter>,
  );

  const breadcumbElements = output.container.querySelectorAll(
    '.ant-breadcrumb-link',
  );

  expect(breadcumbElements.length).toBe(2);

  expect(breadcumbElements[0].getAttribute('href')).toBe(`${BASE_URL}/`);

  expect(await output.findByText(title)).toBeInTheDocument();
  expect(breadcumbElements[1]).not.toHaveAttribute('href');
});

//* ----------------------------------------------------------------------------
