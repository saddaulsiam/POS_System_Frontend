import React, { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = "",
  id,
  required,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;
  const widthStyle = fullWidth ? "w-full" : "";
  const hasError = Boolean(error);

  const isPasswordType = props.type === "password";
  const inputType = isPasswordType && showPassword ? "text" : props.type;

  const inputClassName = `
    px-3 py-2 border rounded-md transition-all bg-gray-50
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${hasError ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"}
    ${isPasswordType ? "pr-10" : ""}
    ${widthStyle}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <div className={widthStyle}>
      {label && (
        <label
          htmlFor={inputId}
          className={`mb-1 block text-sm font-medium ${hasError ? "text-red-700" : "text-gray-700"}`}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={inputClassName}
          required={required}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          {...props}
          type={inputType}
        />
        {isPasswordType && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        )}
      </div>
      {hasError && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      {helperText && !hasError && (
        <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = "",
  id,
  required,
  rows = 3,
  ...props
}) => {
  const textAreaId =
    id || `textarea-${label?.toLowerCase().replace(/\s+/g, "-")}`;
  const widthStyle = fullWidth ? "w-full" : "";
  const hasError = Boolean(error);

  const textAreaClassName = `
    px-3 py-2 border rounded-md transition-all bg-gray-50
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${hasError ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"}
    ${widthStyle}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <div className={widthStyle}>
      {label && (
        <label
          htmlFor={textAreaId}
          className={`mb-1 block text-sm font-medium ${hasError ? "text-red-700" : "text-gray-700"}`}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={textAreaId}
        className={textAreaClassName}
        rows={rows}
        required={required}
        aria-invalid={hasError}
        aria-describedby={
          hasError
            ? `${textAreaId}-error`
            : helperText
              ? `${textAreaId}-helper`
              : undefined
        }
        {...props}
      />
      {hasError && (
        <p id={`${textAreaId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      {helperText && !hasError && (
        <p id={`${textAreaId}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: Array<{ value: string | number; label: string }>;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = "",
  id,
  required,
  options,
  ...props
}) => {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, "-")}`;
  const widthStyle = fullWidth ? "w-full" : "";
  const hasError = Boolean(error);

  const selectClassName = `
    px-3 py-2 border rounded-md transition-all bg-gray-50
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${hasError ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"}
    ${widthStyle}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <div className={widthStyle}>
      {label && (
        <label
          htmlFor={selectId}
          className={`mb-1 block text-sm font-medium ${hasError ? "text-red-700" : "text-gray-700"}`}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={selectClassName}
        required={required}
        aria-invalid={hasError}
        aria-describedby={
          hasError
            ? `${selectId}-error`
            : helperText
              ? `${selectId}-helper`
              : undefined
        }
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hasError && (
        <p id={`${selectId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      {helperText && !hasError && (
        <p id={`${selectId}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};
