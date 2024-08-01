import axios from "axios";

// HARDCODED FOR NOW
export const NOTES_API = `http://localhost:4000/api/notes`;

export interface User {
    _id: string;
    url: string;
    name: string;
    quizIds: string[];
}

const api = axios.create({
    withCredentials: true,
});

export const generateQuestions = async (id: any) => {
    const response = await api.get(`${NOTES_API}/${id}/generate`);
    return response.data;
}

export const findAllQuizzes = async (id: any) => {
    const response = await api.get(`${NOTES_API}/${id}/findAllQuizzes`);
    return response.data;
}