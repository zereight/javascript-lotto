/*
    액션 규칙
    액션은 어떤 형태의 액션이 행해질지 가리키는 type 필드를 가져야 합니다. 
    타입은 상수로 정의되고 다른 모듈에서 불러와질수 있습니다. 
    문자열은 직렬화될 수 있기 때문에 타입으로 Symbols 보다는 문자열을 쓰는 것이 좋습니다.
    액션 객체에서 type외의 다른 부분은 여러분 마음대로입니다.
*/

import {
  CALCULATE_PROFIT,
  CREATE_LOTTOS,
  DECIDE_WINNER,
  UPDATE_PAYMENT,
} from './actionType.js';

export const updatePayment = value => {
  'use strict'; // 중복 속성명 막기 위함
  return {
    type: UPDATE_PAYMENT,
    payload: { payment: value },
  };
};

export const createLottos = () => {
  'use strict';
  return {
    type: CREATE_LOTTOS,
  };
};

export const decideWinner = (winningNumbers, bonusNumber) => {
  'use strict';
  return {
    type: DECIDE_WINNER,
    payload: {
      winningNumbers,
      bonusNumber,
    },
  };
};

export const calculateProfit = () => {
  'use strict';
  return {
    type: CALCULATE_PROFIT,
  };
};
