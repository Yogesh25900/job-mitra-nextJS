"use client"

import React, { forwardRef } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

// Custom input to style react-datepicker with Tailwind
const CustomInput = forwardRef(({ value, onClick, placeholder }: any, ref: any) => {
  return (
    <button
      type="button"
      ref={ref}
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg bg-white dark:bg-[#110E1C]/70 border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-primary/50 flex items-center justify-between text-gray-900 dark:text-white transition-colors"
    >
      <span className={`${value ? "opacity-100" : "text-gray-500 dark:text-zinc-400"}`}>
        {value || placeholder}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400 dark:text-zinc-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v6H4V8z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  )
})

CustomInput.displayName = "CustomInput"

interface DOBDatePickerProps {
  value: Date | null
  onChange: (date: Date) => void
  placeholder?: string
  maxDate?: Date
}

export default function DOBDatePicker({ value, onChange, placeholder = "Select date of birth", maxDate }: DOBDatePickerProps) {
  const today = new Date()

  return (
    <div className="w-full">
      <DatePicker
        selected={value}
        // onChange={onChange}
        maxDate={maxDate || today}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        placeholderText={placeholder}
        customInput={<CustomInput />}
        dateFormat="dd MMM yyyy"
        className="hidden" // use custom input instead
        calendarClassName="dark:bg-[#1E1F55] dark:text-white"
      />
      <p className="mt-2 text-xs text-gray-600 dark:text-zinc-500">Choose your birth date (we'll never share it).</p>
    </div>
  )
}
