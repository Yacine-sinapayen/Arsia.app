import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import PublicationCard from '../components/PublicationCard';
import PublicationForm from '../components/PublicationForm';

const Dashboard = ({ user, setUser }) => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [previewPublication, setPreviewPublication] = useState(null);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [checkingLinkedIn, setCheckingLinkedIn] = useState(true);
  const [linkedinOrganizationName, setLinkedinOrganizationName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'authentification d'abord
    const verifyAuth = async () => {
      try {
        await axios.get('/api/publications');
        // Si on arrive ici, l'utilisateur est authentifié
        fetchPublications();
        checkLinkedInStatus();
        
        // Vérifier les paramètres d'URL pour les notifications LinkedIn
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('linkedin_connected') === 'true') {
          toast.success('✅ LinkedIn connecté avec succès !');
          if (urlParams.get('warning') === 'no_org') {
            toast.warning('⚠️ Page Webysta non trouvée. Vérifiez que vous êtes admin de la page.');
          }
          checkLinkedInStatus();
          // Nettoyer l'URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } else if (urlParams.get('linkedin_error')) {
          toast.error('❌ Erreur lors de la connexion à LinkedIn');
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (error) {
        // Si l'utilisateur n'est pas authentifié, rediriger vers login
        if (error.response?.status === 401) {
          setUser(null);
          navigate('/login');
        }
      }
    };

    verifyAuth();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await axios.get('/api/publications');
      if (response.data.success) {
        setPublications(response.data.publications);
      }
    } catch (error) {
      console.error('Error fetching publications:', error);
      if (error.response?.status === 401) {
        setUser(null);
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      toast.info('👋 Déconnexion réussie');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const handlePublicationCreated = (publication) => {
    toast.success('✨ Publication créée avec succès !');
    setPreviewPublication(publication);
    setShowForm(false);
    fetchPublications();
  };

  const handlePublish = async (publicationId) => {
    try {
      const response = await axios.post(`/api/publications/${publicationId}/publish`);
      if (response.data.success) {
        let message = '🚀 Publication mise en ligne avec succès !';
        if (response.data.linkedin?.published) {
          message += ' 📱 Publiée sur LinkedIn également !';
        } else if (response.data.linkedin?.error) {
          message += ` (LinkedIn: ${response.data.linkedin.error})`;
        }
        toast.success(message);
        setPreviewPublication(null);
        fetchPublications();
      }
    } catch (error) {
      console.error('Error publishing:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la publication');
    }
  };

  const checkLinkedInStatus = async () => {
    try {
      setCheckingLinkedIn(true);
      const response = await axios.get('/api/linkedin/status');
      if (response.data.success) {
        setLinkedinConnected(response.data.connected);
        setLinkedinOrganizationName(response.data.organizationName);
      }
    } catch (error) {
      console.error('Error checking LinkedIn status:', error);
      setLinkedinConnected(false);
    } finally {
      setCheckingLinkedIn(false);
    }
  };

  const handleConnectLinkedIn = async () => {
    try {
      const response = await axios.get('/api/linkedin/auth', {
        withCredentials: true
      });
      
      if (response.data.success) {
        // Rediriger vers LinkedIn
        window.location.href = response.data.authUrl;
      }
    } catch (error) {
      console.error('Error connecting LinkedIn:', error);
      if (error.response?.status === 401) {
        toast.error('❌ Non autorisé. Vous devez être connecté pour utiliser LinkedIn.');
      } else {
        toast.error('Erreur lors de la connexion à LinkedIn');
      }
    }
  };

  const handleDisconnectLinkedIn = async () => {
    try {
      const response = await axios.post('/api/linkedin/disconnect');
      if (response.data.success) {
        toast.success('LinkedIn déconnecté avec succès');
        setLinkedinConnected(false);
        setLinkedinOrganizationName(null);
      }
    } catch (error) {
      console.error('Error disconnecting LinkedIn:', error);
      toast.error('Erreur lors de la déconnexion de LinkedIn');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg text-gray-900">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header mobile-first avec menu responsive */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-4 py-3">
          {/* Header principal */}
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-gray-900">Arsia</h1>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 p-2 -mr-2"
              aria-label="Déconnexion"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
          
          {/* Actions principales */}
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Bouton LinkedIn */}
            {linkedinConnected ? (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex-1 sm:flex-initial">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm font-medium text-green-700 block truncate">
                    {linkedinOrganizationName || 'Profil LinkedIn'}
                  </span>
                </div>
                <button
                  onClick={handleDisconnectLinkedIn}
                  className="text-xs text-green-600 hover:text-green-800 underline"
                >
                  Déco
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectLinkedIn}
                disabled={checkingLinkedIn}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 disabled:opacity-50 flex-1 sm:flex-initial"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="hidden sm:inline">{checkingLinkedIn ? 'Vérification...' : 'LinkedIn'}</span>
                <span className="sm:hidden">{checkingLinkedIn ? '...' : 'LI'}</span>
              </button>
            )}
            
            {/* Bouton créer publication */}
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 flex-1 sm:flex-initial shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Créer</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="px-4 py-4 max-w-7xl mx-auto">
        {showForm && (
          <PublicationForm
            onClose={() => setShowForm(false)}
            onSuccess={handlePublicationCreated}
          />
        )}

        {previewPublication && (
          <div className="mb-4 bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Prévisualisation</h2>
            <div className="border rounded-lg overflow-hidden mb-4">
              <img
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${previewPublication.imageUrl}`}
                alt={previewPublication.title}
                className="w-full h-48 sm:h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">{previewPublication.title}</h3>
                {previewPublication.location && (
                  <p className="text-gray-600 mb-2 text-sm">📍 {previewPublication.location}</p>
                )}
                <p className="text-gray-700 mb-4 text-sm sm:text-base line-clamp-3">{previewPublication.seoText}</p>
                {previewPublication.tags && previewPublication.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {previewPublication.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handlePublish(previewPublication._id)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex-1 sm:flex-initial text-center"
              >
                Publier
              </button>
              <button
                onClick={() => setPreviewPublication(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium flex-1 sm:flex-initial text-center"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Mes publications</h2>
          
          {publications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500 mb-6">Aucune publication pour le moment.</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Créer votre première publication
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {publications.map((publication) => (
                <PublicationCard
                  key={publication._id}
                  publication={publication}
                  onPublish={() => handlePublish(publication._id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

