const axios = require("axios");

function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let resolvedCounter = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = value;
          resolvedCounter++;
          if (resolvedCounter === promises.length) resolve(results);
        })
        .catch((err) => reject(err));
    });
  });
}

jest.useRealTimers();

describe("myPromiseAll unit test", () => {
  it("Resolve all promise", async () => {
    // Arrange
    const promise1 = Promise.resolve("Value 1");
    const promise2 = Promise.resolve("Value 2");
    const promise3 = Promise.resolve("Value 3");

    const results = await myPromiseAll([promise1, promise2, promise3]);
    expect(results).toEqual(["Value 1", "Value 2", "Value 3"]);
  });
  it("Rejects all if one promise get rejected", async () => {
    // Arrange
    const promise1 = Promise.resolve("Value 1");
    const promise2 = Promise.reject("Error");
    const promise3 = Promise.resolve("Value 3");

    try {
      await myPromiseAll([promise1, promise2, promise3]);
    } catch (error) {
      expect(error).toEqual("Error");
    }
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

    const results = await myPromiseAll([promise1, promise2, promise3]);
    expect(results).toEqual(["Value 1", "Value 2", "Value 3"]);
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

    myPromiseAll(promises)
      .then((data) => {
        expect(data.length).toBe(3);
      })
      .catch((error) => {});
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

    myPromiseAll(promises)
      .then((data) => {})
      .catch((error) => {
        expect(error).not.toBeNull();
      });
  });
});
