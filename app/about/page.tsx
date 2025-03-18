"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { 
  FaShippingFast, FaShieldAlt, FaHeadset, 
  FaMoneyCheckAlt, FaPhone, FaEnvelope, FaMapMarkerAlt 
} from "react-icons/fa";
import Loader from "../components/Loader";

export default function About() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>À Propos | Stock-App</title>
        <meta name="description" content="Découvrez notre entreprise et notre mission." />
      </Head>

      {loading ? (
        <div className="flex justify-center items-center h-screen bg-white">
          <Loader />
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto p-6 text-gray-800 bg-gray-50 shadow-lg rounded-lg"
        >
          <h1 className="text-2xl font-extrabold text-center text-blue-600 mb-6">
            À Propos de Nous
          </h1>
          <p className="text-lg text-center mb-6">
            Bienvenue sur <strong>Stock-App</strong>, votre solution de gestion de stock efficace.
          </p>

          <motion.h2 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl font-semibold text-blue-500 mt-8 flex items-center"
          >
            <FaShieldAlt className="mr-2 text-blue-600" /> Notre Mission
          </motion.h2>
          <p className="text-lg mt-2">
            Nous nous engageons à offrir une expérience rapide, sécurisée et agréable.
          </p>

          <motion.h2 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl font-semibold text-blue-500 mt-8 flex items-center"
          >
            <FaShippingFast className="mr-2 text-blue-600" /> Pourquoi Nous Choisir ?
          </motion.h2>
          <ul className="mt-4 space-y-3">
            <motion.li 
              whileHover={{ scale: 1.05 }} 
              transition={{ duration: 0.2 }} 
              className="flex items-center"
            >
              <FaShieldAlt className="text-green-500 mr-2" /> Produits de haute qualité
            </motion.li>
            <motion.li 
              whileHover={{ scale: 1.05 }} 
              transition={{ duration: 0.2 }} 
              className="flex items-center"
            >
              <FaShippingFast className="text-orange-500 mr-2" /> Livraison rapide et fiable
            </motion.li>
            <motion.li 
              whileHover={{ scale: 1.05 }} 
              transition={{ duration: 0.2 }} 
              className="flex items-center"
            >
              <FaHeadset className="text-blue-500 mr-2" /> Service client réactif
            </motion.li>
            <motion.li 
              whileHover={{ scale: 1.05 }} 
              transition={{ duration: 0.2 }} 
              className="flex items-center"
            >
              <FaMoneyCheckAlt className="text-purple-500 mr-2" /> Paiements sécurisés
            </motion.li>
          </ul>

          <h2 className="text-xl font-semibold text-blue-500 mt-8 flex items-center">
            🔹 Technologies utilisées
          </h2>
          <p className="mt-2 text-gray-700">
            ✅ Next.js 15 (Front et Back) <br />
            ✅ Prisma (Gestion de base de données) <br />
            ✅ PostgreSQL / SQLite <br />
            ✅ Tailwind CSS (Design moderne)
          </p>

          <motion.h2 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-xl font-semibold text-blue-500 mt-8 flex items-center"
          >
            <FaPhone className="mr-2 text-blue-600" /> Nos Contacts
          </motion.h2>
          <div className="mt-4 space-y-3">
            <p className="flex items-center">
              <FaPhone className="text-green-500 mr-2 animate-pulse" /> +244 939 465 408
            </p>
            <p className="flex items-center">
              <FaEnvelope className="text-red-500 mr-2 animate-pulse" /> lamat032025@gmail.com
            </p>
            <p className="flex items-center">
              <FaMapMarkerAlt className="text-orange-500 mr-2 animate-pulse" /> 123 Rue de l&apos;espoir, Nouakchott, Mauritanie
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
}
