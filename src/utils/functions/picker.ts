export function randomInt(min: number, max: number) {
  return min + Math.floor((max - min) * Math.random());
}

export function pickChoice(choices: any[]) {
  return choices[randomInt(0, choices.length - 1)];
}

export function shuffleArray(array: any[]) {
  const _array = [...array];
  for (let i = _array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [_array[i], _array[j]] = [_array[j], _array[i]];
  }
  return _array;
}

export function pickChoices(choices: any[], amount: number) {
  const shuffledChoices = shuffleArray(choices);
  return shuffledChoices.slice(0, amount);
}

export function floorToInt(num: number) {
  return Math.floor(num * 100);
}
