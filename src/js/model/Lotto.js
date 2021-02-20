import {
  LOTTO_LENGTH,
  MAX_LOTTO_NUMBER,
  MIN_LOTTO_NUMBER,
} from "../utils/constants.js";
import { generateRandomNumber } from "../utils/lotto.js";

export default class Lotto {
  constructor(numbers = []) {
    this.numbers = numbers;
  }

  static generateNumbers() {
    const lottoNumbers = new Set();
    while (lottoNumbers.size < LOTTO_LENGTH) {
      lottoNumbers.add(
        generateRandomNumber(MIN_LOTTO_NUMBER, MAX_LOTTO_NUMBER)
      );
    }
    return [...lottoNumbers];
  }

  static isValidLottoNumbers(winningNumbers, bonusNumber) {
    const allNumbers = [...winningNumbers, bonusNumber];
    return (
      allNumbers.every((number) => 1 <= number && number <= 45) &&
      allNumbers.length === LOTTO_LENGTH + 1 &&
      new Set(allNumbers).size === allNumbers.length
    );
  }
}
