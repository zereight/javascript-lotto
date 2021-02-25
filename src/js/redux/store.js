/*
    스토어 규칙
    state를 관리하는 역할
    state는 읽기 전용이어야 한다.
    action에 의해서만 변경됨
    reducer는 only function 이어야 함.
    리덕스에서는 한 어플리케이션당 하나의 스토어를 만든다.
*/

import * as reducers from './reducer.js';
export default class Store {
  static singletonStore = null; // 리덕스에서는 한 어플리케이션당 하나의 store만 존재하기 떄문에 싱글톤 구현

  constructor() {
    if (Store.singletonStore) return Store.singletonStore;
    this.subscribers = [];
    this.states = {
      payment: 0,
      lottos: [],
      winningCount: {},
      profit: 0,
    };
    this.states = this.reduce(this.states, {});
    this.prevStates = this.states;
    Store.singletonStore = this;
  }

  getStates() {
    return this.states;
  }

  getPrevStates() {
    return this.prevStates;
  }

  reduce(states, action) {
    return {
      payment: reducers.payment(states.payment, action),
      lottos: reducers.lottos(states.lottos, action),
      winningCount: reducers.winningCount(states.winningCount, action),
      profit: reducers.profit(
        states.profit,
        states.lottos.length,
        states.winningCount,
        action,
      ),
    };
  }

  subscribe(func) {
    this.subscribers.push(func);
  }

  notifySubscribers() {
    this.subscribers.forEach(
      function (subscriber) {
        subscriber(this.prevStates, this.states);
      }.bind(this),
    );
  }

  dispatch(action) {
    this.prevStates = this.states;
    this.states = this.reduce(this.states, action);
    console.log(this.states);
    this.notifySubscribers();
  }
}
