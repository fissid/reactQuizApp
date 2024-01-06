import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";

const INITIALSTATE = {};
function reducer() {}

export default function App() {
  const [state, dispatch] = useReducer(reducer, INITIALSTATE);
  useEffect(function () {
    async function fetchQuestions() {
      try {
        const resp = await fetch("http://localhost:8000/questions");
        const data = await resp.json();
      } catch (err) {
        console.log(err);
      }
    }
    fetchQuestions();
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        <p>1/15</p>
        <p>Question</p>
      </Main>
    </div>
  );
}
