// components/SEO.js
import Head from 'next/head';

const SEO = ({ 
  title = "TaskMaster - Gérez vos tâches efficacement",
  description = "TaskMaster est une application web moderne de gestion de tâches qui vous aide à organiser votre travail, suivre vos progrès et respecter vos délais.",
  canonical = "https://taskmaster.com",
  ogImage = "/og-image.png" 
}) => {
  return (
    <Head>
      {/* Balises Meta de Base */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Balises Open Graph pour les réseaux sociaux */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />

      {/* Balises Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Balises Meta additionnelles */}
      <meta name="keywords" content="gestion de tâches, productivité, organisation, projets, todo list, application web" />
      <meta name="author" content="TaskMaster" />
      <meta name="robots" content="index, follow" />
    </Head>
  );
};

export default SEO;