const PublicationCard = ({ publication, onPublish }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const imageUrl = `${API_URL}${publication.imageUrl}`;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <img
        src={imageUrl}
        alt={publication.title}
        className="w-full h-40 sm:h-48 object-cover"
        loading="lazy"
      />
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex-1 line-clamp-2">{publication.title}</h3>
          <span
            className={`px-2 py-1 text-xs rounded-full whitespace-nowrap flex-shrink-0 ${
              publication.status === 'published'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {publication.status === 'published' ? 'Publié' : 'Brouillon'}
          </span>
        </div>
        
        {publication.location && (
          <p className="text-xs sm:text-sm text-gray-600 mb-2 flex items-center">
            <span className="mr-1">📍</span>
            <span className="truncate">{publication.location}</span>
          </p>
        )}
        
        <p className="text-xs sm:text-sm text-gray-700 mb-3 line-clamp-3 leading-relaxed">{publication.seoText}</p>
        
        {publication.tags && publication.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {publication.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
            {publication.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{publication.tags.length - 3}</span>
            )}
          </div>
        )}
        
        {publication.status === 'draft' && (
          <button
            onClick={() => onPublish(publication._id)}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium active:scale-95 transition-transform"
          >
            Publier
          </button>
        )}
        
        {publication.status === 'published' && publication.publishedAt && (
          <p className="text-xs text-gray-500 mt-2">
            Publié le {new Date(publication.publishedAt).toLocaleDateString('fr-FR')}
          </p>
        )}
      </div>
    </div>
  );
};

export default PublicationCard;

