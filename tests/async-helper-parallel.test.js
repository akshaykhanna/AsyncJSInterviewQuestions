function parallel(promisesFn, fn) {
  return new Promise((resolve, reject) => {
    const promises = promisesFn.map((promisesFn) => promisesFn());
    Promise.all(promises)
      .then((results) => {
        resolve(results.map((result) => (fn ? fn(result) : result)));
      })
      .catch((err) => {
        reject(err);
      });
  });
}

jest.useRealTimers();

describe("Async helper parallel()", () => {
  beforeEach(() => {});
  it("Should resolve array of async function in parallel with callback", async () => {
    const addOne = (num) => num + 1;
    const promise1 = () =>
      new Promise((resolve) => setTimeout(() => resolve(1), 1000));
    const promise2 = () =>
      new Promise((resolve) => setTimeout(() => resolve(2), 500));
    const promise3 = () =>
      new Promise((resolve) => setTimeout(() => resolve(3), 100));

    const results = await parallel([promise1, promise2, promise3], addOne);

    expect(results).toEqual([2, 3, 4]);
  });
  it("Should resolve array of async function in parallel without callback", async () => {
    const promise1 = () =>
      new Promise((resolve) => setTimeout(() => resolve(1), 1000));
    const promise2 = () =>
      new Promise((resolve) => setTimeout(() => resolve(2), 500));
    const promise3 = () =>
      new Promise((resolve) => setTimeout(() => resolve(3), 100));

    const results = await parallel([promise1, promise2, promise3]);

    expect(results).toEqual([1, 2, 3]);
  });
  it("Should reject with any error if any of promise gets rejected", async () => {
    const error = new Error("Something went wrong");
    const promise1 = () =>
      new Promise((resolve) => setTimeout(() => resolve(1), 1000));
    const promise2 = () =>
      new Promise((resolve, reject) => setTimeout(() => reject(error), 500));
    const promise3 = () =>
      new Promise((resolve) => setTimeout(() => resolve(3), 100));

    await expect(parallel([promise1, promise2, promise3])).rejects.toThrow(
      error
    );
  });
});
