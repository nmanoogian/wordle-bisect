import { validWords, targetWords } from "./words.js";
import { getPossibles, chalkedGuess } from "./possibles.js";
import cliProgress from "cli-progress";

const LETTERS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

async function mainLetterScores() {
  const letterScores = Object.fromEntries(
    LETTERS.map((letter) => {
      const numContaining = targetWords.filter((w) =>
        w.includes(letter)
      ).length;
      const percentContaining = numContaining / targetWords.length;
      const distanceFromHalf = Math.abs(50 - percentContaining * 100);
      // `percentContaining * 100` would have worked find for a score here because no letters
      // in English are present in more than 50% of words.
      // I left the computation anyway, just in case this isn't true for words of other lengths.
      const score = 50 - distanceFromHalf;
      return [letter, score];
    })
  );
  const scoredWords = validWords
    .map((word) => {
      const partialScores = [...new Set([...word])].map((l) => letterScores[l]);
      const score = partialScores.reduce((acc, s) => acc + s, 0);
      return {
        word: word,
        score: score,
      };
    })
    .sort((sw1, sw2) => sw2.score - sw1.score);
  console.log(scoredWords);
  console.log(Object.entries(letterScores).sort((p1, p2) => p2[1] - p1[1]));
}

async function mainPossibleOptimizer() {
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar.start(targetWords.length, 0);
  const scoredWords = targetWords
    .map((word) => {
      const possibles = targetWords.map(
        (targetWord) => getPossibles(targetWords, word, targetWord).length
      );
      const score = possibles.reduce((a, b) => a + b) / possibles.length;
      bar.increment();
      return {
        word: word,
        score: score,
      };
    })
    .sort((sw1, sw2) => sw1.score - sw2.score);
  bar.stop();
  console.log(scoredWords.slice(0, 100));
}

async function mainPossibles() {
  const guesses = process.argv.slice(3);
  const target = guesses[guesses.length - 1];

  let possibles = validWords;
  console.log(possibles.length, "possibles");

  for (const guess of guesses) {
    possibles = getPossibles(possibles, guess, target);
    console.log(
      chalkedGuess(guess, target),
      "::",
      possibles.length,
      "possibles"
    );
  }
}

switch (process.argv[2]) {
  case "letterScore": {
    mainLetterScores().catch(console.error);
    break;
  }
  case "possiblesOptimize": {
    mainPossibleOptimizer().catch(console.error);
    break;
  }
  case "possibles": {
    mainPossibles().catch(console.error);
    break;
  }
}
