"use client";

import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  startMonth?: Date;
  endMonth?: Date;
  disableNavigation?: boolean;
}

export default function CustomDatePicker({
  value,
  onChange,
  placeholder = "날짜를 선택하세요",
  disabled = false,
  startMonth,
  endMonth,
  disableNavigation = false,
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
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDate(today);
    onChange(format(today, "yyyy-MM-dd"));
    setIsOpen(false);
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
        disabled={disabled}
        readOnly
        className={`w-full p-3 rounded-xl border-2 focus:outline-none text-center font-medium transition-all ${
          disabled
            ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
            : "border-orange-200 focus:border-orange-400 bg-white text-gray-700 cursor-pointer hover:border-orange-300"
        } placeholder-gray-400`}
      />

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Calendar */}
          <div className="p-3">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              defaultMonth={selectedDate || new Date()}
              startMonth={startMonth}
              endMonth={endMonth}
              disableNavigation={disableNavigation}
              locale={ko}
              className="rdp-custom"
              weekStartsOn={1}
              autoFocus
              styles={{
                root: { width: "100%" },
                month: { width: "100%" },
                month_grid: { width: "100%" },
                weekdays: { width: "100%" },
                week: { width: "100%" },
              }}
            />
            <div className="flex justify-center pt-3 border-t border-gray-100">
              <button
                onClick={handleTodayClick}
                className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 hover:border-orange-300 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                오늘
              </button>
            </div>
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
        .rdp-custom .rdp-month_caption {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8px 0;
          position: relative;
        }
        .rdp-custom .rdp-nav {
          position: relative;

          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          pointer-events: none;
        }
        .rdp-custom .rdp-button_next {
          pointer-events: all;
        }
        .rdp-custom .rdp-button_previous {
          pointer-events: all;
        }
      `}</style>
    </div>
  );
}
