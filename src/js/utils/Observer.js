export default class Observer {
  constructor() {
    this.list = [];
  }

  registerObserver(target) {
    this.list.push(target);
  }

  unregisterObserver(target) {
    this.list = this.list.filter((existObserver) => existObserver !== target);
  }

  notifyObservers(content) {
    this.list.forEach((observer) => {
      return observer.notify(content);
    });
  }
}
