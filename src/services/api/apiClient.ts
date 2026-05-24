import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import { MetalErrors } from '../../types/metal-errors.types';
import MetalErrorMap from '../../constants/api/errors';

const apiClient = axios.create({
    baseURL: Config.BASE_URL,
    headers: {
        Accept: 'application/json',
    },
});

apiClient.interceptors.request.use(config => {
    config.params = {
        ...config.params,
        api_key: Config.API_KEY,
        currency: 'INR',
        unit: 'g',
    };
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<MetalErrors>) => {
        let errorMessage = 'Something went wrong';

        if (error.response && error.response.data) {
            const apiError = error.response.data;
            if (apiError.error_code) {
                errorMessage = MetalErrorMap[String(apiError.error_code)] || apiError.error_message || errorMessage;
            } else if (apiError.error_message) {
                errorMessage = apiError.error_message;
            }
        } else if (error.message) {
            errorMessage = error.message;
        }

        return Promise.reject(new Error(errorMessage));
    }
);

export default apiClient;
