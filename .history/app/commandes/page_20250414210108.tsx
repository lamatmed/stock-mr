/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from "react";
import { FaFileInvoice, FaBox, FaCalendarAlt, FaDollarSign, FaArrowLeft, FaArrowRight, FaSearch, FaDownload, FaTrash, } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Loader from "../components/Loader";
import { deleteInvoice, getInvoiceHistory } from "../utlis/actions";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

type Sale = {
  productName: string;
  quantity: number;
  totalPrice: number;
};

type Invoice = {
  id: string;
  totalAmount: number;
  purchaseTotal: number;
  createdAt: string;
  sales: Sale[];
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchDate, setSearchDate] = useState("");
  const invoicesPerPage = 5;
  const [user, setUser] = useState(null);
   const router = useRouter();
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
    async function fetchInvoices() {
      setIsLoading(true);
      const data = await getInvoiceHistory();

      const formattedData = data.map(invoice => ({
        ...invoice,
        sales: invoice.sales.map(sale => ({
          ...sale,
          productName: sale.productName ?? "Produit inconnu"
        }))
      }));

      setInvoices(formattedData);
      setIsLoading(false);
    }
    fetchInvoices();
  }, []);

  const filteredInvoices = searchDate
    ? invoices.filter(invoice =>
        new Date(invoice.createdAt).toISOString().split('T')[0] === searchDate
      )
    : invoices;

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
 
  const handleDelete = async (invoiceId: string) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "هذا الإجراء لا يمكن التراجع عنه!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذف!",
      cancelButtonText: "إلغاء",
      reverseButtons: true, // Pour inverser les boutons en RTL
      customClass: {
        popup: 'swal2-rtl',
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteInvoice(invoiceId);
        console.log("نتيجة الحذف:", response); // 🛠 Debugging

        if (response?.success) {
          setInvoices((prevInvoices) => prevInvoices.filter((inv) => inv.id !== invoiceId));

          setTimeout(() => {
            Swal.fire("تم الحذف!", "تم حذف الفاتورة بنجاح.", "success");
          }, 100);
        } else {
          Swal.fire("خطأ", response?.message || "تعذر حذف الفاتورة.", "error");
        }
      }
    });
  };

  
  const downloadPDF = (invoice: Invoice) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 150], // Format imprimante thermique 80x150mm
    });
  
    const now = new Date(invoice.createdAt);
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString(); // Ajout de l'heure complète
  
    // Générer un numéro de facture plus lisible (ex: INV-12345)
    const invoiceId = `INV-${invoice.id.substring(0, 5).toUpperCase()}`;
  
    // Chargement du logo
    const logo = new Image();
    logo.src = "/cry.jpg"; // Assure-toi que cette image est disponible
  
    logo.onload = () => {
      doc.addImage(logo, "PNG", 25, 5, 30, 20); // Logo centré
  
      // Informations de l'entreprise
      doc.setFontSize(10);
      doc.text("CRYSTAL PNEUS ANGOLA LDA", 40, 30, { align: "center" });
      doc.text("NIF: 50001011413", 40, 35, { align: "center" });
      doc.text("Endereço: KM28/Viana Estrada N230", 40, 40, { align: "center" });
  
      // Informations de la facture
      doc.text(`Data: ${dateStr} ${timeStr}`, 40, 50, { align: "center" });
      doc.text(`Fatura Nº: ${invoiceId}`, 40, 55, { align: "center" });

  
      // Séparateur
      doc.text("--------------------------------------------------", 40, 55, { align: "center" });
  
      // Données des produits
      const tableData = invoice.sales.map(sale => [
        sale.productName || "Produit inconnu",
        sale.quantity,
        `${sale.totalPrice.toFixed(2)} MRU`
      ]);
  
      autoTable(doc, {
        startY: 60,
        margin: { left: 4 },
        head: [["Produit", "Qté", "Total"]],
        body: tableData,
        styles: { fontSize: 8, halign: "left" },
        columnStyles: {
          0: { cellWidth: 35, halign: "left" },
          1: { cellWidth: 10, halign: "center" },
          2: { cellWidth: 20, halign: "right" }
        },
      });
  
      const finalY = (doc as any).lastAutoTable.finalY || 75;
  
      // Total
      doc.setFontSize(10);
      doc.text(`Total: ${invoice.totalAmount.toFixed(2)} Kz`, 40, finalY + 5, { align: "center" });
  
      // Message de remerciement
      doc.text("Obrigado pela sua compra!", 40, finalY + 15, { align: "center" });
  
      // Séparateur final
      doc.text("--------------------------------------------------", 40, finalY + 20, { align: "center" });
      doc.text("Fatura gerada por Stock-App V1.0.0", 40, finalY + 30, { align: "center" });
  
      // Génération du PDF
      doc.save(`Facture_${invoiceId}.pdf`);
    };
  };


  
 
  

  return (
    <div className="max-w-xl mx-auto p-6 bg-white mt-5">
      <h1 className="text-2xl font-bold text-blue-600 flex items-center px-25">
        <FaFileInvoice className="mr-2" /> سجل الفواتير
      </h1>

      <div className="mt-4 flex items-center ">
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border p-2 rounded-lg text-black w-250 "
        />
        <FaSearch className="ml-2 text-blue-500 text-5xl" />
      </div>

      {isLoading ? (
        <Loader />
      ) : filteredInvoices.length === 0 ? (
          <p className="text-black mt-4">لم يتم العثور على أي فاتورة</p>
      ) : (
        <div className="mt-6 space-y-4">
          {currentInvoices.map((invoice) => (
            <div key={invoice.id} className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                {new Date(invoice.createdAt).toLocaleDateString()}
              </h2>
              <p className="text-gray-700 flex items-center">
                <FaDollarSign className="mr-2 text-green-500" />
                 المبلغ الإجمالي: <strong className="ml-1">{invoice.totalAmount.toFixed(2)} Kz</strong>
              </p>
              <h3 className="text-lg font-semibold mt-2 text-black">المنتجات:</h3>
              <ul className="ml-4 list-disc">
                {invoice.sales.map((sale, index) => (
                  <li key={index} className="text-gray-700 flex items-center">
                    <FaBox className="mr-2 text-gray-500" />
                    {sale?.productName} (x{sale.quantity}) - {sale.totalPrice.toFixed(2)} Kz
                  </li>
                ))}
              </ul>
              <button
                onClick={() => downloadPDF(invoice)}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700"
              >
                <FaDownload className="mr-2" /> 
              </button>

              <button
                onClick={() => handleDelete(invoice.id)}
                 className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg flex items-center hover:bg-red-700"
              >
                <FaTrash className="mr-2" /> 
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-white rounded-lg ${
                currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } flex items-center`}
            >
                  <FaArrowLeft className="mr-2" /> السابق
            </button>

            <span className="text-lg font-semibold text-black">{currentPage}</span>

            <button
              onClick={() => setCurrentPage((prev) => (indexOfLastInvoice < filteredInvoices.length ? prev + 1 : prev))}
              disabled={indexOfLastInvoice >= filteredInvoices.length}
              className={`px-4 py-2 text-white rounded-lg ${
                indexOfLastInvoice >= filteredInvoices.length ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } flex items-center`}
            >
                  التالي <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
