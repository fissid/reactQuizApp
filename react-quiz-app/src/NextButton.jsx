export default function NextButton({ dispatch, answer, currentQuestion, numQuestions }) {
  if (answer === null) return null;
  if (currentQuestion < numQuestions - 1)
    return (
      <button className="btn btn-ui" onClick={() => dispatch({ type: "nextQuestion" })}>
        Next
      </button>
    );

  if (currentQuestion === numQuestions - 1)
    return (
      <button className="btn btn-ui" onClick={() => dispatch({ type: "finished" })}>
        Finish
      </button>
    );
}
