import DashboardComponent from '../components/Dashboard';
import SEO from '../components/SEO';
function DashboardPage() {
  return (
    <>
      <SEO 
        title="Tableau de bord | TaskMaster"
        description="Gérez vos tâches, suivez vos progrès et restez organisé avec TaskMaster."
        canonical="https://taskmaster.com/dashboard"
      />
      {/* Contenu de la page */}
      <DashboardComponent />
    </>
  );
}

export default DashboardPage;




