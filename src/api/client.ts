import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { ApiError } from '../types';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Request interceptor para adicionar X-Client-Id
apiClient.interceptors.request.use(
  (config) => {
    const clientId = import.meta.env.VITE_CLIENT_ID || localStorage.getItem('clientId');
    if (clientId) {
      config.headers['X-Client-Id'] = clientId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.data?.error) {
      const apiError = error.response.data.error;
      
      toast.error(`${apiError.message} (ID: ${apiError.request_id})`);
      
      if (apiError.status === 400 && apiError.code === 'integration.missing_client_id') {
        toast.error('Configure a variável VITE_CLIENT_ID no arquivo .env');
      }
      
      return Promise.reject(apiError);
    }
    
    toast.error('Erro na comunicação com o servidor');
    return Promise.reject(error);
  }
);

export default apiClient;