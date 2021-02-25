import Component from '../core/Component.js';
import { validateWinningNumbersInputValue } from '../redux/reducer.js';
import { $, $$, clearInputValue } from '../utils/dom.js';
import { store } from './App.js';

export default class WinningNumbersInput extends Component {
  mainTemplate() {
    return `
          <label class="flex-auto d-inline-block mb-3">지난 주 당첨번호 6개와 보너스 넘버 1개를 입력해주세요.</label>
          <div class="d-flex flex-col">
            <div class="d-flex number-input-container">
              <div class="winning-number-container d-flex flex-col flex-grow">
                  <h4 class="mt-0 mb-3 text-center">당첨 번호</h4>
                  <div>
                    <input type="number" class="winning-number mx-1 text-center" />
                    <input type="number" class="winning-number mx-1 text-center" />
                    <input type="number" class="winning-number mx-1 text-center" />
                    <input type="number" class="winning-number mx-1 text-center" />
                    <input type="number" class="winning-number mx-1 text-center" />
                    <input type="number" class="winning-number mx-1 text-center" />
                  </div>
              </div>
              <div class="bonus-number-container d-flex flex-col flex-grow">
                <h4 class="mt-0 mb-3 text-center">보너스 번호</h4>
                <div class="d-flex justify-center">
                  <input type="number" class="bonus-number text-center" />
                </div>
              </div>
            </div>
            <p data-section="winningInputMessage" class="text-xs text-center"></p>
          </div>
          <button type="button" class="open-result-modal-button mt-5 btn btn-cyan w-100" disabled>
            결과 확인하기
          </button>
    `;
  }

  selectDOM() {
    this.$openResultModalButton = $('.open-result-modal-button');
    this.$winningNumberInputs = $$('.winning-number');
    this.$bonusNumberInput = $('.bonus-number');
    this.$winningInputMessage = $('[data-section=winningInputMessage]');
  }

  setup() {
    store.subscribe(this.render.bind(this));
  }

  onMoveCursorToNextInput({ target }) {
    if (target.value.length > 1) {
      target.value = target.value.slice(0, 2);
      if (target.nextElementSibling) target.nextElementSibling.focus();
      else {
        this.$bonusNumberInput.focus();
      }
    }
  }

  onKeyUpNumberInput(e) {
    this.onMoveCursorToNextInput(e);
    const winningNumbers = Array.from(this.$winningNumberInputs).map(input =>
      input.value === '' ? '' : Number(input.value),
    );
    const bonusNumber =
      this.$bonusNumberInput.value === ''
        ? ''
        : Number(this.$bonusNumberInput.value);
    const [text, result] = validateWinningNumbersInputValue(
      winningNumbers,
      bonusNumber,
    );

    this.$winningInputMessage.textContent = text;
    if (result === 'success') {
      this.$winningInputMessage.style.color = 'green';
      this.$openResultModalButton.disabled = false;
    } else if (result === 'error') {
      this.$winningInputMessage.style.color = 'red';
      this.$openResultModalButton.disabled = true;
    }
  }

  onClickResultButton() {
    const winningNumbers = this.$winningNumberInputs.map(({ value }) => value);
    const bonusNumber = this.$bonusNumberInput.value;
    store.dispatch({
      type: 'DECIDE_WINNER',
      props: {
        winningNumbers: winningNumbers.map(Number),
        bonusNumber: Number(bonusNumber),
      },
    });
    store.dispatch({
      type: 'CALCULATE_PROFIT',
    });

    // decideWinners(winningNumbers.map(Number), Number(bonusNumber));
  }

  bindEvent() {
    this.$openResultModalButton.addEventListener(
      'click',
      this.onClickResultButton.bind(this),
    );
    this.$winningNumberInputs.forEach($elem =>
      $elem.addEventListener('keyup', this.onKeyUpNumberInput.bind(this)),
    );
    this.$bonusNumberInput.addEventListener(
      'keyup',
      this.onKeyUpNumberInput.bind(this),
    );
  }

  render(prevStates, states) {
    // fail case
    if (states === undefined) {
      this.$target.innerHTML = this.mainTemplate();
      return;
    }

    if (states.lottos.length === 0) {
      this.$target.classList.add('d-none');
      this.$winningNumberInputs.forEach(clearInputValue);
      clearInputValue(this.$bonusNumberInput);
      return;
    }

    // success case
    if (prevStates.lottos !== states.lottos) {
      this.$target.classList.remove('d-none');
    }

    if (prevStates.winningCount !== states.winningCount) {
      this.$winningInputMessage.textContent = '';
    }
  }
}
