/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getAllProducts, updateQuantitePrice } from "../utlis/actions";
import { useRouter } from "next/navigation";
import { RiStickyNoteAddFill } from "react-icons/ri";
import Loader from "../components/Loader";

type Product = {
  id: string;
  code: number;
  name: string;
  quantity: number;
  price_v: number;
  price_a: number;
  expirationDate: Date;
  codeBar: string | null;
};

export default function UpdateProductPageAr() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number | "">("");
  const [priceV, setPriceV] = useState<number | "">("");
  const [priceA, setPriceA] = useState<number | "">("");
  const [user, setUser] = useState(null);
  const router = useRouter();
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
        console.error("خطأ في جلب المستخدم:", error);
        router.push("/login");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await getAllProducts();
    setProducts(data);
  };

  useEffect(() => {
    if (search.trim() !== "") {
      const foundProduct = products.find(
        (p) => p.code.toString() === search || p.codeBar === search
      );

      if (foundProduct) {
        setSelectedProduct(foundProduct);
        setQuantity(0);
        setPriceV(foundProduct.price_v);
        setPriceA(foundProduct.price_a);
      } else {
        setSelectedProduct(null);
      }
    } else {
      setSelectedProduct(null);
    }
  }, [search, products]);

  const handleUpdate = async () => {
    if (!selectedProduct) return;

    if (Number(quantity) < 0) {
      Swal.fire("خطأ", "لا يمكن أن تكون الكمية سالبة", "error");
      return;
    }

    if (Number(priceV) < Number(priceA)) {
      Swal.fire("خطأ", "سعر البيع لا يمكن أن يكون أقل من سعر الشراء", "error");
      return;
    }

    const newQuantity = selectedProduct.quantity + Number(quantity);

    const result = await updateQuantitePrice(
      selectedProduct.id,
      newQuantity,
      Number(priceV),
      Number(priceA)
    );

    if (result.success) {
      Swal.fire("تم", "تم تحديث المنتج بنجاح!", "success");
      fetchProducts();
      setSelectedProduct(null);
      setSearch("");
    } else {
      Swal.fire("خطأ", "فشل في تحديث المنتج", "error");
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
    <div className="max-w-md mx-auto p-4 border rounded shadow mt-10 bg-white text-black" dir="rtl">
      <h2 className="text-lg font-bold mb-4 text-center">تحديث منتج</h2>

      <button
        className="bg-blue-800 text-white p-3 rounded flex items-center gap-2 hover:bg-blue-600"
        onClick={() => router.push("/products/add")}
      >
        منتج جديد
      </button>

      <label className="block mb-2 mt-4">
        الرمز أو الباركود:
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded mt-1"
          placeholder="أدخل الرمز أو الباركود"
        />
      </label>

      {selectedProduct && (
        <div className="mt-4">
          <h3 className="text-md font-bold">المنتج: {selectedProduct.name}</h3>

          <label className="block mt-2">
            الكمية المراد إضافتها:
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const value = e.target.value;
                setQuantity(value === "" ? "" : Number(value));
              }}
              className="w-full p-2 border rounded mt-1"
              min="0"
            />
          </label>

          <label className="block mt-2">
            سعر البيع:
            <input
              type="number"
              value={priceV}
              onChange={(e) => {
                const value = e.target.value;
                setPriceV(value === "" ? "" : Number(value));
              }}
              className="w-full p-2 border rounded mt-1"
              min={priceA}
            />
          </label>

          <label className="block mt-2">
            سعر الشراء:
            <input
              type="number"
              value={priceA}
              onChange={(e) => {
                const value = e.target.value;
                setPriceA(value === "" ? "" : Number(value));
              }}
              className="w-full p-2 border rounded mt-1"
              min="0"
            />
          </label>

          <button
            onClick={handleUpdate}
            className="w-full bg-blue-500 text-white py-2 rounded mt-4 hover:bg-blue-700"
          >
            <RiStickyNoteAddFill className="inline ml-2 text-2xl" />
            تحديث المنتج
          </button>
        </div>
      )}
    </div>
  );
}
