const { doesNotMatch } = require("assert");
// const { EventEmitter } = require('events');
const { emit } = require("process");

class MyEventEmitter {
  constructor() {
    this.events = {};
  }
  on(eventName, listener) {
    if (!(eventName in this.events)) this.events[eventName] = [];
    this.events[eventName].push(listener);
  }
  emit(eventName, ...args) {
    if (!(eventName in this.events)) return;
    const listenersToBeNotified = this.events[eventName];
    listenersToBeNotified.forEach((listener) => {
      listener(...args);
    });
  }
  removeListener(eventName, listener) {
    if (!(eventName in this.events)) return;
    this.events[eventName] = this.events[eventName].filter(
      (l) => l !== listener
    );
  }
}

describe("Event emitter unit tests", () => {
  let emitter;
  beforeEach(() => {
    emitter = new MyEventEmitter();
  });

  it("Emit event", () => {
    const eventName = "testEvent";
    const eventPayload = "testPayload";

    emitter.on(eventName, (payload) => {
      expect(payload).toEqual(eventPayload);
      // done();
    });

    emitter.emit(eventName, eventPayload);
  });
  it("Emit multiple events", () => {
    const expectedEvents = ["testEvent1", "testEvent2"];
    const expectedPayloads = ["testPayload1", "testPayload2"];

    expectedEvents.forEach((eventName, index) => {
      emitter.on(eventName, (payload) => {
        expect(payload).toEqual(expectedPayloads[index]);
      });
    });

    expectedEvents.forEach((eventName, index) => {
      emitter.emit(eventName, expectedPayloads[index]);
    });
  });
  it("Should remove listener & removed should not be notified again", () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    const eventName = "testEvent";

    emitter.on(eventName, listener1);
    emitter.on(eventName, listener2);

    emitter.emit(eventName);

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);

    emitter.removeListener(eventName, listener1);

    emitter.emit(eventName);

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(2);
  });
});
