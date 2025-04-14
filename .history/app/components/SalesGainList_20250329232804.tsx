interface Sale {
    id: string;
    productName: string;
    quantity: number;
    totalPrice: number;
    purchasePrice: number;
    createdAt: string;
  }
  
  interface SalesHistoryProps {
    sales: Sale[];
  }
  
  const SalesHistory: React.FC<SalesHistoryProps> = ({ sales }) => {
    const totalByMonth: Record<string, number> = {};
    const totalByYear: Record<string, number> = {};
    const gainByMonth: Record<string, number> = {};
    const gainByYear: Record<string, number> = {};
  
    sales.forEach((sale) => {
      const date = new Date(sale.createdAt);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      const year = `${date.getFullYear()}`;
      const gain = sale.totalPrice - sale.purchasePrice;
  
      totalByMonth[month] = (totalByMonth[month] || 0) + sale.totalPrice;
      totalByYear[year] = (totalByYear[year] || 0) + sale.totalPrice;
      gainByMonth[month] = (gainByMonth[month] || 0) + gain;
      gainByYear[year] = (gainByYear[year] || 0) + gain;
    });
  
    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-blue-600 mb-4">Totaux des ventes et des gains</h2>
        
        <h3 className="text-lg font-semibold text-black mb-2">Par Mois :</h3>
        <table className="w-full border-collapse border border-gray-300 text-black">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Mois</th>
              <th className="border border-gray-300 px-4 py-2">Total Vente (MRU)</th>
              <th className="border border-gray-300 px-4 py-2">Gain (MRU)</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 12 }, (_, i) => {
              const monthKey = `${new Date().getFullYear()}-${(i + 1).toString().padStart(2, "0")}`;
              return (
                <tr key={monthKey} className="odd:bg-white even:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 font-medium">{monthKey}</td>
                  <td className="border border-gray-300 px-4 py-2">{totalByMonth[monthKey]?.toFixed(2) || "0.00"}</td>
                  <td className="border border-gray-300 px-4 py-2">{gainByMonth[monthKey]?.toFixed(2) || "0.00"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
  
        <h3 className="text-lg font-semibold text-black mt-6 mb-2">Par Année :</h3>
        <table className="w-full border-collapse border border-gray-300 text-black">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Année</th>
              <th className="border border-gray-300 px-4 py-2">Total Vente (MRU)</th>
              <th className="border border-gray-300 px-4 py-2">Gain (MRU)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(totalByYear).map(([year, total]) => (
              <tr key={year} className="odd:bg-white even:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 font-medium">{year}</td>
                <td className="border border-gray-300 px-4 py-2">{total.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">{gainByYear[year].toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default SalesHistory;
