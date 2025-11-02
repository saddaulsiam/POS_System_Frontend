import React from "react";

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
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;
  const widthStyle = fullWidth ? "w-full" : "";
  const hasError = Boolean(error);

  const inputClassName = `
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
          htmlFor={inputId}
          className={`mb-1 block text-sm font-medium ${hasError ? "text-red-700" : "text-gray-700"}`}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
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
      />
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
