// src/components/TopEntidadesConsumo.jsx
import { useState, useEffect } from 'react';
import { getTopEntidadesConsumo } from '../api/consultas.js';

const formatNumber = (num) => {
  return num.toLocaleString('es-ES', { 
    useGrouping: true, 
    maximumFractionDigits: 2
  }).replace(/\./g, ' ');
};

export function TopEntidadesConsumo({ año, unidad = 'kWh' }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getTopEntidadesConsumo(año, unidad);
        setData(result);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el ranking de entidades.');
      } finally {
        setLoading(false);
      }
    };
    if (año) fetchData();
  }, [año, unidad]);

  if (loading) return <div className="text-center py-4">Cargando ranking...</div>;
  if (error) return <div className="text-center py-4 text-red-600">{error}</div>;
  if (!data.length) return <div className="text-center py-4 text-gray-900">No hay datos para el año {año}.</div>;

  let unidadLabel = 'kWh';
  if (unidad === 'MWh') unidadLabel = 'MWh';
  else if (unidad === 'GWh') unidadLabel = 'GWh';
  else unidadLabel = 'kWh';

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Top 10 entidades con mayor consumo en {año} ({unidadLabel})
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">#</th>
              <th className="px-4 py-2 text-left text-gray-700">Nombre de la entidad</th>
              <th className="px-4 py-2 text-left text-gray-700">Código REEUP</th>
              <th className="px-4 py-2 text-right text-red-700 font-bold">Consumo total ({unidadLabel})</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.codigo_reeup} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">
                   {item.nombre && item.nombre.trim() !== '' ? item.nombre : 'Desconocido'}
                  
                  </td>
                <td className="px-4 py-2">{item.codigo_reeup}</td>
                <td className="px-4 py-2 text-right font-semibold text-red-700">{formatNumber(item.consumo_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}