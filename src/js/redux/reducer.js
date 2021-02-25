/*
    리듀서 규칙
    식별되지 않은 모든 상태에 대해서는 첫 인수로 주어진 state를 그대로 반환해야 합니다
    state가 undefined로 주어지면 반드시 해당 리듀서의 초기 상태를 반환해야 합니다
    반드시 리듀서가 undefined를 상태로 받더라도 제대로 작동하는지 확인하세요.
    상태가 평범한 객체라면, 절대 변경하지 않도록 하세요! 
     예를 들어 리듀서에서 Object.assign(state, newData) 같은 것을 반환하는 대신 Object.assign({}, state, newData)를 반환하세요
     이를 통해 이전 상태를 덮어쓰지 않을 수 있습니다.
    객체 확산 연산자 제안을 사용한다면 return { ...state, ...newData }처럼 쓸 수도 있습니다.
 */

import { LOTTO, REWARDS } from '../utils/constants.js';
import { generateRandomNumber } from '../utils/common.js';
import {
  CALCULATE_PROFIT,
  CREATE_LOTTOS,
  DECIDE_WINNER,
  RESTART,
  UPDATE_PAYMENT,
} from '../redux/actionType.js';
import { store } from '../components/App.js';

export const payment = (state = 0, { type, payload = {} }) => {
  switch (type) {
    case UPDATE_PAYMENT:
      if (payload.payment) {
        return payload.payment;
      }
      return state;
    case RESTART:
      return 0;
    default:
      return state;
  }
};

export const lottos = (state = [], { type }) => {
  switch (type) {
    case CREATE_LOTTOS:
      const lottoCount = Math.floor(store.getStates().payment / LOTTO.PRICE);
      const generateLottoNumbers = () => {
        const lottoNumbers = new Set();
        while (lottoNumbers.size < LOTTO.LENGTH) {
          lottoNumbers.add(generateRandomNumber(LOTTO.MIN_NUM, LOTTO.MAX_NUM));
        }
        return [...lottoNumbers];
      };
      return Array.from({ length: lottoCount }, () => generateLottoNumbers());

    case RESTART:
      return [];
    default:
      return state;
  }
};

export const winningCount = (state, { type, payload }) => {
  const getMatchedCount = (winningNumbers, numbers) => {
    let count = 0;
    numbers.forEach(number => {
      if (winningNumbers.includes(number)) count++;
    });
    return count;
  };

  const countWinner = (winningNumbers, bonusNumber, lottoNumbers) => {
    const count = getMatchedCount(winningNumbers, lottoNumbers);
    if (count === 6) {
      return 1;
    } else if (count === 5 && lottoNumbers.includes(bonusNumber)) {
      return 2;
    } else if (count === 5) {
      return 3;
    } else if (count === 4) {
      return 4;
    } else if (count === 3) {
      return 5;
    }
  };

  switch (type) {
    case DECIDE_WINNER:
      const { winningNumbers, bonusNumber } = payload;
      const lottos = store.getStates().lottos;
      const winningCountTemp = {};
      let i = 0;
      Object.assign(
        winningCountTemp,
        Object.seal({
          ['rank' + ++i]: 0,
          ['rank' + ++i]: 0,
          ['rank' + ++i]: 0,
          ['rank' + ++i]: 0,
          ['rank' + ++i]: 0,
        }),
      );

      lottos.forEach(lottoNumbers => {
        const rank = countWinner(winningNumbers, bonusNumber, lottoNumbers);
        rank && winningCountTemp[`rank${rank}`]++;
      });

      return winningCountTemp;
    case RESTART:
      return {};
    default:
      return state;
  }
};

export const profit = (state, lottoCount, winningCount, { type }) => {
  switch (type) {
    case CALCULATE_PROFIT:
      const investment = lottoCount * LOTTO.PRICE;
      const totalProfit = Object.keys(winningCount).reduce(
        (currProfit, key) => currProfit + REWARDS[key] * winningCount[key],
        0,
      );
      const profitRatio = ((totalProfit - investment) / investment) * 100;
      return profitRatio;

    case RESTART:
      return 0;

    default:
      return state;
  }
};
