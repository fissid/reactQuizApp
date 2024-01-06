export default function Start({ numQuestions, dispatch }) {
  return (
    <div className="start">
      <h2>Welcome to The Quiz!</h2>
      <h3>{numQuestions} Qustions to test your mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => {
          dispatch({ type: "start" });
        }}
      >
        Let's Start
      </button>
    </div>
  );
}
