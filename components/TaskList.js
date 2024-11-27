import React from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { TaskMenu } from './TaskMenu';
// Composants Card
const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 backdrop-blur-lg ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children }) => (
    <div className="px-6 py-4">
        {children}
    </div>
);

const CardTitle = ({ children }) => (
    <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {children}
    </h2>
);

const CardContent = ({ children }) => (
    <div className="p-6">
        {children}
    </div>
);

const TaskList = ({
    tasks = [],
    isDarkMode = false,
    handleStatusChange,
    handleEditTask,
    handleDeleteTask
}) => {
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    const isOverdue = (task) => {
        if (task.status === 'completed') return false;
        const dueDate = new Date(task.dueDate);
        return dueDate < new Date();
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-600';
            case 'medium':
                return 'bg-yellow-100 text-yellow-600';
            case 'low':
                return 'bg-green-100 text-green-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Mes Tâches</CardTitle>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {tasks.length} tâche{tasks.length > 1 ? 's' : ''}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {tasks.length === 0 ? (
                        <div className="text-center py-8">
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Aucune tâche pour le moment
                            </p>
                        </div>
                    ) : (
                        tasks.map(task => (
                            <div
                                key={task._id}
                                className={`
                                    p-4 rounded-xl flex items-center justify-between 
                                    ${isDarkMode
                                        ? 'bg-gray-800 hover:bg-gray-700'
                                        : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'
                                    }
                                    transition-all duration-200
                                `}
                            >
                                <div className="flex items-center space-x-4 flex-1">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={task.status === 'completed'}
                                            onChange={() => handleStatusChange(
                                                task._id,
                                                task.status === 'completed' ? 'pending' : 'completed'
                                            )}
                                            className={`
                                                w-6 h-6 rounded-md border-2 
                                                ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
                                                text-indigo-600 
                                                focus:ring-indigo-500 focus:ring-offset-0
                                                transition-colors duration-200
                                                cursor-pointer
                                            `}
                                        />
                                        {task.status === 'completed' && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            </div>
                                        )}

                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`
                                            font-medium truncate
                                            ${task.status === 'completed'
                                                ? 'line-through text-gray-500'
                                                : isDarkMode ? 'text-white' : 'text-gray-900'
                                            }
                                        `}>
                                            {task.title}
                                        </h3>
                                        {task.description && (
                                            <p className={`text-sm mt-1 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {task.description}
                                            </p>
                                        )}
                                        <div className="flex items-center space-x-2 mt-2">
                                            <span className={`
                                                px-2 py-1 rounded-full text-xs font-medium
                                                ${getPriorityColor(task.priority)}
                                            `}>
                                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                            </span>
                                            <span className={`
                                                text-xs px-2 py-1 rounded-full
                                                ${isOverdue(task)
                                                    ? 'bg-red-100 text-red-600'
                                                    : 'text-gray-500'
                                                }
                                            `}>
                                                {formatDate(task.dueDate)}
                                            </span>
                                            {task.category && task.category.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {Array.isArray(task.category) ? (
                                                        task.category.map((cat, index) => (
                                                            <span
                                                                key={index}
                                                                className={`text-xs px-2 py-1 rounded-full 
            ${isDarkMode
                                                                        ? 'bg-indigo-900/20 text-indigo-300'
                                                                        : 'bg-indigo-50 text-indigo-600'}`}
                                                            >
                                                                {cat}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className={`text-xs px-2 py-1 rounded-full 
        ${isDarkMode
                                                                ? 'bg-indigo-900/20 text-indigo-300'
                                                                : 'bg-indigo-50 text-indigo-600'}`}
                                                        >
                                                            {task.category}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 ml-4">
                                    {isOverdue(task) && (
                                        <span className="text-red-500 flex items-center">
                                            <AlertTriangle className="h-5 w-5" />
                                        </span>
                                    )}
                                    {task.status === 'pending' && !isOverdue(task) && (
                                        <Clock className="h-5 w-5 text-yellow-500" />
                                    )}
                                    <TaskMenu
                                        task={task}
                                        onEdit={handleEditTask}
                                        onDelete={handleDeleteTask}
                                        onStatusChange={handleStatusChange}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default TaskList;