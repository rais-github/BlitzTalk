import { NlpManager } from "node-nlp";

// Function to perform emotion detection using the trained NLP model
export async function detectEmotion(text) {
  const manager = new NlpManager({ languages: ["en"], forceNER: true });
  const response = await manager.process("en", text);
  const { classifications, answer } = response;
  // Convert the object into an array of { intent, score } objects
  const classificationArray = Object.entries(classifications).map(
    ([intent, score]) => ({ intent, score })
  );

  // Find the intent with the highest score
  const emotion = classificationArray.reduce((prev, current) =>
    prev.score >= current.score ? prev : current
  );
  return [emotion, answer];
}
