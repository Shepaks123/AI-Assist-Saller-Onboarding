import { useRef, useState } from 'react';
import { CheckCircle2, FileText, Loader2, Trash2, UploadCloud } from 'lucide-react';
import * as documentAPI from '../services/documentAPI';
import { getErrorMessage } from '../services/apiClient';
import { FILE_RULES } from '../utils/constants';
import { formatBytes } from '../utils/format';

// Drag & drop uploader. `value` is the saved document ({id,name,size}) or undefined.
export default function FileUpload({ label, description, docType, value, onChange, error, required, disabled }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(null); // null = idle, 0-100 = uploading
  const [localError, setLocalError] = useState('');

  async function handleFile(file) {
    if (!file) return;
    setLocalError('');
    if (!FILE_RULES.accept.includes(file.type)) return setLocalError(`Unsupported file. Use ${FILE_RULES.acceptLabel}.`);
    if (file.size > FILE_RULES.maxBytes) return setLocalError(`That file is ${formatBytes(file.size)}. The limit is 5 MB.`);
    setProgress(0);
    try {
      const saved = await documentAPI.uploadDocument(file, docType, setProgress);
      onChange(saved);
    } catch (err) {
      setLocalError(getErrorMessage(err, 'Upload failed. Please try again.'));
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  const msg = localError || error;
  const uploading = progress !== null;

  return (
    <div>
      <p className="text-sm font-semibold text-ink-700">{label}{required && <span className="text-red-500"> *</span>}</p>
      {description && <p className="mb-2 text-xs text-ink-500">{description}</p>}

      {value && !uploading ? (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
          <CheckCircle2 className="shrink-0 text-emerald-600" size={20} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{value.name}</p>
            <p className="text-xs text-ink-500">{formatBytes(value.size)} · uploaded</p>
          </div>
          {!disabled && (
            <button type="button" onClick={() => onChange(null)} className="rounded-lg p-2 text-ink-500 hover:bg-white hover:text-red-600" aria-label={`Remove ${value.name}`}>
              <Trash2 size={18} />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); if (!disabled) handleFile(e.dataTransfer.files[0]); }}
          className={`rounded-xl border-2 border-dashed p-5 text-center transition-colors ${dragging ? 'border-brand-500 bg-brand-50' : msg ? 'border-red-300' : 'border-line bg-white'} ${disabled ? 'opacity-60' : ''}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-brand-600" size={22} />
              <p className="text-sm font-semibold">Uploading… {progress}%</p>
              <div className="h-1.5 w-40 overflow-hidden rounded-full bg-brand-100"><div className="h-full bg-brand-600 transition-[width]" style={{ width: `${progress}%` }} /></div>
            </div>
          ) : (
            <>
              <UploadCloud className="mx-auto text-brand-600" size={26} />
              <p className="mt-2 text-sm text-ink-700">
                Drag a file here or{' '}
                <button type="button" disabled={disabled} onClick={() => inputRef.current?.click()} className="font-semibold text-brand-700 underline-offset-2 hover:underline">browse</button>
              </p>
              <p className="mt-1 flex items-center justify-center gap-1 text-xs text-ink-500"><FileText size={12} />{FILE_RULES.acceptLabel}</p>
            </>
          )}
          <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" tabIndex={-1} onChange={(e) => handleFile(e.target.files[0])} disabled={disabled} />
        </div>
      )}
      {msg && <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">{msg}</p>}
    </div>
  );
}
