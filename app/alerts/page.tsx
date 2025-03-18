"use client";

import { useState, useEffect } from "react";
import { FaBox, FaCalendarAlt, FaCubes, FaMoneyBillWave } from "react-icons/fa";
import Loader from "../components/Loader";
import { CiBarcode } from "react-icons/ci";
import { getAllProducts } from "../utlis/actions";

type Product = {
  id: string;
  code: number;
  name: string;
  quantity: number;
  price_v: number;
  expirationDate: string;
  codeBar?: string | null; 
};

export default function ExpiredProducts() {
  const [alertProducts, setAlertProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlertProducts();
  }, []);

  const fetchAlertProducts = async () => {
    setLoading(true);
    const data = await getAllProducts();
    
    const today = new Date();
    
    // Filtrer les produits expirés ou en alerte
    const filteredData = data
      .map((product) => ({
        ...product,
        expirationDate: new Date(product.expirationDate).toISOString().split("T")[0],
      }))
      .filter((p) => {
        const expDate = new Date(p.expirationDate);
        const timeDiff = expDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysLeft < 0 || daysLeft <= 20; // Expiré ou en alerte
      });

    setAlertProducts(filteredData);
    setLoading(false);
  };

  const getExpirationStatus = (expirationDate: string) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const timeDiff = expDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysLeft < 0) return <span className="text-red-600 font-bold">⚠️ Expiré</span>;
    if (daysLeft <= 20) return <span className="text-orange-500 font-bold">⚠️ Alerte ({daysLeft} jours restants)</span>;

    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 mt-5">
      <h1 className="text-3xl font-bold mb-6 text-center text-red-600">⚠️ Produits en Alerte / Expirés</h1>

      {loading ? (
        <Loader />
      ) : alertProducts.length === 0 ? (
        <p className="text-center text-gray-500">Aucun produit en alerte.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {alertProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-lg p-5 transition-transform transform hover:scale-105 hover:shadow-xl">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaBox className="text-blue-500 mr-2" /> {p.name}
              </h2>
              <p className="text-gray-600 flex items-center mt-2">
                <CiBarcode className="text-red-400 mr-2" />
                <span className="font-medium">{p.codeBar}</span>
              </p>
              <p className="text-gray-600 flex items-center mt-2">
                <FaCubes className="text-green-500 mr-2" /> <span className="font-medium">{p.quantity}</span>
              </p>
              <p className="text-gray-600 flex items-center mt-2">
                <FaMoneyBillWave className="text-yellow-500 mr-2" /> <span className="font-medium">{p.price_v} MRU</span>
              </p>
              <p className="text-gray-600 flex items-center mt-2">
                <FaCalendarAlt className="text-red-500 mr-2" /> 
                <span className="font-medium">{p.expirationDate}</span> 
                <span className="ml-2">{getExpirationStatus(p.expirationDate)}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
