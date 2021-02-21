import { $, $$ } from "../utils/dom.js";
import Component from "../utils/Component.js";
import Lotto from "../model/Lotto.js";

export default class WinningNumbersInput extends Component {
  mainTemplate() {
    return `<label class="flex-auto d-inline-block mb-3"
        >지난 주 당첨번호 6개와 보너스 넘버 1개를 입력해주세요.</label
      >
      <div class=" d-flex">
        <div>
          <h4 class="mt-0 mb-3 text-center">당첨 번호</h4>
          <div class="winning-number-container">
            <input
              type="number"
              class="winning-number mx-1 text-center"
            />
            <input
              type="number"
              class="winning-number mx-1 text-center"
            />
            <input
              type="number"
              class="winning-number mx-1 text-center"
            />
            <input
              type="number"
              class="winning-number mx-1 text-center"
            />
            <input
              type="number"
              class="winning-number mx-1 text-center"
            />
            <input
              type="number"
              class="winning-number mx-1 text-center"
            />
          </div>
        </div>

        <div class="bonus-number-container flex-grow">
          <h4 class="mt-0 mb-3 text-center">보너스 번호</h4>
          <div class="d-flex justify-center">
            <input type="number" class="bonus-number text-center" />
          </div>
        </div>
      </div>

      <button
        disabled
        type="button"
        class="open-result-modal-button mt-5 btn btn-cyan w-100"
      >
        결과 확인하기
      </button>
`;
  }

  setup() {
    this.lottos = [];
  }

  selectDOM() {
    this.winningNumberInputs = $$(".winning-number");
    this.bonusNumberInput = $(".bonus-number");
    this.openResultModalButton = $(".open-result-modal-button");
  }

  setState({ lottos }) {
    this.lottos = lottos ?? this.lottos;
  }

  setEvent() {
    this.addEvent({
      eventType: "click",
      target: this.openResultModalButton,
      callback: this.onClickResultButton,
      isBinding: true,
    });

    this.addEvent({
      eventType: "keyup",
      target: this.winningNumberInputs,
      callback: this.onKeyUpNumberInput,
      isBinding: true,
    });

    this.addEvent({
      eventType: "keyup",
      target: this.bonusNumberInput,
      callback: this.onKeyUpNumberInput,
      isBinding: true,
    });
  }

  onKeyUpNumberInput(e) {
    if (e.target.value.length > 1) {
      e.target.value = e.target.value.slice(0, 2);
      if (e.target.nextElementSibling) e.target.nextElementSibling.focus(); // 2자리 입력했으면 다음으로 (당첨번호만, 보너스번호x)
    }
    if (
      Lotto.isValidLottoNumbers(
        Array.from(this.winningNumberInputs).map((input) =>
          Number(input.value)
        ),
        Number(this.bonusNumberInput.value)
      )
    ) {
      this.openResultModalButton.disabled = false;
    } else {
      this.openResultModalButton.disabled = true;
    }
  }

  onClickResultButton() {
    const winningNumbers = Array.from(this.winningNumberInputs).map((input) =>
      Number(input.value)
    );
    const bonusNumber = Number(this.bonusNumberInput.value);
    const winnerCount = [...Array(6)].fill(0); // winnerCount[0] = 10 : 1등이 10명
    this.lottos.forEach((lotto) => {
      const grade =
        this.decideWinners(lotto.numbers, winningNumbers, bonusNumber) - 1;
      winnerCount[grade]++;
    });

    this.$props.mainObserver.notifyObservers({ winnerCount });
  }

  decideWinners = (lottoNumbers, winningNumbers, bonusNumber) => {
    let count = 0;
    lottoNumbers.forEach((number) => {
      if (winningNumbers.includes(number)) count++;
    });
    if (count === 6) {
      return 1;
    } else if (count === 5) {
      if (lottoNumbers.includes(bonusNumber)) return 2;
      return 3;
    } else if (count === 4) return 4;
    else if (count === 3) return 5;
    return 6;
  };

  notify({ lottos, restart }) {
    if (lottos) {
      this.setState({ lottos });
      this.$target.classList.remove("hidden");
    }

    if (restart) {
      this.$target.classList.add("hidden");
      this.winningNumberInputs.forEach((input) => (input.value = ""));
      this.bonusNumberInput.value = "";
      this.openResultModalButton.disabled = true;
    }
  }
}
