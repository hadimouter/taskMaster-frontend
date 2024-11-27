import React, { useState, useEffect } from 'react';
import {LogOut, X, Bell } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateNotifications } from '../reducers/user';
import { logout } from '../reducers/user';
import { useRouter } from 'next/router'; // Router Next.js

export const CreateTaskModal = ({ isOpen, onClose, onSubmit }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(taskData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Nouvelle Tâche
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
              <input
                type="text"
                required
                value={taskData.title}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Nom de la tâche"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows="3"
                placeholder="Description de la tâche"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date limite</label>
                <input
                  type="date"
                  value={taskData.dueDate}
                  onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                <select
                  value={taskData.priority}
                  onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <input
                type="text"
                value={taskData.category}
                onChange={(e) => setTaskData({ ...taskData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Ex: Travail, Personnel, etc."
              />
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





export const ProfileModal = ({ isOpen, onClose, onSubmit }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
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
    router.push('/'); // Utilisation du router Next.js
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Profil Utilisateur
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
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

            {/* Champs du formulaire - inchangés */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input
                  required
                  type="text"
                  placeholder={user.name}
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  required
                  type="email"
                  placeholder={user.email}
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                <input
                  type="password"
                  value={profileData.currentPassword}
                  onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={profileData.newPassword}
                  onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Mettre à jour le profil
            </button>

            {/* Séparateur */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            {/* Bouton de déconnexion */}
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



export const NotificationSettings = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

      // Mettre à jour le state global avec les nouvelles notifications
      dispatch(updateNotifications(settings));
      onClose();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
      // La modal reste ouverte en cas d'erreur
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Paramètres de notification
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}

          <div className="mb-8">
            <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
              <Bell className="h-8 w-8 text-indigo-600" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Notifications par email</h3>
                  <p className="text-sm text-gray-500">Recevoir des mises à jour par email</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="w-10 h-6 bg-gray-200 rounded-full appearance-none cursor-pointer transition-colors checked:bg-indigo-600"
                  />
                  <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform transform ${settings.emailNotifications ? 'translate-x-4' : ''}`} />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Rappels de tâches</h3>
                  <p className="text-sm text-gray-500">Notifications pour les tâches à venir</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.taskReminders}
                    onChange={(e) => setSettings({ ...settings, taskReminders: e.target.checked })}
                    className="w-10 h-6 bg-gray-200 rounded-full appearance-none cursor-pointer transition-colors checked:bg-indigo-600"
                  />
                  <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform transform ${settings.taskReminders ? 'translate-x-4' : ''}`} />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Alertes de date limite</h3>
                  <p className="text-sm text-gray-500">Notifications pour les échéances proches</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.dueDateAlerts}
                    onChange={(e) => setSettings({ ...settings, dueDateAlerts: e.target.checked })}
                    className="w-10 h-6 bg-gray-200 rounded-full appearance-none cursor-pointer transition-colors checked:bg-indigo-600"
                  />
                  <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform transform ${settings.dueDateAlerts ? 'translate-x-4' : ''}`} />
                </div>
              </div>
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