// src/pages/inicio.jsx
import { useState, useEffect } from "react";
import freImg from '../img/FRE.jpg';        
import energyImg from '../img/energy.avif';
import { ConsumoAnualChart } from '../components/ConsumoAnualChart';
import { TopEntidadesConsumo } from '../components/TopEntidadesConsumo';
import { getAniosDisponibles } from '../api/crud_modelos/portador_energetico_elec';

export function Inicio() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [years, setYears] = useState([]);
  const [loadingYears, setLoadingYears] = useState(true);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const años = await getAniosDisponibles();
        setYears(años);
        if (años.length > 0) {
          setSelectedYear(años[0]);
        }
      } catch (error) {
        console.error('Error cargando años:', error);
      } finally {
        setLoadingYears(false);
      }
    };
    fetchYears();
  }, []);

  if (loadingYears) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b bg-yellow-200 relative overflow-hidden">
      <img 
        src={freImg} 
        alt="Fuentes Renovables de Energía" 
        className="absolute top-0 left-0 w-20 sm:w-32 md:w-40 lg:w-48 h-auto z-0" 
      />
      <img 
        src={energyImg} 
        alt="Símbolo de energía" 
        className="absolute top-0 right-0 w-20 sm:w-32 md:w-40 lg:w-48 h-auto z-0 rounded"
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-600 to-red-600 rounded-2xl mb-6">
            <span className="text-white font-bold text-4xl">⚡</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-red-600">
              Sistema de Gestión Energética
            </span>
          </h1>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto">
            Plataforma para la gestión de la estrategia de desarrollo energética territorial
          </p>
        </div>

        {years.length > 0 && (
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg shadow-md p-2 flex items-center gap-3">
              <label htmlFor="yearSelect" className="text-gray-700 font-medium">Año:</label>
              <select
                id="yearSelect"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {years.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            No hay años disponibles. Agregue registros de consumo para visualizar el gráfico.
          </div>
        )}

        {selectedYear && (
          <>
            <ConsumoAnualChart año={selectedYear} />
            <TopEntidadesConsumo año={selectedYear} />
          </>
        )}
      </div>
    </div>
  );
}