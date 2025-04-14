/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { getProductById, updateProduct } from "../utlis/actions";
import { IoIosAddCircle } from "react-icons/io";
import Loader from "./Loader";


export default function EditProduct({ id }: { id: string }) {
  const router = useRouter();

  const [code, setCode] = useState("0");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [price_v, setPriceV] = useState("0");
  const [price_a, setPriceA] = useState("0");
  const [expirationDate, setExpirationDate] = useState("");
  const [codeBar, setCodeBar] = useState(""); 

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1000); // Simule un chargement de 1 seconde
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = useCallback(async () => {
    try {
      const product = await getProductById(id);

      if (!product || "error" in product) {
        alert("Produit non trouvé !");
        router.push("/products");
        return;
      }

      setCode(product.code?.toString() || "0");
      setName(product.name || "");
      setQuantity(product.quantity?.toString() || "0");
      setPriceV(product.price_v?.toString() || "0");
      setPriceA(product.price_a?.toString() || "0");
      setExpirationDate(
        product.expirationDate ? new Date(product.expirationDate).toISOString().split("T")[0] : ""
      );
      setCodeBar(product.codeBar || "");
    } catch (error) {
      console.error("Erreur lors de la récupération du produit :", error);
      alert("Une erreur est survenue !");
      router.push("/products");
    }
  }, [id, router]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleUpdate = async () => {
    if (!code || !name || !quantity || !price_v || !price_a || !expirationDate) {
      Swal.fire({
        icon: "warning",
        title: "Champs manquants",
        text: "Veuillez remplir tous les champs !",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Modifier le produit ?",
        text: "Êtes-vous sûr de vouloir enregistrer ces modifications ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Oui, modifier",
        cancelButtonText: "Annuler",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: "Modification en cours...",
          text: "Veuillez patienter",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(Swal.getConfirmButton());
          },
        });

      

      

        await updateProduct(
          id,
          parseInt(code),
          name,
          parseInt(quantity),
          parseFloat(price_v),
          parseFloat(price_a),
          expirationDate,
          codeBar,
        );

        Swal.close();
        toast.success("Produit mis à jour avec succès !");
        router.push("/products");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit :", error);
      Swal.close();
      toast.error("Une erreur est survenue lors de la mise à jour !");
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader/>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center text-black">تعديل</h1>

      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
       
      <input
          className="border p-2 w-full mb-2 rounded placeholder:text-black text-black"
          placeholder="Code Barre"
          value={codeBar}
          onChange={(e) => setCodeBar(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-2 rounded placeholder:text-black text-black"
          placeholder="Code du produit"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          readOnly
        />
        <input
          className="border p-2 w-full mb-2 rounded placeholder:text-black text-black"
          placeholder="Nom du produit"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2 rounded placeholder:text-black text-black"
          placeholder="Quantité"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2 rounded placeholder:text-black text-black"
          placeholder="Prix de vente"
          type="number"
          value={price_v}
          onChange={(e) => setPriceV(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2 rounded placeholder:text-black text-black"
          placeholder="Prix d'achat"
          type="number"
          value={price_a}
          onChange={(e) => setPriceA(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2 rounded text-black"
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        />

      

        <button className="bg-blue-500 text-white p-2 rounded w-full" onClick={handleUpdate}>
          <IoIosAddCircle className="inline mr-2  text-2xl" />تتعديل المنتج
        </button>
      </div>
    </div>
  );
}
