// src/pages/inicio.jsx
import { Link } from "react-router-dom";
import freImg from '../img/FRE.jpg';        
import energyImg from '../img/energy.avif';
import { ConsumoAnualChart } from '../components/ConsumoAnualChart';

export function Inicio() {
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
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-600 to-red-600 rounded-2xl mb-6">
            <span className="text-white font-bold text-4xl">E</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-red-600">Sistema de Gestión Energética</span>
          </h1>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto">
           Plataforma para la gestión de la estrategia de desarrollo energética territorial
          </p>
        </div>

        {/* Gráfico de consumo */}
        <ConsumoAnualChart año={2025} />
      </div>
    </div>
  );
}