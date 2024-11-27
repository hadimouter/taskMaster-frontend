import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks', 
    async (token, { rejectWithValue }) => {
        try {
            const response = await axios.get('https://taskmaster-weld.vercel.app/tasks', {
                headers: { Authorization: `${token}` },
            });
            return response.data; // Valeur retournée
        } catch (error) {
            return rejectWithValue(error.response.data); // En cas d'erreur
        }
    }
);

const tasksSlice = createSlice({
    name: 'task',
    initialState: {
        tasks: [],
        filteredTasks: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        updateFilteredTasks: (state, action) => {
            state.filteredTasks = action.payload;
        },
        addTask: (state, action) => {
            state.tasks.push(action.payload);
            state.filteredTasks.push(action.payload);
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter(task => task._id !== action.payload);
            state.filteredTasks = state.filteredTasks.filter(task => task._id !== action.payload);
        },
        updateTask: (state, action) => {
            const index = state.tasks.findIndex(task => task._id === action.payload._id);
            if (index >= 0) {
                state.tasks[index] = action.payload;
                state.filteredTasks[index] = action.payload;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tasks = action.payload;
                state.filteredTasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { updateFilteredTasks, addTask, deleteTask, updateTask } = tasksSlice.actions;
export default tasksSlice.reducer;
