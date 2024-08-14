import axios from "axios";
axios.defaults.withCredentials = true;

// HARDCODED FOR NOW
export const NOTES_API = `${process.env.REACT_APP_BACKEND_URL}/api/notes`;

export interface Note {
    _id: string;
    url: string;
    name: string;
    quizIds: string[];
}

export interface Quiz {
    _id: string;
    question: string;
    options: {
        a: string;
        b: string;
        c: string;
        d: string;
    };
    correctAnswer: string;
}

const api = axios.create({
    withCredentials: true,
});

// Find a note object by its id
export const findNoteById = async (id: any) => {
    const response = await api.get(`${NOTES_API}/${id}`)
    return response.data;
}

export const generateQuestions = async (id: any) => {
    const response = await api.get(`${NOTES_API}/${id}/generate`);
    return response.data;
}

export const findAllQuizzes = async (id: any) => {
    const response = await api.get(`${NOTES_API}/${id}/findAllQuizzes`);
    return response.data;
}