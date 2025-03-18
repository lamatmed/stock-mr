/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { addProduct, getLastProductCode } from "@/app/utlis/actions"; 
import { IoIosAddCircle } from "react-icons/io";
import Loader from "@/app/components/Loader";

export default function AddProduct() {
  const router = useRouter();
  const [code, setCode] = useState<string>("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price_v, setPriceV] = useState("");
  const [price_a, setPriceA] = useState("");
  const today = new Date().toISOString().split('T')[0]; // Date d'aujourd'hui format YYYY-MM-DD
  const [expirationDate, setExpirationDate] = useState(today);
  const [codeBar, setCodeBar] = useState("");
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1000); // Simule un chargement de 1 seconde
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
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        router.push("/login");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchLastCode = async () => {
      try {
        const lastCode: number | null = await getLastProductCode();
        
        // Si la base est vide (null), commencer par 1
        const newCode = lastCode !== null ? lastCode + 1 : 1;
        
        setCode(newCode.toString());
      } catch (error) {
        console.error("Erreur lors de la récupération du dernier code produit :", error);
      }
    };
  
    fetchLastCode();
  }, []);
  

  const generateUniqueBarcode = () => {
    return `BC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const handleAddProduct = async () => {
    console.log("Début de l'ajout du produit...");

    if (!code || !name || !quantity || !price_v || !price_a || !expirationDate) {
      Swal.fire({
        icon: "warning",
        title: "Champs manquants",
        text: "Veuillez remplir tous les champs !",
      });
      return;
    }

    if (parseInt(quantity) < 0) {
      Swal.fire({
        icon: "error",
        title: "Valeur invalide",
        text: "La quantité ne peut pas être négative !",
      });
      return;
    }

    if (parseFloat(price_v) <= parseFloat(price_a)) {
      Swal.fire({
        icon: "error",
        title: "Prix incorrect",
        text: "Le prix de vente doit être supérieur au prix d'achat !",
      });
      return;
    }

    // Génération automatique du code-barres si vide
    const finalCodeBar = codeBar.trim() !== "" ? codeBar : generateUniqueBarcode();

    try {
      const result = await Swal.fire({
        title: "Ajouter ce produit ?",
        text: "Voulez-vous vraiment ajouter ce produit ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Oui, ajouter",
        cancelButtonText: "Annuler",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Ajout en cours...",
        text: "Veuillez patienter",
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
        console.error("Erreur lors de l'ajout du produit :", response.error);
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: response.error,
        });
        return;
      }

      toast.success("Produit ajouté avec succès !");
      router.push("/products");
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit :", error);
      Swal.close();
      toast.error("Une erreur est survenue lors de l'ajout !");
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
    <div className="max-w-xl mx-auto p-4 bg-gray-50 mt-5">
      <h1 className="text-2xl font-bold mb-4 text-center text-black">Nouveau Produit</h1>

      <div className="bg-white shadow-md rounded-lg p-4">
        <input className="border p-2 w-full mb-2 rounded placeholder:text-black text-black" placeholder="Code Barre (optionnel)" value={codeBar} onChange={(e) => setCodeBar(e.target.value)} />
        <input className="border p-2 w-full mb-2 rounded placeholder:text-black text-black" type="number" placeholder="Code" value={code} readOnly />
        <input className="border p-2 w-full mb-2 rounded placeholder:text-black text-black" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border p-2 w-full mb-2 placeholder:text-black text-black" type="number" placeholder="Quantité" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <input className="border p-2 w-full mb-2 placeholder:text-black text-black" type="number" placeholder="Prix de vente" value={price_v} onChange={(e) => setPriceV(e.target.value)} />
        <input className="border p-2 w-full mb-2 placeholder:text-black text-black" type="number" placeholder="Prix d'achat" value={price_a} onChange={(e) => setPriceA(e.target.value)} />
        <input className="border p-2 w-full mb-2 text-black" type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value || today)} />

        <button className="bg-blue-500 text-white p-2 rounded w-full mt-2 hover:bg-blue-700" onClick={handleAddProduct}>
          <IoIosAddCircle className="inline mr-2  text-2xl"/> Ajouter
        </button>
      </div>
    </div>
  );
}
