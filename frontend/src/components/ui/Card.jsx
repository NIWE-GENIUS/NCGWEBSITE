// src/components/ui/Card.jsx
export default function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={`card ${hover ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1' : ''} ${className}`}
    >
      {children}
    </div>
  );
}