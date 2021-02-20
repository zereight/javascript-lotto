import { LOTTO_PRICE, WINNINGS } from "../utils/constants.js";
import { $, $$ } from "../utils/dom.js";
import Component from "../utils/Component.js";

export default class ModalDisplay extends Component {
  template() {
    return `
        <div class="modal-inner p-10">
          <div class="modal-close">
            <svg viewbox="0 0 40 40">
              <path class="close-x" d="M 10,10 L 30,30 M 30,10 L 10,30" />
            </svg>
          </div>

          <h2 class="text-center">🏆 당첨 통계 🏆</h2>
          <div class="d-flex justify-center">
            <table class="result-table border-collapse border border-black">
              <thead>
                <tr class="text-center">
                  <th class="p-3">일치 갯수</th>
                  <th class="p-3">당첨금</th>
                  <th class="p-3">당첨 갯수</th>
                </tr>
              </thead>
              <tbody>
                <tr class="text-center">
                  <td class="p-3">3개</td>
                  <td class="p-3">5,000</td>
                  <td class="winner-count p-3">n개</td>
                </tr>
                <tr class="text-center">
                  <td class="p-3">4개</td>
                  <td class="p-3">50,000</td>
                  <td class="winner-count p-3">n개</td>
                </tr>
                <tr class="text-center">
                  <td class="p-3">5개</td>
                  <td class="p-3">1,500,000</td>
                  <td class="winner-count p-3">n개</td>
                </tr>
                <tr class="text-center">
                  <td class="p-3">5개 + 보너스볼</td>
                  <td class="p-3">30,000,000</td>
                  <td class="winner-count p-3">n개</td>
                </tr>
                <tr class="text-center">
                  <td class="p-3">6개</td>
                  <td class="p-3">2,000,000,000</td>
                  <td class="winner-count p-3">n개</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p id="lotto-profit" class="text-center font-bold">당신의 총 수익률은 %입니다.</p>
          <div class="d-flex justify-center mt-5">
            <button id="restart-btn" type="button" class="btn btn-cyan">다시 시작하기</button>
          </div>
        </div>
      </div>

`;
  }

  mounted() {
    this.winnerCountTexts = $$(".winner-count");
    this.lottoProfit = $("#lotto-profit");
    this.restartButton = $("#restart-btn");
  }

  onModalShow() {
    this.$target.classList.add("open");
  }

  onModalClose() {
    this.$target.classList.remove("open");
  }

  onClickOutsideModal(e) {
    if (!e.target.closest("svg") && e.target.closest(".modal-inner")) {
      return;
    }
    this.onModalClose();
  }

  onClickRestartButton() {
    this.$props.mainObserver.notifyObservers({ restart: true });
  }

  setEvent() {
    this.addEvent({
      eventType: "mousedown",
      target: this.$target,
      callback: this.onClickOutsideModal,
      isBinding: true,
    });
    this.addEvent({
      eventType: "click",
      target: this.restartButton,
      callback: this.onClickRestartButton,
      isBinding: true,
    });
  }

  notify({ winnerCount, restart }) {
    if (winnerCount) {
      const investment = LOTTO_PRICE * winnerCount.reduce((a, b) => a + b, 0);
      let profit = 0;
      this.onModalShow();
      this.winnerCountTexts.forEach((winnerCountText, index) => {
        winnerCountText.textContent = winnerCount[4 - index];
        profit += winnerCount[4 - index] * WINNINGS[4 - index];
      });
      this.lottoProfit.textContent = `당신의 총 수익률은 ${(
        (profit / investment).toFixed(2) * 100
      ).toFixed(2)}%입니다.`;
    }

    if (restart) {
      this.onModalClose();
    }
  }
}
