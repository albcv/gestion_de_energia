// src/pages/consultas.jsx
import { useState, useEffect, useCallback } from 'react';
import AsyncSelect from 'react-select/async';
import { getEntidadById, searchEntidad } from '../api/crud_modelos/entidad';
import { 
  getServiciosElectricosByEntidad, 
  getAniosDisponiblesEntidad,
  getEntidadesSinServicio,
  getEntidadesSinNombre
} from '../api/crud_modelos/entidad';
import { ConsumoAnualChart } from '../components/ConsumoAnualChart';

const consultaOptions = [
  { value: 'info', label: '📋 Información de una entidad' },
  { value: 'consumo', label: '📊 Consumo energético por mes de una entidad' },
  { value: 'servicios', label: '⚡ Servicios eléctricos asociados a una entidad' },
  { value: 'sin_servicio', label: '⚠️ Entidades sin servicio eléctrico asociado' },
  { value: 'sin_nombre', label: '❓ Entidades sin nombre asociado' },
];

export function Consultas() {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedConsulta, setSelectedConsulta] = useState('');
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasQueried, setHasQueried] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [unidad, setUnidad] = useState('MWh');

  const limpiarConsulta = () => {
    setSelectedConsulta('');
    setSelectedEntity(null);
    setSelectedYear('');
    setUnidad('MWh');
    setResultData(null);
    setHasQueried(false);
    setError('');
    setAvailableYears([]);
  };

  useEffect(() => {
    setResultData(null);
    setHasQueried(false);
    setError('');
    setAvailableYears([]);
    setSelectedYear('');
  }, [selectedConsulta, selectedEntity]);

  useEffect(() => {
    if (selectedConsulta === 'consumo' && selectedEntity) {
      const fetchYears = async () => {
        try {
          const years = await getAniosDisponiblesEntidad(selectedEntity.value);
          setAvailableYears(years);
          if (years.length > 0) setSelectedYear(years[0]);
        } catch (err) {
          console.error(err);
          setAvailableYears([]);
        }
      };
      fetchYears();
    } else {
      setAvailableYears([]);
      setSelectedYear('');
    }
  }, [selectedConsulta, selectedEntity]);

  const loadEntityOptions = useCallback(async (inputValue) => {
    if (!inputValue || inputValue.length < 2) return []; 
    try {
      const results = await searchEntidad(inputValue);
      console.log('Opciones recibidas:', results);
      return results;
    } catch (err) {
      console.error('Error en loadEntityOptions:', err);
      return [];
    }
  }, []);

  const handleExecute = async () => {
    if (!selectedConsulta) {
      setError('Seleccione un tipo de consulta');
      return;
    }
    if (['info', 'consumo', 'servicios'].includes(selectedConsulta) && !selectedEntity) {
      setError('Debe seleccionar una entidad');
      return;
    }
    if (selectedConsulta === 'consumo' && !selectedYear) {
      setError('Seleccione un año');
      return;
    }

    setLoading(true);
    setError('');
    setHasQueried(true);
    setResultData(null);

    try {
      if (selectedConsulta === 'info') {
        const entity = await getEntidadById(selectedEntity.value);
        setResultData({ type: 'info', data: entity });
      } else if (selectedConsulta === 'servicios') {
        const servicios = await getServiciosElectricosByEntidad(selectedEntity.value);
        setResultData({ type: 'servicios', data: servicios });
      } else if (selectedConsulta === 'consumo') {
        setResultData({
          type: 'consumo',
          data: { 
            entityId: selectedEntity.value, 
            year: selectedYear, 
            entityName: selectedEntity.label,
            unidad: unidad
          }
        });
      } else if (selectedConsulta === 'sin_servicio') {
        const entidades = await getEntidadesSinServicio();
        setResultData({ type: 'list', listType: 'sin_servicio', data: entidades });
      } else if (selectedConsulta === 'sin_nombre') {
        const entidades = await getEntidadesSinNombre();
        setResultData({ type: 'list', listType: 'sin_nombre', data: entidades });
      }
    } catch (err) {
      console.error(err);
      setError('Error al ejecutar la consulta');
    } finally {
      setLoading(false);
    }
  };

  const shouldShow = (value) => {
    return value !== null && value !== undefined && value !== '';
  };

  const renderResult = () => {
    if (!resultData) return null;

    switch (resultData.type) {
      case 'info': {
        const ent = resultData.data;
        const fields = [
          { label: 'Nombre', value: ent.nombre },
          { label: 'Código REEUP', value: ent.codigo_REEUP },
          { label: 'Municipio', value: ent.municipio_nombre },
          { label: 'NAE', value: ent.nae_codigo ? `${ent.nae_codigo} - ${ent.nae_nombre}` : (ent.nae_nombre || null) },
          { label: 'Siglas', value: ent.siglas },
          { label: 'Cuenta bancaria', value: ent.cuenta_bancaria },
          { label: 'Teléfono', value: ent.telefono },
          { label: 'NIT', value: ent.NIT },
          { label: 'Dirección', value: ent.direccion },
          { label: 'Geolocalización', value: ent.geolocalizacion },
        ];
        const nonEmptyFields = fields.filter(f => shouldShow(f.value));
        return (
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Información de la entidad</h2>
            <div className="space-y-2">
              {nonEmptyFields.map((field, idx) => (
                <p key={idx}>
                  <strong>{field.label}:</strong> {field.value}
                </p>
              ))}
            </div>
          </div>
        );
      }
      case 'servicios':
        if (!resultData.data.length) {
          return <div className="bg-white p-6 text-center">Esta entidad no tiene servicios eléctricos asociados.</div>;
        }
        return (
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Servicios eléctricos</h2>
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Código</th>
                  <th className="px-4 py-2">Mes</th>
                  <th className="px-4 py-2">Año</th>
                  <th className="px-4 py-2">Consumo real (kWh)</th>
                </tr>
              </thead>
              <tbody>
                {resultData.data.map(serv => (
                  <tr key={serv.id}>
                    <td className="px-4 py-2">{serv.codigo_servicio}</td>
                    <td className="px-4 py-2">{serv.mes}</td>
                    <td className="px-4 py-2">{serv.año}</td>
                    <td className="px-4 py-2">{serv.consumo_real?.toLocaleString('es-ES') || '0'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'consumo':
        const { entityId, year, entityName, unidad: unidadConsumo } = resultData.data;
        return (
          <div>
            <ConsumoAnualChart año={year} entityId={entityId} entidadNombre={entityName} unidad={unidadConsumo} />
          </div>
        );
      case 'list':
        if (!resultData.data.length) {
          return <div className="bg-white p-6 text-center">No se encontraron entidades.</div>;
        }
        
        let titulo = '';
        if (resultData.listType === 'sin_servicio') {
          titulo = `Entidades sin servicio eléctrico (${resultData.data.length} entidad${resultData.data.length !== 1 ? 'es' : ''})`;
        } else if (resultData.listType === 'sin_nombre') {
          titulo = `Entidades sin nombre asociado (${resultData.data.length} entidad${resultData.data.length !== 1 ? 'es' : ''})`;
        } else {
          titulo = `Listado de entidades (${resultData.data.length} entidad${resultData.data.length !== 1 ? 'es' : ''})`;
        }
        
        return (
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{titulo}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Código REEUP</th>
                    <th className="px-4 py-2">Municipio</th>
                  </tr>
                </thead>
                <tbody>
                  {resultData.data.map(ent => (
                    <tr key={ent.id}>
                      <td className="px-4 py-2">{ent.nombre || '—'}</td>
                      <td className="px-4 py-2">{ent.codigo_REEUP}</td>
                      <td className="px-4 py-2">{ent.municipio_nombre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-yellow-200 p-6">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Consultas de entidades</h1>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-2">Tipo de consulta:</label>
            <select
              value={selectedConsulta}
              onChange={(e) => setSelectedConsulta(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Seleccione una consulta</option>
              {consultaOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {['info', 'consumo', 'servicios'].includes(selectedConsulta) && (
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">Entidad:</label>
              <AsyncSelect
                loadOptions={loadEntityOptions}
                onChange={(opt) => setSelectedEntity(opt)}
                placeholder="Buscar por nombre o código REEUP..."
                isClearable
                className="w-full"
              />
            </div>
          )}

          {selectedConsulta === 'consumo' && availableYears.length > 0 && (
            <>
              <div className="mb-4">
                <label className="block text-gray-800 font-medium mb-2">Año:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-800 font-medium mb-2">Unidad:</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUnidad('kWh')}
                    className={`px-3 py-1 rounded-md transition ${
                      unidad === 'kWh' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    kWh
                  </button>
                  <button
                    onClick={() => setUnidad('MWh')}
                    className={`px-3 py-1 rounded-md transition ${
                      unidad === 'MWh' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    MWh
                  </button>
                  <button
                    onClick={() => setUnidad('GWh')}
                    className={`px-3 py-1 rounded-md transition ${
                      unidad === 'GWh' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    GWh
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleExecute}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-yellow-600 to-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-yellow-700 hover:to-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Consultando...' : 'Ejecutar consulta'}
            </button>
            <button
              onClick={limpiarConsulta}
              type="button"
              className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
            >
              Nueva consulta
            </button>
          </div>
          {error && <p className="text-red-600 mt-3 text-center">{error}</p>}
        </div>

        {hasQueried && !loading && renderResult()}
      </div>
    </div>
  );
}