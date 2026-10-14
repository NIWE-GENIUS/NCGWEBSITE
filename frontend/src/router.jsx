// frontend/src/router.jsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
//
import AdminLegalPages from './pages/admin/AdminLegalPages';

// ===== Public =====
import Home from './pages/Home';
import About from './pages/About';
import Search from './pages/Search';
import NotFound from './pages/NotFound';
import FeatureDetail from './pages/FeatureDetail';
import Contact from './pages/Contact';
import LegalPage from './pages/LegalPage';
import Newsletter from './pages/Newsletter';
import Unsubscribe from './pages/Unsubscribe';

// ===== Services =====
import Services from './pages/services/Services';
import ServiceDetail from './pages/services/ServiceDetail';

// ===== Innovation =====
import Innovation from './pages/innovation/Innovation';

// ===== Programs =====
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import RegisterProgram from './pages/programs/RegisterProgram';
import Internship from './pages/programs/Internship';
import OnlineLearning from './pages/programs/OnlineLearning';
import Coaching from './pages/programs/Coaching';
import PrivateTutoring from './pages/programs/PrivateTutoring';

// ===== Team =====
import Team from './pages/Team';
import TeamMemberDetail from './pages/TeamMemberDetail';

// ===== Auth =====
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';

// ===== Collaboration =====
import CollaborationHub from './pages/collaboration/CollaborationHub';
import Strategic from './pages/collaboration/Strategic';
import Corporate from './pages/collaboration/Corporate';
import NGO from './pages/collaboration/NGO';
import Schools from './pages/collaboration/Schools';
import Investment from './pages/collaboration/Investment';
import Expert from './pages/collaboration/Expert';
import Education from './pages/collaboration/Education';
import InnovationCollab from './pages/collaboration/InnovationCollab';
import Technology from './pages/collaboration/Technology';
import Community from './pages/collaboration/Community';
import Government from './pages/collaboration/Government';
import PartnershipProgram from './pages/collaboration/PartnershipProgram';

// ===== Donations =====
import DonationHub from './pages/donation/DonationHub';
import DonationPage from './pages/donation/DonationPage';

// ===== Blog =====
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// ===== User Dashboard =====
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Profile from './pages/dashboard/Profile';
import MyApplications from './pages/dashboard/MyApplications';
import Messages from './pages/dashboard/Messages';
import Notifications from './pages/dashboard/Notifications';
import Settings from './pages/dashboard/Settings';
import Documents from './pages/dashboard/Documents';
import MyPrograms from './pages/dashboard/MyPrograms';
import MyCertificates from './pages/dashboard/MyCertificates';
import MyOpportunities from './pages/dashboard/MyOpportunities';

// ===== Admin Dashboard =====
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMessages from './pages/admin/AdminMessages';
import AdminTeam from './pages/admin/AdminTeam';
import AdminPrograms from './pages/admin/AdminPrograms';
import AdminProjects from './pages/admin/AdminProjects';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminFAQs from './pages/admin/AdminFAQs';
import AdminUsers from './pages/admin/AdminUsers';
import AdminApplications from './pages/admin/AdminApplications';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminActivity from './pages/admin/AdminActivity';
import AdminIntegrations from './pages/admin/AdminIntegrations';
import AdminBlog from './pages/admin/AdminBlog';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminBroadcast from './pages/admin/AdminBroadcast';
import AdminFinancials from './pages/admin/AdminFinancials';
import AdminDonations from './pages/admin/AdminDonations';
import AdminDonors from './pages/admin/AdminDonors';
import AdminInvoices from './pages/admin/AdminInvoices';
import AdminPayments from './pages/admin/AdminPayments';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminReports from './pages/admin/AdminReports';
import AdminNewsletter from './pages/admin/AdminNewsletter';

// ===== Portals =====
import PartnerPortal from './pages/portals/PartnerPortal';
import DonorPortal from './pages/portals/DonorPortal';

