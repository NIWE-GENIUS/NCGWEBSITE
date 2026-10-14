// frontend/src/components/layout/CookieConsent.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X, Settings } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState({
    essential: true,
    analytics: true,
    functional: true,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('ncg_cookie_consent');
    if (!saved) {
      setTimeout(() => setVisible(true), 1500);
    }
  }, []);

  const accept = (all = true) => {
    const consent = all
      ? { essential: true, analytics: true, functional: true, marketing: true }
      : prefs;
    localStorage.setItem('ncg_cookie_consent', JSON.stringify(consent));
    localStorage.setItem('ncg_cookie_consent_date', new Date().toISOString());
    setVisible(false);
  };

  const reject = () => {
    const consent = { essential: true, analytics: false, functional: false, marketing: false };
    localStorage.setItem('ncg_cookie_consent', JSON.stringify(consent));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] bg-white border-t border-[#EDF2F5] shadow-2xl">
      <div className="container-ncg py-5">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-11 h-11 rounded-lg bg-[#8BCB2A]/15 flex items-center justify-center flex-shrink-0">
            <Cookie className="w-5 h-5 text-[#8BCB2A]" />
          </div>
          <div className="flex-1 min-w-[250px]">
            <p className="font-heading font-bold text-sm text-[#031B2A] mb-1">
              We use cookies
            </p>
            <p className="text-xs text-[#6D7E89] leading-relaxed">
              We use cookies to improve your experience, analyze traffic, and
              personalize content. By clicking "Accept All," you consent to our use of cookies.
              Read our{' '}
              <Link to="/legal/cookie-policy" className="text-[#064B7A] font-semibold hover:underline">
                Cookie Policy
              </Link>.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[#EDF2F5] text-xs font-semibold text-[#6D7E89] hover:bg-[#F5F9FB]"
            >
              <Settings className="w-3.5 h-3.5" /> Customize
            </button>
            <button
              onClick={reject}
              className="px-4 py-2 rounded-md border border-[#EDF2F5] text-xs font-semibold text-[#163247] hover:bg-[#F5F9FB]"
            >
              Reject Non-Essential
            </button>
            <button
              onClick={() => accept(true)}
              className="px-4 py-2 rounded-md bg-[#8BCB2A] text-[#031B2A] text-xs font-bold hover:bg-[#A8D94A]"
            >
              Accept All
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-[#EDF2F5] grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { key: 'essential', label: 'Essential', desc: 'Required', locked: true },
              { key: 'analytics', label: 'Analytics', desc: 'Improves site' },
              { key: 'functional', label: 'Functional', desc: 'Preferences' },
              { key: 'marketing', label: 'Marketing', desc: 'Relevant ads' },
            ].map((c) => (
              <label key={c.key} className="flex items-start gap-2 p-3 rounded-lg border border-[#EDF2F5] cursor-pointer hover:bg-[#F5F9FB]">
                <input
                  type="checkbox"
                  checked={prefs[c.key]}
                  disabled={c.locked}
                  onChange={(e) => setPrefs({ ...prefs, [c.key]: e.target.checked })}
                  className="w-4 h-4 mt-0.5 accent-[#8BCB2A]"
                />
                <div>
                  <p className="text-xs font-semibold text-[#031B2A]">{c.label}</p>
                  <p className="text-[10px] text-[#6D7E89]">{c.desc}</p>
                </div>
              </label>
            ))}
            <button
              onClick={() => accept(false)}
              className="md:col-span-4 py-2.5 rounded-md bg-[#064B7A] text-white text-xs font-bold hover:bg-[#062F4A]"
            >
              Save My Preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
}