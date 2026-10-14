// backend/src/routes/profile.routes.js
const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profileController');
const { requireAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { updateProfileValidator, userIdValidator } = require('../validators/userValidator');

router.use(requireAuth);

// My profile
router.get('/me', profileController.getMyProfile);
router.put('/me', updateProfileValidator, validate, profileController.updateMyProfile);
router.put('/me/avatar', profileController.updateAvatar);

// Someone else's profile
router.get('/user/:userId', userIdValidator, validate, profileController.getByUserId);

module.exports = router;