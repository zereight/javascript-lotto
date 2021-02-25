/// <reference types="cypress" />

import { DECIDE_WINNER } from '../../src/js/redux/actionType.js';
import { calculateProfitMargin } from '../../src/js/redux/reducer.js';
import { ERROR_MESSAGE } from '../../src/js/utils/message.js';

describe('LOTTO - 구매한 로또 화면 출력 테스트', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5500/');
  });

  it('로또 구매를 완료할 경우, 구매한 로또의 총 개수를 화면에 출력한다.', () => {
    cy.get('#lotto-purchase-input').type('1500');
    cy.get('#lotto-purchase-btn').click();

    cy.get('#total-lotto-count').should(
      'have.text',
      '총 1개를 구매하였습니다.',
    );
  });

  it('로또 구매를 완료할 경우, 수량에 맞는 로또를 화면에 출력한다.', () => {
    cy.get('#lotto-purchase-input').type('1500');
    cy.get('#lotto-purchase-btn').click();
    cy.get('[data-test=lotto]').its('length').should('eq', 1);
  });

  it('번호 보기 토글 버튼을 클릭한 경우, 각 로또의 숫자들을 로또 이모지 우측에 토글한다.', () => {
    cy.get('#lotto-purchase-input').type('1500');
    cy.get('#lotto-purchase-btn').click();

    cy.get('.lotto-numbers-toggle-button').check({ force: true });
    cy.get('.lotto-numbers').should('to.be.visible');
  });
});

// describe('LOTTO - 당첨번호 입력 및 상금확인 테스트', () => {
//   beforeEach(() => {
//     cy.visit('http://localhost:5500/');
//   });

// it('당첨 번호 각각이 1~45 범위를 벗어나게 입력한 경우, 결과 확인하기 버튼이 disabled 상태 및 에러메시지가 화면에 출력된다.', () => {
//   const winningNumbers = [1, 2, 3, 4, 5, 50];
//   const bonusNumber = 40;

//   cy.get('#lotto-purchase-input').type('4500');
//   cy.get('#lotto-purchase-btn').click();
//   cy.get('.winning-number')
//     .each((elem, index) => {
//       cy.wrap(elem).type(winningNumbers[index]);
//     })
//     .then(() => {
//       cy.get('.bonus-number').type(bonusNumber);
//     });

//   cy.get('.open-result-modal-button').should('be.disabled');
//   cy.get('[data-section=winningInputMessage]').should(
//     'have.text',
//     ERROR_MESSAGE.OUT_OF_RANGE,
//   );
// });

// it('중복된 숫자를 당첨 번호로 입력한 경우, 결과 확인하기 버튼이 disabled 상태 및 에러메시지가 화면에 출력된다.', () => {
//   const winningNumbers = [1, 1, 3, 4, 5, 6];
//   const bonusNumber = 45;

//   cy.get('#lotto-purchase-input').type('4500');
//   cy.get('#lotto-purchase-btn').click();

//   cy.get('.winning-number')
//     .each((elem, index) => {
//       cy.wrap(elem).type(winningNumbers[index]);
//     })
//     .then(() => {
//       cy.get('.bonus-number').type(bonusNumber);
//     });

//   cy.get('.open-result-modal-button').should('be.disabled');
//   cy.get('[data-section=winningInputMessage]').should(
//     'have.text',
//     ERROR_MESSAGE.DUPLICATED_NUMBER,
//   );
// });

// it('7개의 번호 중 하나라도 입력하지 않은 경우, 결과 확인하기 버튼이 disabled 상태 및 에러메시지가 화면에 출력된다.', () => {
//   const winningNumbers = [1, 3, 4, 5, 6, 7];

//   cy.get('#lotto-purchase-input').type('4500');
//   cy.get('#lotto-purchase-btn').click();
//   cy.get('.winning-number').each((elem, index) => {
//     cy.wrap(elem).type(winningNumbers[index]);
//   });

//   cy.get('.open-result-modal-button').should('be.disabled');
//   cy.get('[data-section=winningInputMessage]').should(
//     'have.text',
//     ERROR_MESSAGE.EMPTY_INPUT_NUMBER,
//   );
// });

// it('로또 구매를 완료할 경우, 당첨 번호 입력 UI를 화면에 출력한다.', () => {
//   cy.get('#lotto-purchase-input').type('4500');
//   cy.get('#lotto-purchase-btn').click();

//   cy.get('#lotto-winning-number-input-container').should('be.visible');
// });

// it('로또와 당첨 번호가 주어질 때, 당첨 통계/수익률을 계산한다.', () => {
//   const winningNumbers = [1, 2, 3, 4, 5, 6];
//   const bonusNumber = 45;
//   const lottos = [
//     [45, 2, 3, 4, 5, 6],
//     [45, 2, 3, 4, 5, 6],
//     [45, 2, 3, 4, 5, 6],
//     [45, 2, 3, 4, 5, 6],
//     [45, 2, 3, 4, 5, 6],
//   ];

//   const result = {
//     FIRST: 0,
//     SECOND: 5,
//     THIRD: 0,
//     FOURTH: 0,
//     FIFTH: 0,
//   };

//   let winningCount = Object.seal({
//     FIRST: 0,
//     SECOND: 0,
//     THIRD: 0,
//     FOURTH: 0,
//     FIFTH: 0,
//   });

//   winningCount = decideWinners(winningCount, {
//     type: DECIDE_WINNER,
//     props: { winningNumbers, bonusNumber },
//   });
//   for (const [key, value] of Object.entries(winningCount)) {
//     expect(result[key]).to.equal(value);
//   }

//   const profitMargin = calculateProfitMargin(0, lottos.length, winningCount);
//   expect(profitMargin).to.equal(100 * ((300000000 * 5 - 5000) / 5000));
// });
// });
