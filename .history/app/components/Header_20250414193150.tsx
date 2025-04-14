'use client';
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
      console.error("خطأ في جلب المستخدم:", error);
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
        title: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
        text: "ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حسابك.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "نعم، تسجيل الخروج",
        cancelButtonText: "إلغاء",
      });

      if (!result.isConfirmed) return;

      await fetch("/api/logout", { method: "POST" });
      setUser(null);
      setAdmin(false);

      Swal.fire({
        icon: "success",
        title: "تم تسجيل الخروج بنجاح",
        text: "تم تسجيل خروجك بنجاح.",
        confirmButtonText: "موافق",
      });

      router.push("/");
    } catch (error) {
      console.error("خطأ أثناء تسجيل الخروج:", error);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء تسجيل الخروج.",
        confirmButtonText: "موافق",
      });
    }
  };

  return (
    <header className="bg-gray-200">
      <nav className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image src={logo} alt="stok-app" width={50} height={50} />
            </Link>
            <div className="hidden md:block">
              <div className="flex items-baseline ml-10 space-x-4">
                {user && (
                  <>
                    {admin && (
                      <>
                        <Link href="/products" className="px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                          <FaProductHunt className="text-blue-500" size={24} /> المنتجات
                        </Link>
                        <Link href="/commandes" className="px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                          <FaFileInvoiceDollar className="text-blue-500" size={24} /> الفواتير
                        </Link>
                        <Link href="/update" className="px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                          <MdAddBox className="text-blue-500" size={24} /> إضافة
                        </Link>
                      </>
                    )}
                    <Link href="/sales" className="px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                      <FaCartShopping className="text-blue-500" size={24} /> بيع
                    </Link>
                    <Link href="/stock" className="px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                      <MdProductionQuantityLimits className="text-blue-500" size={24} /> المخزون
                    </Link>
                    <Link href="/clients" className="px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                      <FaUsersBetweenLines className="text-blue-500" size={24} /> الزبائن
                    </Link>
                    <Link href="/alerts" className="px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                      <FiAlertTriangle className="text-red-500" size={24} /> التنبيهات
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center ml-auto">
            {!user && (
              <Link href="/login" className="mr-3 text-gray-900 hover:bg-blue-600 font-bold">
                <FaSignInAlt className="inline mr-1 text-green-700 text-2xl" /> تسجيل الدخول
              </Link>
            )}
            {user && (
              <>
                {admin && (
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4">
                    <Link href="/users" className="flex items-center text-gray-900 hover:bg-blue-200 font-bold p-1 sm:p-2 rounded text-sm sm:text-base">
                      <FaUserTie className="mr-1 sm:mr-2 text-blue-700" size={24} /> المستخدمين
                    </Link>
                    <Link href="/dashboard" className="flex items-center text-gray-900 hover:bg-blue-200 font-bold p-1 sm:p-2 rounded text-sm sm:text-base">
                      <LuLayoutDashboard className="mr-1 sm:mr-2 text-green-700" size={24} /> لوحة التحكم
                    </Link>
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="mx-3 text-gray-900 hover:bg-blue-200 font-bold"
                >
                  <FaSignOutAlt className="inline mr-1 text-red-700 text-2xl" /> تسجيل الخروج
                </button>
              </>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 md:hidden hover:text-gray-600"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="bg-gray-200 md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user && (
              <>
                {admin && (
                  <>
                    <Link href="/products" className="block px-3 py-2 text-base font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                      <FaProductHunt className="inline mr-1" /> المنتجات
                    </Link>
                    <Link href="/commandes" className="block px-3 py-2 text-base font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                      <FaFileInvoiceDollar className="inline mr-1" /> الفواتير
                    </Link>
                    <Link href="/update" className="block px-3 py-2 text-base font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                      <MdAddBox className="inline mr-1" /> إضافة
                    </Link>
                  </>
                )}
                <Link href="/stock" className="block px-3 py-2 text-base font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                  <MdProductionQuantityLimits className="inline mr-1" /> المخزون
                </Link>
                <Link href="/sales" className="block px-3 py-2 text-base font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                  <FaCartShopping className="inline mr-1" /> بيع
                </Link>
                <Link href="/clients" className="block px-3 py-2 text-base font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                  <FaUsersBetweenLines className="inline mr-1" /> الزبائن
                </Link>
                <Link href="/alerts" className="block px-3 py-2 text-base font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                  <FiAlertTriangle className="text-red-500 inline mr-2" /> التنبيهات
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
