import CustomDatePicker from "../ui/CustomDatePicker";
import { DINING_TIME_LABELS } from "@/constants";
import type { MealTimeType } from "@/types";

interface MealFiltersProps {
  selectedDate: string;
  selectedTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export default function MealFilters({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}: MealFiltersProps) {
  const timeOptions = Object.keys(DINING_TIME_LABELS) as MealTimeType[];

  return (
    <>
      {/* Date Selector */}
      <div className="mb-4">
        <CustomDatePicker
          value={selectedDate}
          onChange={onDateChange}
          placeholder="식단을 확인할 날짜를 선택하세요"
        />
      </div>

      {/* Time Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => onTimeChange("all")}
          className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
            selectedTime === "all"
              ? "bg-orange-400 text-white shadow-lg"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-orange-50"
          }`}
        >
          전체
        </button>
        {timeOptions.map((time) => (
          <button
            key={time}
            onClick={() => onTimeChange(time)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
              selectedTime === time
                ? "bg-orange-400 text-white shadow-lg"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-orange-50"
            }`}
          >
            {DINING_TIME_LABELS[time]}
          </button>
        ))}
      </div>
    </>
  );
}
