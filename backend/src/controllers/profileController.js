// backend/src/controllers/profileController.js
const profileService = require('../services/profileService');
const { success } = require('../utils/response');

async function getMyProfile(req, res, next) {
  try {
    const profile = await profileService.getByUserId(req.user.id);
    return success(res, profile, 'Profile retrieved');
  } catch (err) { next(err); }
}

async function getByUserId(req, res, next) {
  try {
    const profile = await profileService.getByUserId(req.params.userId);
    return success(res, profile, 'Profile retrieved');
  } catch (err) { next(err); }
}

async function updateMyProfile(req, res, next) {
  try {
    const profile = await profileService.update(req.user.id, req.body);
    return success(res, profile, 'Profile updated');
  } catch (err) { next(err); }
}

async function updateAvatar(req, res, next) {
  try {
    const { avatarUrl } = req.body;
    const result = await profileService.setAvatar(req.user.id, avatarUrl);
    return success(res, result, 'Avatar updated');
  } catch (err) { next(err); }
}

module.exports = { getMyProfile, getByUserId, updateMyProfile, updateAvatar };