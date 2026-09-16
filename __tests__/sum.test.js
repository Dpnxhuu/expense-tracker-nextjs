function sum(a, b) {
  return a + b;
}

test('2 + 3 sahi se 5 dena chahiye', () => {
  expect(sum(2, 3)).toBe(5);
});