const yup = require("yup");

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const registerSchema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const updateUserSchema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const createGroupSchema = yup.object().shape({
  name: yup.string().required(),
});

const updateGroupSchema = yup.object().shape({
  name: yup.string().required(),
});

const inviteToGroupSchema = yup.object().shape({
  groupId: yup.string().required(),
  emails: yup.array(yup.string().email()).min(1).required(),
});

module.exports = {
  loginSchema,
  registerSchema,
  updateUserSchema,
  createGroupSchema,
  updateGroupSchema,
  inviteToGroupSchema,
};
