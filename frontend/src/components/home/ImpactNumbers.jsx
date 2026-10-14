// src/components/home/ImpactNumbers.jsx
import useCountUp from './useCountUp';

const NUMBERS = [
  { target: 4, suffix: '+', label: 'Innovation Projects' },
  { target: 5, suffix: '+', label: 'Technology Areas' },
  { target: 50, suffix: '+', label: 'Learners Reached' },
  { target: 10, suffix: '+', label: 'Startups / Ideas Supported' },
];

function NumberItem({ target, suffix, label }) {
  const { value, ref } = useCountUp(target);
  return (
    <div ref={ref} className="text-center">
      <p className="text-5xl md:text-6xl font-heading font-bold text-[#031B2A]">
        {value}
        <span className="text-[#8BCB2A]">{suffix}</span>
      </p>
      <p className="text-sm uppercase tracking-[0.15em] text-[#6D7E89] mt-2 font-medium">
        {label}
      </p>
    </div>
  );
}

export default function ImpactNumbers() {
  return (
    <section className="section bg-[#F5F9FB]">
      <div className="container-ncg">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
            Our Impact So Far
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#031B2A]">
            Making a <span className="text-[#8BCB2A]">Difference</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {NUMBERS.map((n, i) => (
            <NumberItem key={i} {...n} />
          ))}
        </div>
      </div>
    </section>
  );
}