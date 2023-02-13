const _ = require("lodash");

const debounce = function (func, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    const context = this;
    const args = arguments;
    timeout = setTimeout(() => {
      func.apply(context, args);
      clearTimeout(timeout);
    }, delay);
  };
};

describe("debounce unit test", () => {
  let spy, debounceFn;
  beforeEach(() => {
    spy = jest.fn();
    // debounceFn = _.debounce(spy, 100);
    debounceFn = debounce(spy, 100);
  });
  it("Should call function spy only once after the wait time has passed", () => {
    debounceFn();
    debounceFn();
    debounceFn();
    jest.advanceTimersByTime(110);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it("Should call function spy only twice even if it is called infinite times in 303 seconds ", () => {
    const intervalId = setInterval(() => {
      debounceFn();
    }, 101);
    // 101- calls debouncefn(), 201 calls spy function 0 - 1st spy call,
    // 202 calls debouncefn(), 302 calls spy function - 2nd spy call
    jest.advanceTimersByTime(303);
    expect(spy).toHaveBeenCalledTimes(2);
    clearInterval(intervalId);
  });
  it("Should never call spy function if calling is happening before debounce delay (interval time < debounce delay time)", () => {
    const intervalId = setInterval(() => {
      debounceFn();
    }, 10);
    jest.advanceTimersByTime(303);
    expect(spy).toHaveBeenCalledTimes(0);
    clearInterval(intervalId);
  });
  it("Should call spy function with specific arguments", () => {
    debounceFn(1, 2, 3);
    jest.advanceTimersByTime(110);
    expect(spy).toHaveBeenCalledWith(1, 2, 3);
  });
  it("Should call spy function with specific context", () => {
    const context = {};
    let spyContext;
    let mySpy = jest.fn((...args) => {
      spyContext = this;
    });
    // const debounceWithCustomContext = _.debounce(mySpy, 100).bind(context);
    const debounceWithCustomContext = debounce(mySpy, 100).bind(context);
    debounceWithCustomContext();
    jest.advanceTimersByTime(110);
    expect(spyContext).toEqual(context);
  });
});
