"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Loader from "./components/Loader";

const Hero = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500); // Simule un chargement de 1.5s
  }, []);

  return (
    <section className="relative bg-gray-300 py-20 mt-5">
      <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center justify-between">
        {loading ? (
          // Loader
          <div className="w-full flex justify-center items-center min-h-[400px]">
            <Loader />
          </div>
        ) : (
          <>
            {/* Texte en arabe */}
            <div className="lg:w-1/2 text-center lg:text-right" dir="rtl">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                قم بإدارة <span className="text-green-600">مخزونك</span> <br /> بكل سهولة!
              </h1>
              <p className="mt-4 text-lg text-gray-700">
                تابع منتجاتك، وتحكم في مبيعاتك، وقم بتحسين مخزونك باستخدام حلنا العصري والسهل الاستخدام.
              </p>
              <div className="mt-6 flex justify-center lg:justify-end space-x-reverse space-x-4">
                <Link
                  href="/login"
                  className="px-6 py-3 text-white bg-green-600 rounded-lg hover:text-white hover:bg-blue-800 transition"
                >
                  ابدأ الآن
                </Link>
                <Link
                  href="/about"
                  className="px-6 py-3 text-green-600 border border-green-600 rounded-lg hover:bg-green-600 hover:text-white transition"
                >
                  معلومات
                </Link>
              </div>
            </div>

            {/* صورة */}
            <div className="lg:w-1/2 flex justify-center">
              <Image
                src="/R.jpg"
                alt="إدارة المخزون"
                width={500}
                height={500}
                className="drop-shadow-lg"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;
