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
      console.error("خطأ في جلب بيانات المستخدم:", error);
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
        title: "هل أنت متأكد من تسجيل الخروج؟",
        text: "سوف تحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حسابك.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3b82f6",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "نعم، سجل الخروج",
        cancelButtonText: "إلغاء",
      });

      if (!result.isConfirmed) return;

      await fetch("/api/logout", { method: "POST" });
      setUser(null);
      setAdmin(false);

      Swal.fire({
        icon: "success",
        title: "تم تسجيل الخروج بنجاح",
        text: "لقد تم تسجيل خروجك بنجاح.",
        confirmButtonText: "موافق",
      });
      router.push("/");

    } catch (error) {
      console.error("خطأ أثناء تسجيل الخروج:", error);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء محاولة تسجيل الخروج.",
        confirmButtonText: "موافق",
      });
    }
  };

  // Style commun pour les liens
  const navLinkStyle = "flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-black hover:bg-blue-50 hover:text-blue-600";
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
                <span className="text-blue-600">المخزن</span> المحلي
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
                        <span>المنتجات</span>
                      </Link>
                      <Link href="/commandes" className={navLinkStyle}>
                        <FiFileText className={`${iconStyle} text-green-500`} size={18} />
                        <span>الفواتير</span>
                      </Link>
                      <Link href="/update" className={navLinkStyle}>
                        <FiPlusSquare className={`${iconStyle} text-purple-500`} size={18} />
                        <span>إضافة</span>
                      </Link>
                    </>
                  )}

                  <Link href="/sales" className={navLinkStyle}>
                    <FiShoppingCart className={`${iconStyle} text-orange-500`} size={18} />
                    <span>بيع</span>
                  </Link>
                  <Link href="/stock" className={navLinkStyle}>
                    <FiPackage className={`${iconStyle} text-amber-500`} size={18} />
                    <span>المخزون</span>
                  </Link>
                  <Link href="/clients" className={navLinkStyle}>
                    <FiUsers className={`${iconStyle} text-emerald-500`} size={18} />
                    <span>العملاء</span>
                  </Link>
                  <Link href="/alerts" className={navLinkStyle}>
                    <FiAlertTriangle className={`${iconStyle} text-red-500`} size={18} />
                    <span>التنبيهات</span>
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
                <span>تسجيل الدخول</span>
              </Link>
            ) : (
              <>
                {admin && (
                  <div className="hidden md:flex items-center gap-2">
                    <Link href="/users" className={navLinkStyle}>
                      <FiUser className={`${iconStyle} text-indigo-500`} size={18} />
                      <span className="hidden lg:inline">المستخدمون</span>
                    </Link>
                    <Link href="/dashboard" className={navLinkStyle}>
                      <FiGrid className={`${iconStyle} text-teal-500`} size={18} />
                      <span className="hidden lg:inline">لوحة التحكم</span>
                    </Link>
                  </div>
                )}

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-gray-100 rounded-md hover:bg-gray-200 hover:text-red-500 transition-colors"
                >
                  <FiLogOut className="text-red-500" size={16} />
                  <span className="font-bold">تسجيل الخروج</span>
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
                      <span>المنتجات</span>
                    </div>
                  </Link>
                  <Link
                    href="/commandes"
                    className="block px-3 py-2 rounded-md text-gray-900 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <FiFileText className="text-green-500" size={18} />
                      <span>الفواتير</span>
                    </div>
                  </Link>
                  <Link
                    href="/update"
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <FiPlusSquare className="text-purple-500" size={18} />
                      <span>إضافة</span>
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
                  <span>بيع</span>
                </div>
              </Link>
              <Link
                href="/stock"
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <FiPackage className="text-amber-500" size={18} />
                  <span>المخزون</span>
                </div>
              </Link>
              <Link
                href="/clients"
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <FiUsers className="text-emerald-500" size={18} />
                  <span>العملاء</span>
                </div>
              </Link>
              <Link
                href="/alerts"
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <FiAlertTriangle className="text-red-500" size={18} />
                  <span>التنبيهات</span>
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
                      <span>المستخدمون</span>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <FiGrid className="text-teal-500" size={18} />
                      <span>لوحة التحكم</span>
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
              <span>تسجيل الدخول</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;