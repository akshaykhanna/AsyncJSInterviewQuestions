function fetchWithAutoRetry(url, options = {}, retries = 3, interval = 100) {
  let currentTries = 0;
  return new Promise((resolve, reject) => {
    function tryFetch() {
      fetch(url, options)
        // .then(data => resolve(data))
        .then(resolve)
        .catch((error) => {
          currentTries ++;
          if (currentTries < retries) setTimeout(tryFetch, interval);
          //  setTimeout(() => tryFetch(), interval);
          else reject(error);
        });
    }
    tryFetch();
  });
}


jest.useRealTimers();

describe("fetchWithAutoRetry unit testa", () => {

  it("Should able resolved data from API in first attempt", async () => {
    const spy = jest.spyOn(global, "fetch").mockResolvedValue("resolved");
    const result = await fetchWithAutoRetry("https://example.com", {});
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual("resolved");
    spy.mockRestore();
  });

  it("should make 2 attempts and resolve on the 2nd attempt", async () => {
    const spy = jest.spyOn(global, "fetch").mockRejectedValueOnce("error").mockResolvedValue("resolved");
    const result = await fetchWithAutoRetry("https://example.com", {});
    expect(spy).toHaveBeenCalledTimes(2);
    expect(result).toEqual("resolved");
    spy.mockRestore();
  });
  it("Should able to 3 attempts to API and should only resolve 3rd attempt", async () => {
    const spy = jest.spyOn(global, "fetch").mockRejectedValueOnce("error").mockRejectedValueOnce("error").mockResolvedValue("resolved");
    const result = await fetchWithAutoRetry("https://example.com", {});
    expect(spy).toHaveBeenCalledTimes(3);
    expect(result).toEqual("resolved");
    spy.mockRestore();
  });
  it("Should make 3 calls to API and and get rejected in 3rd attempt", async() => {
    const spy = jest.spyOn(global, "fetch").mockRejectedValueOnce("error1").mockRejectedValueOnce("error2").mockRejectedValueOnce("error3").mockResolvedValue("resolved");
    let result, error;
    try {
     result = await fetchWithAutoRetry("https://example.com", {});
    } catch(err) {
      error = err;
    } finally {
      expect(spy).toHaveBeenCalledTimes(3);
      expect(result).toEqual(undefined);
      expect(error).toEqual("error3");
      spy.mockRestore();
    }
  });
  it("Should make 4 calls to API and and get resolved in 4th attempt", async() => {
    const spy = jest.spyOn(global, "fetch").mockRejectedValueOnce("error1").mockRejectedValueOnce("error2").mockRejectedValueOnce("error3").mockResolvedValue("resolved");
    let result, error;
    try {
      result = await fetchWithAutoRetry("https://example.com", {}, 4);
    } catch(err) {
      error = err;
    } finally {
      expect(spy).toHaveBeenCalledTimes(4);
      expect(result).toEqual('resolved');
      expect(error).toEqual(undefined);
      spy.mockRestore();
    }
  });
  it("Should make 3 calls to API and and get rejected in all attempts", async() => {
    const spy = jest.spyOn(global, "fetch").mockRejectedValue("error1");
    let result, error;
    try {
     result = await fetchWithAutoRetry("https://example.com", {});
    } catch(err) {
      error = err;
    } finally {
      expect(spy).toHaveBeenCalledTimes(3);
      expect(result).toEqual(undefined);
      expect(error).toEqual("error1");
      spy.mockRestore();
    }
  });
});
