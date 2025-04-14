/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef } from "react";
import { IoIosAddCircle } from "react-icons/io";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import SalesHistory from "../components/SelesHostory";
import { addMultipleSales, getAllClients, getAllProducts, getSalesHistory } from "../utlis/actions";
import { useRouter } from "next/navigation";
import { FaEye } from "react-icons/fa";
import { CiBarcode, CiCircleCheck } from "react-icons/ci";
import { MdNotListedLocation } from "react-icons/md";
import Loader from "../components/Loader";

interface Product {
  id: string;
  code: number;
  name: string;
  quantity: number;
  price_v: number;
  codeBar?: string |null;
}

interface Sale {
  id: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  purchasePrice: number;
}

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  
}
type Client = {
  id: string;
  nom: string;
  tel: string;
  nif: string | null;
};

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  //const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number | "">('');
  const [showSalesHistory, setShowSalesHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef =  useRef<HTMLInputElement>(null); 
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1000); // Simule un chargement de 1 seconde
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user'); // Endpoint pour récupérer l'utilisateur
        if (response.ok) {
          const userData = await response.json();
          setUser(userData); // Stocke l'utilisateur dans l'état
        } else {
          router.push('/'); // Redirige vers la page de connexion si non connecté
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        router.push('/login'); // Redirige en cas d'erreur
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchClients() {
      const result = await getAllClients();
      if (result.success) {
        setClients(result.clients);
      } else {
        console.error(result.error);
      }
    }
    fetchClients();
  }, []);
  
  useEffect(() => {
    async function fetchData() {
      const productList = await getAllProducts();
      setProducts(productList);
  
      const sales = await getSalesHistory();
  
      // S'assurer que productName n'est jamais undefined
      const formattedSales = sales.map(sale => ({
        ...sale,
        productName: sale.productName ?? "Produit inconnu" // Remplace undefined par une valeur par défaut
      }));
  
      setSalesHistory(formattedSales);
    }
    fetchData();
  }, []);
  

  const addToCart = () => {
    if (!filteredProduct) {
      toast.error("Sélectionnez un produit.");
      return;
    }
    if (Number(quantity) <= 0) {
      toast.error("Entrez une quantité valide.");
      return;
    }
  
    if (filteredProduct.quantity <  Number(quantity)) {
      toast.error("Quantité insuffisante en stock.");
      return;
    }
  
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === filteredProduct.id);
  
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === filteredProduct.id
            ? { ...item, quantity: item.quantity +  Number(quantity), totalPrice: (item.quantity +  Number(quantity)) * item.unitPrice }
            : item
        );
      }
  
      return [
        ...prevCart,
        {
          productId: filteredProduct.id,
          productName: filteredProduct.name,
          quantity:Number(quantity) || 1,
          unitPrice: filteredProduct.price_v,
          totalPrice: filteredProduct.price_v *  Number(quantity),
        },
      ];
    });
  
    setQuantity(1);
    setSearchTerm(""); // Réinitialise l'input de recherche
  
  
    setTimeout(() => searchInputRef.current?.focus(), 0); // Redonne le focus à l'input
  };
  
  const removeFromCart = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    toast.info("Produit retiré du panier.");
  };
  

 // const filteredProducts = products.filter(
   // (product) =>
    //  product.code.toString().includes(searchTerm) ||
    //  (product.codeBar && product.codeBar.includes(searchTerm))
  //);
  const handleSale = async () => {
    if (cart.length === 0) {
        toast.error("Ajoutez au moins un produit au panier.");
        return;
    }

    const confirm = await Swal.fire({
        title: "Confirmer la vente ?",
        text: "Cette action est irréversible.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, valider",
        cancelButtonText: "Annuler",
    });

    if (confirm.isConfirmed) {
        setLoading(true); // 🔹 Activer le chargement

        try {
            const result = await addMultipleSales(cart);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Vente enregistrée avec succès !");
                generateInvoice();
                setCart([]);

                // 🔹 Charger les produits et les ventes en parallèle (optimisation)
                const [productList, sales] = await Promise.all([
                    getAllProducts(),
                    getSalesHistory(),
                ]);

                setProducts(productList);

                // 🔹 Corriger le problème de `productName`
                const formattedSales = sales.map(sale => ({
                    ...sale,
                    productName: sale.productName ?? "Produit inconnu",
                }));

                setSalesHistory(formattedSales);
            }
        } catch (error) {
            toast.error("Une erreur s'est produite.");
            console.error("Erreur lors de la vente :", error);
        } finally {
            setLoading(false); // 🔹 Désactiver le chargement
        }
    }
};

