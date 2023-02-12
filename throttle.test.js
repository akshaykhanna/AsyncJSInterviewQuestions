const _ = require("lodash");

const throttle = function(func, delay) {
    let timer = null;
    return function() {
      if(!timer) {
        func.apply(this, arguments);
        timer = setTimeout(() => timer = null, delay);
      }
    }
}

describe("throttle unit test", () => {
  let spy, throttledFn;
  beforeEach(() => {
    spy = jest.fn();
    // throttledFn = _.throttle(spy, 201);
    throttledFn = throttle(spy, 201);
  });
  it("Should able to call function once within the specified time", () => {
    for (let i = 0; i < 100; i++) {
      throttledFn();
    }
    jest.advanceTimersByTime(100);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it("Should call spy function every time that particular window is passed", () => {
    throttledFn();
    jest.advanceTimersByTime(100);
    throttledFn();
    jest.advanceTimersByTime(100);
    expect(spy).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(100);
    throttledFn();
    expect(spy).toHaveBeenCalledTimes(2);
  });
  it("Should able to call function once within the specified time even though throttleFn is called infinites times", () => {
    setInterval(() => {
      throttledFn();
    }, 10);
    jest.advanceTimersByTime(200);
    expect(spy).toHaveBeenCalledTimes(1);
    // 10-1, 210-201-2, 410-403-3, 610-604-4
    jest.advanceTimersByTime(400);
    expect(spy).toHaveBeenCalledTimes(3);
  });
});
