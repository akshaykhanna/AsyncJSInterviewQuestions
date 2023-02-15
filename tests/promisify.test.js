const util = require("util");

const promisify = function (fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
};

describe("promisfy unit test", () => {
  it("Return a promise that resolves with a result of the original function", async () => {
    function originalFn(callback) {
      callback(null, "success");
    }

    // const promisifiedFn = util.promisify(originalFn);
    const promisifiedFn = promisify(originalFn);
    const result = await promisifiedFn();

    expect(result).toEqual("success");
  });
  it("Return a promise that rejects with an error if the original function throws an error ", async () => {
    function originalFn(callback) {
      callback(new Error("error"));
    }

    // const promisifiedFn = util.promisify(originalFn);
    const promisifiedFn = promisify(originalFn);
    let result, error;
    try {
      result = await promisifiedFn();
    } catch (err) {
      error = err;
    } finally {
      expect(result).toEqual(undefined);
      expect(error.message).toEqual("error");
    }
  });
});
