const API_BASE_URL = "http://127.0.0.1:8000";

export const ENDPOINTS = {
  IMPORT_STUDENTS: `${API_BASE_URL}/api/students/import`,
  checkEmail: `${API_BASE_URL}/api/students/checkEmail`,
  sendVerificationCode: `${API_BASE_URL}/api/sendCode`,
  resendCode: `${API_BASE_URL}/api/resendCode`,
  verifyCode: `${API_BASE_URL}/api/verifyCode`,
  adminLogin: `${API_BASE_URL}/api/admin/auth/login`,
  availableCertificates: `${API_BASE_URL}/api/available-certificates`,
  issueCertificate: `${API_BASE_URL}/api/issue-certificate`,
  getCertificateById: (id) => `${API_BASE_URL}/api/certificate/${id}`,
};

export default API_BASE_URL;
