import React, { useState, useEffect } from "react";
import QuizzPage from "./Quizz-Page";

export default function Main() {
  const [quizzStarted, setQuizzStarted] = useState(false);

  const [options, setOptions] = useState({
    questionNo: "5",
    category: "",
    difficulty: "",
  });
  const [url, updateUrl] = useState(`https://opentdb.com/api.php?amount=5`);

  useEffect(() => {
    updateUrl(
      `https://opentdb.com/api.php?amount=${options.questionNo}${options.category}${options.difficulty}&type=multiple`
    );
  }, [options]);

  function startQuiz() {
    const page = document.querySelector(".start-page");

    if (quizzStarted) {
      page.classList.add("active");
      page.classList.remove("inactive");
      setQuizzStarted(false);
    } else {
      page.classList.add("inactive");
      page.classList.remove("active");
      setQuizzStarted(true);
    }
  }
  function changeOptions(e) {
    const { name, value } = e.target;
    setOptions((prevOptions) => {
      return { ...prevOptions, [name]: value };
    });
  }

  return (
    <main className="main">
      <div className="start-page">
        <div className="description">
          <h2>
            Challenge your knowledge with <span>QuizzTime!</span>
          </h2>
          <p>
            With multiple categories and questions, this app is perfect for
            those who love to learn and test their skills.
          </p>
        </div>

        <div className="options-container">
          <div className="select">
            <label className="selections" htmlFor="No. Questions">
              Select No. of Questions:
            </label>
            <select
              name="questionNo"
              id="No. Questions"
              value={options.questionNo}
              onChange={changeOptions}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
          <div className="select">
            <label className="selections" htmlFor="Category">
              Select Category
            </label>

            <select
              id="Category"
              name="category"
              value={options.category}
              onChange={changeOptions}
            >
              <option value="">Any Category</option>
              <option value="&category=9">General Knowledge</option>
              <option value="&category=10">Books</option>
              <option value="&category=11">Films</option>
              <option value="&category=12">Music</option>
            </select>
          </div>
          <div className="select">
            <label className="selections" htmlFor="Difficulty">
              Select Difficulty
            </label>
            <select
              id="Difficulty"
              name="difficulty"
              value={options.difficulty}
              onChange={changeOptions}
            >
              <option value="">Any Difficulty</option>
              <option value="&difficulty=easy">Easy</option>
              <option value="&difficulty=medium">Medium</option>
              <option value="&difficulty=hard">Hard</option>
            </select>
          </div>
        </div>
        <button className="start-btn" onClick={startQuiz}>
          Start Quiz
        </button>
      </div>
      {quizzStarted && <QuizzPage url={url} endEvent={startQuiz} />}
    </main>
  );
}
