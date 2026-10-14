// frontend/src/components/shared/FileUpload.jsx
import { useState, useRef } from 'react';
import { Upload, X, Loader2, FileText } from 'lucide-react';
import { uploadSingle } from '../../lib/upload';

export default function FileUpload({ value, onChange, accept = '*/*', label = 'Upload File', hint = 'Max 50 MB' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setError('File is larger than 50 MB');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const result = await uploadSingle(file);
      onChange(result.url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const isImage = (url) => /\.(png|jpe?g|webp|gif|svg|bmp|ico)$/i.test(url || '');

  return (
    <div>
      {label && (
        <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-[#EDF2F5] bg-[#F5F9FB]">
          {isImage(value) ? (
            <img src={value} alt="Uploaded" className="w-full h-40 object-contain" />
          ) : (
            <div className="p-4 flex items-center gap-3">
              <FileText className="w-6 h-6 text-[#064B7A]" />
              <span className="text-sm text-[#163247] break-all">{value.split('/').pop()}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-red-500 hover:text-white flex items-center justify-center shadow-md transition-colors"
            title="Remove"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-[#EDF2F5] hover:border-[#8BCB2A] rounded-lg p-6 text-center cursor-pointer transition-colors"
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-[#8BCB2A] animate-spin mx-auto mb-2" />
          ) : (
            <Upload className="w-8 h-8 text-[#A8BBC5] mx-auto mb-2" />
          )}
          <p className="text-sm text-[#163247] font-medium mb-1">
            {uploading ? 'Uploading...' : 'Click to upload or drag & drop'}
          </p>
          <p className="text-xs text-[#6D7E89]">{hint}</p>
        </div>
      )}

      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />

      {error && <p className="text-xs text-[#E74C3C] mt-2">⚠ {error}</p>}
    </div>
  );
}