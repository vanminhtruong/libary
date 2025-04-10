import axios from 'axios'
import useLoading from '../hooks/useLoading'
import { API_CONFIG } from '../config/api.config'
import { apiMiddleware } from '../middleware/api.middleware.jsx'
import { Toast } from 'primereact/toast'

const createBaseService = (resourcePath) => {
    const { showLoading, hideLoading } = useLoading.getState()
    // Create axios instance
    const axiosInstance = axios.create({
        baseURL: API_CONFIG.BASE_URL,
        timeout: API_CONFIG.TIMEOUT
    })

    // Add custom error handling for authentication errors
    const customResponseInterceptor = (response) => {
        // Vẫn xử lý response bằng middleware mặc định
        return apiMiddleware.responseMiddleware(response);
    };

    const customErrorInterceptor = (error) => {
        // Xử lý đặc biệt cho lỗi 401 từ endpoint login
        if (error.response?.status === 401 && error.config?.url?.includes('/login')) {
            // Chuyển lỗi 401 từ login endpoint thành lỗi đăng nhập cụ thể
            return Promise.reject(new Error("Email hoặc mật khẩu không đúng"));
        }
        // Các lỗi khác vẫn sử dụng middleware mặc định
        return apiMiddleware.errorMiddleware(error);
    };

    // Add request interceptor
    axiosInstance.interceptors.request.use(
        apiMiddleware.requestMiddleware,
        apiMiddleware.errorMiddleware
    )

    // Add response interceptor
    axiosInstance.interceptors.response.use(
        customResponseInterceptor,
        customErrorInterceptor
    )

    // Get auth token
    const getAuthToken = () => {
        return localStorage.getItem('token')
    }

    // Get headers with auth token
    const getHeaders = (customHeaders = {}, isFormData = false) => {
        const token = getAuthToken()
        const headers = {
            'Accept': 'application/json',
            ...(!isFormData && { 'Content-Type': 'application/json' }),
            ...customHeaders
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        return headers
    }

    // Handle API Response
    const handleResponse = (response) => {
        return response.data
    }

    // Handle API Error
    const handleError = (error) => {
        // Check if this is a login error with status: false
        if (error.config?.url?.includes('/login') && error.response?.data?.status === false) {
            const errorMessage = error.response.data.message || "Email hoặc mật khẩu không đúng";
            return Promise.reject(new Error(errorMessage));
        }
        
        // Chỉ xử lý lỗi 401 khi không phải đang trong quá trình login
        if (error.response?.status === 401 && !error.config?.url?.includes('/login')) {
            if (error.response?.data?.message === 'Email hoặc mật khẩu không đúng') {
                return Promise.reject(new Error('Tài khoản hoặc mật khẩu không đúng'));
            }
        }
        return Promise.reject(error);
    }

    // GET request
    const get = async (endpoint = '', params = {}, customHeaders = {}) => {
        try {
            showLoading()
            const response = await axiosInstance.get(`${resourcePath}${endpoint}`, {
                params,
                headers: getHeaders(customHeaders)
            })
            return handleResponse(response)
        } catch (error) {
            return Promise.reject(error)
        } finally {
            hideLoading()
        }
    }

    // POST request
    const post = async (endpoint = '', data = {}, customHeaders = {}) => {
        try {
            showLoading()
            const isFormData = data instanceof FormData
            const headers = getHeaders(customHeaders, isFormData)
            const processedData = isFormData ? data : data

            const response = await axiosInstance.post(`${resourcePath}${endpoint}`, processedData, {
                headers
            })
            return handleResponse(response)
        } catch (error) {
            // If this is a login endpoint, ensure error is properly returned to caller
            if (endpoint.includes('/login')) {
                const errorMessage = error.response?.data?.message || "Email hoặc mật khẩu không đúng";
                hideLoading();
                return Promise.reject(new Error(errorMessage));
            }
            return handleError(error)
        } finally {
            hideLoading()
        }
    }

    // PUT request
    const put = async (endpoint = '', data = {}, customHeaders = {}) => {
        try {
            showLoading()
            const isFormData = data instanceof FormData
            const headers = getHeaders(customHeaders, isFormData)
            const processedData = isFormData ? data : data

            const response = await axiosInstance.put(`${resourcePath}${endpoint}`, processedData, {
                headers
            })
            return handleResponse(response)
        } catch (error) {
            handleError(error)
        } finally {
            hideLoading()
        }
    }

    // DELETE request
    const deleteRequest = async (endpoint = '', customHeaders = {}) => {
        try {
            showLoading()
            const response = await axiosInstance.delete(`${resourcePath}${endpoint}`, {
                headers: getHeaders(customHeaders)
            })
            return handleResponse(response)
        } catch (error) {
            handleError(error)
        } finally {
            hideLoading()
        }
    }

    // PATCH request
    const patch = async (endpoint = '', data = {}, customHeaders = {}) => {
        try {
            showLoading()
            const response = await axiosInstance.patch(`${resourcePath}${endpoint}`, data, {
                headers: getHeaders(customHeaders)
            })
            return handleResponse(response)
        } catch (error) {
            handleError(error)
        } finally {
            hideLoading()
        }
    }

    return {
        get,
        post,
        put,
        delete: deleteRequest,
        patch,
        getAuthToken,
        getHeaders
    }
}

export default createBaseService 