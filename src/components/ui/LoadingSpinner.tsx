interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

export default function LoadingSpinner({
  size = "md",
  message = "로딩 중...",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div
        className={`animate-spin rounded-full border-b-2 border-orange-400 ${sizeClasses[size]}`}
      />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}