const generateInvoice = () => {
  if (cart.length === 0) {
    toast.error("Aucun produit dans le panier pour générer la facture.");
    return;
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [80, 150], // Format 80x150mm
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();
  const invoiceId = `INV-${now.getTime()}`;

  // Chargement et affichage du logo
  const logo = new Image();
  logo.src = "/lok.jpg"; // Vérifie le chemin du logo

  logo.onload = () => {
    doc.addImage(logo, "PNG", 25, 5, 30, 20); // Logo centré

    // Informations de l'entreprise
    doc.setFontSize(10);
    doc.text("CRYSTAL PNE LDA", 40, 30, { align: "center" });
    doc.text("NIF: 5417208523", 40, 35, { align: "center" });
    doc.text("Adresse: Catete-Bengo", 40, 40, { align: "center" });

    // Informations de la facture (date, numéro de facture)
    doc.text(`Date: ${dateStr} ${timeStr}`, 40, 45, { align: "center" });
    doc.text(`Facture N°: ${invoiceId}`, 40, 50, { align: "center" });

    // Ligne de points
    doc.text(".............................................................", 40, 55, { align: "center" });

    // Génération du tableau des produits
    autoTable(doc, {
      startY: 60, // Décalage pour commencer le tableau
      margin: { left: 4 },
      head: [["Produit", "Qté", "P.U", "Total"]],
      body: cart.map((item) => [
        item.productName.substring(0, 10),
        item.quantity,
        item.unitPrice.toFixed(2),
        item.totalPrice.toFixed(2),
      ]),
      styles: {
        fontSize: 8,
        halign: "left",
      },
      columnStyles: {
        0: { cellWidth: 25, halign: "left" },
        1: { cellWidth: 10, halign: "center" },
        2: { cellWidth: 15, halign: "right" },
        3: { cellWidth: 20, halign: "right" },
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 75;

    doc.setFontSize(10);
    doc.text(
      `Total: ${cart.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)} MRU`,
      40,
      finalY + 5,
      { align: "center" }
    );

    // Message de remerciement centré
    doc.setFontSize(10);
    doc.text("Merci de votre achat !", 40, finalY + 15, { align: "center" });

    // Ligne de points et message de génération de la facture
    doc.text(".............................................................", 40, finalY + 25, { align: "center" });
    doc.text("Facture générée par Stock-App V1.0.0", 40, finalY + 30, { align: "center" });
    doc.text("Certificado AGT/2025/MK77/CATETE", 40, finalY + 35, { align: "center" });

    // Génération de la facture en PDF
    doc.save(`facture_${invoiceId}.pdf`);
   
  };
};

const filteredProduct = products.find(
  (product) =>
    product.codeBar === searchTerm.trim() ||
    product.code === Number(searchTerm.trim())
);


if (pageLoading) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Loader/>
    </div>
  );
}

  return (
    <div className="container mx-auto p-6 max-w-lg bg-white shadow-md rounded-lg">
    <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Vendre des Produits</h1>
    
    {/* Sélection du Client */}
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700">Sélectionner un client :</label>
      <select
        onChange={(e) => setSelectedClient(clients.find(c => c.id === e.target.value) || null)}
        className="border p-2 w-full rounded-md text-gray-700"
      >
        <option value="">-- Choisir un client --</option>
        {clients.map(client => (
          <option key={client.id} value={client.id}>{client.nom} - {client.tel}</option>
        ))}
      </select>
    </div>
    
    {selectedClient && (
      <div className="mb-4 p-3 bg-gray-100 rounded-md">
        <h3 className="text-sm font-semibold">Informations du Client</h3>
        <p className="text-gray-700"><strong>Nom:</strong> {selectedClient.nom}</p>
        <p className="text-gray-700"><strong>Téléphone:</strong> {selectedClient.tel}</p>
        <p className="text-gray-700"><strong>NIF:</strong> {selectedClient.nif || "Non renseigné"}</p>
      </div>
    )}

    {/* Sélection du Produit */}
    <div className="mb-4">
  <label className="block text-sm font-semibold text-gray-700">Produit :</label>
  <div className="flex flex-row items-center border p-2 w-full rounded-md mb-2">
  <CiBarcode className="text-black mr-2 text-3xl font-bold" />
  <input
    ref={searchInputRef}
    type="text"
    placeholder="Rechercher par code ou code-barres"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full outline-none text-gray-700 font-bold"
  />
</div>

 
  <select
    className="border p-2 w-full rounded-md text-gray-700 font-bold"
    disabled={!filteredProduct}
  >
    {filteredProduct ? (
      <option key={filteredProduct.id} value={filteredProduct.id}>
        {filteredProduct.name} (Stock: {filteredProduct.quantity})
      </option>
    ) : (
      <option value="" disabled>Aucun produit trouvé</option>
    )}
  </select>
</div>

    
    {/* Quantité */}
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700">Quantité :</label>
      <input
        type="number"
        value={quantity}
        onChange={(e) =>{
          const value = e.target.value;
          setQuantity(value === "" ? "" : Number(value))} }
        className="border p-2 w-full rounded-md text-gray-700 font-bold"
        min="1"
      />
    </div>
    
    <button 
      onClick={addToCart} 
      className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition mb-4"
    >
      <IoIosAddCircle className="inline mr-2  text-2xl"/>
    </button>
    
    {/* Panier */}
    <h2 className="text-lg font-bold text-center text-gray-800">Panier</h2>
    {cart.length > 0 && (
      <div className="border p-4 rounded-md bg-gray-100 mt-2">
        {cart.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-700">{item.productName} - {item.quantity} x {item.unitPrice} MRU = {item.totalPrice} MRU</p>
            <button onClick={() => removeFromCart(index)} className="bg-red-500 text-white px-2 py-1 rounded">X</button>
          </div>
        ))}
        <p className="font-bold mt-2 text-gray-800">Total: {cart.reduce((sum, item) => sum + item.totalPrice, 0)} MRU</p>
      </div>
    )}
    
    <button 
      onClick={handleSale} 
      className="w-full bg-green-700 text-white p-2 rounded-md hover:bg-green-600 transition mt-4"
      disabled={loading}
    >
     <CiCircleCheck className="inline mr-2  text-2xl"/> {loading ? "Vente en cours..." : "Vendre"}
    </button>

    <button 
      className="w-full bg-blue-700  text-white p-2 rounded-md hover:bg-blue-600 transition mt-4"
      onClick={generateInvoice}
    ><FaEye className="inline mr-2  text-2xl"/>
      Visualiser PDF
    </button>
    
    <button 
      className="w-full bg-gray-800 text-white p-2 rounded-md hover:bg-gray-600 transition mt-4"
      onClick={() => setShowSalesHistory(!showSalesHistory)}
    >
      <MdNotListedLocation className="inline mr-2  text-2xl" />{showSalesHistory ? "Masquer l'historique" : "Afficher l'historique"}
    </button>
    
    {showSalesHistory && <SalesHistory sales={salesHistory} />}
  </div>
  );
}
