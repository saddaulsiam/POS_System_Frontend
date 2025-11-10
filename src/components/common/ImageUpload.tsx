import React, { useRef } from "react";

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (file: File | null, preview: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label = "Upload Photo",
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onChange(null, "");
    }
  };

  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium">{label}</label>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
      />
      {/* Preview is handled by parent, not here */}
    </div>
  );
};

export default ImageUpload;
