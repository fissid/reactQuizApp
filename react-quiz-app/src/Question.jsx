import Answers from "./Answers";

export default function Question({ currentQuestion, dispatch, answer }) {
  console.log(currentQuestion);
  return (
    <div>
      <h4>{currentQuestion.question}</h4>
      <Answers currentQuestion={currentQuestion} dispatch={dispatch} answer={answer} />
    </div>
  );
}
