// src/components/ConsumoAnualChart.jsx
import { useState, useEffect } from 'react';
import { getConsumoPorMes } from '../api/consultas.js';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const mesesNombres = {
  1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun',
  7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic'
};

const formatNumber = (num) => {
  return num.toLocaleString('es-ES', { 
    useGrouping: true, 
    maximumFractionDigits: 2   
  }).replace(/\./g, ' ');     
};

const yAxisFormat = (value) => {
  if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
  if (value >= 1e3) return (value / 1e3).toFixed(1) + 'k';
  return value.toString();
};

export function ConsumoAnualChart({ año, unidad = 'kW' }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPeriodo, setTotalPeriodo] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const monthlyData = await getConsumoPorMes(año, unidad);
        setData(monthlyData);
        const total = monthlyData.reduce((acc, item) => acc + item.total, 0);
        setTotalPeriodo(total);
      } catch (err) {
        console.error('Error cargando datos de consumo:', err);
        setError('No se pudieron cargar los datos. Intente de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [año, unidad]);

  if (loading) return <div className="text-center py-12">Cargando datos...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;
  if (!data.length) return <div className="text-center py-12 text-gray-600">No hay datos disponibles para el año {año}</div>;

  const maxTotal = Math.max(...data.map(d => d.total), 0);
  const yDomain = [0, maxTotal * 1.1 || 100];

  const unidadLower = unidad === 'MW' ? 'MW' : 'kW';

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Consumo por mes en {año} ({unidadLower})
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" tickFormatter={(mes) => mesesNombres[mes]} />
          <YAxis domain={yDomain} tickFormatter={yAxisFormat} />
          <Tooltip
            formatter={(value) => [`${formatNumber(value)} ${unidadLower}`, 'Consumo']}
            labelFormatter={(label) => mesesNombres[label]}
          />
          <Legend />
          <Bar dataKey="total" fill="#ef4444" name={`Consumo real (${unidadLower})`} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-center text-gray-900 mt-4">
        Total anual: <span className='font-bold text-red-700'>{formatNumber(totalPeriodo)} {unidadLower}</span>
      </p>
    </div>
  );
}