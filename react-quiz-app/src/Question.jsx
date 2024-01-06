export default function Question({ currentQuestion }) {
  console.log(currentQuestion);
  return (
    <div>
      <h4>{currentQuestion.question}</h4>
      <ul></ul>
    </div>
  );
}
