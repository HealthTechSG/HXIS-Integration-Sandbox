import { test, expect } from 'vitest';

import UrlUtils from './UrlUtils';

//* ----------------------------------------------------------------------------
test('generateFullPath', async () => {
  const BASE_URL = `/`;
  const baseUrl = BASE_URL?.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

  expect(UrlUtils.generateFullPath('some-path')).toBe(`${baseUrl}/some-path`);
  expect(UrlUtils.generateFullPath('/some-path')).toBe(`${baseUrl}/some-path`);
  expect(UrlUtils.generateFullPath('')).toBe(`${baseUrl}/`);
});

//* ----------------------------------------------------------------------------
