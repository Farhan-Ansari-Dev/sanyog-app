const { ZodError } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      // Map Zod errors to a single readable string
      const errorMessage = err.errors.map(e => e.message).join(', ');
      return res.status(400).json({
        success: false,
        data: null,
        error: errorMessage
      });
    }
    next(err);
  }
};

module.exports = validate;
