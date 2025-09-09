"use client";

import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export default function CustomDatePicker({
  value,
  onChange,
  placeholder = "날짜를 선택하세요",
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onChange(format(date, "yyyy-MM-dd"));
      setIsOpen(false);
    }
  };

  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  const displayValue = selectedDate
    ? format(selectedDate, "yyyy년 MM월 dd일", { locale: ko })
    : "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        value={displayValue}
        placeholder={placeholder}
        onClick={handleInputClick}
        readOnly
        className="w-full p-3 rounded-xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none text-center font-medium bg-white text-gray-700 placeholder-gray-400 cursor-pointer"
      />

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Calendar */}
          <div className="p-3">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              locale={ko}
              className="rdp-custom"
              styles={{
                root: { width: "100%" },
                month: { width: "100%" },
                month_grid: { width: "100%" },
                weekdays: { width: "100%" },
                week: { width: "100%" },
              }}
            />
          </div>
        </div>
      )}

      <style jsx global>{`
        .rdp-custom {
          --rdp-accent-color: #fb923c;
          --rdp-background-color: #fff7ed;
          width: 100%;
        }
        .rdp-custom .rdp-month {
          width: 100%;
        }
        .rdp-custom .rdp-month_grid {
          width: 100%;
        }
        .rdp-custom .rdp-weekdays {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }
        .rdp-custom .rdp-week {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
        .rdp-custom .rdp-day {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .rdp-custom .rdp-day_button {
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
          border: none;
          background: none;
          cursor: pointer;
        }
        .rdp-custom .rdp-day_button:hover {
          background-color: #fed7aa;
          color: #ea580c;
        }
        .rdp-custom .rdp-day_button[data-selected="true"] {
          background-color: #fb923c;
          color: white;
        }
        .rdp-custom .rdp-day_button[data-selected="true"]:hover {
          background-color: #f97316;
        }
        .rdp-custom .rdp-day_button[data-today="true"] {
          font-weight: bold;
          color: #ea580c;
        }
        .rdp-custom .rdp-day_button[data-outside="true"] {
          color: #d1d5db;
        }
        .rdp-custom .rdp-weekday {
          text-align: center;
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
          padding: 8px;
        }
      `}</style>
    </div>
  );
}
