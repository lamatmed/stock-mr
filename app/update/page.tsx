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

export default function UpdateProductPage() {
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
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          if (!userData.admin) {
            router.push('/');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        router.push('/login');
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

  // Recherche automatique du produit
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
      Swal.fire("Erreur", "La quantité ne peut pas être négative.", "error");
      return;
    }

    if (Number(priceV) < Number(priceA)) {
      Swal.fire("Erreur", "Le prix de vente ne peut pas être inférieur au prix d'achat.", "error");
      return;
    }

    const newQuantity = selectedProduct.quantity + Number(quantity);

    const result = await updateQuantitePrice(selectedProduct.id, newQuantity, Number(priceV), Number(priceA));

    if (result.success) {
      Swal.fire("Succès", "Produit mis à jour avec succès !", "success");
      fetchProducts();
      setSelectedProduct(null);
      setSearch("");
    } else {
      Swal.fire("Erreur", "Échec de la mise à jour du produit.", "error");
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
    <div className="max-w-md mx-auto p-4 border rounded shadow mt-10 bg-gray-50">
      <h2 className="text-lg font-bold mb-4">Mise à jour d'un produit</h2>
      <button
        className="bg-blue-800 text-white p-3 rounded flex items-center gap-2 hover:bg-blue-600"
        onClick={() => router.push("/products/add")}
      >
        Nouveau
      </button>

      {/* Recherche automatique du produit */}
      <label className="block mb-2">
        Code ou Code-Barres :
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Taper code ou Code-Barres"
        />
      </label>

      {selectedProduct && (
        <div className="mt-4">
          <h3 className="text-md font-bold">Produit : {selectedProduct.name}</h3>

          <label className="block mt-2">
            Ajouter à la Quantité :
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const value = e.target.value;
                setQuantity(value === "" ? "" : Number(value));
              }}
              className="w-full p-2 border rounded"
              min="0"
            />
          </label>

          <label className="block mt-2">
            Prix de Vente :
            <input
              type="number"
              value={priceV}
              onChange={(e) => {
                const value = e.target.value;
                setPriceV(value === "" ? "" : Number(value));
              }}
              className="w-full p-2 border rounded"
              min={priceA}
            />
          </label>

          <label className="block mt-2">
            Prix d&apos;Achat :
            <input
              type="number"
              value={priceA}
              onChange={(e) => {
                const value = e.target.value;
                setPriceA(value === "" ? "" : Number(value));
              }}
              className="w-full p-2 border rounded"
              min="0"
            />
          </label>

          <button
            onClick={handleUpdate}
            className="w-full bg-blue-500 text-white py-2 rounded mt-4 hover:bg-blue-700"
          >
            <RiStickyNoteAddFill className="inline mr-2 text-2xl" />
            Mettre à jour
          </button>
        </div>
      )}
    </div>
  );
}
