export class PromiseQueue {
  private queue: Promise<void>;
  private running: boolean;
  private lastTask: Promise<void> | null;

  constructor(private defaultSleepTime = 1000) {
    this.queue = Promise.resolve();
    this.running = false;
    this.lastTask = null;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  add<T>(task: () => Promise<T>): Promise<void> {
    this.running = true;

    const newTask = this.queue
      .then(() => this.sleep(this.defaultSleepTime))
      .then(() => task()) as Promise<void>;

    this.lastTask = newTask;

    newTask.finally(() => {
      if (this.lastTask === newTask) {
        this.running = false;
      }
    });

    this.queue = newTask;

    return newTask;
  }

  isRunning(): boolean {
    return this.running;
  }
}
