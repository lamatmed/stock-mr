import React, { useState, useEffect } from "react";
import Loader from "./Loader";

interface Sale {
  id: string;
  productName: string;
  quantity: number;
  totalPrice: number; // Prix total de la vente
  purchasePrice: number; // Prix d'achat total pour cette vente
  createdAt: string;
}

interface SalesHistoryProps {
  sales: Sale[];
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ sales }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [sales]);

  const groupSalesByMonthAndDay = () => {
    const grouped: Record<
      string,
      {
        total: number;
        gain: number;
        days: Record<string, { total: number; gain: number }>;
      }
    > = {};

    sales.forEach((sale) => {
      const date = new Date(sale.createdAt);
      const monthYear = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
      const day = date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

      if (!grouped[monthYear]) {
        grouped[monthYear] = { total: 0, gain: 0, days: {} };
      }

      if (!grouped[monthYear].days[day]) {
        grouped[monthYear].days[day] = { total: 0, gain: 0 };
      }

      grouped[monthYear].total += sale.totalPrice;
      grouped[monthYear].gain += sale.totalPrice - sale.purchasePrice;

      grouped[monthYear].days[day].total += sale.totalPrice;
      grouped[monthYear].days[day].gain += sale.totalPrice - sale.purchasePrice;
    });

    return grouped;
  };

  const groupedSales = groupSalesByMonthAndDay();

  return (
    <div className="mt-6 bg-white">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h2 className="text-xl font-bold text-black mb-4">Total des ventes et gains par mois et jour :</h2>
          {Object.keys(groupedSales).map((monthYear) => (
            <div key={monthYear} className="mb-6">
              <h3 className="text-lg font-bold text-black mb-2 bg-gray-100 p-2">{monthYear}</h3>
              <table className="min-w-full border-collapse border">
                <thead>
                  <tr className="bg-white">
                    <th className="border p-2 text-black">Date</th>
                    <th className="border p-2 text-black">Total des ventes (Kz)</th>
                    <th className="border p-2 text-black">Gains (Kz)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(groupedSales[monthYear].days).map((day) => (
                    <tr key={day} className="border">
                      <td className="border p-2 text-black">{day}</td>
                      <td className="border p-2 text-black">{groupedSales[monthYear].days[day].total} Kz</td>
                      <td className="border p-2 text-black">{groupedSales[monthYear].days[day].gain} Kz</td>
                    </tr>
                  ))}
                  {/* Ligne du total du mois */}
                  <tr className="bg-gray-200 font-bold">
                    <td className="border p-2 text-black">Total du {monthYear}</td>
                    <td className="border p-2 text-black">{groupedSales[monthYear].total} MRU</td>
                    <td className="border p-2 text-black">{groupedSales[monthYear].gain} MRU</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default SalesHistory;
