// frontend/src/components/layout/PublicLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AnnouncementBanner from '../shared/AnnouncementBanner';
import ChatWidget from '../shared/ChatWidget';
import CookieConsent from './CookieConsent';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FB]">
      {/* Top banner for active announcements */}
      <AnnouncementBanner />

      {/* Global header with logo, nav, search, notifications */}
      <Header />

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global footer */}
      <Footer />

      {/* Floating chat assistant (bottom-right) */}
      <ChatWidget />

      {/* Cookie consent banner (first visit only) */}
      <CookieConsent />
    </div>
  );
}