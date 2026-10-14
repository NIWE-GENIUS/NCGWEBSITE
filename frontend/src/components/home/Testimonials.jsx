// src/components/home/Testimonials.jsx
import { useEffect, useState } from 'react';
import { User2, Quote, Star } from 'lucide-react';
import api from '../../lib/api';

const FALLBACK = [
  { id: '1', name: 'John M.', position: 'Founder, TechStart Rwanda', content: 'NCG helped us turn an idea into a practical solution. Their approach was not only technical but focused on understanding the actual problem.', rating: 5 },
  { id: '2', name: 'Sarah K.', position: 'Bootcamp Participant', content: 'The bootcamp program transformed my skills. I went from knowing basic HTML to building full applications. The hands-on approach made all the difference.', rating: 5 },
  { id: '3', name: 'David R.', position: 'Partner, AgriTech Solutions', content: 'Working with NCG on the smart irrigation project was eye-opening. They combine technical expertise with a genuine understanding of agricultural needs.', rating: 5 },
];

export default function Testimonials() {
  const [items, setItems] = useState(FALLBACK);

  useEffect(() => {
    api.get('/content/testimonials?featured=true')
      .then((res) => {
        const data = res.data || [];
        if (data.length > 0) setItems(data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section bg-[#F5F9FB]">
      <div className="container-ncg">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#031B2A] mb-4">
            What People Say <span className="text-[#8BCB2A]">About NCG</span>
          </h2>
          <p className="text-[#6D7E89]">
            Real experiences from students, partners, clients, and innovators who have worked with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <div key={t.id || i} className="relative bg-white border border-[#EDF2F5] rounded-2xl p-7 hover:shadow-xl hover:shadow-[#064B7A]/5 hover:-translate-y-1 transition-all duration-300">
              <Quote className="absolute top-5 right-6 w-10 h-10 text-[#8BCB2A]/20" />

              <div className="flex gap-1 mb-4">
                {[...Array(t.rating || 5)].map((_, si) => (
                  <Star key={si} className="w-4 h-4 fill-[#8BCB2A] text-[#8BCB2A]" />
                ))}
              </div>

              <p className="text-[#163247] leading-relaxed mb-6 text-[15px]">
                "{t.content}"
              </p>

              <div className="flex items-center gap-3 pt-5 border-t border-[#EDF2F5]">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#064B7A] to-[#8BCB2A] flex items-center justify-center">
                  <User2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm text-[#031B2A]">{t.name}</p>
                  <p className="text-xs text-[#6D7E89]">{t.position}{t.company ? `, ${t.company}` : ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}