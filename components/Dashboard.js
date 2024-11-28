import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { CreateTaskModal } from './CreateTaskModal';
import axios from 'axios';
import { NotificationSettings } from './CreateTaskModal';
import { ProfileModal } from './CreateTaskModal';
import { EditTaskModal } from './TaskMenu';
import Header from './Header.js';
import TaskFilters from './TaskFilters';
import StatsCards from './StatsCards';
import TaskList from './TaskList';
import ProgressChart from './ProgressChart';
import { useSelector, useDispatch } from 'react-redux';
import { UpdateProfil } from '../reducers/user.js';


const Dashboard = () => {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const dispatch = useDispatch();
    const [searchResults, setSearchResults] = useState(null);
    const token = useSelector((state) => state.user.value.token);

    // Gestionnaire de recherche
    const handleSearch = (results) => {
        if (results === null) {
            // Si null, afficher toutes les tâches avec les filtres actuels
            setFilteredTasks(tasks);
        } else {
            // Sinon, afficher les résultats de la recherche
            setFilteredTasks(results);
        }
    };

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('https://taskmaster-weld.vercel.app/tasks', {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setTasks(response.data);
                // Ne mettre à jour les tâches filtrées que s'il n'y a pas de recherche active
                if (!searchResults) {
                    setFilteredTasks(response.data);
                }
            } catch (error) {
                console.error('Erreur de récupération des tâches', error);
            }
        };

        if (token) {
            fetchTasks();
        }
    }, [token, updateTrigger]);



    const handleFilterChange = (filters) => {
        const filtered = tasks.filter(task => {
            if (filters.status !== 'all' && task.status !== filters.status) return false;
            if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
            if (filters.dateRange !== 'all') {
                const taskDate = new Date(task.dueDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                switch (filters.dateRange) {
                    case 'today':
                        return taskDate.toDateString() === today.toDateString();
                    case 'week': {
                        const weekAhead = new Date(today);
                        weekAhead.setDate(weekAhead.getDate() + 7);
                        return taskDate >= today && taskDate <= weekAhead;
                    }
                    case 'month': {
                        const monthAhead = new Date(today);
                        monthAhead.setMonth(monthAhead.getMonth() + 1);
                        return taskDate >= today && taskDate <= monthAhead;
                    }
                    case 'custom': {
                        const selectedDate = new Date(filters.selectedDate);
                        return taskDate.toDateString() === selectedDate.toDateString();
                    }
                }
            }

            return true;
        });

        console.log('Tâches filtrées:', filtered); // Pour déboguer
        setFilteredTasks(filtered);
    };


    const handleTaskSubmit = async (taskData) => {
        try {
            // Envoie de la nouvelle tâche au backend
            const response = await fetch('https://taskmaster-weld.vercel.app/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout de la tâche');
            }

            const newTask = await response.json();
            console.log('Tâche ajoutée:', newTask);
            setUpdateTrigger(prev => prev + 1);

        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleProfileUpdate = async (profileData) => {
        try {
            // Premièrement, mise à jour des informations de profil
            const response = await fetch('https://taskmaster-weld.vercel.app/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
                body: JSON.stringify(profileData),
            });

            const data = await response.json();
            if (data.error) {
                console.error(data.error);
                return;
            }

            // Si le mot de passe est fourni, mettre à jour le mot de passe
            if (profileData.currentPassword && profileData.newPassword) {
                const passwordResponse = await fetch('https://taskmaster-weld.vercel.app/users/password', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${token}`,
                    },
                    body: JSON.stringify({
                        oldPassword: profileData.currentPassword,
                        newPassword: profileData.newPassword,
                    }),
                });

                const passwordData = await passwordResponse.json();
                if (passwordData.error) {
                    console.error(passwordData.error);
                    return;
                }

                console.log('Mot de passe mis à jour avec succès');
            }

            // Mettre à jour l'état global avec les nouvelles informations
            dispatch(UpdateProfil({ email: data.user.email, name: data.user.name }));
            console.log('Profil mis à jour avec succès', data.user);
        } catch (err) {
            console.error('Erreur lors de la mise à jour du profil', err);
        }
    };



    // État pour le modal d'édition
    const [editingTask, setEditingTask] = useState(null);

    // Gestionnaires d'événements pour les tâches
    const handleEditTask = (task) => {
        setEditingTask(task);
    };

    const handleUpdateTask = async (updatedTask) => {
        try {
            // Envoi de la requête PUT pour mettre à jour la tâche sur le backend
            await axios.put(`https://taskmaster-weld.vercel.app/tasks/${updatedTask._id}`, updatedTask, {
                headers: { Authorization: `${token}` }
            });
            setEditingTask(null); // Ferme le modal d'édition
            setUpdateTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Erreur de mise à jour de la tâche', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            // Envoi de la requête DELETE pour supprimer la tâche du backend
            await axios.delete(`https://taskmaster-weld.vercel.app/tasks/${taskId}`, {
                headers: { Authorization: `${token}` }
            });
            setUpdateTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Erreur de suppression de la tâche', error);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await axios.put(`https://taskmaster-weld.vercel.app/tasks/${taskId}`, {
                status: newStatus
            }, {
                headers: { Authorization: `${token}` }
            });
            setUpdateTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Erreur de changement de statut de la tâche', error);
        }
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
            {/* Header Modern */}
            <Header
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                setIsNotificationModalOpen={setIsNotificationModalOpen}
                setIsProfileModalOpen={setIsProfileModalOpen}
                onSearch={handleSearch}
            />
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Quick Actions */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => setIsTaskModalOpen(true)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Nouvelle Tâche</span>
                    </button>
                    <TaskFilters
                        tasks={tasks}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                {/* Stats Cards */}
                <StatsCards tasks={tasks || []} />

                {/* Progress Chart */}
                <ProgressChart tasks={tasks} />

                {/* Tasks List */}
                <TaskList
                    tasks={filteredTasks}
                    isDarkMode={isDarkMode}
                    handleStatusChange={handleStatusChange}
                    handleEditTask={handleEditTask}
                    handleDeleteTask={handleDeleteTask}
                />
            </main>
            <CreateTaskModal
                isDarkMode={isDarkMode}
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSubmit={handleTaskSubmit}
            />
            <ProfileModal
                isDarkMode={isDarkMode}
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                onSubmit={handleProfileUpdate}
            />
            <NotificationSettings
                isDarkMode={isDarkMode}
                isOpen={isNotificationModalOpen}
                onClose={() => setIsNotificationModalOpen(false)}
            />
            <EditTaskModal
                isDarkMode={isDarkMode}
                isOpen={!!editingTask}
                onClose={() => setEditingTask(null)}
                onSubmit={handleUpdateTask}
                task={editingTask}
            />
        </div>
    );
};


export default Dashboard;