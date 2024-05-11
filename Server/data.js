import { NlpManager } from "node-nlp";
// Function to train the NLP model
export async function trainModel() {
  const manager = new NlpManager({ languages: ["en"], forceNER: true });
  // Add training data for greetings.hello
  manager.addDocument("en", "hi", "greetings.hello");
  manager.addDocument("en", "hello", "greetings.hello");
  manager.addDocument("en", "hey", "greetings.hello");
  manager.addDocument("en", "howdy", "greetings.hello");
  manager.addDocument("en", "hello there", "greetings.hello");

  // Add training data for greetings.bye
  manager.addDocument("en", "goodbye for now", "greetings.bye");
  manager.addDocument("en", "bye bye take care", "greetings.bye");
  manager.addDocument("en", "okay see you later", "greetings.bye");
  manager.addDocument("en", "bye for now", "greetings.bye");
  manager.addDocument("en", "i must go", "greetings.bye");

  // Add training data for joy
  manager.addDocument("en", "I'm feeling great!", "joy");
  manager.addDocument("en", "This is awesome!", "joy");
  manager.addDocument("en", "I'm so happy!", "joy");
  manager.addDocument("en", "Life is beautiful!", "joy");

  // Add training data for sad
  manager.addDocument("en", "I'm feeling down", "sad");
  manager.addDocument("en", "Sorry", "sad");
  manager.addDocument("en", "My bad", "sad");
  manager.addDocument("en", "Pardon", "sad");
  manager.addDocument("en", "My apologies", "sad");
  manager.addDocument("en", "Everything feels hopeless", "sad");
  manager.addDocument("en", "I'm so sad", "sad");
  manager.addDocument("en", "Life seems bleak", "sad");

  // Add training data for love
  manager.addDocument("en", "I love you", "love");
  manager.addDocument("en", "You mean everything to me", "love");
  manager.addDocument("en", "I'm deeply in love with you", "love");
  manager.addDocument("en", "You make my heart skip a beat", "love");

  // Add training data for calm
  manager.addDocument("en", "I'm feeling peaceful", "calm");
  manager.addDocument("en", "Everything is so serene", "calm");
  manager.addDocument("en", "I'm completely relaxed", "calm");
  manager.addDocument("en", "I feel at ease", "calm");

  // Add training data for excited
  manager.addDocument("en", "I'm so excited!", "excited");
  manager.addDocument("en", "I can't wait!", "excited");
  manager.addDocument("en", "This is going to be amazing!", "excited");
  manager.addDocument("en", "I'm bursting with excitement!", "excited");

  // Add training data for irritated
  manager.addDocument("en", "I'm so annoyed right now", "irritated");
  manager.addDocument("en", "This is frustrating", "irritated");
  manager.addDocument("en", "I can't stand this", "irritated");
  manager.addDocument("en", "Why does everything bother me?", "irritated");

  //Add training data for angry
  manager.addDocument("en", "I'm so angry!", "angry");
  manager.addDocument("en", "I'm furious", "angry");
  manager.addDocument("en", "I'm seeing red", "angry");
  manager.addDocument("en", "I'm about to explode", "angry");
  manager.addDocument("en", "I'm so mad I can't see straight", "angry");
  manager.addDocument("en", "I'm so angry I can't think straight", "angry");
  manager.addDocument("en", "I don't want to talk", "angry");

  // Add answers for ashamed
  manager.addDocument("en", "I'm so ashamed", "ashamed");
  manager.addDocument("en", "I feel so guilty", "ashamed");
  manager.addDocument("en", "I'm embarrassed", "ashamed");
  manager.addDocument("en", "I can't face anyone", "ashamed");
  manager.addDocument("en", "I'm so sorry", "ashamed");
  manager.addDocument("en", "I can't believe I did that", "ashamed");

  // Add training data for bored
  manager.addDocument("en", "I'm so bored", "bored");
  manager.addDocument("en", "I'm tired of this", "bored");
  manager.addDocument("en", "This is so dull", "bored");
  manager.addDocument("en", "I'm sick of this", "bored");
  manager.addDocument("en", "I can't take it anymore", "bored");

  //Add training data for curious
  manager.addDocument("en", "I'm curious", "curious");
  manager.addDocument("en", "I'm interested", "curious");
  manager.addDocument("en", "I want to know more", "curious");
  manager.addDocument("en", "I'm inquisitive", "curious");
  manager.addDocument("en", "why is this happening", "curious");

  //Add training data for blank
  manager.addDocument("en", "I do not know", "blank");
  manager.addDocument("en", "I don't know", "blank");
  manager.addDocument("en", "I can't help", "blank");
  manager.addDocument("en", "I do not know", "blank");
  manager.addDocument("en", "Sorry , i did'nt understand", "blank");
  manager.addDocument("en", "I'm sorry, I don't know", "blank");
  manager.addDocument("en", "I'm sorry, I don't understand", "blank");
  manager.addDocument("en", "Pardon, I did'nt here you", "blank");
  manager.addDocument("en", "I'm sorry, I didn't get that", "blank");
  manager.addDocument("en", "Come again", "blank");
  manager.addDocument("en", "I'm sorry, I didn't catch that", "blank");
  manager.addDocument("en", "I'm sorry, I didn't hear you", "blank");

  // Train the model
  await manager.train();
  console.log("Model trained successfully");

  // Add answers for greetings.hello
  manager.addAnswer("en", "greetings.hello", "hello");

  // Add answers for greetings.bye
  manager.addAnswer("en", "greetings.bye", "bye");

  // Add answers for joy
  manager.addAnswer("en", "joy", "joy");

  // Add answers for sad
  manager.addAnswer("en", "sad", "sad");

  // Add answers for love
  manager.addAnswer("en", "love", "Love");

  // Add answers for calm
  manager.addAnswer("en", "calm", "calm");

  // Add answers for excited
  manager.addAnswer("en", "excited", "excited");

  // Add answers for irritated
  manager.addAnswer("en", "irritated", "irritated");

  // Add answers for angry
  manager.addAnswer("en", "angry", "angry");

  //Add answers for ashamed
  manager.addAnswer("en", "ashamed", "ashamed");

  // Add answers for bored
  manager.addAnswer("en", "bored", "bored");

  //Add answers for curious
  manager.addAnswer("en", "curious", "curious");

  //Add answers for blank
  manager.addAnswer("en", "blank", "blank");

  // Save the trained model
  await manager.save();
  console.log("Model saved successfully");
}
