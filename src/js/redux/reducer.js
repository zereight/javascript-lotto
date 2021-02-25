import { LOTTO } from '../utils/constants.js';
import {
  generateRandomNumber,
  isEmptyValue,
  isInRange,
} from '../utils/common.js';
import { ERROR_MESSAGE } from '../utils/message.js';
import {
  CALCULATE_PROFIT,
  CREATE_LOTTOS,
  DECIDE_WINNER,
  RESTART,
  UPDATE_PAYMENT,
} from '../redux/actionType.js';
import { store } from '../components/App.js';

const getMatchedCount = (winningNumbers, numbers) => {
  let count = 0;
  numbers.forEach(number => {
    if (winningNumbers.includes(number)) count++;
  });
  return count;
};

export const validateWinningNumbersInputValue = (
  winningNumbers,
  bonusNumber,
) => {
  const numbers = [...winningNumbers, bonusNumber].map(Number);

  if (winningNumbers.some(isEmptyValue) || isEmptyValue(bonusNumber)) {
    return [ERROR_MESSAGE.EMPTY_INPUT_NUMBER, 'error'];
  }

  if (!numbers.every(number => isInRange(number))) {
    return [ERROR_MESSAGE.OUT_OF_RANGE, 'error'];
  }

  if (new Set(numbers).size !== numbers.length) {
    return [ERROR_MESSAGE.DUPLICATED_NUMBER, 'error'];
  }

  return [ERROR_MESSAGE.VALID_INPUT_NUMBER, 'success'];
};

export const validatePurchaseInputValue = number => {
  const payment = Number(number);
  if (!Number.isInteger(payment)) {
    return [ERROR_MESSAGE.NOT_INTEGER_NUMBER, 'error'];
  }

  if (payment < LOTTO.PRICE) {
    return [ERROR_MESSAGE.PAYMENT_AMOUNT, 'error'];
  }

  return [ERROR_MESSAGE.VALID_INPUT_NUMBER, 'success'];
};

export const updatePayment = (payment, { type, props = {} }) => {
  switch (type) {
    case UPDATE_PAYMENT:
      if (props.payment) {
        return props.payment;
      }
      return payment;
    case RESTART:
      return 0;
    default:
      return payment;
  }
};

export const updateLottos = (lottos, { type }) => {
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
      return lottos;
  }
};

export const decideWinners = (winningCount, { type, props }) => {
  const countWinner = (winningNumbers, bonusNumber, lottoNumbers) => {
    const count = getMatchedCount(winningNumbers, lottoNumbers);
    if (count === 6) {
      winningCount[`FIRST`]++;
    } else if (count === 5 && lottoNumbers.includes(bonusNumber)) {
      winningCount[`SECOND`]++;
    } else if (count === 5) {
      winningCount[`THIRD`]++;
    } else if (count === 4) {
      winningCount[`FOURTH`]++;
    } else if (count === 3) {
      winningCount[`FIFTH`]++;
    }
  };

  switch (type) {
    case DECIDE_WINNER:
      const { winningNumbers, bonusNumber } = props;
      const lottos = store.getStates().lottos;
      winningCount = Object.seal({
        FIRST: 0,
        SECOND: 0,
        THIRD: 0,
        FOURTH: 0,
        FIFTH: 0,
      });

      lottos.forEach(lottoNumbers => {
        countWinner(winningNumbers, bonusNumber, lottoNumbers);
      });

      return winningCount;
    case RESTART:
      return {};
    default:
      return winningCount;
  }
};

export const calculateProfitMargin = (
  profit,
  lottoCount,
  winningCount,
  { type },
) => {
  const rewards = Object.freeze({
    FIRST: 2000000000,
    SECOND: 300000000,
    THIRD: 1500000,
    FOURTH: 50000,
    FIFTH: 5000,
  });

  switch (type) {
    case CALCULATE_PROFIT:
      const investment = lottoCount * LOTTO.PRICE;
      const totalProfit = Object.keys(winningCount).reduce(
        (currProfit, key) => currProfit + rewards[key] * winningCount[key],
        0,
      );
      const profitRatio = ((totalProfit - investment) / investment) * 100;
      return profitRatio;

    case RESTART:
      return 0;

    default:
      return profit;
  }
};
