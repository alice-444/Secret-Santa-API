const yup = require("yup");

const signSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min().required(),
});

const updateSchema = yup.object({
  email: yup.string().email(),
  password: yup.string().min(6),
});

module.exports = { signSchema, updateSchema };
