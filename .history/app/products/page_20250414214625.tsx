/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { getAllProducts, deleteProduct, deleteAllProducts } from '../utlis/actions';
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";
import { MdOutlineDelete } from "react-icons/md";
import Swal from "sweetalert2"
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import { IoIosAddCircle } from "react-icons/io";
type Product = {
  id: string;
  code: number;
  name: string;
  quantity: number;
  price_v: number;
  price_a: number;
  expirationDate: string;
  codeBar?: string | null;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const router = useRouter();
  const [user, setUser] = useState(null);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user'); // Endpoint pour récupérer l'utilisateur
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);

          // 🔐 Vérifie si l'utilisateur n'est pas admin
          if (!userData.admin) {
            router.push('/'); // Redirige vers l'accueil si pas admin
          }
        } else {
          router.push('/login'); // Redirige vers login si non connecté
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        router.push('/login'); // Redirige en cas d'erreur
      }
    };

    setTimeout(fetchUser, 1000); // Attendre 1 seconde avant d'exécuter fetchUser
  }, []);


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getAllProducts();
    const formattedData = data.map((product) => ({
      ...product,
      expirationDate: new Date(product.expirationDate).toISOString().split("T")[0],
    }));
    setProducts(formattedData);
    setFilteredProducts(formattedData);
    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    const result = await Swal.fire({
      title: "Supprimer le produit ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      await deleteProduct(id);
      fetchProducts();
      toast.success("Produit supprimé avec succès !");
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Supprimer tous les produits ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteAllProducts();

        if (response.success) {
          toast.success("Tous les produits ont été supprimés avec succès !");
          fetchProducts(); // Rafraîchir la liste des produits
        } else {
          toast.error(response.error || "Une erreur est survenue.");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast.error("Une erreur est survenue.");
      }
    }
  };



  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const filtered = products.filter((p) =>
      p.code.toString().toLowerCase().includes(e.target.value.toLowerCase())
      ||
      p.codeBar?.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="mx-auto p-4 bg-white w-full max-w-2xl mt-5">
      <h1 className="text-2xl font-bold mb-4 text-center text-black">v</h1>

      <button
        className="bg-green-800 text-white p-2 rounded w-full mb-4 hover:bg-green-600"
        onClick={() => router.push("/products/add")}
      >
        <IoIosAddCircle className="inline mr-2  text-2xl" />منتج جديد
      </button>

      <input
        className="border p-2 w-full mb-4 rounded text-black placeholder:text-black"
        type="text"
        placeholder="البحث عن طريق الرمز أو الرمز الشريطي..."
        value={search}
        onChange={handleSearch}
      />

      {loading ? (
        <Loader />
      ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">لم يتم العثور على منتجات</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
                  <tr className="bg-white text-right text-sm">
                    <th className="p-2 text-black">الرمز الشريطي</th>
                    <th className="p-2 text-black">الرمز</th>
                    <th className="p-2 text-black">الاسم</th>
                    <th className="p-2 text-black">الكمية</th>
                    <th className="p-2 text-black">السعر (مبيع)</th>
                    <th className="p-2 text-black">السعر (شراء)</th>
                    <th className="p-2 text-black">انتهاء</th>
                    <th className="p-2 text-center text-black">العمليات</th>
                  </tr>

            </thead>
            <tbody>
              {currentProducts.map((p) => (
                <tr key={p.id} className="border-t text-sm bg-white">
                  <td className="p-2 text-black">{p.codeBar}</td>
                  <td className="p-2 text-black">{p.code}</td>
                  <td className="p-2 text-black">{p.name}</td>
                  <td className="p-2 text-black">{p.quantity}</td>
                  <td className="p-2 text-black">{p.price_v}</td>
                  <td className="p-2 text-black">{p.price_a}</td>
                  <td className="p-2 text-black">{p.expirationDate}</td>
                  <td className="p-2 flex justify-center space-x-2">
                    <button
                      className="bg-yellow-700 text-white px-3 py-1 rounded hover:bg-yellow-400"
                      onClick={() => router.push(`/products/${p.id}`)}
                    >
                      <FaEdit className="text-xl" />
                    </button>
                    <button
                      className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-400"
                      onClick={() => handleDeleteProduct(p.id)}
                    >
                      <MdOutlineDelete className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t font-bold bg-white">
                <td className="p-2 text-black">Total</td>
                <td className="p-2"></td>
                <td className="p-2"></td>
                <td className="p-2 text-black">{filteredProducts.reduce((acc, p) => acc + p.quantity, 0)}</td>
                <td className="p-2"></td>
                <td className="p-2 text-black">
                  {filteredProducts.reduce((acc, p) => acc + p.price_a * p.quantity, 0)} MRU
                </td>
                <td className="p-2"> </td>
                <td className="p-2"></td>
              </tr>
            </tfoot>

          </table>

        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            className={`px-3 py-1 border rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <span className="px-3 py-1">{currentPage} / {totalPages}</span>
          <button
            className={`px-3 py-1 border rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}

      <button
        onClick={handleDelete}

        className=" text-white p-2 rounded w-full mb-4 hover:bg-red-700"
      >
        <FiAlertTriangle className="w-5 h-5 bg-red-600 animate-bounce" />Supprimer tous les produits
      </button>
    </div>
  );
}
