/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
const enUS = require('./enUS');
const deDE = require('./deDE');
const frFR = require('./frFR');
const koKR = require('./koKR');
const ptBR = require('./ptBR');
const ruRU = require('./ruRU');
const zhCN = require('./zhCN');
const zhTW = require('./zhTW');
const esES = require('./esES');
const itIT = require('./itIT');

let dictionary = [enUS, deDE, frFR, itIT, koKR, ptBR, ruRU, zhCN, zhTW, esES];
dictionary = dictionary.reduce((acc, next) => Object.assign(acc, next), {});

const get_enUS = translateWord => {
  for (const word in dictionary) {
    if (word === translateWord) {
      return dictionary[word];
    }
  }
  return false;
};

module.exports = {
  get_enUS
};
