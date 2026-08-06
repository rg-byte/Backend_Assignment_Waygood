const ENDPOINTS={
    AUTH: {
    REGISTER: "auth/register",
    LOGIN: "auth/login",
    VERIFY_EMAIL: (token) => `auth/verify-email/${token}`,
    RESEND_VERIFICATION_EMAIL: "auth/resend-verification-email",
    REFRESH_TOKEN: "auth/refresh-token",
    LOGOUT: "auth/logout",
  }
};
export default ENDPOINTS;