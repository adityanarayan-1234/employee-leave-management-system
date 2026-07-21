// Small, dependency-free validation helpers used across controllers.
// Keeping these in one place avoids re-writing the same checks in
// every controller function.

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const requireFields = (body, fields) => {
  const missing = fields.filter((field) => !body[field] && body[field] !== 0);
  return missing;
};

const isValidDateRange = (fromDate, toDate) => {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  return !isNaN(from) && !isNaN(to) && to >= from;
};

// Number of calendar days between two dates, inclusive of both ends
const daysBetween = (fromDate, toDate) => {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  const diffMs = to.setHours(0, 0, 0, 0) - from.setHours(0, 0, 0, 0);
  return Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
};

module.exports = { isValidEmail, requireFields, isValidDateRange, daysBetween };
