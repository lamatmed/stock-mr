/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Link from "next/link";
import { FiAlertCircle, FiPackage, FiInfo, FiMail, FiGithub, FiLinkedin, FiHome } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-100 shadow-sm" dir="rtl">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                ستوك<span className="text-blue-600">لوكال</span>
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              حل متكامل لإدارة المخزون لتحسين أعمالك.
            </p>
            <div className="flex space-x-4">
              <Link
                href="mailto:contact@example.com"
                className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                aria-label="الاتصال عبر البريد الإلكتروني"
              >
                <FiMail size={20} />
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-800 transition-colors duration-200"
                aria-label="حساب جيت هاب"
              >
                <FiGithub size={20} />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-700 transition-colors duration-200"
                aria-label="حساب لينكد إن"
              >
                <FiLinkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
              التنقل
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
              >
                <span>الصفحة الرئيسية</span>
                <FiHome className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href="/alerts"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
              >
                <span>التنبيهات</span>
                <FiAlertCircle className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href="/stock"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
              >
                <span>المخزون</span>
                <FiPackage className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
              الشركة
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/about"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                عن الشركة
              </Link>
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                سياسة الخصوصية
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                شروط الاستخدام
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
              اتصل بنا
            </h3>
            <address className="not-italic text-gray-600 space-y-3">
              <p className="text-sm">123 شارع المثال</p>
              <p className="text-sm">نواكشوط، موريتانيا</p>
              <p className="text-sm">contact@rimtechnologie.com</p>
              <p className="text-sm">+222 36 12 34 56</p>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} <span className="font-semibold text-blue-600">ريم تكنولوجي</span>. جميع الحقوق محفوظة.
          </p>
          <p className="text-xs text-gray-500 mt-2 md:mt-0">
            صمم بواسطة <span className="font-semibold text-gray-700">لمات عبد الله</span> ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;