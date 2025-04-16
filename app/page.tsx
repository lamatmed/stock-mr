"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Loader from "./components/Loader";
import { motion } from "framer-motion";

const Hero = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 py-24 md:py-32 overflow-hidden">
      {/* خلفية ديكورية */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full filter blur-3xl opacity-10 -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-10 -ml-32 -mb-32"></div>
      </div>

      <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 relative z-10">
        {loading ? (
          <div className="w-full flex justify-center items-center min-h-[400px]">
            <Loader />
          </div>
        ) : (
          <>
            {/* النص */}
            <motion.div
              className="lg:w-1/2 text-center lg:text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                قم بإدارة <span className="text-green-600">المخزون</span> الخاص بك <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                  بكل بساطة وسهولة
                </span>!
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-lg">
                تتبع منتجاتك، راقب مبيعاتك، وقم بتحسين مخزونك باستخدام حلنا الحديث والبديهي.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link
                  href="/login"
                  className="px-8 py-4 text-white bg-gradient-to-r from-green-600 to-green-700 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300 font-medium text-lg"
                >
                  ابدأ الآن
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-4 text-green-700 border-2 border-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300 font-medium text-lg"
                >
                  معرفة المزيد
                </Link>
              </div>
            </motion.div>

            {/* الصورة */}
            <motion.div
              className="lg:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                <Image
                  src="/R.jpg"
                  alt="رسم توضيحي لنشاط تجاري في نمو"
                  fill
                  className="rounded-2xl shadow-2xl object-cover"
                  priority
                />
                {/* تأثير ديكوري حول الصورة */}
                <div className="absolute inset-0 rounded-2xl border-4 border-green-500/20 transform rotate-6 scale-105 -z-10"></div>
                <div className="absolute inset-0 rounded-2xl border-4 border-blue-500/20 transform -rotate-6 scale-105 -z-10"></div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;
