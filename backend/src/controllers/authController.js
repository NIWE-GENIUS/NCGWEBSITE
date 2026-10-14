// backend/src/controllers/authController.js
const authService = require('../services/authService');
const { success, created } = require('../utils/response');

async function register(req, res, next) {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;
    const result = await authService.register({ firstName, lastName, email, phone, password, role });
    return created(res, result, 'Account created successfully. Please check your email to verify your account.');
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({
      email, password,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return success(res, result, 'Logged in successfully');
  } catch (err) { next(err); }
}

async function verifyEmail(req, res, next) {
  try {
    const { token } = req.body;
    const result = await authService.verifyEmail(token);
    return success(res, result, result.message);
  } catch (err) { next(err); }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    return success(res, result, result.message);
  } catch (err) { next(err); }
}

async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    const result = await authService.resetPassword({ token, password });
    return success(res, result, result.message);
  } catch (err) { next(err); }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword({
      userId: req.user.id,
      currentPassword,
      newPassword,
    });
    return success(res, result, result.message);
  } catch (err) { next(err); }
}

async function logout(req, res, next) {
  try {
    const token = req.token;
    const result = await authService.logout(token);
    return success(res, result, result.message);
  } catch (err) { next(err); }
}

async function me(req, res, next) {
  try {
    const user = await authService.getMe(req.user.id);
    return success(res, user, 'User retrieved');
  } catch (err) { next(err); }
}

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
  me,
};