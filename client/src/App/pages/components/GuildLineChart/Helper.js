function getIndex(currentIndex, changer, maxLength) {
  let ret = 0;

  if (changer < 0) {
    ret = currentIndex + changer <= 0 ? 0 : currentIndex + changer;
  }

  if (changer > 0) {
    ret = currentIndex + changer > maxLength - 1 ? maxLength - 1 : currentIndex + changer;
  }

  return ret;
}

const buildStack = (arr, currentIndex) => {
  return [
    arr[getIndex(currentIndex, -3)],
    arr[getIndex(currentIndex, -2)],
    arr[getIndex(currentIndex, -1)],
    arr[currentIndex],
    arr[getIndex(currentIndex, 1, arr.length)],
    arr[getIndex(currentIndex, 2, arr.length)],
    arr[getIndex(currentIndex, 3, arr.length)]
  ];
};

export function notTooCloseToMinOrMaxInStack(el, index, arr) {
  const stack = buildStack(arr, index);
  const stackValues = stack.map(stackEl => stackEl.onlineTotal);
  const stackMin = Math.min(...stackValues);
  const stackMax = Math.max(...stackValues);
  const minIndex = stackValues.indexOf(stackMin);
  const maxIndex = stackValues.indexOf(stackMax);
  const yMaxVal = stack[maxIndex].date;
  const yMinVal = stack[minIndex].date;

  const gapToMin = Math.abs(yMinVal - el.date);
  const gapToMax = Math.abs(yMaxVal - el.date);

  const gapToMinOrMaxTooSmall =
    (gapToMin < 5 || gapToMax < 5) && yMaxVal !== el.date && yMinVal !== el.date;

  return !gapToMinOrMaxTooSmall;
}

export function onlyTurningPoints(el, index, arr) {
  const prevIndex = getIndex(index, -1);
  const nextIndex = getIndex(index, 1, arr.length);
  const prev = arr[prevIndex].onlineTotal;
  const next = arr[nextIndex].onlineTotal;
  const cur = el.onlineTotal;
  const isBeginningOrEnd = index === 0 || index === arr.length - 1;
  const isTurningPoint = !((prev <= cur && next >= cur) || (prev >= cur && next <= cur));
  return isBeginningOrEnd || isTurningPoint;
}
