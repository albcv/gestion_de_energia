import { useState } from 'react';
import { realizarBackup } from '../api/gestionar_bd.js';
import { toast } from 'react-hot-toast';

export function GestionarBD() {
  const [loading, setLoading] = useState(false);

  const handleBackup = async () => {
    setLoading(true);
    try {
      const response = await realizarBackup();

      // Crear enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Obtener nombre del archivo desde Content-Disposition o usar default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'backup_datos.sql';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match) filename = match[1];
      }
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Backup generado correctamente');
    } catch (error) {
      console.error('Error al generar backup:', error);
      toast.error(error.response?.data?.error || 'Error al generar el backup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-200 p-6">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-600 to-red-600 p-6">
            <h1 className="text-3xl font-bold text-white">Gestión de Base de Datos 🗄️</h1>
          </div>
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Realizar Backup</h2>
                <p className="text-gray-600 mb-4">
                  Genera un archivo SQL con todos los datos de la base de datos (solo datos, no estructura).
                  El archivo se descargará automáticamente.
                </p>
                <button
                  onClick={handleBackup}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generando...
                    </>
                  ) : (
                    '📥 Realizar Backup (solo datos)'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}