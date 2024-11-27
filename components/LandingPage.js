import { useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import AuthModal from '../components/AuthModal';

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const features = [
    { title: "Organisation Simple", description: "Gérez vos tâches facilement" },
    { title: "Priorités", description: "Définissez l'importance de chaque tâche" },
    { title: "Suivi", description: "Visualisez votre progression" },
  ];

  const handleAuthClick = (type) => {
    setModalContent(type);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-indigo-200">
      <nav className="bg-transparent backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 transition-all duration-500">
                TaskMaster
              </span>
            </h1>

            <div className="flex items-center gap-3 sm:gap-6">
              <button
                className="relative text-gray-700 px-2 sm:px-3 py-2 text-sm sm:text-base rounded-md overflow-hidden group"
                onClick={() => handleAuthClick('login')}
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-indigo-600">
                  Connexion
                </span>
                <div className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </button>

              <button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:-translate-y-0.5"
                onClick={() => handleAuthClick('register')}
              >
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-16 px-6 sm:py-24 sm:px-8 lg:px-12">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
            Simplifiez votre gestion de tâches
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Une application intuitive pour organiser et suivre vos tâches quotidiennes
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => handleAuthClick('register')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:bg-indigo-700"
            >
              Commencer gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10 group-hover:scale-125 transition-transform duration-500"></div>

              <div className="relative">
                <div className="inline-flex p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>

                <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {feature.title}
                </h3>

                <p className="mt-4 text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalContent}
        setModalContent={setModalContent}
      />
    </div>
  );
};

export default LandingPage;
