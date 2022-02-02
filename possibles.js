const { validWords } = require('./words');

async function main() {
  const guesses = [
    [["o", "y"], ["r", "d"], ["a", "d"], ["t", "y"], ["e", "d"]],
    [["t", "y"], ["o", "g"], ["i", "g"], ["l", "d"], ["s", "y"]],
  ];
  let possibles = validWords;
  console.log(possibles.length, "possibles");
  for (const guess of guesses) {
    possibles = possibles.filter(word => {
      return [...word].map((letter, i) => {
        const [guessLetter, guessResult] = guess[i];
        if (guessResult === "g") {
          return guessLetter === letter;
        } else if (guessResult === "y") {
          return guessLetter !== letter && word.includes(guessLetter);
        } else {
          return !word.includes(guessLetter);
        }
      }).every(p => p);
    })
    console.log(guess.map(p => p[0]).join(""), possibles.length, "possibles");
  }
}

main().catch(console.error);
