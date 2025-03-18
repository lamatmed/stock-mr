"use client";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" w-full py-5 bg-gray-200 shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between px-6 mx-auto max-w-7xl">
        {/* Texte Copyright */}
        <p className="text-sm text-center md:text-left text-black">
  &copy; {currentYear } <span className="font-semibold">Stock-Local</span>. Tous droits réservés.
  Développeur : <span className="font-semibold">Lamat Abdellahi</span>
</p>


        {/* Icônes Réseaux Sociaux */}
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="text-gray-800 hover:text-blue-600 text-xl transition" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-gray-800 hover:text-blue-400 text-xl transition" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-gray-800 hover:text-blue-700 text-xl transition" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-gray-800 hover:text-gray-900 text-xl transition" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
