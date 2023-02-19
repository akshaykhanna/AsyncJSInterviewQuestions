/**
 * The Promise.allSettled method in JavaScript returns an array of objects, each representing the outcome of a Promise.
 * The objects in the array have two properties: status and value.
 * The status property indicates whether the Promise was fulfilled ("fulfilled") or rejected ("rejected").
 * The value property holds the resolved value or the rejection reason.
 * So, in the case of Promise.allSettled, even if one of the Promises in the input array is rejected,
 * the result of Promise.allSettled will not be rejected.
 * Instead, the outcome of the rejected Promise will be included in the array of results as an object with status equal to "rejected"
 * and value equal to the rejection reason.
 */

const axios = require("axios");

// Promise.prototype.myAllSettled = function (promises) {
function myAllSettled(promises) {
  return new Promise((resolve) => {
    const results = [];
    let counter = 0;
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = { status: "fulfilled", value };
        })
        .catch((reason) => {
          results[index] = { status: "rejected", reason };
        })
        .finally(() => {
          counter++;
          if (counter === promises.length) resolve(results);
        });
    });
  });
}

jest.useRealTimers();

describe("Promise.allSettled unit test", () => {
  it("Resolve all promise", async () => {
    // Arrange
    const promise1 = Promise.resolve("Value 1");
    const promise2 = Promise.resolve("Value 2");
    const promise3 = Promise.resolve("Value 3");

    const results = await myAllSettled([promise1, promise2, promise3]);
    expect(results.map((res) => res.value)).toEqual([
      "Value 1",
      "Value 2",
      "Value 3",
    ]);
  });
  it("Don't Rejects all if one promise get rejected instead return all the response with there state", async () => {
    // Arrange
    const promise1 = Promise.resolve("Value 1");
    const promise2 = Promise.reject("Error");
    const promise3 = Promise.resolve("Value 3");

    const results = await myAllSettled([promise1, promise2, promise3]);
    expect(results.map((res) => res.value)).toEqual([
      "Value 1",
      undefined,
      "Value 3",
    ]);
    expect(results.map((p) => p.status)).toEqual([
      "fulfilled",
      "rejected",
      "fulfilled",
    ]);
  });

  it("Resolve all delayed promise", async () => {
    // Arrange
    const promise1 = new Promise((res, rej) => {
      setTimeout(res, 1000, "Value 1");
    });
    const promise2 = new Promise((res, rej) => {
      setTimeout(res, 100, "Value 2");
    });
    const promise3 = "Value 3";

    const results = await myAllSettled([promise1, promise2, promise3]);
    
    expect(results.map((p) => p.value)).toEqual([
      "Value 1",
      "Value 2",
      "Value 3",
    ]);
    expect(results.map((p) => p.status)).toEqual([
      "fulfilled",
      "fulfilled",
      "fulfilled",
    ]);
  });

  it("Should resolve all API calls", async () => {
    function makeRequest(url) {
      return new Promise((resolve, reject) => {
        axios
          .get(url)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }

    const urls = [
      "https://jsonplaceholder.typicode.com/posts/1",
      "https://jsonplaceholder.typicode.com/posts/2",
      "https://jsonplaceholder.typicode.com/posts/3",
    ];

    const promises = urls.map((url) => makeRequest(url));

    myAllSettled(promises).then((data) => {
      expect(data.length).toBe(3);
      expect(data.map((p) => p.status)).toEqual([
        "fulfilled",
        "fulfilled",
        "fulfilled",
      ]);
    });
  });
  it("Should not resolve all API calls if any of them fails", async () => {
    function makeRequest(url) {
      return new Promise((resolve, reject) => {
        axios
          .get(url)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }

    const urls = [
      "https://jsonplaceholder.typicode.com/posts/1",
      "https://jsonplaceholder.tt.typicode.tt.com/posts/2",
      "https://jsonplaceholder.typicode.com/posts/3",
    ];

    const promises = urls.map((url) => makeRequest(url));

    myAllSettled(promises).then((data) => {
      expect(data.map((p) => p.status)).toEqual([
        "fulfilled",
        "rejected",
        "fulfilled",
      ]);
    });
  });
});
