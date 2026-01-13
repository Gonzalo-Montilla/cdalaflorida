import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, X, Clock, User, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatNumber';
import apiClient from '../api/client';

interface Notificacion {
  id: string;
  caja_id: string;
  turno: string;
  cajera_nombre: string;
  fecha_cierre: string;
  efectivo_entregar: number;
  monto_sistema: number;
  monto_fisico: number;
  diferencia: number;
  observaciones: string | null;
  estado: string;
  created_at: string;
}

export default function NotificacionesCierreCaja() {
  const queryClient = useQueryClient();

  // Obtener notificaciones pendientes
  const { data: notificaciones, isLoading } = useQuery<Notificacion[]>({
    queryKey: ['notificaciones-cierre-pendientes'],
    queryFn: async () => {
      const response = await apiClient.get('/notificaciones/pendientes');
      return response.data;
    },
    refetchInterval: 30000, // Actualizar cada 30 segundos
  });

  // Marcar como leída
  const marcarLeidaMutation = useMutation({
    mutationFn: async (notificacionId: string) => {
      await apiClient.post(`/notificaciones/${notificacionId}/marcar-leida`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones-cierre-pendientes'] });
    },
  });

  // Archivar notificación
  const archivarMutation = useMutation({
    mutationFn: async (notificacionId: string) => {
      await apiClient.delete(`/notificaciones/${notificacionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones-cierre-pendientes'] });
    },
  });

  if (isLoading) {
    return null;
  }

  if (!notificaciones || notificaciones.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="w-6 h-6 text-primary-600" />
        <h3 className="text-xl font-bold text-gray-900">
          Notificaciones de Cierre de Caja ({notificaciones.length})
        </h3>
      </div>

      <div className="space-y-3">
        {notificaciones.map((notif) => {
          const tieneDiferencia = Math.abs(notif.diferencia) > 0.01;
          const esFaltante = notif.diferencia < 0;
          const esSobrante = notif.diferencia > 0;

          return (
            <div
              key={notif.id}
              className="card-pos bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-700" />
                      <span className="font-bold text-blue-900">{notif.cajera_nombre}</span>
                    </div>
                    <span className="px-3 py-1 bg-blue-200 text-blue-900 text-sm font-semibold rounded-full">
                      Turno {notif.turno.charAt(0).toUpperCase() + notif.turno.slice(1)}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {new Date(notif.fecha_cierre).toLocaleString('es-CO')}
                    </div>
                  </div>

                  {/* Resumen Financiero */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <p className="text-xs text-gray-600 mb-1">Efectivo a Entregar</p>
                      <p className="text-xl font-bold text-green-700">
                        ${formatCurrency(notif.efectivo_entregar)}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <p className="text-xs text-gray-600 mb-1">Sistema vs Físico</p>
                      <p className="text-sm font-semibold text-gray-700">
                        ${formatCurrency(notif.monto_sistema)} / ${formatCurrency(notif.monto_fisico)}
                      </p>
                    </div>

                    <div className={`rounded-lg p-3 border-2 ${
                      tieneDiferencia 
                        ? esFaltante 
                          ? 'bg-red-50 border-red-300' 
                          : 'bg-orange-50 border-orange-300'
                        : 'bg-green-50 border-green-300'
                    }`}>
                      <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                        {tieneDiferencia && <AlertCircle className="w-3 h-3" />}
                        Diferencia
                      </p>
                      <p className={`text-xl font-bold ${
                        tieneDiferencia
                          ? esFaltante 
                            ? 'text-red-700' 
                            : 'text-orange-700'
                          : 'text-green-700'
                      }`}>
                        {notif.diferencia >= 0 ? '+' : ''}${formatCurrency(notif.diferencia)}
                      </p>
                      {esFaltante && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" />
                          Faltante
                        </p>
                      )}
                      {esSobrante && (
                        <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Sobrante
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Observaciones */}
                  {notif.observaciones && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Observaciones:</p>
                      <p className="text-sm text-gray-800">{notif.observaciones}</p>
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => marcarLeidaMutation.mutate(notif.id)}
                    disabled={marcarLeidaMutation.isPending}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                    title="Marcar como leída"
                  >
                    <Check className="w-4 h-4" />
                    OK
                  </button>
                  <button
                    onClick={() => archivarMutation.mutate(notif.id)}
                    disabled={archivarMutation.isPending}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                    title="Archivar"
                  >
                    <X className="w-4 h-4" />
                    Archivar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
