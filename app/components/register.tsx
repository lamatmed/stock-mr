/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { addUser } from '../utlis/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'; // Import de toastify
import 'react-toastify/dist/ReactToastify.css';
const Register = () => {
  const [nom, setNom] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [admin, setAdmin] = useState(false);
 
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Indique que nous sommes en mode client
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.'); // Toast d'erreur
      return;
    }

    setLoading(true);

    try {
      const result = await addUser(nom, password, admin);
      if (result.success) {
        toast.success('Enregistrement réussi !'); // Toast de succès
        router.push('/login');
      } else {
      
        toast.error(result.error || 'Une erreur est survenue'); // Toast d'erreur
      }
    } catch (err) {
      
      toast.error('Erreur lors de l\'enregistrement.'); // Toast d'erreur
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return null; // Assurez-vous de ne pas afficher le composant avant que le client soit monté
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">Créer un compte</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-600">Nom</label>
            <input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirmer le mot de passe */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Admin */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="admin"
              checked={admin}
              onChange={() => setAdmin(!admin)}
              className="h-4 w-4 border-gray-300 rounded"
            />
            <label htmlFor="admin" className="text-sm font-medium text-gray-600">Compte administrateur</label>
          </div>

          {/* Bouton d'enregistrement */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {loading ? 'Chargement...' : 'S’inscrire'}
          </button>

          
        </form>
      </div>

   
    </div>
  );
};

export default Register;
