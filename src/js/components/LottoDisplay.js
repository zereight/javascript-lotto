import { $, $$ } from "../utils/dom.js";
import { LOTTO_PRICE } from "../utils/constants.js";
import Component from "../utils/Component.js";
import Lotto from "../model/Lotto.js";

export default class LottoDisplay extends Component {
  mainTemplate() {
    return `<div class="d-flex">
        <label id="total-lotto-count" class="flex-auto my-0">총 5개를 구매하였습니다.</label>
        <div class="flex-auto d-flex justify-end pr-1">
          <label class="switch">
            <input type="checkbox" class="lotto-numbers-toggle-checkbox" />
            <span class="text-base font-normal">번호보기</span>
          </label>
        </div>
      </div>
      <div id="lotto-display-area" class="d-flex flex-wrap">
      </div>`;
  }

  lottoTemplate(numbers) {
    return `<span data-test="lotto-numbers" class="text-2xl ml-4">🎟️ <span class="hidden lotto-numbers">${numbers.join(
      ", "
    )}</span></span>`;
  }

  selectDOM() {
    this.totalLottoCountText = $("#total-lotto-count");
    this.lottoDisplayArea = $("#lotto-display-area");
    this.lottoNumberToggleCheckBox = $(".lotto-numbers-toggle-checkbox");
  }

  setEvent() {
    this.addEvent({
      eventType: "change",
      target: this.lottoNumberToggleCheckBox,
      callback: this.onChangeToggleButton,
      isBinding: true,
    });
  }

  onChangeToggleButton() {
    $$(".lotto-numbers", this.lottoDisplayArea).forEach((lottoElement) => {
      lottoElement.classList.toggle("hidden");
    });
  }

  notify({ purchaseInputValue, restart }) {
    if (purchaseInputValue) {
      const lottos = [];
      let lottoCount = Math.floor(purchaseInputValue / LOTTO_PRICE);
      let lottosHTML = "";
      this.$target.classList.remove("hidden");
      this.totalLottoCountText.textContent = `총 ${lottoCount}개를 구매하였습니다.`;

      while (lottoCount--) {
        const newLotto = new Lotto(Lotto.generateNumbers());
        lottos.push(newLotto);
        lottosHTML += this.lottoTemplate(newLotto.numbers);
      }
      this.lottoDisplayArea.innerHTML = lottosHTML;
      this.$props.mainObserver.notifyObservers({ lottos });
    }

    if (restart) {
      this.$target.classList.add("hidden");
      this.lottoNumberToggleCheckBox.checked = false;
    }
  }
}
