import React, { useState, useEffect } from 'react';
import { LogOut, X, Bell } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateNotifications } from '../reducers/user';
import { logout } from '../reducers/user';
import { useRouter } from 'next/router'; // Router Next.js


// Fonction utilitaire de validation
const checkDuplicateTask = (newTitle, existingTasks) => {
  const normalizeText = text => text.toLowerCase().trim().replace(/\s+/g, ' ');
  const normalizedNewTitle = normalizeText(newTitle);
  
  const similarTasks = existingTasks.filter(task => {
    const normalizedExistingTitle = normalizeText(task.title);
    return normalizedExistingTitle === normalizedNewTitle;
  });

  return {
    hasDuplicate: similarTasks.length > 0,
    duplicateTasks: similarTasks
  };
};

export const CreateTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  isDarkMode,
  existingTasks = [],
  savedCategories = ['Personnel', 'Travail', 'Urgent', 'Projet', 'Famille'],
  onSaveCategory = () => {}
}) => {
  // États initiaux
  const initialTaskData = {
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: []
  };

  // États
  const [taskData, setTaskData] = useState(initialTaskData);
  const [categoryInput, setCategoryInput] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [duplicateError, setDuplicateError] = useState('');
  const [duplicateTasks, setDuplicateTasks] = useState([]);

  if (!isOpen) return null;

  // Classes CSS conditionnelles
  const modalBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBgClass = isDarkMode ? 'bg-gray-700' : 'bg-white';
  const inputTextClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const labelClass = isDarkMode ? 'text-gray-200' : 'text-gray-700';
  const borderClass = isDarkMode ? 'border-gray-600' : 'border-gray-200';
  const hoverClass = isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

  // Gestionnaires d'événements
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTaskData({ ...taskData, title: newTitle });

    if (newTitle.trim()) {
      const { hasDuplicate, duplicateTasks: foundDuplicates } = 
        checkDuplicateTask(newTitle, existingTasks);
      if (hasDuplicate) {
        setDuplicateError('Une tâche similaire existe déjà');
        setDuplicateTasks(foundDuplicates);
      } else {
        setDuplicateError('');
        setDuplicateTasks([]);
      }
    } else {
      setDuplicateError('');
      setDuplicateTasks([]);
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value.slice(-1) === ',') {
      const newCategory = value.slice(0, -1).trim();
      handleAddCategory(newCategory);
    } else {
      setCategoryInput(value);
      setCategoryDropdownOpen(true);
    }
  };

  const handleAddCategory = (newCategory) => {
    if (newCategory && !taskData.category.includes(newCategory)) {
      setTaskData({ ...taskData, category: [...taskData.category, newCategory] });
      if (!savedCategories.includes(newCategory)) {
        onSaveCategory(newCategory);
      }
    }
    setCategoryInput('');
    setCategoryDropdownOpen(false);
  };

  const removeCategory = (categoryToRemove) => {
    setTaskData({
      ...taskData,
      category: taskData.category.filter(cat => cat !== categoryToRemove)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDuplicateError('');

    if (!taskData.title.trim()) {
      setDuplicateError('Le titre est requis');
      return;
    }

    const { hasDuplicate } = checkDuplicateTask(taskData.title, existingTasks);
    if (hasDuplicate) {
      // On affiche juste un avertissement et on continue
      const confirmCreate = window.confirm('Une tâche similaire existe déjà. Voulez-vous quand même créer cette tâche ?');
      if (!confirmCreate) {
          return;
      }
  }

    const trimmedData = {
      ...taskData,
      title: taskData.title.trim(),
      description: taskData.description.trim()
    };

    onSubmit(trimmedData);
    setTaskData(initialTaskData);
    setCategoryInput('');
    onClose();
  };

  const handleClose = () => {
    setTaskData(initialTaskData);
    setCategoryInput('');
    setDuplicateError('');
    setDuplicateTasks([]);
    onClose();
  };

  const filteredCategories = savedCategories.filter(cat => 
    cat.toLowerCase().includes(categoryInput.toLowerCase()) &&
    !taskData.category.includes(cat)
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${modalBgClass} rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto`}>
        <div className="p-6 space-y-6">
          {/* En-tête */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Nouvelle Tâche
            </h2>
            <button
              onClick={handleClose}
              className={`p-2 rounded-full transition-colors ${hoverClass}`}
              aria-label="Fermer"
            >
              <X className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} />
            </button>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div>
              <label htmlFor="task-title" className={`block text-sm font-medium ${labelClass} mb-2`}>
                Titre de la tâche
              </label>
              <input
                id="task-title"
                type="text"
                required
                value={taskData.title}
                onChange={handleTitleChange}
                className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBgClass} ${inputTextClass} focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200`}
                placeholder="Entrez le titre de la tâche"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="task-description" className={`block text-sm font-medium ${labelClass} mb-2`}>
                Description
              </label>
              <textarea
                id="task-description"
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBgClass} ${inputTextClass} focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200`}
                rows="3"
                placeholder="Décrivez votre tâche"
              />
            </div>

            {/* Date et Priorité */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="task-due-date" className={`block text-sm font-medium ${labelClass} mb-2`}>
                  Date limite
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  required
                  value={taskData.dueDate}
                  onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBgClass} ${inputTextClass} focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200`}
                />
              </div>

              <div>
                <label htmlFor="task-priority" className={`block text-sm font-medium ${labelClass} mb-2`}>
                  Priorité
                </label>
                <select
                  id="task-priority"
                  value={taskData.priority}
                  onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${borderClass} ${inputBgClass} ${inputTextClass} focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200`}
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
            </div>

            {/* Catégories */}
            <div className="relative">
              <label htmlFor="task-category" className={`block text-sm font-medium ${labelClass} mb-2`}>
                Catégories
              </label>
              <div className={`min-h-[45px] flex flex-wrap gap-2 p-3 rounded-xl border ${borderClass} focus-within:ring-2 focus-within:ring-indigo-500 ${inputBgClass} ${inputTextClass} transition-colors duration-200`}>
                {taskData.category.map((cat, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium"
                  >
                    {cat}
                    <button
                      onClick={() => removeCategory(cat)}
                      className="hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                      type="button"
                      aria-label={`Supprimer la catégorie ${cat}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  id="task-category"
                  type="text"
                  value={categoryInput}
                  onChange={handleCategoryChange}
                  className={`flex-grow min-w-[120px] outline-none bg-transparent ${inputTextClass}`}
                  placeholder="Ajouter une catégorie..."
                  onFocus={() => setCategoryDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setCategoryDropdownOpen(false), 200)}
                />
              </div>
              
              {/* Dropdown des catégories */}
              {categoryDropdownOpen && filteredCategories.length > 0 && (
                <div className={`absolute z-10 w-full mt-2 ${modalBgClass} border ${borderClass} rounded-xl shadow-lg overflow-hidden max-h-40 overflow-y-auto`}>
                  {filteredCategories.map((cat, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAddCategory(cat)}
                      className={`w-full text-left px-4 py-3 ${inputTextClass} ${hoverClass} transition-colors duration-200 ${
                        index !== filteredCategories.length - 1 ? `border-b ${borderClass}` : ''
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-4 rounded-xl font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Créer la tâche
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};



export const ProfileModal = ({ isOpen, onClose, onSubmit, isDarkMode }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const modalBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBgClass = isDarkMode ? 'bg-gray-700' : 'bg-white';
  const inputTextClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const labelClass = isDarkMode ? 'text-gray-200' : 'text-gray-700';
  const borderClass = isDarkMode ? 'border-gray-600' : 'border-gray-200';

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const resetForm = () => {
    setProfileData({
      name: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className={`relative ${modalBgClass} rounded-2xl shadow-xl w-full max-w-md mx-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Profil Utilisateur
            </h2>
            <button
              onClick={onClose}
              className={`p-2 hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full transition-colors`}
            >
              <X className={isDarkMode ? 'text-gray-300' : 'text-gray-500'} />
            </button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit(profileData);
            resetForm();
            onClose();
          }} className="space-y-6">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl">
                {profileData.name ? profileData.name[0].toUpperCase() : 'U'}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-2`}>Nom</label>
                <input
                  required
                  type="text"
                  placeholder={user.name}
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${borderClass} ${inputBgClass} ${inputTextClass} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-2`}>Email</label>
                <input
                  required
                  type="email"
                  placeholder={user.email}
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${borderClass} ${inputBgClass} ${inputTextClass} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-2`}>Mot de passe actuel</label>
                <input
                  type="password"
                  value={profileData.currentPassword}
                  onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${borderClass} ${inputBgClass} ${inputTextClass} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-2`}>Nouveau mot de passe</label>
                <input
                  type="password"
                  value={profileData.newPassword}
                  onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${borderClass} ${inputBgClass} ${inputTextClass} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Mettre à jour le profil
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${borderClass}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${modalBgClass} ${labelClass}`}>ou</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full group relative flex justify-center items-center py-3 px-4 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-50 transition-all duration-300"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Se déconnecter</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};



export const NotificationSettings = ({ isOpen, onClose, isDarkMode }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const labelClass = isDarkMode ? 'text-gray-200' : 'text-gray-700';
  const hoverBgClass = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const borderClass = isDarkMode ? 'border-gray-600' : 'border-gray-200';
  const secondaryTextClass = isDarkMode ? 'text-gray-300' : 'text-gray-500';

  const [settings, setSettings] = useState({
    emailNotifications: true,
    taskReminders: true,
    dueDateAlerts: true
  });

  useEffect(() => {
    if (user?.notifications) {
      setSettings(user.notifications);
    }
  }, [user?.notifications]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('https://taskmaster-weld.vercel.app/users/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user.token
        },
        body: JSON.stringify({
          notifications: settings
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour des notifications');
      }

      dispatch(updateNotifications(settings));
      onClose();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`${modalBgClass} rounded-2xl shadow-xl max-w-md w-full mx-4`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Paramètres de notification
            </h2>
            <button
              onClick={onClose}
              className={`p-2 ${hoverBgClass} rounded-full transition-colors`}
            >
              <X className={isDarkMode ? 'text-gray-300' : 'text-gray-500'} />
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}

          <div className="mb-8">
            <div className={`w-16 h-16 mx-auto ${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-100'} rounded-full flex items-center justify-center`}>
              <Bell className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} size={32} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {[
                {
                  title: 'Notifications par email',
                  description: 'Recevoir des mises à jour par email',
                  key: 'emailNotifications'
                },
                {
                  title: 'Rappels de tâches',
                  description: 'Notifications pour les tâches à venir',
                  key: 'taskReminders'
                },
                {
                  title: 'Alertes de date limite',
                  description: 'Notifications pour les échéances proches',
                  key: 'dueDateAlerts'
                }
              ].map((setting) => (
                <div key={setting.key} className={`flex items-center justify-between p-4 rounded-lg ${hoverBgClass} transition-colors`}>
                  <div>
                    <h3 className={`font-medium ${textClass}`}>{setting.title}</h3>
                    <p className={secondaryTextClass}>{setting.description}</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings[setting.key]}
                      onChange={(e) => setSettings({ ...settings, [setting.key]: e.target.checked })}
                      className="w-10 h-6 bg-gray-200 rounded-full appearance-none cursor-pointer transition-colors checked:bg-indigo-600"
                    />
                    <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform transform ${settings[setting.key] ? 'translate-x-4' : ''}`} />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer les paramètres'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;