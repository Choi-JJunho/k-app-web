interface ErrorStateProps {
  icon?: string;
  title: string;
  description?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  icon = "⚠️",
  title,
  description,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-6xl mb-4 opacity-60">{icon}</div>
      <h3 className="text-lg font-semibold text-red-600 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-orange-400 text-white rounded-xl font-medium hover:bg-orange-500 transition-colors shadow-lg hover:shadow-xl"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
