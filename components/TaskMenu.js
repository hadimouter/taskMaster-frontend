import React, { useState, useEffect } from 'react';
import { MoreVertical, Edit, Trash2, CheckCircle, X } from 'lucide-react';

export const TaskMenu = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical className="h-5 w-5 text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50">
            <button
              onClick={() => {
                onEdit(task);
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </button>
            <button
              onClick={() => {
                onStatusChange(task._id, task.status === 'completed' ? 'pending' : 'completed');
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {task.status === 'completed' ? 'Marquer comme à faire' : 'Marquer comme terminé'}
            </button>
            <button
              onClick={() => {
                onDelete(task._id);
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  );
};


export const EditTaskModal = ({ isOpen, onClose, onSubmit, task, isDarkMode }) => {
  // Initialiser taskData avec des valeurs par défaut plus complètes
  const defaultData = {
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    status: 'pending'
  };

  const [taskData, setTaskData] = useState({ ...defaultData, ...task });

  // Mettre à jour taskData quand task change
  useEffect(() => {
    if (task) {
      setTaskData(task);
    }
  }, [task]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(taskData);
    onClose();
  };

  // Classes conditionnelles basées sur isDarkMode
  const modalBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBgClass = isDarkMode ? 'bg-gray-700' : 'bg-white';
  const inputTextClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const labelClass = isDarkMode ? 'text-gray-200' : 'text-gray-700';
  const borderClass = isDarkMode ? 'border-gray-600' : 'border-gray-200';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`${modalBgClass} rounded-2xl shadow-xl max-w-md w-full mx-4`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Modifier la tâche
            </h2>
            <button
              onClick={onClose}
              className={`p-2 hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full transition-colors`}
            >
              <X className={isDarkMode ? 'text-gray-300' : 'text-gray-500'} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium ${labelClass} mb-2`}>
                Titre
              </label>
              <input
                type="text"
                required
                value={taskData.title}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${borderClass} ${inputBgClass} ${inputTextClass} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${labelClass} mb-2`}>
                Description
              </label>
              <textarea
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${borderClass} ${inputBgClass} ${inputTextClass} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                rows="3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-2`}>
                  Date limite
                </label>
                <input
                  type="date"
                  value={taskData.dueDate}
                  onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${borderClass} ${inputBgClass} ${inputTextClass} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-2`}>
                  Priorité
                </label>
                <select
                  value={taskData.priority}
                  onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${borderClass} ${inputBgClass} ${inputTextClass} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Mettre à jour
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;