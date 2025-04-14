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
  codeBar?: string | null;
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
  const searchInputRef = useRef<HTMLInputElement>(null);
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

    if (filteredProduct.quantity < Number(quantity)) {
      toast.error("Quantité insuffisante en stock.");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === filteredProduct.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === filteredProduct.id
            ? { ...item, quantity: item.quantity + Number(quantity), totalPrice: (item.quantity + Number(quantity)) * item.unitPrice }
            : item
        );
      }

      return [
        ...prevCart,
        {
          productId: filteredProduct.id,
          productName: filteredProduct.name,
          quantity: Number(quantity) || 1,
          unitPrice: filteredProduct.price_v,
          totalPrice: filteredProduct.price_v * Number(quantity),
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
    toast.info("تمت إزالة المنتج من ال");
  };


  // const filteredProducts = products.filter(
  // (product) =>
  //  product.code.toString().includes(searchTerm) ||
  //  (product.codeBar && product.codeBar.includes(searchTerm))
  //);
  const handleSale = async () => {
    if (cart.length === 0) {
      toast.error("يرجى إضافة منتج واحد على الأقل إلى السلة.");
      return;
    }

    const confirm = await Swal.fire({
      title: "تأكيد عملية البيع؟",
      text: "هذا الإجراء لا يمكن التراجع عنه.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، تأكيد",
      cancelButtonText: "إلغاء",
    });

    if (confirm.isConfirmed) {
      setLoading(true); // 🔹 تفعيل التحميل

      try {
        const result = await addMultipleSales(cart);

        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("تم تسجيل عملية البيع بنجاح!");
          generateInvoice();
          setCart([]);

          // 🔹 تحميل المنتجات والمبيعات في نفس الوقت (تحسين الأداء)
          const [productList, sales] = await Promise.all([
            getAllProducts(),
            getSalesHistory(),
          ]);

          setProducts(productList);

          // 🔹 تصحيح مشكلة اسم المنتج
          const formattedSales = sales.map(sale => ({
            ...sale,
            productName: sale.productName ?? "منتج غير معروف",
          }));

          setSalesHistory(formattedSales);
        }
      } catch (error) {
        toast.error("حدث خطأ أثناء المعالجة.");
        console.error("خطأ أثناء البيع :", error);
      } finally {
        setLoading(false); // 🔹 إيقاف التحميل
      }
    }
  };

  const generateInvoice = () => {
    if (cart.length === 0) {
      toast.error("Nenhum produto no carrinho para gerar a fatura.");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 150],
    });

    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    const invoiceId = `FAT-${now.getTime()}`;

    const logo = new Image();
    logo.src = "/cry.jpg";

    logo.onload = () => {
      doc.addImage(logo, "PNG", 25, 5, 30, 20);

      doc.setFontSize(10);
      doc.text("CRYSTAL PNEUS ANGOLA LDA", 40, 30, { align: "center" });
      doc.text("NIF: 50001011413", 40, 35, { align: "center" });
      doc.text("Endereço: KM28/Viana Estrada N230", 40, 40, { align: "center" });
      doc.text("Tel: 924111042 / 929178671", 40, 45, { align: "center" });

      doc.text(`Data: ${dateStr} ${timeStr}`, 40, 50, { align: "center" });
      doc.text(`Fatura Nº: ${invoiceId}`, 40, 55, { align: "center" });

      // 🔹 Informações do cliente
      if (selectedClient) {
        doc.text("Cliente:", 5, 62);
        doc.text(`Nome: ${selectedClient.nom}`, 5, 67);
        doc.text(`Telefone: ${selectedClient.tel}`, 5, 72);
        doc.text(`NIF: ${selectedClient.nif || ""}`, 5, 77);
      }

      const startY = selectedClient ? 82 : 65;

      autoTable(doc, {
        startY,
        margin: { left: 4 },
        head: [["Produto", "Qtd", "P.U", "Total"]],
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

      const finalY = (doc as any).lastAutoTable.finalY || startY + 10;

      doc.setFontSize(10);
      doc.text(`Total: ${cart.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)} Kz`, 40, finalY + 5, { align: "center" });

      doc.text("Obrigado pela sua compra!", 40, finalY + 15, { align: "center" });
      doc.text(".............................................................", 40, finalY + 25, { align: "center" });
      doc.text("Fatura gerada por Stock-App V1.0.0", 40, finalY + 30, { align: "center" });

      doc.save(`${invoiceId}.pdf`);
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
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-lg bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">بيع المنتجات</h1>

      {/* Sélection du Client */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700">حدد عميلا :</label>
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
        <div className="mb-4 p-3 bg-gray-100 rounded-md" dir="rtl">
          <h3 className="text-sm font-semibold">معلومات الزبون</h3>
          <p className="text-gray-700"><strong>الاسم:</strong> {selectedClient.nom}</p>
          <p className="text-gray-700"><strong>الهاتف:</strong> {selectedClient.tel}</p>
          <p className="text-gray-700"><strong>الرقم الضريبي:</strong> {selectedClient.nif || "غير متوفر"}</p>
        </div>

      )}

      {/* Sélection du Produit */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700">المنتج :</label>
        <div className="flex flex-row items-center border p-2 w-full rounded-md mb-2">
          <CiBarcode className="text-black mr-2 text-3xl font-bold" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="البحث عن طريق الرمز أو الرمز الشريطي"
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
              <option value="" disabled>لم يتم العثور على منتجات</option>
          )}
        </select>
      </div>


      {/* Quantité */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700">كمية :</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => {
            const value = e.target.value;
            setQuantity(value === "" ? "" : Number(value))
          }}
          className="border p-2 w-full rounded-md text-gray-700 font-bold"
          min="1"
        />
      </div>

      <button
        onClick={addToCart}
        className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition mb-4"
      >
        <IoIosAddCircle className="inline mr-2  text-2xl" />
      </button>

      {/* Panier */}
      <h2 className="text-lg font-bold text-center text-gray-800">سلة</h2>
      {cart.length > 0 && (
        <div className="border p-4 rounded-md bg-gray-100 mt-2">
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-700">{item.productName} - {item.quantity} x {item.unitPrice} MRU = {item.totalPrice} MRU</p>
              <button onClick={() => removeFromCart(index)} className="bg-red-500 text-white px-2 py-1 rounded">X</button>
            </div>
          ))}
          <p className="font-bold mt-2 text-gray-800">Total: {cart.reduce((sum, item) => sum + item.totalPrice, 0)} Kz</p>
        </div>
      )}

      <button
        onClick={handleSale}
        className="w-full bg-green-700 text-white p-2 rounded-md hover:bg-green-600 transition mt-4"
        disabled={loading}
      >
        <CiCircleCheck className="inline mr-2  text-2xl" /> {loading ? "البيع قيد التنفيذ ..." : "بيع"}
      </button>

      <button
        className="w-full bg-blue-700  text-white p-2 rounded-md hover:bg-blue-600 transition mt-4"
        onClick={generateInvoice}
      ><FaEye className="inline mr-2  text-2xl" />
        عرض  PDF
      </button>

      <button
        className="w-full bg-gray-800 text-white p-2 rounded-md hover:bg-gray-600 transition mt-4"
        onClick={() => setShowSalesHistory(!showSalesHistory)}
      >
        <MdNotListedLocation className="inline mr-2  text-2xl" />{showSalesHistory ? "إخفاء سجل المبيعات" : "عرض سجل المبيعات"}
      </button>

      {showSalesHistory && <SalesHistory sales={salesHistory} />}
    </div>
  );
}
