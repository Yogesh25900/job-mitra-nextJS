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