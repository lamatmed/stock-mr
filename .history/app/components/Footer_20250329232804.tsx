'use client';

import Link from "next/link";

const Footer = () => {
  return (
    <footer className=" w-full py-5 bg-gray-200 shadow-md">
			<div className="flex flex-col md:flex-row items-center justify-between px-6 mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          {/* Logo et description */}
          <div className="mb-4 sm:mb-0">
            <Link href="/">
              <span className="text-lg font-bold text-blue-900">Stock-local</span>
            </Link>
            <p className="mt-2 text-sm text-gray-700">
              Simplifiez votre gestion avec notre application intuitive.
            </p>
          </div>

          {/* Liens rapides */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
           
            <Link href="/alerts" className="text-black hover:bg-blue-300 transition">
              Alerts
            </Link>
            <Link href="/stock" className="text-black hover:bg-blue-300 transition">
              Stock
            </Link>
            <Link href="/about" className="text-black hover:bg-blue-300 transition">
              Infos
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t border-black pt-4 text-center">
          <p className="text-xs text-gray-700">
            © {new Date().getFullYear()}  <span className="text-primary font-bold">RIM TECHNOLOGIE.</span> Tous droits réservés.
          </p>
          <p className="text-xs text-gray-700">
            Conçu par <span className=" font-bold">Lamat Abdellahi</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
