function add(a, b) {
  return a + b;
}

describe("Sample unit test", () => {
  beforeEach(() => {});
  it("Sample first test", () => {
    expect(5 + 3).toEqual(add(5, 3));
  });
});
