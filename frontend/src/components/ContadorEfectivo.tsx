import { useState, useEffect } from 'react';

export interface DesgloseEfectivo {
  billetes_100000: number;
  billetes_50000: number;
  billetes_20000: number;
  billetes_10000: number;
  billetes_5000: number;
  billetes_2000: number;
  billetes_1000: number;
  monedas_1000: number;
  monedas_500: number;
  monedas_200: number;
  monedas_100: number;
  monedas_50: number;
}

interface Props {
  montoDeclarado: number;
  onChange: (desglose: DesgloseEfectivo) => void;
}

export default function ContadorEfectivo({ montoDeclarado, onChange }: Props) {
  const [desglose, setDesglose] = useState<DesgloseEfectivo>({
    billetes_100000: 0,
    billetes_50000: 0,
    billetes_20000: 0,
    billetes_10000: 0,
    billetes_5000: 0,
    billetes_2000: 0,
    billetes_1000: 0,
    monedas_1000: 0,
    monedas_500: 0,
    monedas_200: 0,
    monedas_100: 0,
    monedas_50: 0,
  });

  const calcularTotal = (d: DesgloseEfectivo): number => {
    return (
      d.billetes_100000 * 100000 +
      d.billetes_50000 * 50000 +
      d.billetes_20000 * 20000 +
      d.billetes_10000 * 10000 +
      d.billetes_5000 * 5000 +
      d.billetes_2000 * 2000 +
      d.billetes_1000 * 1000 +
      d.monedas_1000 * 1000 +
      d.monedas_500 * 500 +
      d.monedas_200 * 200 +
      d.monedas_100 * 100 +
      d.monedas_50 * 50
    );
  };

  const totalCalculado = calcularTotal(desglose);
  const diferencia = totalCalculado - montoDeclarado;
  const coincide = diferencia === 0 && montoDeclarado > 0;

  useEffect(() => {
    onChange(desglose);
  }, [desglose, onChange]);

  const handleChange = (campo: keyof DesgloseEfectivo, valor: string) => {
    const cantidad = parseInt(valor) || 0;
    setDesglose({ ...desglose, [campo]: cantidad >= 0 ? cantidad : 0 });
  };

  const denominaciones = [
    { tipo: 'billetes', denominacion: 100000, label: '$100.000', emoji: '💵', campo: 'billetes_100000' as keyof DesgloseEfectivo },
    { tipo: 'billetes', denominacion: 50000, label: '$50.000', emoji: '💵', campo: 'billetes_50000' as keyof DesgloseEfectivo },
    { tipo: 'billetes', denominacion: 20000, label: '$20.000', emoji: '💵', campo: 'billetes_20000' as keyof DesgloseEfectivo },
    { tipo: 'billetes', denominacion: 10000, label: '$10.000', emoji: '💵', campo: 'billetes_10000' as keyof DesgloseEfectivo },
    { tipo: 'billetes', denominacion: 5000, label: '$5.000', emoji: '💵', campo: 'billetes_5000' as keyof DesgloseEfectivo },
    { tipo: 'billetes', denominacion: 2000, label: '$2.000', emoji: '💵', campo: 'billetes_2000' as keyof DesgloseEfectivo },
    { tipo: 'billetes', denominacion: 1000, label: '$1.000', emoji: '💵', campo: 'billetes_1000' as keyof DesgloseEfectivo },
    { tipo: 'monedas', denominacion: 1000, label: '$1.000', emoji: '💰', campo: 'monedas_1000' as keyof DesgloseEfectivo },
    { tipo: 'monedas', denominacion: 500, label: '$500', emoji: '💰', campo: 'monedas_500' as keyof DesgloseEfectivo },
    { tipo: 'monedas', denominacion: 200, label: '$200', emoji: '💰', campo: 'monedas_200' as keyof DesgloseEfectivo },
    { tipo: 'monedas', denominacion: 100, label: '$100', emoji: '💰', campo: 'monedas_100' as keyof DesgloseEfectivo },
    { tipo: 'monedas', denominacion: 50, label: '$50', emoji: '💰', campo: 'monedas_50' as keyof DesgloseEfectivo },
  ];

  return (
    <div className="border-2 border-yellow-300 rounded-lg p-6 bg-yellow-50">
      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-2xl">💰</span>
        Desglose de Efectivo
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {denominaciones.map((item) => {
          const cantidad = desglose[item.campo];
          const subtotal = cantidad * item.denominacion;

          return (
            <div key={item.campo} className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  {item.emoji} {item.label}
                </span>
                {subtotal > 0 && (
                  <span className="text-xs font-bold text-green-600">
                    ${subtotal.toLocaleString()}
                  </span>
                )}
              </div>
              <input
                type="number"
                min="0"
                value={cantidad || ''}
                onChange={(e) => handleChange(item.campo, e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-bold"
              />
            </div>
          );
        })}
      </div>

      {/* Resumen */}
      <div className={`border-t-2 pt-4 ${
        coincide ? 'border-green-500' : diferencia !== 0 ? 'border-red-500' : 'border-gray-300'
      }`}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-600">Monto declarado:</span>
          <span className="text-lg font-bold text-gray-900">
            ${montoDeclarado.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-600">Total contado:</span>
          <span className={`text-lg font-bold ${
            totalCalculado === 0 ? 'text-gray-400' : 'text-blue-600'
          }`}>
            ${totalCalculado.toLocaleString()}
          </span>
        </div>

        {montoDeclarado > 0 && diferencia !== 0 && (
          <div className={`flex justify-between items-center p-3 rounded-lg mt-3 ${
            diferencia > 0 ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            <span className="text-sm font-bold">
              {diferencia > 0 ? '⚠️ Sobra:' : '❌ Falta:'}
            </span>
            <span className={`text-xl font-bold ${
              diferencia > 0 ? 'text-yellow-700' : 'text-red-700'
            }`}>
              ${Math.abs(diferencia).toLocaleString()}
            </span>
          </div>
        )}

        {coincide && (
          <div className="bg-green-100 border-2 border-green-500 rounded-lg p-3 mt-3">
            <p className="text-center text-green-800 font-bold">
              ✅ El desglose coincide con el monto declarado
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
