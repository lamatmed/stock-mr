'use client';

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full py-5 bg-gray-200 shadow-md" dir="rtl">
      <div className="flex flex-col md:flex-row items-center justify-between px-6 mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          {/* الشعار والوصف */}
          <div className="mb-4 sm:mb-0 text-center sm:text-right">
            <Link href="/">
              <span className="text-lg font-bold text-blue-900">ستوك-لوكال</span>
            </Link>
            <p className="mt-2 text-sm text-gray-700">
              سهّل إدارة متجرك مع تطبيقنا السهل والبسيط.
            </p>
          </div>

          {/* روابط سريعة */}
          <div className="flex flex-wrap justify-center gap-6 text-sm mt-4 sm:mt-0">
            <Link href="/alerts" className="text-black hover:bg-blue-300 transition">
              التنبيهات
            </Link>
            <Link href="/stock" className="text-black hover:bg-blue-300 transition">
              المخزون
            </Link>
            <Link href="/about" className="text-black hover:bg-blue-300 transition">
              معلومات
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t border-black pt-4 text-center w-full">
          <p className="text-xs text-gray-700">
            © {new Date().getFullYear()} <span className="text-primary font-bold">RIM TECHNOLOGIE.</span> جميع الحقوق محفوظة.
          </p>
          <p className="text-xs text-gray-700">
            تصميم: <span className="font-bold">لمات عبد اللي</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
