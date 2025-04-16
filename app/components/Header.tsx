'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/lok.jpg";
import {
  FiAlertTriangle,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiX,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiUser,
  FiPlusSquare,
  FiFileText,
  FiGrid,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  FiSettings
} from "react-icons/fi";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface User {
  nom: string;
  admin: boolean;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState(false);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setAdmin(userData.admin);
      } else {
        setUser(null);
        setAdmin(false);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      setUser(null);
      setAdmin(false);
    }
  };

  useEffect(() => {
    fetchUser();
    const interval = setInterval(fetchUser, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    try {
      const result = await Swal.fire({
        title: "Êtes-vous sûr de vouloir vous déconnecter ?",
        text: "Vous devrez vous reconnecter pour accéder à votre compte.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3b82f6",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Oui, déconnecter",
        cancelButtonText: "Annuler",
      });

      if (!result.isConfirmed) return;

      await fetch("/api/logout", { method: "POST" });
      setUser(null);
      setAdmin(false);

      Swal.fire({
        icon: "success",
        title: "Déconnexion réussie",
        text: "Vous avez été déconnecté avec succès.",
        confirmButtonText: "OK",
      });
      router.push("/");

    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de la déconnexion.",
        confirmButtonText: "OK",
      });
    }
  };

  // Style commun pour les liens
  const navLinkStyle = "flex items-center gap-2 px-3 py-2 rounded-md transition-colors hover:bg-blue-50 hover:text-blue-600";
  const iconStyle = "flex-shrink-0";

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <nav className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo et navigation principale */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logo}
                alt="StockLocal"
                height={40}
                width={40}
                className="rounded-lg"
              />
              <span className="text-xl font-semibold text-gray-800 hidden sm:block">
                Stock<span className="text-blue-600">Local</span>
              </span>
            </Link>

            {/* Navigation desktop */}
            <div className="hidden md:flex items-center gap-1">
              {user && (
                <>
                  {admin && (
                    <>
                      <Link href="/products" className={navLinkStyle}>
                        <FiPackage className={`${iconStyle} text-blue-500`} size={18} />
                        <span>Produits</span>
                      </Link>
                      <Link href="/commandes" className={navLinkStyle}>
                        <FiFileText className={`${iconStyle} text-green-500`} size={18} />
                        <span>Factures</span>
                      </Link>
                      <Link href="/update" className={navLinkStyle}>
                        <FiPlusSquare className={`${iconStyle} text-purple-500`} size={18} />
                        <span>Ajouter</span>
                      </Link>
                    </>
                  )}

                  <Link href="/sales" className={navLinkStyle}>
                    <FiShoppingCart className={`${iconStyle} text-orange-500`} size={18} />
                    <span>Vendre</span>
                  </Link>
                  <Link href="/stock" className={navLinkStyle}>
                    <FiPackage className={`${iconStyle} text-amber-500`} size={18} />
                    <span>Stock</span>
                  </Link>
                  <Link href="/clients" className={navLinkStyle}>
                    <FiUsers className={`${iconStyle} text-emerald-500`} size={18} />
                    <span>Clients</span>
                  </Link>
                  <Link href="/alerts" className={navLinkStyle}>
                    <FiAlertTriangle className={`${iconStyle} text-red-500`} size={18} />
                    <span>Alertes</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-4">
            {!user ? (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                <FiLogIn size={16} />
                <span>Connexion</span>
              </Link>
            ) : (
              <>
                {admin && (
                  <div className="hidden md:flex items-center gap-2">
                    <Link href="/users" className={navLinkStyle}>
                      <FiUser className={`${iconStyle} text-indigo-500`} size={18} />
                      <span className="hidden lg:inline">Utilisateurs</span>
                    </Link>
                    <Link href="/dashboard" className={navLinkStyle}>
                      <FiGrid className={`${iconStyle} text-teal-500`} size={18} />
                      <span className="hidden lg:inline">Dashboard</span>
                    </Link>
                  </div>
                )}

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <FiLogOut className="text-red-500" size={16} />
                  <span>Déconnexion</span>
                </button>
              </>
            )}

            {/* Bouton menu mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-500 rounded-md md:hidden hover:text-gray-700 hover:bg-gray-100"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="px-4 pt-2 pb-4 space-y-1 md:hidden bg-white border-t border-gray-100">
          {user ? (
            <>
              {admin && (
                <>
                  <Link
                    href="/products"
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <FiPackage className="text-blue-500" size={18} />
                      <span>Produits</span>
                    </div>
                  </Link>
                  <Link
                    href="/commandes"
                    className="block px-3 py-2 rounded-md text-gray-900 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <FiFileText className="text-green-500" size={18} />
                      <span>Factures</span>
                    </div>
                  </Link>
                  <Link
                    href="/update"
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <FiPlusSquare className="text-purple-500" size={18} />
                      <span>Ajouter</span>
                    </div>
                  </Link>
                </>
              )}

              <Link
                href="/sales"
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <FiShoppingCart className="text-orange-500" size={18} />
                  <span>Vendre</span>
                </div>
              </Link>
              <Link
                href="/stock"
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <FiPackage className="text-amber-500" size={18} />
                  <span>Stock</span>
                </div>
              </Link>
              <Link
                href="/clients"
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <FiUsers className="text-emerald-500" size={18} />
                  <span>Clients</span>
                </div>
              </Link>
              <Link
                href="/alerts"
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <FiAlertTriangle className="text-red-500" size={18} />
                  <span>Alertes</span>
                </div>
              </Link>

              {admin && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link
                    href="/users"
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <FiUser className="text-indigo-500" size={18} />
                      <span>Utilisateurs</span>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <FiGrid className="text-teal-500" size={18} />
                      <span>Dashboard</span>
                    </div>
                  </Link>
                </>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 px-3 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <FiLogIn size={16} />
              <span>Connexion</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;