import React, { useState, useEffect } from 'react';
import { LogOut, X, Bell } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateNotifications } from '../reducers/user';
import { logout } from '../reducers/user';
import { useRouter } from 'next/router'; // Router Next.js



export const CreateTaskModal = ({ isOpen, onClose, onSubmit, isDarkMode }) => {
  const initialTaskData = {
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: []
  };

  const [taskData, setTaskData] = useState(initialTaskData);
  const [categoryInput, setCategoryInput] = useState('');

  if (!isOpen) return null;

  const modalBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBgClass = isDarkMode ? 'bg-gray-700' : 'bg-white';
  const inputTextClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const labelClass = isDarkMode ? 'text-gray-200' : 'text-gray-700';
  const borderClass = isDarkMode ? 'border-gray-600' : 'border-gray-200';

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value.slice(-1) === ',') {
      const newCategory = value.slice(0, -1).trim();
      if (newCategory && !taskData.category.includes(newCategory)) {
        setTaskData({ ...taskData, category: [...taskData.category, newCategory] });
      }
      setCategoryInput('');
    } else {
      setCategoryInput(value);
    }
  };

  const removeCategory = (categoryToRemove) => {
    setTaskData({
      ...taskData,
      category: taskData.category.filter(cat => cat !== categoryToRemove)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(taskData);
    setTaskData(initialTaskData);
    setCategoryInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`${modalBgClass} rounded-2xl shadow-xl max-w-md w-full mx-4`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Nouvelle Tâche
            </h2>
            <button
              onClick={() => {
                setTaskData(initialTaskData);
                setCategoryInput('');
                onClose();
              }}
              className={`p-2 hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full transition-colors`}
            >
              <X className={isDarkMode ? 'text-gray-300' : 'text-gray-500'} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium ${labelClass} mb-2`}>Titre</label>
              <input
                type="text"
                required
                value={taskData.title}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${borderClass} ${inputBgClass} ${inputTextClass} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                placeholder="Nom de la tâche"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${labelClass} mb-2`}>Description</label>
              <textarea
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${borderClass} ${inputBgClass} ${inputTextClass} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                rows="3"
                placeholder="Description de la tâche"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-2`}>Date limite</label>
                <input
                  type="date"
                  required
                  value={taskData.dueDate}
                  onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${borderClass} ${inputBgClass} ${inputTextClass} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-2`}>Priorité</label>
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

            <div>
              <label className={`block text-sm font-medium ${labelClass} mb-2`}>Catégorie</label>
              <div className={`min-h-[45px] flex flex-wrap gap-2 p-2 rounded-lg border ${borderClass} focus-within:ring-2 focus-within:ring-indigo-500 ${inputBgClass} ${inputTextClass}`}>
                {taskData.category.map((cat, index) => (
                  <span
                    key={index}
                    className={`bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-3 py-1 rounded-full flex items-center gap-2 shadow-sm ${isDarkMode ? 'bg-opacity-80' : ''}`}
                  >
                    {cat}
                    <button
                      onClick={() => removeCategory(cat)}
                      className="hover:bg-indigo-200 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                      type="button"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={categoryInput}
                  onChange={handleCategoryChange}
                  className={`flex-grow min-w-[120px] outline-none ${inputBgClass} ${inputTextClass}`}
                  placeholder="Tapez et utilisez une virgule pour ajouter"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300"
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