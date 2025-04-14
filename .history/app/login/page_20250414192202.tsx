/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserAlt, FaLock, FaSignInAlt } from 'react-icons/fa';
import Swal from "sweetalert2";
import { loginUser } from '../utlis/actions';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';

const Login = () => {
  const [nom, setNom] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          if (userData) {
            router.push('/');
          }
        }
      } catch (error) {
        console.error("خطأ أثناء جلب المستخدم :", error);
      }
    };
    fetchUser();
  }, []);

  const notify = (message: string, type: 'success' | 'error') => {
    Swal.fire({
      icon: type,
      title: type === 'success' ? 'نجاح' : 'خطأ',
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
        notify('تم تسجيل الدخول بنجاح!', 'success');
        router.push('/sales');
      } else {
        setError(result.error || 'حدث خطأ ما');
        notify(result.error || 'حدث خطأ ما', 'error');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول.');
      notify('حدث خطأ أثناء تسجيل الدخول.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl"
      >
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          <FaSignInAlt className="inline ml-2 text-green-500" /> تسجيل الدخول
        </h1>
        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-center border border-gray-300 p-3 rounded-lg shadow-sm bg-gray-50"
            >
              <FaUserAlt className="text-blue-500 ml-3" />
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                placeholder="اسم المستخدم"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-right"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-center border border-gray-300 p-3 rounded-lg shadow-sm bg-gray-50"
            >
              <FaLock className="text-red-500 ml-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="كلمة المرور"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-right"
              />
            </motion.div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
