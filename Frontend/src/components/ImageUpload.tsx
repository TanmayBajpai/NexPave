import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Camera, Check } from 'lucide-react';

interface ImageUploadProps {
  onChange: (file: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    onChange(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeImage = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div 
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 transition-colors duration-200 flex flex-col items-center justify-center
            ${isDragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-neutral-300 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600'}`}
        >
          <input {...getInputProps()} />
          <div className="mb-3">
            {isDragActive ? (
              <Upload size={48} className="text-primary-500" />
            ) : (
              <Camera size={48} className="text-neutral-400" />
            )}
          </div>
          <p className="text-center text-sm font-medium mb-1">
            {isDragActive ? 'Drop the image here' : 'Upload pothole photo'}
          </p>
          <p className="text-center text-xs text-neutral-500 mb-4">
            Drag & drop or click to select
          </p>
          <button
            type="button"
            className="btn btn-outline text-sm py-1.5"
            onClick={(e) => {
              e.stopPropagation();
              document.querySelector('input[type="file"]')?.click();
            }}
          >
            Browse Files
          </button>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src={preview} 
            alt="Upload preview" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <button
              type="button"
              onClick={removeImage}
              className="p-2 bg-error-500 text-white rounded-full hover:bg-error-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white py-2 px-4 flex items-center">
            <Check size={16} className="text-success-400 mr-2" />
            <span className="text-sm">Image uploaded successfully</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;