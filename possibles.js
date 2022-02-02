const { validWords } = require('./words');

async function main() {
  const target = "";
  const guesses = [];

  let possibles = validWords;
  console.log(possibles.length, "possibles");

  for (const guess of guesses) {
    possibles = possibles.filter(word => {
      return [...word].map((letter, i) => {
        const guessLetter = guess[i];
        const targetLetter = target[i];

        if (guessLetter === targetLetter) {
          // Green
          return guessLetter === letter;
        } else if (target.includes(guessLetter)) {
          // Yellow
          return guessLetter !== letter && word.includes(guessLetter);
        } else {
          // Grey
          return !word.includes(guessLetter);
        }
      }).every(p => p);
    })
    console.log(guess, possibles.length, "possibles");
  }
}

main().catch(console.error);
