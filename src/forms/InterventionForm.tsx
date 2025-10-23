import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Stethoscope, MapPin } from 'lucide-react';

interface InterventionFormProps {
  onBack: () => void;
  onInterventionCreated: (interventionData: any) => void;
}

const InterventionForm: React.FC<InterventionFormProps> = ({
  onBack,
  onInterventionCreated
}) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    interventionType: '',
    surgeon: '',
    operatingRoom: '',
    interventionDate: '',
    interventionTime: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const interventionTypes = [
    'Appendicectomie',
    'Cholécystectomie',
    'Hernie inguinale',
    'Césarienne',
    'Chirurgie cardiaque',
    'Chirurgie orthopédique',
    'Chirurgie urologique',
    'Chirurgie gynécologique',
    'Chirurgie digestive',
    'Autre'
  ];

  const operatingRooms = [
    'Bloc 1',
    'Bloc 2', 
    'Bloc 3',
    'Akanda'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Le nom du patient est requis';
    }

    if (!formData.interventionType) {
      newErrors.interventionType = 'Le type d\'intervention est requis';
    }

    if (!formData.surgeon.trim()) {
      newErrors.surgeon = 'Le chirurgien est requis';
    }

    if (!formData.operatingRoom) {
      newErrors.operatingRoom = 'La salle d\'opération est requise';
    }

    if (!formData.interventionDate) {
      newErrors.interventionDate = 'La date de l\'intervention est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const interventionData = {
        ...formData,
        id: Date.now().toString(), // ID temporaire
        createdAt: new Date().toISOString()
      };
      
      onInterventionCreated(interventionData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur quand l'utilisateur commence à saisir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nouvelle Intervention</h1>
              <p className="text-gray-600">Centre Diagnostic de Libreville</p>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Nom du Patient */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nom du Patient *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => handleInputChange('patientName', e.target.value)}
                    placeholder="Entrez le nom complet"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.patientName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.patientName && (
                  <p className="text-red-500 text-sm">{errors.patientName}</p>
                )}
              </div>

              {/* Âge */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Âge
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.patientAge}
                    onChange={(e) => handleInputChange('patientAge', e.target.value)}
                    placeholder="Âge du patient"
                    min="0"
                    max="120"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Type d'Intervention */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Type d'Intervention *
                </label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.interventionType}
                    onChange={(e) => handleInputChange('interventionType', e.target.value)}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none ${
                      errors.interventionType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionnez...</option>
                    {interventionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.interventionType && (
                  <p className="text-red-500 text-sm">{errors.interventionType}</p>
                )}
              </div>

              {/* Chirurgien */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Chirurgien Principal *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.surgeon}
                    onChange={(e) => handleInputChange('surgeon', e.target.value)}
                    placeholder="Dr. ..."
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.surgeon ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.surgeon && (
                  <p className="text-red-500 text-sm">{errors.surgeon}</p>
                )}
              </div>

              {/* Salle d'Opération */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Salle d'Opération *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.operatingRoom}
                    onChange={(e) => handleInputChange('operatingRoom', e.target.value)}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none ${
                      errors.operatingRoom ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionnez...</option>
                    {operatingRooms.map((room) => (
                      <option key={room} value={room}>
                        {room}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.operatingRoom && (
                  <p className="text-red-500 text-sm">{errors.operatingRoom}</p>
                )}
              </div>

              {/* Date et Heure */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date de l'Intervention *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.interventionDate}
                    onChange={(e) => handleInputChange('interventionDate', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.interventionDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.interventionDate && (
                  <p className="text-red-500 text-sm">{errors.interventionDate}</p>
                )}
              </div>

              {/* Heure Prévue */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Heure Prévue
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="time"
                    value={formData.interventionTime}
                    onChange={(e) => handleInputChange('interventionTime', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Stethoscope className="w-4 h-4" />
                Créer l'Intervention
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterventionForm;
