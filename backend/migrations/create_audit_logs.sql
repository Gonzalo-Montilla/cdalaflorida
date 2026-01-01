-- =====================================================
-- Migración: Crear tabla de auditoría (audit_logs)
-- Descripción: Registra todas las operaciones críticas del sistema
-- Fecha: 2025-11-25
-- =====================================================

-- Crear tipo ENUM para las acciones
CREATE TYPE audit_action_enum AS ENUM (
    'login',
    'logout',
    'failed_login',
    'create_user',
    'update_user',
    'delete_user',
    'change_password',
    'open_caja',
    'close_caja',
    'register_gasto',
    'register_ingreso_extra',
    'create_tesoreria_movement',
    'update_tesoreria_movement',
    'delete_tesoreria_movement',
    'create_tarifa',
    'update_tarifa',
    'activate_tarifa',
    'deactivate_tarifa',
    'register_vehicle',
    'update_vehicle',
    'delete_vehicle'
);

-- Crear tabla de auditoría
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Información de la acción
    action audit_action_enum NOT NULL,
    description VARCHAR(500) NOT NULL,
    
    -- Usuario que realizó la acción
    usuario_id UUID,  -- NULL para acciones anónimas (login fallido)
    usuario_email VARCHAR(255),
    usuario_nombre VARCHAR(200),
    usuario_rol VARCHAR(50),
    
    -- Información de la solicitud
    ip_address VARCHAR(45),  -- Soporta IPv6
    user_agent VARCHAR(500),
    
    -- Datos adicionales
    extra_data JSONB,
    
    -- Resultado
    success VARCHAR(20) NOT NULL DEFAULT 'success',  -- 'success', 'failed', 'error'
    error_message TEXT,
    
    -- Timestamp
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar consultas
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_usuario_id ON audit_logs(usuario_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_success ON audit_logs(success);
CREATE INDEX idx_audit_logs_ip_address ON audit_logs(ip_address);

-- Comentarios
COMMENT ON TABLE audit_logs IS 'Registro de auditoría de operaciones críticas del sistema';
COMMENT ON COLUMN audit_logs.action IS 'Tipo de acción realizada';
COMMENT ON COLUMN audit_logs.description IS 'Descripción legible de la acción';
COMMENT ON COLUMN audit_logs.usuario_id IS 'ID del usuario que realizó la acción (NULL para acciones anónimas)';
COMMENT ON COLUMN audit_logs.ip_address IS 'Dirección IP desde donde se realizó la acción';
COMMENT ON COLUMN audit_logs.user_agent IS 'User-Agent del navegador/cliente';
COMMENT ON COLUMN audit_logs.extra_data IS 'Información adicional en formato JSON';
COMMENT ON COLUMN audit_logs.success IS 'Estado del resultado: success, failed, error';
COMMENT ON COLUMN audit_logs.created_at IS 'Fecha y hora de la acción';
