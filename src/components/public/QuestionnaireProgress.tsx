export function QuestionnaireProgress({
  answeredCount,
  totalCount,
}: {
  answeredCount: number;
  totalCount: number;
}) {
  if (!totalCount) return null;
  return (
    <div className="label">
      Questions répondues: {answeredCount}/{totalCount}
    </div>
  );
}
