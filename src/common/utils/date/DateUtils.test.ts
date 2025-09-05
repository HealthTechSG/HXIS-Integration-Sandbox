import dayjs from 'dayjs';
import { test, expect } from 'vitest';

import DateUtils from './DateUtils';

//* ----------------------------------------------------------------------------
test('formatDate()', async () => {
  expect(DateUtils.formatDate(null)).toBe(null);
  expect(DateUtils.formatDate(undefined)).toBe(undefined);
  expect(DateUtils.formatDate('2001-12-23')).toBe('23 Dec 2001');
  expect(DateUtils.formatDate(dayjs('2002-11-24'))).toBe('24 Nov 2002');
});

//* ----------------------------------------------------------------------------
test('transformDatesInObject()', async () => {
  const input = {
    nullField: null,
    undefField: undefined,
    strField: '2014-05-16',
    emptyStrField: '',
  };

  const output = DateUtils.transformDatesInObject(input, [
    'nullField',
    'undefField',
    'strField',
    'emptyStrField',
  ]);

  expect(output.nullField).toBe(null);
  expect(output.undefField).toBe(undefined);
  expect(output.strField).toBeInstanceOf(dayjs);
  expect(output.emptyStrField).toBe('');
});

//* ----------------------------------------------------------------------------
