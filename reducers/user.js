import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        name: null,
        email: null,
        token: null,
        isConnect: false,
        notifications: {
            emailNotifications: true,
            taskReminders: true,
            dueDateAlerts: true
        }
    },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.value.name = action.payload.name;
            state.value.token = action.payload.token;
            state.value.email = action.payload.email;
            state.value.isConnect = true;
            state.value.notifications = action.payload.notifications || {
                emailNotifications: true,
                taskReminders: true,
                dueDateAlerts: true
            };
        },
        logout: (state) => {
            state.value.name = null;
            state.value.token = null;
            state.value.email = null;
            state.value.isConnect = false;
            state.value.notifications = {
                emailNotifications: true,
                taskReminders: true,
                dueDateAlerts: true
            };
        },
        UpdateProfil: (state, action) => {
            state.value.name = action.payload.name;
            state.value.email = action.payload.email;
        },
        updateNotifications: (state, action) => {
            state.value.notifications = action.payload;
        }
    },
});

export const { login, logout, UpdateProfil, updateNotifications } = userSlice.actions;
export default userSlice.reducer;