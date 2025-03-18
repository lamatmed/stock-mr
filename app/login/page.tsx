/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserAlt, FaLock, FaSignInAlt } from 'react-icons/fa';
import Swal from "sweetalert2";
import { loginUser } from '../utlis/actions';
import Loader from '../components/Loader';

const Login = () => {
  const [nom, setNom] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user'); // Ton endpoint
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          if (userData) {
            router.push('/'); // Redirige si déjà connecté
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    };
    fetchUser();
  }, []);

  const notify = (message: string, type: 'success' | 'error') => {
    Swal.fire({
      icon: type,
      title: type === 'success' ? 'Succès' : 'Erreur',
      text: message,
      confirmButtonColor: type === 'success' ? '#28a745' : '#dc3545',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginUser(nom, password);
      if (result.success) {
        notify('Connexion réussie!', 'success');
        router.push('/');
      } else {
        setError(result.error || 'Une erreur est survenue');
        notify(result.error || 'Une erreur est survenue', 'error');
      }
    } catch (err) {
      setError('Erreur lors de la connexion.');
      notify('Erreur lors de la connexion.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-xl p-8 bg-pink-300 shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          <FaSignInAlt className="inline mr-1 text-green-500" /> Connexion
        </h1>
        {loading ? (
          <Loader/>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center border-b border-gray-300 py-2">
              <FaUserAlt className="text-blue-500 mr-3" />
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                placeholder="Nom d'utilisateur"
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center border-b border-gray-300 py-2">
              <FaLock className="text-red-500 mr-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mot de passe"
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
