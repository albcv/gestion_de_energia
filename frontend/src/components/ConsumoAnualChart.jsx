import { useState, useEffect } from 'react';
import { getConsumoPorMes } from '../api/consultas.js';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const mesesNombres = {
  1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun',
  7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic'
};

// Formato para tooltip y total (separadores de miles, 2 decimales)
const formatNumber = (num) => {
  return num.toLocaleString('es-ES', { useGrouping: true, maximumFractionDigits: 2 });
};

// Formato abreviado para el eje Y (con 1 decimal para miles)
const yAxisFormat = (value) => {
  if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
  if (value >= 1e3) return (value / 1e3).toFixed(1) + 'k';
  return value.toString();
};

export function ConsumoAnualChart({ año = 2025 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAnual, setTotalAnual] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const monthlyData = await getConsumoPorMes(año);
        setData(monthlyData);
        const total = monthlyData.reduce((acc, item) => acc + item.total, 0);
        setTotalAnual(total);
      } catch (err) {
        console.error('Error cargando datos de consumo:', err);
        setError('No se pudieron cargar los datos. Intente de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [año]);

  if (loading) {
    return <div className="text-center py-12">Cargando datos...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  if (!data.length) {
    return <div className="text-center py-12 text-gray-600">No hay datos disponibles para el año {año}</div>;
  }

  // Calcular valor máximo para el eje Y (con margen del 10%)
  const maxTotal = data.length ? Math.max(...data.map(d => d.total)) : 0;
  const yDomain = [0, maxTotal * 1.1 || 100];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Consumo total por mes en {año} (kW)
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" tickFormatter={(mes) => mesesNombres[mes]} />
          <YAxis domain={yDomain} tickFormatter={yAxisFormat} />
          <Tooltip
            formatter={(value) => [`${formatNumber(value)} kW`, 'Consumo real']}
            labelFormatter={(label) => mesesNombres[label]}
          />
          <Legend />
          <Bar dataKey="total" fill="#ef4444" name="Consumo real (kW)" />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-center text-gray-600 mt-4">
        Total anual: {formatNumber(totalAnual)} kW
      </p>
    </div>
  );
}