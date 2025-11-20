import axios from "axios";
import {toast} from "sonner";
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response=>response,
  (error)=>{
    if(error.response && error.response.status === 401){
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = '/login';
    }    
    return Promise.reject(error);
  }
)

export default axiosInstance;


