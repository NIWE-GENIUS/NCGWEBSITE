// frontend/src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { SOCIALS } from '../shared/SocialIcons';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#031B2A] text-white mt-auto">
      <div className="container-ncg py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img src="/logo.png" alt="NEXT Creatures Group Ltd" className="h-16 w-auto bg-white/95 rounded-lg p-2" />
            </div>
            <p className="font-heading font-bold text-white text-base mb-1">
              NEXT CREATURES GROUP LTD
            </p>
            <p className="text-xs text-[#8BCB2A] uppercase tracking-[0.2em] font-bold mb-4">
              Smart Solutions For Digital Future
            </p>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              Rwandan innovation and technology company building practical solutions for Africa's real-world challenges.
            </p>

            {/* Social icons */}
            <div className="flex flex-wrap gap-2">
              {SOCIALS.map((s) => {
                const Icon = s.Icon;
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name}
                    title={s.name}
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform hover:scale-110 hover:shadow-lg"
                    style={{ background: s.bg, color: s.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-white/60 hover:text-[#8BCB2A]">Home</Link></li>
              <li><Link to="/about" className="text-white/60 hover:text-[#8BCB2A]">About</Link></li>
              <li><Link to="/services" className="text-white/60 hover:text-[#8BCB2A]">Services</Link></li>
              <li><Link to="/programs" className="text-white/60 hover:text-[#8BCB2A]">Programs</Link></li>
              <li><Link to="/innovation" className="text-white/60 hover:text-[#8BCB2A]">Innovation</Link></li>
              <li><Link to="/collaboration" className="text-white/60 hover:text-[#8BCB2A]">Collaborate</Link></li>
              <li><Link to="/team" className="text-white/60 hover:text-[#8BCB2A]">Team</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Programs</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/programs/bootcamp" className="text-white/60 hover:text-[#8BCB2A]">Bootcamp</Link></li>
              <li><Link to="/programs/internship" className="text-white/60 hover:text-[#8BCB2A]">Internship</Link></li>
              <li><Link to="/programs/online-learning" className="text-white/60 hover:text-[#8BCB2A]">Online Learning</Link></li>
              <li><Link to="/programs/coaching" className="text-white/60 hover:text-[#8BCB2A]">Coaching</Link></li>
              <li><Link to="/programs/private-tutoring" className="text-white/60 hover:text-[#8BCB2A]">Private Tutoring</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-white/60">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#8BCB2A]" />
                Kigali, Rwanda
              </li>
              <li className="flex items-start gap-2 text-white/60">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#8BCB2A]" />
                <a href="mailto:info@nextcreaturesgroup.com" className="hover:text-[#8BCB2A]">info@nextcreaturesgroup.com</a>
              </li>
              <li className="flex items-start gap-2 text-white/60">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#8BCB2A]" />
                <a href="tel:+250788123456" className="hover:text-[#8BCB2A]">+250 788 123 456</a>
              </li>
            </ul>

            <div className="flex flex-wrap gap-2 mt-5">
              <Link to="/login" className="text-xs bg-white/10 text-white px-4 py-2 rounded-md hover:bg-[#8BCB2A] hover:text-[#031B2A] font-semibold">Login</Link>
              <Link to="/register" className="text-xs bg-[#8BCB2A] text-[#031B2A] px-4 py-2 rounded-md hover:bg-[#A8D94A] font-semibold">Register</Link>
              <Link to="/donate" className="text-xs bg-white/10 text-white px-4 py-2 rounded-md hover:bg-[#8BCB2A] hover:text-[#031B2A] font-semibold">Donate</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>© {year} NEXT Creatures Group Ltd. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/legal/privacy" className="hover:text-[#8BCB2A]">Privacy</Link>
            <Link to="/legal/terms" className="hover:text-[#8BCB2A]">Terms</Link>
            <Link to="/legal/code-of-conduct" className="hover:text-[#8BCB2A]">Code of Conduct</Link>
            <Link to="/legal/cookie-policy" className="hover:text-[#8BCB2A]">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}