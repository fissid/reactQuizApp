export default function Answers({ currentQuestion, dispatch, answer }) {
  const hasAnswered = answer !== null;
  return (
    <div className="options">
      {currentQuestion.options.map((each, index) => (
        <button
          className={`btn btn-option ${index === answer ? "answer" : ""} ${hasAnswered ? (index === currentQuestion.correctOption ? "correct" : "wrong") : ""}`}
          key={each}
          disabled={hasAnswered}
          onClick={() => {
            dispatch({ type: "newAnswer", payload: index });
          }}
        >
          {each}
        </button>
      ))}
    </div>
  );
}
