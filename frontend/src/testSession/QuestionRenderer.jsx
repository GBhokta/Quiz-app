export default function QuestionRenderer({
  question,
  answer,
  onAnswerChange,
}) {
  if (!question) return null;

  switch (question.question_type) {
    case "MCQ":
      return (
        <MCQ
          question={question}
          answer={answer}
          onAnswerChange={onAnswerChange}
        />
      );

    case "MSQ":
      return (
        <MSQ
          question={question}
          answer={answer}
          onAnswerChange={onAnswerChange}
        />
      );

    case "NAT":
      return (
        <NAT
          question={question}
          answer={answer}
          onAnswerChange={onAnswerChange}
        />
      );

    default:
      return <p className="text-muted">Unsupported question type</p>;
  }
}
