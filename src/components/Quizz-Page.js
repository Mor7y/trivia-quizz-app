import React, { useState, useEffect } from "react";
import Entities from "./entities/entities-list.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function QuizzPage(props) {
  const [quizzData, setQuizzData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [count, setCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    async function fetchTrivia() {
      const response = await fetch(props.url);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();
      setQuizzData(data.results);
    }
    try {
      fetchTrivia();
    } catch (err) {
      console.log(err);
    }
    return () => {};
  }, [props.url]);

  useEffect(() => {
    const quizzPage = document.querySelector(".quizz-page");
    setTimeout(() => {
      quizzPage.classList.add("active");
    }, 1000);
  }, []);

  const replaceEntities = (text) => {
    const allEntities = [
      ...Entities.letters,
      ...Entities.currency,
      ...Entities.numbers,
      ...Entities.punctuation,
      ...Entities.math,
      ...Entities.symbols,
    ];

    const entityCodeRegex = /&(?:[a-zA-Z]+|#[0-9]+);/g;

    return text.replace(entityCodeRegex, (match) => {
      const entity = allEntities.find(
        (entityObj) => entityObj.entity === match
      );
      if (entity) {
        return entity.character;
      }
    });
  };

  useEffect(() => {
    const newQuestions = quizzData.map((data) => {
      const generateId = () => Math.random().toString(36).slice(-8);

      return {
        id: generateId(),
        question: replaceEntities(data.question),

        correctAnswer: replaceEntities(data.correct_answer),

        allAnswers: [data.correct_answer, ...data.incorrect_answers]
          .sort(() => Math.random() - 0.5)
          .map((answer) => {
            return replaceEntities(answer);
          }),
      };
    });
    setQuestions(newQuestions);
  }, [quizzData]);

  function pickAnswer(e) {
    if (gameOver) return;
    const element = e.target;
    const questionId = element.parentNode.dataset.questionid;
    const answer = element.innerText;

    setSelectedAnswers((prevAnswers) => {
      return {
        ...prevAnswers,
        [questionId]: answer,
      };
    });
  }

  function checkAnswers() {
    questions.forEach((question) => {
      const selectedAnswer = selectedAnswers[question.id];
      const correctAnswer = question.correctAnswer;

      if (selectedAnswer === correctAnswer) {
        setCount((prevCount) => prevCount + 1);
      }
      const answerElements = document.querySelectorAll(
        `[data-questionid="${question.id}"] li`
      );

      answerElements.forEach((answerEl) => {
        const answer = answerEl.innerText;
        const icon = answerEl.firstChild;

        if (answer === correctAnswer) {
          answerEl.classList.add("correct-answer");
          answerEl.classList.remove("wrong-answer");
          if (selectedAnswer === correctAnswer) {
            icon.classList.add("active");
          } else {
            icon.classList.remove("active");
          }
        } else if (answer === selectedAnswer) {
          answerEl.classList.add("wrong-answer");
          answerEl.classList.remove("correct-answer");
        } else {
          answerEl.classList.remove("correct-answer");
          answerEl.classList.remove("wrong-answer");
        }

        answerEl.classList.remove("active");
      });

      setGameOver(true);
    });
  }

  useEffect(() => {
    quizzData.forEach((q) => console.log(q.correct_answer));  // FOR CHEATERS!!
  }, [quizzData]);

  const renderQuestion = questions.map((question) => {
    const selectedAnswer = selectedAnswers[question.id];
    return (
      <div key={question.id} className="question-container">
        <h1 className="question">{question.question}</h1>
        <ul className="answer-container" data-questionid={question.id}>
          {question.allAnswers.map((answer) => (
            <li
              key={answer}
              className={selectedAnswer === answer ? "answer active" : "answer"}
              onClick={pickAnswer}
            >
              <FontAwesomeIcon className="icon" icon="fa-solid fa-check" />
              {answer}
            </li>
          ))}
        </ul>
      </div>
    );
  });

  return (
    <div className="quizz-page ">
      {renderQuestion}
      <div className="quizzbuttons-wraper">
        {!gameOver && (
          <button className="quizz-btn" onClick={checkAnswers}>
            Check Answers
          </button>
        )}
        {gameOver && (
          <p className="count">
            {count === questions.length ? "Congratulations!!!" : ""} You Got{" "}
            {count} out of {questions.length}!
          </p>
        )}
        {gameOver && (
          <button className="quizz-btn" onClick={props.endEvent}>
            Start New Game
          </button>
        )}
      </div>
    </div>
  );
}
