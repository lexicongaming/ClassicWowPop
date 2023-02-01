/* eslint-disable no-restricted-properties */
/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
/* eslint-disable no-bitwise */

Math.fmod = function fmod(x, y) {
  //  discuss at: http://locutus.io/php/fmod/
  // original by: Onno Marsman (https://twitter.com/onnomarsman)
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //   example 1: fmod(5.7, 1.3)
  //   returns 1: 0.5

  let tmp;
  let p = 0;
  let pY = 0;
  let l = 0.0;
  let l2 = 0.0;

  tmp = x.toExponential().match(/^.\.?(.*)e(.+)$/);
  p = parseInt(tmp[2], 10) - `${tmp[1]}`.length;
  tmp = y.toExponential().match(/^.\.?(.*)e(.+)$/);
  pY = parseInt(tmp[2], 10) - `${tmp[1]}`.length;

  if (pY > p) {
    p = pY;
  }

  const tmp2 = x % y;

  if (p < -100 || p > 20) {
    // toFixed will give an out of bound error so we fix it like this:
    l = Math.round(Math.log(tmp2) / Math.log(10));
    l2 = Math.pow(10, l);

    return (tmp2 / l2).toFixed(l - p) * l2;
  }
  p = p > 0 ? 0 : p;
  return parseFloat(tmp2.toFixed(-p));
};

function StringHash(str) {
  let counter = 1;
  const len = str.length;
  for (let i = 1; i <= len; i += 3) {
    counter =
      Math.fmod(counter * 8161, 4294967279) +
      (str[i - 1] || '').charCodeAt() * 16776193 +
      ((str[i] || '').charCodeAt() || len - i + 256) * 8372226 +
      ((str[i + 1] || '').charCodeAt() || len - i + 256) * 3932164;
  }
  return Math.fmod(counter, 4294967291);
}

module.exports = { StringHash };
