import readline from "readline";
import fs from "fs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function loadQuestionsAndAnswers(filename) {
  const data = fs.readFileSync(filename);
  return JSON.parse(data);
}

async function program() {
  console.log("Study App\nModes:\n1. Multiple Choice\n2. Vocabulary Drill\n3. Exit");

  rl.question("> ", (mode) => {
    switch (mode) {
      case "1":
        multipleChoiceMode();
        break;
      case "2":
        vocabularyDrillMode();
        break;
      case "3":
        console.log("Exiting...");
        rl.close();
        break;
      default:
        console.log("Invalid mode. Please enter a number between 1 and 3.");
        program();
        break;
    }
  });
}

function multipleChoiceMode() {
  const questions = loadQuestionsAndAnswers("multipleChoice.json");
  let score = 0;

  function askQuestion(index) {
    if (index >= questions.length) {
      console.log(`Score: ${score}/${questions.length}`);
      program();
      return;
    }

    const question = questions[index];
    console.log(`Q: ${question.question}`);
    question.possibleAnswers.forEach((answer, i) => {
      console.log(`${i + 1}. ${answer}`);
    });

    rl.question("> ", (answer) => {
      if (answer === "q") {
        console.log(`Score: ${score}/${questions.length}`);
        program();
        return;
      }

      if (parseInt(answer) === question.correctAnswer + 1) {
        score++;
      }

      askQuestion(index + 1);
    });
  }

  askQuestion(0);
}

function vocabularyDrillMode() {
  const definitions = loadQuestionsAndAnswers("definitions.json");
  const terms = definitions.map((def) => def.possibleTerms[def.correctDefinition]);

  function drill(index) {
    if (index >= terms.length) {
      console.log("Complete");
      program();
      return;
    }

    const term = terms[index];
    const definition = definitions.find((def) => def.possibleTerms.includes(term)).definition;
    console.log(`Definition: ${definition}`);
    console.log(definitions[index].possibleTerms.map((term, i) => `${i + 1}. ${term}`).join("\n"));

    setTimeout(() => {
      console.log("Time's up!");
      drill(index + 1);
    }, 5000);

    rl.question("> ", (answer) => {
      if (answer === "q") {
        console.log("Incomplete");
        program();
        return;
      }

      if (parseInt(answer) === definitions[index].correctDefinition + 1) {
        console.log("Correct");
        definitions.splice(index, 1);
      } else {
        console.log("Incorrect");
      }

      drill(index);
    });
  }

  drill(0);
}

program();
