import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import Start from "./Start";
import Question from "./Question";
import NextButton from "./NextButton";

const INITIALSTATE = {
  questions: [],
  // different status during the time in application
  // loading, error, ready, active, finish
  status: "loading",
  currentQuestion: 0,
  answer: null,
  points: 0,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
      };
    case "newAnswer":
      const question = state.questions.at(state.currentQuestion);
      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ? state.points + question.points : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
        answer: null,
      };
    default:
      throw new Error("smt happened");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, INITIALSTATE);

  const { questions, status, currentQuestion, answer } = state;
  const numQuestions = questions.length;
  useEffect(function () {
    async function fetchQuestions() {
      try {
        const resp = await fetch("http://localhost:8000/questions");
        const data = await resp.json();
        dispatch({ type: "dataReceived", payload: data });
      } catch (err) {
        dispatch({ type: "dataFailed" });
        console.log(err);
      }
    }
    fetchQuestions();
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <Start numQuestions={numQuestions} dispatch={dispatch} />}
        {status === "active" && (
          <>
            <Question currentQuestion={questions[currentQuestion]} dispatch={dispatch} answer={answer} />
            <NextButton dispatch={dispatch} answer={answer} />
          </>
        )}
      </Main>
    </div>
  );
}
