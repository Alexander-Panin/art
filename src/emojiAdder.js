const m = {
  unicore: '🦄', единорог: '🦄',
  alien: '👽', пришелец: '👽',
  iphone: '📱', айфон: '📱',
  sex: '🍸', секс: '🍸',
  poo: '💩', какашка: '💩',
  cat: '😺', котик: '😺',
  drugs: '💉', наркотики: '💉',
  music: '🎸', "rock'n'roll": '🎸',
}

export function emojiAdder(prev = 0) {
  return function(text, pos) {
    const {f, l} = findWord(text, pos);
    let word = text.substr(f,l-f);
    if (m[word] && (prev + 1 === pos)) word += m[word];
    prev = pos;
    return text.substr(0,f) + word + text.substr(l);
  }
}

function findWord(text, pos) {
  let [f, l] = [pos, pos];
  if (text.charCodeAt(pos) === 32 && f !== 0) {f--;}
  const len = text.length;
  while(f !== 0 && text.charCodeAt(f) !== 32) f--;
  while(l !== len && text.charCodeAt(l) !== 32) l++;
  if (f !== 0) f++;
  return {f, l};
}
