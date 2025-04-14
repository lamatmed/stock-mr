"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

const NotFound = () => {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-900 px-4 text-center"
      dir="rtl" // Ajout du support de la lecture de droite à gauche
    >
      {/* Icône Alerte */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FiAlertTriangle className="w-24 h-24 text-red-500 animate-bounce" />
      </motion.div>

      {/* Image Not Found */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Image
          src="/not-found.png"
          alt="Illustration de page introuvable"
          width={220}
          height={220}
          unoptimized
          priority
        />
      </motion.div>

      {/* Message */}
      <p className="text-xl text-gray-600 mt-4">
        عذراً، هذه الصفحة غير موجودة.
      </p>

      {/* Bouton Retour */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-10"
      >
        <Link href="/" passHref>
          <span className="inline-block px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105 cursor-pointer">
            العودة إلى الصفحة الرئيسية
          </span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
