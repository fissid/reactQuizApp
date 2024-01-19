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

const SEC_PER_QUESTION = 30;
const INITIALSTATE = {
  questions: [],
  // different status during the time in application
  // loading, error, ready, active, finish
  status: "loading",
  currentQuestion: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemained: null,
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
        secondsRemained: state.questions.length * SEC_PER_QUESTION,
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
        highScore: state.points > state.highScore ? state.points : state.highScore,
      };
    case "reset":
      return {
        ...INITIALSTATE,
        questions: state.questions,
        status: "ready",
      };
    case "tick":
      return {
        ...state,
        secondsRemained: state.secondsRemained - 1,
        status: state.secondsRemained === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("smt happened");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, INITIALSTATE);

  const { questions, status, currentQuestion, answer, points, highScore, secondsRemained } = state;
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
            <Footer>
              <NextButton dispatch={dispatch} answer={answer} currentQuestion={currentQuestion} numQuestions={numQuestions} />
              <Timer dispatch={dispatch} secondsRemained={secondsRemained} />
            </Footer>
          </>
        )}
        {status === "finished" && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highScore={highScore} dispatch={dispatch} />}
      </Main>
    </div>
  );
}
