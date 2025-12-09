import { useState } from 'react';
import axios from 'axios';

const PublicationForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    workType: '',
    date: new Date().toISOString().split('T')[0],
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.image) {
      setError('Veuillez sélectionner une image');
      setLoading(false);
      return;
    }

    if (!formData.title) {
      setError('Le titre est requis');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('image', formData.image);
      data.append('title', formData.title);
      data.append('location', formData.location);
      data.append('workType', formData.workType);
      data.append('date', formData.date);

      const response = await axios.post('/api/publications', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        onSuccess(response.data.publication);
      } else {
        setError(response.data.error || 'Erreur lors de la création de la publication');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création de la publication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center z-10">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Créer une publication</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 -mr-1"
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Photo du travail *
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                required
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="Ex: Rénovation complète d'une cuisine"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Ville / Localisation
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="Ex: Paris, Lyon, Marseille..."
              />
            </div>

            <div>
              <label htmlFor="workType" className="block text-sm font-medium text-gray-700 mb-2">
                Type de travaux
              </label>
              <input
                type="text"
                id="workType"
                name="workType"
                value={formData.workType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="Ex: Rénovation, Plomberie, Électricité..."
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 pb-2 sm:pb-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-base"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-initial px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium text-base active:scale-95 transition-transform"
              >
                {loading ? 'Génération en cours...' : 'Générer avec l\'IA'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PublicationForm;

