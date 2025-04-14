/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { addProduct, getLastProductCode } from "@/app/utlis/actions";
import { IoIosAddCircle } from "react-icons/io";
import Loader from "@/app/components/Loader";

export default function AddProductAr() {
  const router = useRouter();
  const [code, setCode] = useState<string>("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price_v, setPriceV] = useState("");
  const [price_a, setPriceA] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [expirationDate, setExpirationDate] = useState(today);
  const [codeBar, setCodeBar] = useState("");
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          if (!userData.admin) {
            router.push("/");
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("خطأ في التحقق من المستخدم:", error);
        router.push("/login");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchLastCode = async () => {
      try {
        const lastCode: number | null = await getLastProductCode();
        const newCode = lastCode !== null ? lastCode + 1 : 1;
        setCode(newCode.toString());
      } catch (error) {
        console.error("خطأ في جلب آخر كود:", error);
      }
    };
    fetchLastCode();
  }, []);

  const generateUniqueBarcode = () => {
    return `BC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const handleAddProduct = async () => {
    if (!code || !name || !quantity || !price_v || !price_a || !expirationDate) {
      Swal.fire({
        icon: "warning",
        title: "حقول ناقصة",
        text: "يرجى ملء جميع الحقول!",
      });
      return;
    }

    if (parseInt(quantity) < 0) {
      Swal.fire({
        icon: "error",
        title: "قيمة غير صالحة",
        text: "لا يمكن أن تكون الكمية سالبة!",
      });
      return;
    }

    if (parseFloat(price_v) <= parseFloat(price_a)) {
      Swal.fire({
        icon: "error",
        title: "خطأ في السعر",
        text: "سعر البيع يجب أن يكون أكبر من سعر الشراء!",
      });
      return;
    }

    const finalCodeBar = codeBar.trim() !== "" ? codeBar : generateUniqueBarcode();

    try {
      const result = await Swal.fire({
        title: "هل تريد إضافة هذا المنتج؟",
        text: "تأكد من صحة المعلومات قبل الإضافة",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "نعم، أضف",
        cancelButtonText: "إلغاء",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "جاري الإضافة...",
        text: "يرجى الانتظار",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(Swal.getConfirmButton());
        },
      });

      const response = await addProduct(
        parseInt(code),
        name,
        parseInt(quantity),
        parseFloat(price_v),
        parseFloat(price_a),
        expirationDate,
        finalCodeBar
      );

      Swal.close();

      if (response.error) {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: response.error,
        });
        return;
      }

      toast.success("تمت إضافة المنتج بنجاح!");
      router.push("/products");
    } catch (error) {
      Swal.close();
      toast.error("حدث خطأ أثناء الإضافة!");
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-white mt-5" dir="rtl">
      <h1 className="text-2xl font-bold mb-4 text-center text-black">منتج جديد</h1>

      <div className="bg-white shadow-md rounded-lg p-4">
        <input
          className="border p-2 w-full mb-2 rounded placeholder:text-black text-black"
          placeholder="كود الباركود (اختياري)"
          value={codeBar}
          onChange={(e) => setCodeBar(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2 rounded placeholder:text-black text-black"
          type="number"
          placeholder="الكود"
          value={code}
          readOnly
        />
        <input
          className="border p-2 w-full mb-2 rounded placeholder:text-black text-black"
          placeholder="اسم المنتج"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2 placeholder:text-black text-black"
          type="number"
          placeholder="الكمية"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2 placeholder:text-black text-black"
          type="number"
          placeholder="سعر البيع"
          value={price_v}
          onChange={(e) => setPriceV(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2 placeholder:text-black text-black"
          type="number"
          placeholder="سعر الشراء"
          value={price_a}
          onChange={(e) => setPriceA(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2 text-black"
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value || today)}
        />

        <button
          className="bg-blue-500 text-white p-2 rounded w-full mt-2 hover:bg-blue-700"
          onClick={handleAddProduct}
        >
          <IoIosAddCircle className="inline ml-2 text-2xl" />
          إضافة المنتج
        </button>
      </div>
    </div>
  );
}
