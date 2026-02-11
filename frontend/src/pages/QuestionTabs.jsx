export default function QuestionTabs({ active, onChange }) {
  return (
    <div className="flex" style={{ gap: "var(--space-3)" }}>
      <button
        className={active === "my" ? "btn-primary" : ""}
        onClick={() => onChange("my")}
      >
        My Questions
      </button>

      <button
        className={active === "public" ? "btn-primary" : ""}
        onClick={() => onChange("public")}
      >
        Public Question Bank
      </button>

      <button
        className={active === "create" ? "btn-primary" : ""}
        onClick={() => onChange("create")}
      >
        Create New Question
      </button>
    </div>
  );
}
