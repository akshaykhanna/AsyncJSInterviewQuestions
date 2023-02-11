const axios = require("axios");

function myPromiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      Promise.resolve(promise)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  });
}

describe("myPromiseRace unit test", () => {
  it("Resolve first resolved promise", async () => {
    // Arrange
    const promise1 = Promise.resolve("Value 1");
    const promise2 = Promise.resolve("Value 2");
    const promise3 = Promise.resolve("Value 3");

    const results = await myPromiseRace([promise1, promise2, promise3]);
    expect(results).toEqual("Value 1");
  });
  it("Will return the first settled resolved promise irrespective of next one is rejected", async () => {
    // Arrange
    const promise1 = Promise.resolve("Value 1");
    const promise2 = Promise.reject("Error");
    const promise3 = Promise.resolve("Value 3");

    const results = await myPromiseRace([promise1, promise2, promise3]);
    expect(results).toEqual("Value 1");
  });
  it("Will return the first settled rejected promise irrespective of next is resolved", async () => {
    // Arrange
    const delayedPromise = (value, delay, shouldResolve = true) => {
      return new Promise((resolve, reject) => {
        if(shouldResolve)
          setTimeout(resolve, delay, value);
          else
          setTimeout(reject, delay, value);
      });
    }
    const promise1 = delayedPromise("Error 1", 100, false);
    const promise2 = delayedPromise("Value 2", 1000);
    const promise3 = delayedPromise("Value 3", 500);

    try {
      var results = await myPromiseRace([promise1, promise2, promise3]);
    } catch (err) {
      var error = err;
    }
    expect(results).toEqual(undefined);
    expect(error).toEqual("Error 1");
  });
  it("Should reject with first settled rejected promise even though all promises pass to it are rejected", async () => {
    // Arrange
    const errors = ["Error 1", "Error 2", "Error 3"];
    const promise1 = Promise.reject(errors[0]);
    const promise2 = Promise.reject(errors[1]);
    const promise3 = Promise.reject(errors[2]);
    var results, error;
    try {
      results = await myPromiseRace([promise1, promise2, promise3]);
    } catch (err) {
      error = err;
    } finally {
      expect(results).toEqual(undefined);
      expect(error).toEqual("Error 1");
    }
  });

  it("Resolve the first settled promise within the list of delayed & non delayed promises", async () => {
    // Arrange
    const promise1 = new Promise((res, rej) => {
      setTimeout(res, 1000, "Value 1");
    });
    const promise2 = new Promise((res, rej) => {
      setTimeout(res, 100, "Value 2");
    });
    const promise3 = "Value 3";

    // Act
    const results = await myPromiseRace([promise1, promise2, promise3]);
    // Assert
    expect(results).toEqual("Value 3");
  });

  it("Should resolve the fastest API call", async () => {
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
    var results, error;
    myPromiseRace(promises)
      .then((data) => {
        results = data;
      })
      .catch((err) => {
        error = err;
      })
      .finally(() => {
        expect(Array.isArray(results)).toEqual(false);
        expect(error).toEqual(undefined);
      });
  });
  it("Should not resolve all API calls if any of them fails", async () => {
    function makeRequest(url) {
      return new Promise((resolve, reject) => {
        axios
          .get(url)
          .then((response) => {
            setTimeout(() => resolve(response.data), 100);
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
    var results, error;
    myPromiseRace(promises)
      .then((data) => {
        results = data;
      })
      .catch((err) => {
        error = err;
      })
      .finally(() => {
        expect(results).toEqual(undefined);
        expect(error).not.toEqual(undefined);
      });
  });
});
