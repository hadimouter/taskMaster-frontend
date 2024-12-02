import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Filter, ArrowLeft, ArrowRight, X } from 'lucide-react';


const FilterPanel = ({ filters: initialFilters, onFilterChange }) => {
    const [filters, setFilters] = useState(initialFilters);

    const handleChange = (type, value) => {
        const newFilters = { ...filters, [type]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    return (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg p-4 border border-gray-100 w-64 z-50">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray">Statut</label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 p-2 text-gray-900 dark:text-gray"
                    >
                        <option value="all">Tous</option>
                        <option value="pending">En cours</option>
                        <option value="completed">Terminé</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray">Priorité</label>
                    <select
                        value={filters.priority}
                        onChange={(e) => handleChange('priority', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 p-2 text-gray-900 dark:text-gray"
                    >
                        <option value="all">Toutes</option>
                        <option value="high">Haute</option>
                        <option value="medium">Moyenne</option>
                        <option value="low">Basse</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray">Période</label>
                    <select
                        value={filters.dateRange}
                        onChange={(e) => handleChange('dateRange', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 p-2 text-gray-900 dark:text-gray"
                    >
                        <option value="all">Toutes les dates</option>
                        <option value="today">Aujourd'hui</option>
                        <option value="week">Cette semaine</option>
                        <option value="month">Ce mois</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

const FilterSelect = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 p-2"
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

const CalendarView = ({ selectedDate, onDateSelect, onClose, tasks }) => {
    const daysInMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
    ).getDay();

    const days = [...Array(firstDayOfMonth).fill(null), ...Array(daysInMonth).fill().map((_, i) => i + 1)];
    const today = new Date();

    const isToday = useCallback((day) => (
        day === today.getDate() &&
        selectedDate.getMonth() === today.getMonth() &&
        selectedDate.getFullYear() === today.getFullYear()
    ), [selectedDate, today]);

    const getDayTasks = useCallback((day) => {
        const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
        return tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            return taskDate.toDateString() === currentDate.toDateString();
        });
    }, [selectedDate, tasks]);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-6 mx-4 max-w-md w-full" onClick={e => e.stopPropagation()}>
                <CalendarHeader
                    selectedDate={selectedDate}
                    onPrevMonth={() => onDateSelect(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                    onNextMonth={() => onDateSelect(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                    onClose={onClose}
                />

                <CalendarGrid
                    days={days}
                    selectedDate={selectedDate}
                    isToday={isToday}
                    getDayTasks={getDayTasks}
                    onDateSelect={(day) => onDateSelect(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
                />
            </div>
        </div>
    );
};

const CalendarHeader = ({ selectedDate, onPrevMonth, onNextMonth, onClose }) => (
    <div className="flex justify-between items-center mb-4">
        <button onClick={onPrevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-900 dark:text-gray">
            <ArrowLeft className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray">
            {selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex items-center space-x-2">
            <button onClick={onNextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-900 dark:text-gray">
                <ArrowRight className="h-5 w-5" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-900 dark:text-gray">
                <X className="h-5 w-5" />
            </button>
        </div>
    </div>
);

const CalendarGrid = ({ days, selectedDate, isToday, getDayTasks, onDateSelect }) => (
    <>
        <div className="grid grid-cols-7 gap-2 text-center mb-2 ">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                <div key={day} className="text-sm font-medium text-gray-600 text-gray-900 dark:text-gray">{day}</div>
            ))}
        </div>
        <div className="grid grid-cols-7 gap-2 text-gray-900 dark:text-gray">
            {days.map((day, index) => {
                if (!day) return <div key={`empty-${index}`} />;

                const tasksForDay = getDayTasks(day);
                const isSelectedDay = day === selectedDate.getDate();

                return (
                    <button
                        key={day}
                        onClick={() => onDateSelect(day)}
                        className={`
              p-2 rounded-lg text-center relative cursor-pointer
              ${isToday(day) ? 'bg-indigo-100 text-indigo-600' : ''}
              ${isSelectedDay ? 'bg-indigo-600 text-white' : ''}
              ${tasksForDay.length > 0 && !isToday(day) && !isSelectedDay ? 'bg-indigo-50' : 'hover:bg-gray-50'}
              transition-all duration-200
            `}
                    >
                        <span className="text-sm">{day}</span>
                        {tasksForDay.length > 0 && (
                            <span className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${isSelectedDay ? 'bg-white' : 'bg-indigo-500'}`} />
                        )}
                    </button>
                );
            })}
        </div>
    </>
);

const TaskFilters = ({ tasks = [], onFilterChange = () => { } }) => {
    const [filterView, setFilterView] = useState('list');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        dateRange: 'all'
    });

    const handleShowFilters = (show) => {
        setShowFilters(show);
    };

    // Simplement mettre à jour les filtres et laisser le parent gérer le filtrage
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        onFilterChange(newFilters); // Envoie les filtres au parent
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        handleFilterChange({
            ...filters,
            dateRange: 'custom',
            selectedDate: date
        });
    };

    return (
        <div className="relative">
            <div className="flex space-x-2">
                <button
                    className={`p-2 rounded-lg transition-colors ${filterView === 'calendar' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-white/80'}`}
                    onClick={() => setFilterView(prev => prev === 'calendar' ? 'list' : 'calendar')}
                    aria-label={filterView === 'calendar' ? "Afficher la liste" : "Afficher le calendrier"}
                >
                    <Calendar className="h-5 w-5" />
                </button>
                {filters.dateRange === 'custom' && (
                    <button
                        onClick={() => handleFilterChange({ ...filters, dateRange: 'all' })}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        aria-label="Réinitialiser le filtre de date"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
                <button
                    className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-white/80'}`}
                    onClick={() => handleShowFilters(!showFilters)}
                    aria-label={showFilters ? "Masquer les filtres" : "Afficher les filtres"}
                >
                    <Filter className="h-5 w-5" />
                </button>
            </div>

            {showFilters && <FilterPanel filters={filters} onFilterChange={handleFilterChange} />}

            {filterView === 'calendar' && (
                <CalendarView
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    onClose={() => setFilterView('list')}
                    tasks={tasks}
                />
            )}
        </div>

    );
};

export default TaskFilters;