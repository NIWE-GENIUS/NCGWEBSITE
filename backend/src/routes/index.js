// backend/src/routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'NCG Platform API',
    version: '1.0.0',
    company: 'NEXT Creatures Group Ltd',
    tagline: 'Smart Solutions For Digital Future',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      profile: '/api/profile',
      team: '/api/team',
      programs: '/api/programs',
      applications: '/api/applications',
      projects: '/api/projects',
      partnerships: '/api/partnerships',
      collaborations: '/api/collaborations',
      events: '/api/events',
      contact: '/api/contact',
      blog: '/api/blog',
      donations: '/api/donations',
      payments: '/api/payments',
      notifications: '/api/notifications',
      content: '/api/content',
      navigation: '/api',
      settings: '/api/settings',
      search: '/api/search',
      uploads: '/api/uploads',
      admin: '/api/admin',
    },
  });
});

router.use('/health', require('./health.routes'));
router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/profile', require('./profile.routes'));
router.use('/team', require('./team.routes'));
router.use('/programs', require('./program.routes'));
router.use('/applications', require('./application.routes'));
router.use('/projects', require('./project.routes'));
router.use('/partnerships', require('./partnership.routes'));
router.use('/collaborations', require('./collaboration.routes'));
router.use('/events', require('./event.routes'));
router.use('/contact', require('./contact.routes'));
router.use('/blog', require('./blog.routes'));
router.use('/donations', require('./donation.routes'));
router.use('/payments', require('./payment.routes'));
router.use('/notifications', require('./notification.routes'));
router.use('/content', require('./content.routes'));
router.use('/', require('./navigation.routes'));  // has /navigation, /footer, /legal
router.use('/settings', require('./settings.routes'));
router.use('/search', require('./search.routes'));
router.use('/uploads', require('./upload.routes'));
router.use('/admin', require('./admin.routes'));
router.use('/broadcast', require('./broadcast.routes'));
router.use('/newsletter', require('./newsletter.routes'));
router.use('/broadcast', require('./broadcast.routes'));
router.use('/ai', require('./aiChat.routes'));

module.exports = router;