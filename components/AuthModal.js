import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/user.js';

const AuthModal = ({ isOpen, onClose, type, setModalContent }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const url = `https://taskmaster-weld.vercel.app/auth/${type}`;
      const body = type === 'register' ? { email, password, name } : { email, password };
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.result) {
        localStorage.setItem('token', data.user.token);
        setSuccessMessage(type === 'login' ? 'Connexion réussie !' : 'Inscription réussie !');
        router.push('/dashboardPage');
        dispatch(login({ token: data.user.token, email: data.user.email, name: data.user.name }));
        if (type === 'register') {
          setType('login');
        } else {
          onClose();
        }
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('https://taskmaster-weld.vercel.app/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setSuccessMessage('Instructions de réinitialisation envoyées par email');
      setTimeout(() => {
        setIsResetMode(false);
        setResetEmail('');
      }, 3000);
    } catch (err) {
      setError('Erreur lors de la demande de réinitialisation');
    }
  };

  if (isResetMode) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Réinitialiser le mot de passe</h2>
            <button onClick={() => setIsResetMode(false)} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

          <form onSubmit={handlePasswordReset} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Envoyer les instructions
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {type === 'login' ? 'Connexion' : 'Inscription'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {type === 'login' ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          {type === 'login' ? (
            <>
              <p>
                Pas encore de compte ?{' '}
                <button
                  onClick={() => setModalContent('register')}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  S'inscrire
                </button>
              </p>
              <button
                onClick={() => setIsResetMode(true)}
                className="text-indigo-600 hover:text-indigo-500 mt-2"
              >
                Mot de passe oublié ?
              </button>
            </>
          ) : (
            <p>
              Déjà un compte ?{' '}
              <button
                onClick={() => setModalContent('login')}
                className="text-indigo-600 hover:text-indigo-500"
              >
                Se connecter
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

