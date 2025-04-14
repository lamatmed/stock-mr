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
        <title>حول | Stock-App</title>
        <meta name="description" content="اكتشف شركتنا ومهمتنا." />
      </Head>

      {loading ? (
        <div className="flex justify-center items-center h-screen bg-white">
          <Loader />
        </div>
      ) : (
        <motion.div
          dir="rtl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto p-6 text-gray-800 bg-gray-50 shadow-lg rounded-lg"
        >
          <h1 className="text-2xl font-extrabold text-center text-blue-600 mb-6">
            من نحن
          </h1>
          <p className="text-lg text-center mb-6">
            مرحبًا بكم في <strong>Stock-App</strong>، حلّكم الفعّال لإدارة المخزون.
          </p>

          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl font-semibold text-blue-500 mt-8 flex items-center"
          >
            <FaShieldAlt className="ml-2 text-blue-600" /> مهمتنا
          </motion.h2>
          <p className="text-lg mt-2">
            نلتزم بتقديم تجربة سريعة وآمنة ومريحة للمستخدم.
          </p>

          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl font-semibold text-blue-500 mt-8 flex items-center"
          >
            <FaShippingFast className="ml-2 text-blue-600" /> لماذا نحن؟
          </motion.h2>
          <ul className="mt-4 space-y-3">
            <motion.li
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <FaShieldAlt className="text-green-500 ml-2" /> منتجات عالية الجودة
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <FaShippingFast className="text-orange-500 ml-2" /> توصيل سريع وموثوق
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <FaHeadset className="text-blue-500 ml-2" /> دعم عملاء فعّال
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <FaMoneyCheckAlt className="text-purple-500 ml-2" /> دفع آمن
            </motion.li>
          </ul>

          <h2 className="text-xl font-semibold text-blue-500 mt-8 flex items-center">
            🔹 التقنيات المستخدمة
          </h2>
          <p className="mt-2 text-gray-700">
            ✅ Next.js 15 (الواجهة والباك إند) <br />
            ✅ Prisma (إدارة قاعدة البيانات) <br />
            ✅ PostgreSQL / SQLite <br />
            ✅ Tailwind CSS (تصميم عصري)
          </p>

          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-xl font-semibold text-blue-500 mt-8 flex items-center"
          >
            <FaPhone className="ml-2 text-blue-600" /> تواصل معنا
          </motion.h2>
          <div className="mt-4 space-y-3">
            <p className="flex items-center">
              <FaPhone className="text-green-500 ml-2 animate-pulse" /> +244 939 465 408
            </p>
            <p className="flex items-center">
              <FaEnvelope className="text-red-500 ml-2 animate-pulse" /> lamat032025@gmail.com
            </p>
            <p className="flex items-center">
              <FaMapMarkerAlt className="text-orange-500 ml-2 animate-pulse" /> 123 شارع الأمل، نواكشوط، موريتانيا
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
}
