const util = require("util");

describe("promisfy unit test", () => {
  it("Return a promise that resolves with a result of the original function", async () => {
    function originalFn(callback) {
      callback(null, "success");
    }

    const promisifiedFn = util.promisify(originalFn);
    const result = await promisifiedFn();

    expect(result).toEqual("success");
  });
  it("Return a promise that rejects with an error if the original function throws an error ", async () => {
    function originalFn(callback) {
      callback(new Error("error"));
    }

    const promisifiedFn = util.promisify(originalFn);
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
