const fs = require('fs').promises;

const WORDS_FILENAME = "/usr/share/dict/words";
const LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

async function main() {
    const data = await fs.readFile(WORDS_FILENAME, "utf8");
    const words = data.split("\n");
    const fiveLetterWords = words.filter(w => w.length === 5 && w === w.toLowerCase());
    const letterScores = Object.fromEntries(LETTERS.map(letter => {
        const numContaining = fiveLetterWords.filter(w => w.includes(letter)).length;
        const percentContaining = numContaining / fiveLetterWords.length;
        const distanceFromHalf = Math.abs(50 - (percentContaining * 100))
        // `percentContaining * 100` would have worked find for a score here because no letters
        // in English are present in more than 50% of words.
        // I left the computation anyway, just in case this isn't true for words of other lengths.
        const score = 50 - distanceFromHalf;
        return [letter, score];
    }))
    const scoredWords = fiveLetterWords
        .map(word => {
            const partialScores = [...new Set([...word])].map(l => letterScores[l]);
            const score = partialScores.reduce((acc, s) => acc + s, 0);
            return {
                word: word,
                score: score
            }
        })
        .sort((sw1, sw2) => sw2.score - sw1.score);
    console.log(scoredWords);
    console.log(Object.entries(letterScores).sort((p1, p2) => p2[1]- p1[1]));
}

main().catch(console.error);