export const router = createBrowserRouter([
  // ==================================================
  // PUBLIC SITE
  // ==================================================
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'search', element: <Search /> },
      { path: 'contact', element: <Contact /> },

      // Feature detail pages
      { path: 'features/:slug', element: <FeatureDetail /> },

      // Legal pages
      { path: 'legal/:slug', element: <LegalPage /> },

      // Services
      { path: 'services', element: <Services /> },
      { path: 'services/:slug', element: <ServiceDetail /> },

      // Innovation
      { path: 'innovation', element: <Innovation /> },

      // Programs
      { path: 'programs', element: <Programs /> },
      { path: 'programs/internship', element: <Internship /> },
      { path: 'programs/online-learning', element: <OnlineLearning /> },
      { path: 'programs/coaching', element: <Coaching /> },
      { path: 'programs/private-tutoring', element: <PrivateTutoring /> },
      { path: 'programs/:slug', element: <ProgramDetail /> },
      { path: 'programs/:slug/register', element: <RegisterProgram /> },

      // Team
      { path: 'team', element: <Team /> },
      { path: 'team/:slug', element: <TeamMemberDetail /> },

      // Blog
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <BlogPost /> },

      // Collaboration
      { path: 'collaboration', element: <CollaborationHub /> },
      { path: 'collaboration/strategic', element: <Strategic /> },
      { path: 'collaboration/corporate', element: <Corporate /> },
      { path: 'collaboration/ngo', element: <NGO /> },
      { path: 'collaboration/schools', element: <Schools /> },
      { path: 'collaboration/investment', element: <Investment /> },
      { path: 'collaboration/expert', element: <Expert /> },
      { path: 'collaboration/education', element: <Education /> },
      { path: 'collaboration/innovation', element: <InnovationCollab /> },
      { path: 'collaboration/technology', element: <Technology /> },
      { path: 'collaboration/community', element: <Community /> },
      { path: 'collaboration/government', element: <Government /> },
      { path: 'collaboration/partnership', element: <PartnershipProgram /> },

      // Alias
      { path: 'partnership', element: <CollaborationHub /> },

      // Donations
      { path: 'donate', element: <DonationHub /> },
      { path: 'donate/:slug', element: <DonationPage /> },

      // Newsletter
      { path: 'newsletter', element: <Newsletter /> },
      { path: 'unsubscribe', element: <Unsubscribe /> },

      // Auth
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'verify-email', element: <VerifyEmail /> },

      // 404
      { path: '*', element: <NotFound /> },
    ],
  },

  // ==================================================
  // USER DASHBOARD
  // ==================================================
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: 'profile', element: <Profile /> },
      { path: 'applications', element: <MyApplications /> },
      { path: 'messages', element: <Messages /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'settings', element: <Settings /> },
      { path: 'documents', element: <Documents /> },
      { path: 'programs', element: <MyPrograms /> },
      { path: 'opportunities', element: <MyOpportunities /> },
      { path: 'certificates', element: <MyCertificates /> },
    ],
  },

  // ==================================================
  // ADMIN DASHBOARD
  // ==================================================
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      // Main
      { path: 'legal', element: <AdminLegalPages /> },
      { index: true, element: <AdminDashboard /> },
      { path: 'analytics', element: <AdminAnalytics /> },

      // Communication
      { path: 'messages', element: <AdminMessages /> },
      { path: 'announcements', element: <AdminAnnouncements /> },
      { path: 'broadcast', element: <AdminBroadcast /> },
      { path: 'newsletter', element: <AdminNewsletter /> },

      // Content
      { path: 'team', element: <AdminTeam /> },
      { path: 'programs', element: <AdminPrograms /> },
      { path: 'projects', element: <AdminProjects /> },
      { path: 'testimonials', element: <AdminTestimonials /> },
      { path: 'faqs', element: <AdminFAQs /> },
      { path: 'blog', element: <AdminBlog /> },

      // People
      { path: 'users', element: <AdminUsers /> },
      { path: 'applications', element: <AdminApplications /> },

      // Financials
      { path: 'financials', element: <AdminFinancials /> },
      { path: 'donations', element: <AdminDonations /> },
      { path: 'donors', element: <AdminDonors /> },
      { path: 'invoices', element: <AdminInvoices /> },
      { path: 'payments', element: <AdminPayments /> },
      { path: 'subscriptions', element: <AdminSubscriptions /> },
      { path: 'reports', element: <AdminReports /> },

      // System
      { path: 'integrations', element: <AdminIntegrations /> },
      { path: 'activity', element: <AdminActivity /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },

  // ==================================================
  // PORTALS
  // ==================================================
  { path: '/partner-portal', element: <PartnerPortal /> },
  { path: '/donor-portal', element: <DonorPortal /> },
]);