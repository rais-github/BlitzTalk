import compromise from "compromise";
import { emotions } from "../json/emotions";
const nlp = compromise;
export const detectEmotion = (text) => {
  // Tokenize the input text using Compromise
  const doc = nlp(text.toLowerCase());
  const tokens = doc.terms().out("array");

  // Iterate through each token and check if it matches any emotion keyword
  for (let token of tokens) {
    for (let [emotion, keywords] of Object.entries(emotions)) {
      if (keywords.includes(token)) {
        return emotion;
      }
    }
  }

  // If no emotion keyword is found in the text, return null
  return null;
};
