import { LoginTalentInput, SignupTalentInput } from "@/app/(auth)/schema"
import axios from "./axios"
import { API } from "./endpoints"


export const registerTalent = async (registerData: SignupTalentInput) => {
    try {
        const response = await axios.post(API.AUTH.TALENT.REGISTER, registerData)
        return response.data
    } catch (error: any) {
        console.error('registerTalent error:', error);
        throw error;
    }
}

export const loginTalent = async (loginData: LoginTalentInput) => {
    try {
        const response = await axios.post(API.AUTH.TALENT.LOGIN, loginData)
        return response.data
    } catch (error: any) {
        console.error('loginTalent error:', error);
        throw error;
    }
}

export const registerRecruiter = async (registerData: any) => {
    try {
        const response = await axios.post(API.AUTH.RECRUITER.REGISTER, registerData)
        return response.data
    } catch (error: any) {
        console.error('registerRecruiter error:', error);
        throw error;
    }
}

export const loginRecruiter = async (loginData: any) => {
    try {
        const response = await axios.post(API.AUTH.RECRUITER.LOGIN, loginData)
        return response.data
    } catch (error: any) {
        console.error('loginRecruiter error:', error);
        throw error;
    }
}

export const loginAdmin = async (loginData: any) => {
    try {
        const response = await axios.post(API.AUTH.ADMIN.LOGIN, loginData)
        return response.data
    } catch (error: any) {
        console.error('loginAdmin error:', error);
        throw error;
    }
}


//talent 

export const getTalentProfileById = async (token: string,id: string) => {
    try{
        const response = await axios.get(`${API.AUTH.TALENT.GETPROFILEBYID}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('getTalentProfileById error:', error);
        throw error;
    }
}

export const getTalentProfileMe = async (token: string) => {
    try{
        console.log('🎯 [API] getTalentProfileMe - Making GET request');
        console.log('📍 [API] Endpoint:', API.AUTH.TALENT.GETPROFILEMYSELF);
        const response = await axios.get(API.AUTH.TALENT.GETPROFILEMYSELF, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('✅ [API] getTalentProfileMe - Response received');
        return response.data;
    } catch (error: any) {
        console.error('❌ [API] getTalentProfileMe error:', error?.response?.status, error?.response?.data || error?.message);
        throw error;
    }
}

export const talentProfileEdit = async (formData: FormData, token: string, id: string) => {
    try{
        console.log('🚀 [FRONTEND] talentProfileEdit called');
        console.log('📤 [FRONTEND] URL:', `${API.AUTH.TALENT.EDITPROFILE}/${id}`);
        console.log('📤 [FRONTEND] FormData entries:');
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`  - ${key}: File(${value.name}, ${value.size} bytes)`);
            } else {
                const preview = typeof value === 'string' ? value.substring(0, 50) : value;
                console.log(`  - ${key}:`, preview);
            }
        }
        const response = await axios.put(`${API.AUTH.TALENT.EDITPROFILE}/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('✅ [FRONTEND] Response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ [FRONTEND] Error:', error.response?.data || error.message);
        throw error;
    }
}

export const uploadTalentProfilePhoto = async (formData: FormData, token: string) => {
    try{
        if (!token) {
            console.error('❌ No auth token provided');
            throw new Error('Authentication token not found');
        }
        console.log('🔑 Token present, uploading...');
        console.log('📤 Uploading to:', API.AUTH.TALENT.UPLOADPHOTO);
        
        // Debug: Log FormData
        console.log('📋 FormData entries before sending:');
        for (let [key, value] of formData.entries()) {
          console.log(`  - ${key}:`, value instanceof File ? `File: ${(value as File).name} (${(value as File).size} bytes)` : value);
        }
                const response = await axios.post(
            API.AUTH.TALENT.UPLOADPHOTO,
            formData,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
                withCredentials: true, // 
            }
            );

        console.log('✅ Upload response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ uploadTalentProfilePhoto error:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
        });
        throw error;
    }
}
