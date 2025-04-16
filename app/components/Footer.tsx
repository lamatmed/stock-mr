'use client';

import Link from "next/link";
import { FiAlertCircle, FiPackage, FiInfo, FiMail, FiGithub, FiLinkedin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="w-full py-8 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="flex flex-col md:flex-row items-center justify-between px-6 mx-auto max-w-7xl gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">
          {/* Logo et description */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="group">
              <span className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                Stock<span className="text-blue-600">Local</span>
              </span>
            </Link>
            <p className="mt-2 text-sm text-gray-600 max-w-xs text-center md:text-left">
              Simplifiez votre gestion d&lsquo;inventaire avec notre solution intuitive et puissante.
            </p>

            {/* Réseaux sociaux */}
            <div className="flex gap-4 mt-4">
              <Link href="mailto:contact@example.com" className="text-gray-500 hover:text-blue-600 transition-colors">
                <FiMail size={18} />
              </Link>
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800 transition-colors">
                <FiGithub size={18} />
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700 transition-colors">
                <FiLinkedin size={18} />
              </Link>
            </div>
          </div>

          {/* Liens rapides */}
          <div className="flex flex-wrap justify-center gap-8">
            <Link href="/alerts" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors group">
              <FiAlertCircle className="group-hover:scale-110 transition-transform" />
              <span>Alertes</span>
            </Link>
            <Link href="/stock" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors group">
              <FiPackage className="group-hover:scale-110 transition-transform" />
              <span>Stock</span>
            </Link>
            <Link href="/about" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors group">
              <FiInfo className="group-hover:scale-110 transition-transform" />
              <span>À propos</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} <span className="font-semibold text-blue-600">RIM TECHNOLOGIE</span>. Tous droits réservés.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Conçu par <span className="font-semibold text-gray-700">Lamat Abdellahi</span> avec ❤️
        </p>
      </div>
    </footer>
  );
};

export default Footer;