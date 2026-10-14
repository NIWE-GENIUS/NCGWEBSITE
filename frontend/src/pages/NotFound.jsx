// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-9xl font-heading font-bold text-[#064B7A]/20">404</p>
        <h1 className="text-3xl font-heading font-bold text-[#031B2A] mb-2 -mt-8">Page not found</h1>
        <p className="text-[#6D7E89] mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-7 py-3 rounded-lg hover:bg-[#A8D94A]">
          <Home className="w-4 h-4" /> Back Home
        </Link>
      </div>
    </div>
  );
}