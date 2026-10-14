// src/components/ui/Loader.jsx
import { Loader2 } from 'lucide-react';

export default function Loader({ text = 'Loading...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Loader2 className="w-8 h-8 text-ncg-blue animate-spin" />
      <p className="text-ncg-muted text-sm">{text}</p>
    </div>
  );

  if (fullScreen) {
    return <div className="min-h-screen flex items-center justify-center">{content}</div>;
  }
  return content;
}