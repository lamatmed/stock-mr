'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/lok.jpg";
import { FaSignInAlt, FaSignOutAlt, FaBars, FaTimes, FaProductHunt, FaFileInvoiceDollar, FaUserTie } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdAddBox, MdProductionQuantityLimits } from "react-icons/md";
import { FaCartShopping, FaUsersBetweenLines } from "react-icons/fa6";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { FiAlertTriangle } from "react-icons/fi";

interface User {
  nom: string;
  admin: boolean;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);  // Spécifier le type User ou null
  const [admin, setAdmin] = useState(false);
  const router = useRouter();
  // Fonction pour récupérer l'utilisateur connecté depuis une API ou un stockage
  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user"); // Ton endpoint pour récupérer l'utilisateur connecté
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);  // Mettez à jour l'état avec les données de l'utilisateur
        setAdmin(userData.admin);  // Si l'utilisateur est admin, mettre à jour l'état
      } else {
        setUser(null);  // En cas d'erreur, déconnecter l'utilisateur
        setAdmin(false);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      setUser(null);
      setAdmin(false);
    }
  };

  useEffect(() => {
    fetchUser(); // Charger l'utilisateur au montage du composant
  
    // Vérifier l'état de l'utilisateur toutes les 5 secondes
    const interval = setInterval(fetchUser, 5000);
  
    return () => clearInterval(interval); // Nettoyer l'intervalle quand le composant se démonte
  }, []);
  

  // Déconnexion de l'utilisateur
 

  const handleSignOut = async () => {
    try {
      // Demander confirmation avant la déconnexion
      const result = await Swal.fire({
        title: "Êtes-vous sûr de vouloir vous déconnecter ?",
        text: "Vous devrez vous reconnecter pour accéder à votre compte.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Oui, déconnecter",
        cancelButtonText: "Annuler",
      });
  
      if (!result.isConfirmed) {
        return; // Si l'utilisateur annule, on arrête ici
      }
  
      // Effectuer la déconnexion
      await fetch("/api/logout", { method: "POST" });
      setUser(null);
      setAdmin(false);
  
      // Afficher une confirmation après déconnexion
      Swal.fire({
        icon: "success",
        title: "Déconnexion réussie",
        text: "Vous avez été déconnecté avec succès.",
        confirmButtonText: "OK",
      });
      // Rediriger vers la page d'accueil
    router.push("/");
  
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
  
      // Afficher une alerte en cas d'erreur
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de la déconnexion.",
        confirmButtonText: "OK",
      });
    }
  };
  
  

  return (
    <header className="bg-gray-200">
      <nav className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image  src={logo} alt="stok-app" width={50}  height={50}/>
            </Link>
            <div className="hidden md:block">
              <div className="flex items-baseline ml-10 space-x-4">
             
                {user && (
                  <>

                     {admin && (
                        <>
                          <Link href="/products" className="px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                           <FaProductHunt className="text-blue-500" size={24}/>Produits
                         </Link>
                        <Link href="/commandes" className="px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                         <FaFileInvoiceDollar  className="text-blue-500"size={24}/>Factures
                       </Link>
                        <Link href="/update" className="px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                          <MdAddBox className="text-blue-500" size={24}/>Ajouter
                         </Link>
                        </>
                       )}
                  
                    <Link href="/sales" className="px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                    <FaCartShopping className="text-blue-500"size={24} />Vendre
                    </Link>
                    <Link href="/stock" className="px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                      <MdProductionQuantityLimits className="text-blue-500" size={24}/>Stock
                    </Link>
                    <Link href="/clients" className="px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                    <FaUsersBetweenLines  className="text-blue-500"size={24} />Clients
                    </Link>
                    <Link href="/alerts" className="px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                     <FiAlertTriangle className="text-red-500" size={24} />
                      Alerts
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Menu Droite */}
          <div className="flex items-center ml-auto">
            {!user && (
              <>
                <Link href="/login" className="mr-3 text-gray-900 hover:bg-blue-600 font-bold">
                  <FaSignInAlt className="inline mr-1 text-green-700 text-2xl" /> Connexion
                </Link>
              </>
            )}

{user && (
  <>
    {admin && (
      <>
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4">
  <Link href="/users" className="flex items-center text-gray-900 hover:bg-blue-200 font-bold p-1 sm:p-2 rounded text-sm sm:text-base">
    <FaUserTie className="mr-1 sm:mr-2 text-blue-700" size={window.innerWidth >= 640 ? 24 : 20} />
    Users
  </Link>
  <Link href="/dashboard" className="flex items-center text-gray-900 hover:bg-blue-200 font-bold p-1 sm:p-2 rounded text-sm sm:text-base">
  <LuLayoutDashboard
  className="mr-1 sm:mr-2 text-green-700"
  size={window.innerWidth >= 640 ? 24 : 20} // Adapte la taille selon l'écran
/>
    Dashboard
  </Link>
</div>


    </>
      
    )}
    <button
      onClick={handleSignOut}
      className="mx-3 text-gray-900 hover:bg-blue-200 font-bold"
    >
      <FaSignOutAlt className="inline mr-1 text-red-700 text-2xl" /> Déconnexion
    </button>
  </>
)}


            {/* Bouton Menu Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 md:hidden hover:text-gray-600"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-gray-200 md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            
            {user && (
                                
              <>   
                    {admin && (
                          <>
                    <Link href="/products" className="block px-3 py-2 text-base font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                  <FaProductHunt className="inline mr-1 " />Produits
                   </Link>
                   <Link href="/commandes" className="block px-3 py-2 text-base font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                  <FaFileInvoiceDollar className="inline mr-1" />Facutres
                   </Link>
                   <Link href="/update" className="block px-3 py-2 text-base font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white ">
                  <MdAddBox className="inline mr-1" /> Ajouter
                    </Link>
                           </>
                           )}
              <Link href="/stock" className="block px-3 py-2 text-base font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                  <MdProductionQuantityLimits className="inline mr-1" />Stock
                  </Link>
                   <Link href="/sales" className="block px-3 py-2 text-base font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                   <FaCartShopping className="inline mr-1" />Vendre
                   </Link>
                   <Link href="/clients" className="block px-3 py-2 text-base font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                   <FaUsersBetweenLines  className="inline mr-1" />Clients
                   </Link>
                  <Link href="/alerts" className="block px-3 py-2 text-base font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                  <FiAlertTriangle className="text-red-500 inline mr-2" />
                  Alerts
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
