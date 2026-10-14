// src/pages/About.jsx
import { Target, Eye, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="section bg-[#F5F9FB]">
      <div className="container-ncg">
        <div className="text-center mb-16">
          <h1 className="section-title">About NCG</h1>
          <p className="section-subtitle">
            NEXT Creatures Group Ltd is a Rwandan innovation and technology company building practical solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Target, title: 'Our Mission', text: 'To identify real-world challenges and transform innovative ideas into practical, accessible, and sustainable solutions.' },
            { icon: Eye, title: 'Our Vision', text: 'To become a leading innovation and technology company in Africa, recognized for practical technologies and empowered youth.' },
            { icon: Heart, title: 'Our Values', text: 'Innovation, integrity, collaboration, excellence, impact, and empowerment.' },
          ].map((item, i) => (
            <div key={i} className="card p-8">
              <div className="w-14 h-14 rounded-lg bg-[#8BCB2A]/10 flex items-center justify-center mb-4">
                <item.icon className="w-7 h-7 text-[#8BCB2A]" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3 text-[#031B2A]">{item.title}</h3>
              <p className="text-[#6D7E89]">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="card p-8 md:p-12 bg-gradient-to-br from-[#064B7A] to-[#031B2A] text-white">
          <h2 className="text-3xl font-heading font-bold mb-4 text-white">Our Story</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            Founded in 2024 in Kigali, Rwanda, NEXT Creatures Group Ltd was born out of a simple conviction:
            Africa's biggest challenges are also its biggest opportunities. We started with a focus on
            software and education, then expanded into AI, IoT, automation, agriculture, and beyond.
          </p>
          <p className="text-white/70 leading-relaxed">
            Today, NCG operates at the intersection of technology, engineering, and education —
            building solutions that create lasting social and economic impact.
          </p>
        </div>
      </div>
    </div>
  );
}