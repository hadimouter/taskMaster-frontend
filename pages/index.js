import LandingPage from '../components/LandingPage';
import SEO from '../components/SEO';
function Index() {
  return (
    <>
      <SEO 
        title="TaskMaster - Organisez votre travail efficacement"
        description="Découvrez TaskMaster, l'application de gestion de tâches qui simplifie votre organisation quotidienne. Essayez gratuitement et boostez votre productivité."
        canonical="https://taskmaster.com"
      />
      {/* Contenu de la page */}
      <LandingPage />
    </>
  );
}

export default Index;







