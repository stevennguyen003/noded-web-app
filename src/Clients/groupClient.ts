import axios from "axios";

// HARDCODED FOR NOW
export const GROUPS_API = `http://localhost:4000/api/groups`;

export interface Group {
    _id: string;
    name: string;
    userRoles: {
        [username: string]: 'admin' | 'editor' | 'user';
    };
    profilePicture: string;
    inviteLink: string;
}

const api = axios.create({
    withCredentials: true,
});

// Create a group
export const createGroup = async (group: any) => {
    const response = await api.post(`${GROUPS_API}`, group);
    return response.data;
};

// Find all groups
export const findAllGroups = async () => {
    const response = await api.get(`${GROUPS_API}`);
    return response.data;
};

// Find a group by their id
export const findGroupById = async (id: any) => {
    const response = await api.get(`${GROUPS_API}/id/${id}`);
    return response.data;
};

// Find a group by their invite link
export const findGroupByInviteCode = async (inviteCode: any) => {
    const response = await api.get(`${GROUPS_API}/invite/${inviteCode}`);
    return response.data;
}

// Update a group's info
export const updateGroup = async (group: any) => {
    const response = await api.put(`${GROUPS_API}/${group._id}`, group);
    return response.data;
};

// Delete a group
export const deleteGroup = async (group: any) => {
    const response = await api.delete(`${GROUPS_API}/${group._id}`);
    return response.data;
};

// Updates a group's profile picture
export const uploadProfilePicture = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    const response = await api.post(`${GROUPS_API}/${id}/uploadProfilePicture`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Uploads a note to the group
export const uploadNote = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('note', file);
    const response = await api.post(`${GROUPS_API}/${id}/uploadNote`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Find all notes from the group's array of IDs
export const findAllNotes = async (id: any) => {
    const response = await api.get(`${GROUPS_API}/${id}/findAllNotes`);
    return response.data;
}
