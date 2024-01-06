import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import Start from "./Start";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";

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
    case "finished":
      return {
        ...state,
        status: "finished",
      };
    default:
      throw new Error("smt happened");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, INITIALSTATE);

  const { questions, status, currentQuestion, answer, points } = state;
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0);
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
            <Progress currentQuestion={currentQuestion} numQuestions={numQuestions} points={points} maxPossiblePoints={maxPossiblePoints} />
            <Question currentQuestion={questions[currentQuestion]} dispatch={dispatch} answer={answer} />
            <NextButton dispatch={dispatch} answer={answer} currentQuestion={currentQuestion} numQuestions={numQuestions} />
          </>
        )}
        {status === "finished" && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} />}
      </Main>
    </div>
  );
}
