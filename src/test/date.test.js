const printDate = require('../db/date');

test('print date works well for simple dates', () => {
  expect(new printDate(new Date(2022, 0, 1)).get()).toBe('1/01/2022 0:0');
});

test('print date works well for simple dates with hours', () => {
    expect(new printDate(new Date(2022, 1, 1, 8)).get()).toBe('1/11/2022 8:0');
  });


test('print date works well for simple dates with hours and minutes', () => {
expect(new printDate(new Date(2022, 3, 8, 8, 23)).get()).toBe('8/04/2022 8:23');
});


