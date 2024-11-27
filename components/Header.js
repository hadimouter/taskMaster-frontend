// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Sun, Moon, Bell, Search } from 'lucide-react';

const Header = ({ isDarkMode, setIsDarkMode, setIsNotificationModalOpen, setIsProfileModalOpen, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const token = useSelector((state) => state.user.value.token);

    // Fonction pour gérer la recherche
    const handleSearch = async (event) => {
        setSearchTerm(event.target.value);

        // Si la recherche est vide, renvoyer toutes les tâches
        if (event.target.value === '') {
            onSearch(null); // Null indiquera au Dashboard de montrer toutes les tâches
            return;
        }

        try {
            // Appel de l'API de recherche
            const response = await fetch(`https://taskmaster-weld.vercel.app/tasks/search?q=${event.target.value}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            const data = await response.json();
            onSearch(data); // Envoyer les résultats au Dashboard
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            onSearch(null);
        }
    };


    return (
        <header className={`${isDarkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-lg'} sticky top-0 z-50 shadow-sm`}>
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            TaskMaster
                        </h1>
                        <div className="hidden md:flex">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    onChange={handleSearch}
                                    className="pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:text-gray-900  focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                                />
                                <Search className="h-5 w-5 text-gray-400 dark:text-gray-900 absolute left-3 top-2.5" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <button className="relative" onClick={() => setIsNotificationModalOpen(true)}>
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                                3
                            </span>
                        </button>
                        <button
                            onClick={() => setIsProfileModalOpen(true)}
                            className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                                U
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
