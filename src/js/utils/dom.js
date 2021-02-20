const doc = document;

export const $ = (selector, target = doc) => {
  return target.querySelector(selector);
};

export const $$ = (selector, target = doc) => {
  return target.querySelectorAll(selector);
};
