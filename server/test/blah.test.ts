function sum(a, b) {
    return a + b;
}

// describe('blah', () => {
//   it('works', () => {
//     expect(sum(1, 1)).toEqual(2);
//   });
// });

// Language: typescript
// Path: server\test\blah.test.ts
test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});