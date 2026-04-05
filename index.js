import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "ChibaKing82",
  port: 5432,
});
db.connect();

let totalCorrect = 0;
let quiz = [];

db.query("SELECT * from flags", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    quiz = res.rows;
  }
  db.end();
});


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

// GET home page
app.get("/", (req, res) =>
{
  //console.log("test" + JSON.stringify(quiz[0].name));
  totalCorrect = 0;
  nextQuestion();
  console.log("test2" + currentQuestion.flag);
  res.render("index.ejs", { question:  emojiToISO(currentQuestion.flag) });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}

function emojiToISO(emoji) {
  if (!emoji) return "";
  const codePoints = [...emoji].map(c => c.codePointAt(0));
  // Regional indicator symbols start at 127462 ("A")
  return codePoints
    .map(cp => String.fromCharCode(cp - 127397))
    .join("")
    .toLowerCase();
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
