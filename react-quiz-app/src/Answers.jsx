export default function Answers({ currentQuestion, dispatch, userAnswer }) {
  return (
    <div className="options">
      {currentQuestion.options.map((each, index) => (
        <button
          className={`btn btn-option ${index === userAnswer ? "answer" : ""} ${index === currentQuestion.correctOption ? "correct" : "wrong"}}`}
          key={each}
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
