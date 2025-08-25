import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { getBaseURL } from '../config/environment';

const apiClient = axios.create({
  baseURL: getBaseURL(),
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
  (error: AxiosError<any>) => {

    if (error.response?.data?.error && typeof error.response.data.error === 'string') {
      const errorMessage = error.response.data.error;
      toast.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }

    if (error.response?.data?.error && typeof error.response.data.error === 'object') {
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