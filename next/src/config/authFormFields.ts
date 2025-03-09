const authFormFields = {
  signIn: {
    username: {
      labelHidden: true,
    },
    password: {
      labelHidden: true,
    },
  },
  signUp: {
    email: {
      labelHidden: true,
    },
    password: {
      labelHidden: true,
    },
    confirm_password: {
      required: false,
    },
  },
  forgotPassword: {
    username: {
      labelHidden: true,
    },
  },
  confirmResetPassword: {
    confirmation_code: {
      labelHidden: true,
    },
    password: {
      labelHidden: true,
    },
    confirm_password: {
      required: false,
    },
  },
  confirmSignUp: {
    confirmation_code: {
      labelHidden: true,
    },
  },
}

export default authFormFields
