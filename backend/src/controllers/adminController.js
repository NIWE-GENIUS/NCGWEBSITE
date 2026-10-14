// backend/src/controllers/adminController.js
const service = require('../services/adminService');
const { success } = require('../utils/response');

async function dashboard(req, res, next) {
  try {
    const [stats, recent] = await Promise.all([
      service.getDashboardStats(),
      service.getRecentActivity(20),
    ]);
    return success(res, { stats, recentActivity: recent }, 'Dashboard data');
  } catch (err) { next(err); }
}

module.exports = { dashboard };