function race(promisesFn, fn) {
  return new Promise((resolve, reject) => {
    const promises = promisesFn.map((promisesFn) => promisesFn());
    promises.forEach(promise => {
      promise.then(res => {
        resolve(fn ? fn(res): res);
      }).catch(error => {
        reject(error);
      })
    })
  });
}

jest.useRealTimers();

describe("Async helper race()", () => {
  beforeEach(() => {});
  it("Should resolve first promise in the array of async function in parallel with callback", async () => {
    const addOne = (num) => num + 1;
    const promise1 = () =>
      new Promise((resolve) => setTimeout(() => resolve(1), 1000));
    const promise2 = () =>
      new Promise((resolve) => setTimeout(() => resolve(2), 500));
    const promise3 = () =>
      new Promise((resolve) => setTimeout(() => resolve(3), 100));

    const results = await race([promise1, promise2, promise3], addOne);

    expect(results).toEqual(4);
  });
  it("Should resolve first promise in an array of async function in parallel without callback", async () => {
    const promise1 = () =>
      new Promise((resolve) => setTimeout(() => resolve(1), 1000));
    const promise2 = () =>
      new Promise((resolve) => setTimeout(() => resolve(2), 500));
    const promise3 = () =>
      new Promise((resolve) => setTimeout(() => resolve(3), 100));

    const results = await race([promise1, promise2, promise3]);

    expect(results).toEqual(3);
  });
  it("Should reject with any error if any of promise gets rejected first", async () => {
    const error = new Error("Something went wrong");
    const promise1 = () =>
      new Promise((resolve) => setTimeout(() => resolve(1), 1000));
    const promise2 = () =>
      new Promise((resolve, reject) => setTimeout(() => reject(error), 50));
    const promise3 = () =>
      new Promise((resolve) => setTimeout(() => resolve(3), 100));

    await expect(race([promise1, promise2, promise3])).rejects.toThrow(
      error
    );
  });
  it("Should not reject with any error if any of promise gets rejected is not first", async () => {
    const error = new Error("Something went wrong");
    const promise1 = () =>
      new Promise((resolve) => setTimeout(() => resolve(1), 1000));
    const promise2 = () =>
      new Promise((resolve, reject) => setTimeout(() => reject(error), 500));
    const promise3 = () =>
      new Promise((resolve) => setTimeout(() => resolve(3), 100));

    const results = await race([promise1, promise2, promise3]);

    expect(results).toEqual(3);
  });
});
