# Checklist de Pruebas - Edición de Vehículos

## ✅ Casos de Prueba

### 1. **Botón de Edición Visible Correctamente**
- [ ] El botón "Editar" aparece SOLO en vehículos con estado `registrado`
- [ ] El botón NO aparece en vehículos con estado `pagado`, `en_pista`, `aprobado`, etc.

### 2. **Iniciar Edición**
- [ ] Al hacer clic en "Editar", el formulario se carga con los datos actuales del vehículo
- [ ] Las fotos existentes se cargan correctamente
- [ ] El formulario muestra el badge "MODO EDICIÓN" en amarillo
- [ ] El botón cambia de "Registrar Vehículo" a "Actualizar Vehículo"
- [ ] El botón "Limpiar" cambia a "Cancelar"
- [ ] La página hace scroll automático al formulario

### 3. **Edición de Datos**
- [ ] Cambiar la placa y verificar que se actualiza
- [ ] Cambiar el tipo de vehículo (ej: de moto a liviano) y verificar que la tarifa se recalcula automáticamente
- [ ] Cambiar el año del modelo y verificar que la tarifa se recalcula
- [ ] Cambiar el estado del checkbox "¿Compra SOAT?" y verificar que el total se recalcula
- [ ] Editar nombre, documento y teléfono del cliente
- [ ] Editar marca y modelo
- [ ] Agregar/eliminar fotos

### 4. **Validaciones Backend**
- [ ] Intentar editar un vehículo que ya fue cobrado (estado `pagado`) → debe mostrar error
- [ ] Cambiar la placa a una que ya existe en otro vehículo registrado → debe mostrar error
- [ ] Verificar que solo recepcionistas y administradores pueden editar

### 5. **Recálculo de Tarifas**
- [ ] Editar un vehículo liviano 2020 y cambiar año a 2010 → verificar que la tarifa aumenta por antigüedad
- [ ] Cambiar de moto a carro → verificar que la comisión SOAT cambia de $30,000 a $50,000 (si aplica)
- [ ] Marcar SOAT en un vehículo que no lo tenía → verificar que se agrega la comisión al total
- [ ] Desmarcar SOAT en un vehículo que lo tenía → verificar que se quita la comisión

### 6. **Actualización Exitosa**
- [ ] Hacer clic en "Actualizar Vehículo" → debe mostrar toast verde "¡Vehículo actualizado exitosamente!"
- [ ] El formulario se limpia y vuelve al modo registro normal
- [ ] La tarjeta del vehículo se actualiza con los nuevos datos en la lista
- [ ] El total_cobrado actualizado es visible en el módulo Caja cuando el cajero va a cobrar

### 7. **Cancelar Edición**
- [ ] Hacer cambios en el formulario
- [ ] Hacer clic en "Cancelar"
- [ ] Verificar que el formulario se limpia y vuelve al modo registro
- [ ] Verificar que los cambios NO se guardaron

### 8. **Integración con Caja**
- [ ] Registrar un vehículo liviano 2020 a $92,000 (ejemplo)
- [ ] Editar el vehículo: cambiar año a 2010
- [ ] Verificar que la nueva tarifa (mayor por antigüedad) aparece correctamente
- [ ] En el módulo Caja, verificar que el vehículo muestra el nuevo total_cobrado
- [ ] Cobrar el vehículo exitosamente con el monto correcto

### 9. **Permisos y Seguridad**
- [ ] Iniciar sesión como recepcionista → debe poder editar vehículos registrados
- [ ] Iniciar sesión como administrador → debe poder editar vehículos registrados
- [ ] (Opcional) Si hay un cajero con acceso, verificar que NO puede editar (solo cajeros no deberían)

---

## 🚀 Comandos de Deploy

### Deploy Backend (producción)
```bash
# En el VPS
cd /root/cda-laflorida/backend
git pull origin main
sudo systemctl restart cda-laflorida.service
sudo systemctl status cda-laflorida.service
```

### Deploy Frontend (producción)
```bash
# En el VPS
cd /root/cda-laflorida/frontend
git pull origin main
npm run build
```

---

## 📝 Notas Importantes

- **Backup creado**: Tag `backup-antes-editar-vehiculos-20260121-081929`
- **Restaurar si falla**: `git checkout backup-antes-editar-vehiculos-20260121-081929`
- **Archivos modificados**:
  - `backend/app/api/v1/endpoints/vehiculos.py`
  - `backend/app/schemas/vehiculo.py`
  - `frontend/src/api/vehiculos.ts`
  - `frontend/src/pages/Recepcion.tsx`

---

## ⚠️ Validaciones Importantes

1. **Solo editar en estado REGISTRADO**: El backend valida que no se puedan editar vehículos que ya fueron cobrados
2. **Recálculo automático**: Cuando se edita el tipo o año del vehículo, el total_cobrado se recalcula automáticamente
3. **No se pierden datos**: Las fotos existentes se preservan a menos que se eliminen explícitamente
4. **Placa única**: No permite cambiar la placa a una que ya existe en otro vehículo activo
