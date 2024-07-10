import axios from "axios";

// HARDCODED FOR NOW
export const USERS_API = `http://localhost:4000/api/users`;

export interface User {
    _id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
}

const api = axios.create({
    withCredentials: true,
});

// Sign in to session
export const signin = async (credentials: User) => {
    const response = await api.post(`${USERS_API}/signin`, credentials);
    return response.data;
};

// Signup a new user
export const signup = async (user: any) => {
    const response = await api.post(`${USERS_API}/signup`, user);
    return response.data;
};

// Sign out of session
export const signout = async () => {
    const response = await api.post(`${USERS_API}/signout`);
    return response.data;
};

// Returns the profile of the current user
export const profile = async () => {
    const response = await api.post(`${USERS_API}/profile`);
    return response.data;
};

// Find the profile of a user by their id
export const findProfileById = async (id: any) => {
    const response = await api.get(`${USERS_API}/profile/${id}`)
    return response.data;
}

// Update a user's info
export const updateUser = async (user: any) => {
    const response = await api.put(`${USERS_API}/${user._id}`, user);
    return response.data;
};

// Find all users
export const findAllUsers = async () => {
    const response = await api.get(`${USERS_API}`);
    return response.data;
};

// Create a user
export const createUser = async (user: any) => {
    const response = await api.post(`${USERS_API}`, user);
    return response.data;
};

// Delete a user
export const deleteUser = async (user: any) => {
    const response = await api.delete(`${USERS_API}/${user._id}`);
    return response.data;
};

// Find a user by their id
export const findUserById = async (id: any) => {
    const response = await api.get(`${USERS_API}/${id}`);
    return response.data;
};

// Updates a user's profile picture
export const uploadProfilePicture = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await api.post(`${USERS_API}/${id}/uploadProfilePicture`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};