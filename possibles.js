import chalk from "chalk";

export function scoreGuess(guess, target) {
  return [...guess].map((guessLetter, i) => {
    const targetLetter = target[i];
    if (guessLetter === targetLetter) {
      return [guessLetter, "green"];
    } else if (target.includes(guessLetter)) {
      return [guessLetter, "yellow"];
    } else {
      return [guessLetter, "grey"];
    }
  });
}

export function chalkedGuess(guess, target) {
  return scoreGuess(guess, target)
    .map(([guessLetter, color]) => chalk[color](guessLetter))
    .join("");
}

export function getPossibles(possibles, guess, target) {
  const scoredGuess = scoreGuess(guess, target);

  return possibles.filter((word) => {
    return [...word]
      .map((letter, i) => {
        const [guessLetter, color] = scoredGuess[i];

        if (color === "green") {
          return guessLetter === letter;
        } else if (color === "yellow") {
          return guessLetter !== letter && word.includes(guessLetter);
        } else {
          return !word.includes(guessLetter);
        }
      })
      .every((p) => p);
  });
}
