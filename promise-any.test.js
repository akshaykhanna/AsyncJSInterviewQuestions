const axios = require("axios");

function myPromiseAny(promises) {
  return new Promise((resolve, reject) => {
    let counter = 0;
    let errors = [];
    promises.forEach((promise) => {
      Promise.resolve(promise)
        .then((result) => resolve(result))
        .catch((err) => {
          errors[counter++] = err;
          if (counter == promises.length)
            reject(new AggregateError(errors, "All promises were rejected"));
        });
    });
  });
};


describe("myPromiseAny unit test", () => {
  it("Resolve first resolved promise", async () => {
    // Arrange
    const promise1 = Promise.resolve("Value 1");
    const promise2 = Promise.resolve("Value 2");
    const promise3 = Promise.resolve("Value 3");

    const results = await myPromiseAny([promise1, promise2, promise3]);
    expect(results).toEqual("Value 1");
  });
  test("Will return the first resolve promise irrespective of some promises getting rejected", async () => {
    // Arrange
    const promise1 = Promise.resolve("Value 1");
    const promise2 = Promise.reject("Error");
    const promise3 = Promise.resolve("Value 3");

    const results = await myPromiseAny([promise1, promise2, promise3]);
    expect(results).toEqual("Value 1");
  });
  it("Should only reject when all promises pass to it are rejected", async () => {
    // Arrange
    const errors = ["Error 1", "Error 2", "Error 3"];
    const promise1 = Promise.reject(errors[0]);
    const promise2 = Promise.reject(errors[1]);
    const promise3 = Promise.reject(errors[2]);
    var results, error;
    try {
      results = await myPromiseAny([promise1, promise2, promise3]);
    } catch (err) {
      error = err;
    } finally {
      expect(results).toEqual(undefined);
      expect(error.message).toEqual("All promises were rejected");
      expect(error.errors).toEqual(errors);
    }
  });

  test("Resolve all delayed promise", async () => {
    // Arrange
    const promise1 = new Promise((res, rej) => {
      setTimeout(res, 1000, "Value 1");
    });
    const promise2 = new Promise((res, rej) => {
      setTimeout(res, 100, "Value 2");
    });
    const promise3 = "Value 3";

    // Act
    const results = await myPromiseAny([promise1, promise2, promise3]);
    // Assert
    expect(results).toEqual("Value 3");
  });

  test("Should resolve all API calls", async () => {
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

    myPromiseAny(promises).then((data) => {
      expect(Array.isArray(data)).toEqual(false);
    });
  });
  test("Should not resolve all API calls if any of them fails", async () => {
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

    myPromiseAny(promises).then((data) => {
      expect(data.userId).toEqual(1);
    });
  });
});
