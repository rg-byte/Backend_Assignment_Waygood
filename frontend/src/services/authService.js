import api from "./axiosInstance";
import ENDPOINTS from "./endpoints";

const authService = {
    login: (credentials) => api.post(ENDPOINTS.AUTH.LOGIN,credentials),
    register:  (userData) =>  api.post(ENDPOINTS.AUTH.REGISTER,userData),
    logout:() => api.post(ENDPOINTS.AUTH.LOGOUT)
}

export default authService;