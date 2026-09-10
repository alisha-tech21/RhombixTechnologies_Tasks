const sanitizeObject = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;

  for (const key in obj) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      sanitizeObject(obj[key]);
    }
  }
  return obj;
};

const mongoSanitizeBody = (req, res, next) => {
  if (req.body) {
    sanitizeObject(req.body);
  }
  next();
};

module.exports = mongoSanitizeBody;
