/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBox, FaShoppingCart, FaDollarSign, FaEye } from "react-icons/fa";
import { getDashboardStats, getSalesHistory, getMonthlySales, deleteAllSales } from '../utlis/actions';
import Chart from "chart.js/auto";
import Loader from "../components/Loader";
import SalesHistoryDay from "../components/SalesHistoryDay";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FiAlertTriangle } from "react-icons/fi";
import { FcAddDatabase } from "react-icons/fc";

// Définition des types
interface Stats {
  totalProducts: number;
  totalSales: number;
  totalProfit: number;
  totalOrders: number;
}

interface Sale {
  id: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  purchasePrice: number;
}

interface MonthlySales {
  month: string;
  totalSales: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const monthlyChartRef = useRef<HTMLCanvasElement | null>(null);
  const router = useRouter();
  const [showSalesHistory, setShowSalesHistory] = useState(false);
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);
  const [user, setUser] = useState(null);
 
  // Récupération des données depuis l'API

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
    async function fetchData() {
      const sales = await getSalesHistory();
  
      // Remplace undefined par une valeur par défaut
      const formattedSales = sales.map(sale => ({
        ...sale,
        productName: sale.productName ?? "Produit inconnu"
      }));
  
      setSalesHistory(formattedSales);
    }
    fetchData();
  }, []);
  
  useEffect(() => {
    fetchStats();
    fetchMonthlySales();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      console.log("Statistiques récupérées :", data);
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques :", error);
      setLoading(false);
    }
  };

  const fetchMonthlySales = async () => {
    try {
      const data = await getMonthlySales();
  
      // Agréger les ventes par mois
      const salesByMonth: { [key: string]: number } = {};
      data.forEach(({ month, totalSales }) => {
        if (!salesByMonth[month]) {
          salesByMonth[month] = 0;
        }
        salesByMonth[month] += totalSales;
      });
  
      // Transformer l'objet en tableau
      const aggregatedSales = Object.entries(salesByMonth).map(([month, totalSales]) => ({
        month,
        totalSales,
      }));
  
      console.log("Ventes mensuelles agrégées :", aggregatedSales);
      setMonthlySales(aggregatedSales);
    } catch (error) {
      console.error("Erreur lors du chargement des ventes mensuelles :", error);
    }
  };
  

  useEffect(() => {
    if (stats && chartCanvasRef.current) {
      const ctx = chartCanvasRef.current.getContext("2d");
      if (!ctx) return;

      Chart.getChart(chartCanvasRef.current)?.destroy();

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Produits", "Ventes", "Gains (Kz)", "Commandes"],
          datasets: [
            {
              label: "Statistiques",
              data: [
                stats.totalProducts,
                stats.totalSales,
                stats.totalProfit,
                stats.totalOrders,
              ],
              backgroundColor: ["blue", "green", "orange", "yellow"],
            },
          ],
        },
      });
    }
  }, [stats]);

  useEffect(() => {
    console.log("Mise à jour du graphique mensuel avec :", monthlySales);
    if (monthlySales.length > 0 && monthlyChartRef.current) {
      const ctx = monthlyChartRef.current.getContext("2d");
      if (!ctx) return;
  
      Chart.getChart(monthlyChartRef.current)?.destroy();
  
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: monthlySales.map((sale) => sale.month),
          datasets: [
            {
              label: "المبيعات الشهرية (Kz)",
              data: monthlySales.map((sale) => sale.totalSales),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [monthlySales]);
  

  
  const handleDeleteSales = async () => {
    const result = await Swal.fire({
      title: "Supprimer tout l'historique des ventes ?",
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
        const response = await deleteAllSales();
  
        if (response.success) {
          toast.success("L'historique des ventes a été supprimé avec succès !");
          fetchStats(); // Rafraîchir la liste des ventes après suppression
        } else {
          toast.error(response.error || "Une erreur est survenue.");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast.error("Une erreur est survenue.");
      }
    }
  };
  

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">لوحة التحكم</h1>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Statistiques numériques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-500 text-white p-4 rounded flex items-center justify-between">
              <FaBox size={32} />
              <div>
                <h2 className="text-2xl font-semibold">{stats?.totalProducts ?? 0}</h2>
                  <p>المنتجات في المخزون</p>
              </div>
            </div>
            <div className="bg-green-500 text-white p-4 rounded flex items-center justify-between">
              <FaShoppingCart size={32} />
              <div>
                <h2 className="text-2xl font-semibold">{stats?.totalSales ?? 0} Kz</h2>
                  <p>المبيعات المنجزة</p>
              </div>
            </div>
            <div className="bg-yellow-500 text-white p-4 rounded flex items-center justify-between">
              <FaDollarSign size={32} />
              <div>
                <h2 className="text-2xl font-semibold">{stats?.totalProfit ?? 0} Kz</h2>
                  <p>إجمالي الأرباح</p>
              </div>
            </div>
          </div>

          {/* Graphique avec Chart.js */}
          <div className="bg-white p-4 rounded shadow mb-6">
              <h2 className="text-xl font-bold mb-4 text-black">إحصائيات بيانية</h2>
            <canvas ref={chartCanvasRef} className="w-full h-80"></canvas>
          </div>

          {/* Graphique des ventes mensuelles */}
          <div className="bg-white p-4 rounded shadow mb-6">
              <h2 className="text-xl font-bold mb-4 text-black">المبيعات الشهرية</h2>
            <canvas ref={monthlyChartRef} className="w-full h-80"></canvas>
          </div>

          <div className="py-4">
            <button
              className="bg-gray-800 text-white p-2 rounded w-full mb-4 hover:bg-gray-600"
              onClick={() => setShowSalesHistory(!showSalesHistory)}
            >
                {showSalesHistory ? "إخفاء السجل" : "عرض السجل اليومي"}
            </button>

            {showSalesHistory && (
              <>
                  <h2 className="mt-8 text-lg font-bold text-center text-black">سجل المبيعات </h2>
                <SalesHistoryDay sales={salesHistory} />
              </>
            )}
          </div>

          {/* Boutons rapides */}
          <div className="flex justify-center mt-6 gap-4">
         
            <button
              className="bg-blue-800 text-white p-3 rounded flex items-center gap-2 hover:bg-blue-600"
              onClick={() => router.push("/update")}
            >
                <FcAddDatabase className="inline mr-2  text-2xl" />المبيعات
            </button>
            <button
              className="bg-orange-800 text-white p-3 rounded flex items-center gap-2 hover:bg-orange-600"
              onClick={() => router.push("/commandes")}
            >
              <FaEye className="inline mr-2  text-2xl"/>
            </button>

            <button
              className=" text-white p-3 rounded flex items-center gap-2 hover:bg-red-600"
              onClick={handleDeleteSales}
            >
                <FiAlertTriangle className="w-5 h-5 bg-red-600 animate-bounce" /> حذف جميع المبيعات
            </button>
          </div>
        </>
      )}
    </div>
  );
}
