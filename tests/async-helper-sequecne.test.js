function sequence(tasks) {
  return new Promise((resolve, reject) => {
    let index = 0;

    function resolveTask(prevResult = null) {
      if(index >= tasks.length) {
        resolve(prevResult);
        return;
      }
      const task = tasks[index];
      task(prevResult).then(res => {
        index ++;
        resolveTask(res);
      }).catch(err => {
        reject(err)
      });
    }
    resolveTask();
  });
}

describe("Async helper sequence() unit tests", () => {
  beforeEach(() => {});
  it("Should resolve with correct result from list of tasks", async() => {
    const tasks = [
      () => Promise.resolve(1),
      (prevResult) => Promise.resolve(prevResult + 2),
      (prevResult) => Promise.resolve(prevResult + 3),
    ];

    const results = await sequence(tasks);
    expect(results).toEqual(6);
  });
  it("Should reject if any tasks gets rejected", async() => {
    const tasks = [
      () => Promise.resolve(1),
      (prevResult) => Promise.reject(new Error('failed')),
      (prevResult) => Promise.resolve(prevResult + 3),
    ];

    await expect(sequence(tasks)).rejects.toThrow('failed');
  });
});
