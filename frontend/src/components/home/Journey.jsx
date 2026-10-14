// src/components/home/Journey.jsx
import { ArrowDown } from 'lucide-react';

const ITEMS = [
  { year: '2024', text: 'NCG founded' },
  { year: '2024-2025', text: 'Innovation projects launched' },
  { year: '2025-2026', text: 'Technology programs expanded' },
  { year: 'Future', text: 'Growing an African innovation ecosystem' },
];

export default function Journey() {
  return (
    <section className="section bg-[#F5F9FB]">
      <div className="container-ncg">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
            Our Journey
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#031B2A]">
            Building the <span className="text-[#8BCB2A]">Future</span>
          </h2>
        </div>

        <div className="max-w-md mx-auto">
          {ITEMS.map((item, i) => (
            <div key={i}>
              <div className="bg-white border border-[#EDF2F5] rounded-xl p-5 text-center hover:border-[#8BCB2A]/40 hover:shadow-lg transition-all duration-300">
                <p className="font-heading font-bold text-lg text-[#064B7A] mb-1">
                  {item.year}
                </p>
                <p className="text-sm text-[#6D7E89]">{item.text}</p>
              </div>
              {i < ITEMS.length - 1 && (
                <div className="flex justify-center py-3">
                  <ArrowDown className="w-5 h-5 text-[#8BCB2A]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}