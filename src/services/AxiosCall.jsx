import axios from "axios"
import { baseUrl } from "./BaseUrl"

export const AxiosCall =async (method, endpoint, dataList, headerData, isFormdata) => {
    try {
        const url = baseUrl + endpoint
        let body = {
            method,
            url,
            data: dataList,
        }
        if (headerData) {
            // const token = localStorage.getItem('authToken')
            const headerauth = {
                // 'Authorization': `Bearer ${token}`,
                'Content-Type': isFormdata ? "multipart/form-data" : "application/json",
            }
            body.headers = headerauth
        }
        const response = await axios(body)
        return response
    } catch (error) {
        console.log("AxiosCall error:", error);
        throw error  // Throw the error instead of returning it
    }
}