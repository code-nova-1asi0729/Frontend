# Sprint 2: tareas del frontend

La base del proyecto ya está en `develop`:
- clases base en `shared`, layout, i18n y Angular Material;
- fake API con datos de prueba en `server/db.json`;
- el simulador de sensores;
- el flujo completo de **Buildings**, que sirve de ejemplo.

Cada tarea repite ese ejemplo para otro recurso. Los diagramas de clases en `docs/class-diagrams` (CD-07, CD-08 y CD-09) dicen exactamente qué clases, atributos y métodos crear. Usen los mismos nombres.

## Antes de empezar

1. Instalen Node.js 24 LTS. Clonen el repositorio y ejecuten `npm install`.
2. Abran tres terminales: `npm run fake-api`, `npm start` y, si su tarea usa lecturas, `npm run simulator`.
3. Creen su rama desde `develop`: `git checkout develop && git pull && git checkout -b feature/<nombre-de-su-rama>`.
4. Lean los archivos de Buildings en este orden. Su tarea sigue el mismo camino.

| Capa | Archivo de ejemplo |
|---|---|
| domain | `asset-monitoring/domain/model/building.entity.ts` |
| infrastructure | `buildings-response.ts`, `building-assembler.ts`, `buildings-api-endpoint.ts`, `asset-monitoring-api.ts` |
| application | `asset-monitoring/application/asset-monitoring.store.ts` |
| presentation | `presentation/asset-monitoring.routes.ts`, `views/building-list`, `views/building-form` |

## Reglas para todos

- Un solo store por bounded context. Asset Monitoring usa `AssetMonitoringStore`; Incidents crea `IncidentsStore`. No creen un store por recurso.
- Las entidades usan campos privados `#` con get y set, como `Building`. Las reglas del negocio van en métodos de la entidad, no en la vista.
- Los enums van en su propio archivo dentro de `domain/model` (por ejemplo `equipment-type.ts`).
- Ningún texto fijo en las vistas: todo va en `public/i18n/en.json` y `es.json`.
- Los formularios heredan de `BaseForm` y muestran errores con `isInvalidControl` y `errorMessageForControl`.
- Commits con Conventional Commits y el scope del bounded context, por ejemplo: `feat(asset-monitoring): add equipment list view`.
- Antes del Pull Request a `develop`, ejecuten `npm run build`. Debe terminar sin errores.

**Archivos compartidos.** Varias tareas tocan los mismos archivos:
- `asset-monitoring-api.ts`, `asset-monitoring.store.ts` y `asset-monitoring.routes.ts`;
- `layout.ts`, `en.json` y `es.json`.

Agreguen sus líneas al final de cada bloque y hagan `git pull origin develop` antes del Pull Request. Si hay conflicto, conserven las líneas de ambos.

**Orden de merge.** La Tarea 1 crea `CriticalEquipment`, que usan las demás.
- La Tarea 1 hace su primer Pull Request, solo con domain, infrastructure y store, en las primeras horas.
- Mientras tanto, las Tareas 2 y 3 avanzan con su domain e infrastructure.
- La Tarea 4 no depende de nadie: solo usa los edificios que ya existen.

---

## Tarea 1: Equipos críticos (US08, US09, US11)

Rama: `feature/asset-monitoring-equipment`. Diagramas: CD-07 y CD-08.

1. **domain/model:** `equipment-type.ts`, `equipment-status.ts` y `critical-equipment.entity.ts`.
   - Métodos: `isOperational()` y `decommission()`. Dar de baja cambia el estado a `DECOMMISSIONED`; no borra el equipo (US09).
2. **infrastructure:** `equipment-response.ts`, `equipment-assembler.ts` y `equipment-api-endpoint.ts`.
   - `installationDate` viaja como texto `yyyy-MM-dd`.
   - Para leerlo usen ``new Date(`${fecha}T00:00:00`)``, que lo toma como fecha local y evita que se corra un día.
   - Para escribirlo usen `formatDate(fecha, 'yyyy-MM-dd', 'en-US')` de `@angular/common`.
3. **AssetMonitoringApi:** `getEquipment()`, `createEquipment()` y `updateEquipment()`.
4. **AssetMonitoringStore:**
   - el signal privado `equipmentSignal`;
   - un `computed` público `equipment` que enlaza cada equipo con su `Building` (`item.building = ...`);
   - los métodos `getEquipmentById`, `getEquipmentByBuilding`, `addEquipment`, `updateEquipment` y `decommissionEquipment`;
   - la carga de equipos dentro de `loadAll()`.
5. **Vistas:**
   - `equipment-list`: tabla con filtro por edificio (`mat-select` y el signal `selectedBuildingId`), y botones editar y dar de baja.
   - `equipment-form`: edificio y tipo con `mat-select`, fecha con `mat-datepicker` y `providers: [provideNativeDateAdapter()]`, y estado.
6. **Rutas y menú:** `equipment`, `equipment/new` y `equipment/:id/edit`. Opción de menú `option.equipment`. Textos en `equipment.*`, incluidos los nombres de cada tipo y estado.

Listo cuando: se lista, filtra, registra, edita y da de baja un equipo, y los cambios quedan en `db.json`.

## Tarea 2: Alertas activas (US19, US20)

Rama: `feature/asset-monitoring-alerts`. Diagramas: CD-07 y CD-08.

1. **domain/model:** `alert-severity.ts`, `alert-status.ts` y `alert.entity.ts`.
   - Métodos: `isActive()`, `severityRank()` (LOW=0 … CRITICAL=3), `acknowledge()` (solo desde ACTIVE) y `resolve()`.
2. **infrastructure:** `alerts-response.ts`, `alert-assembler.ts` y `alerts-api-endpoint.ts`. `detectedAt` se convierte a `Date`.
3. **AssetMonitoringApi:** `getAlerts()` y `updateAlert()`.
4. **AssetMonitoringStore:**
   - el signal privado `alertsSignal`;
   - un `computed` `alerts` que enlaza cada alerta con su equipo;
   - un `computed` `activeAlerts`, sin resueltas y ordenadas de mayor a menor severidad;
   - el método `changeAlertStatus(alert, status)`, que llama al método de la entidad y luego guarda;
   - la carga de alertas en `loadAll()`.
   - Hasta que la Tarea 1 haga merge, muestren `equipmentId` en vez del nombre del equipo.
5. **Vista `alert-list`:**
   - tarjetas (`mat-card`) con la cantidad de alertas activas por severidad;
   - un `mat-slide-toggle` "mostrar resueltas" (signal `showResolved`);
   - una tabla con severidad (con un color por nivel), equipo, métrica, último valor, fecha (pipe `date`) y estado;
   - los botones "En gestión" y "Resolver".
6. **Rutas y menú:** ruta `alerts` y opción `option.alerts`. Textos en `alerts.*` y en `metrics.*` (los nombres de las 4 métricas, que también usa la Tarea 3).
   - Cambien el botón de `home.html` para que lleve a las alertas: es el dashboard del administrador.

Listo cuando: las alertas aparecen ordenadas por severidad, el conteo por severidad es correcto y los cambios de estado se guardan.

Esta tarea es un poco más corta, así que también incluye la integración final:
- después del último merge, ejecutar `npm run build` en `develop`;
- recorrer todas las pantallas en inglés y en español;
- abrir el Pull Request de `develop` a `main`, que despliega en Vercel.

## Tarea 3: Sensores e historial de lecturas (US10, US14)

Rama: `feature/asset-monitoring-sensors`. Diagramas: CD-07 y CD-08.

1. **domain/model:** `sensor-status.ts`, `sensor.entity.ts` y `sensor-reading.entity.ts`.
   - Regla del sensor: pertenece a un solo equipo activo a la vez. `assignTo(equipmentId)` lanza un error si el sensor ya tiene equipo.
   - Métodos del sensor: `isAssigned()`, `assignTo()` y `unassign()`. La lectura tiene `isValid()`.
2. **infrastructure:** `sensors-response.ts`, `sensor-assembler.ts`, `sensors-api-endpoint.ts`, `sensor-readings-response.ts`, `sensor-reading-assembler.ts` y `sensor-readings-api-endpoint.ts`.
3. **AssetMonitoringApi:** `getSensors()`, `updateSensor()` y `getSensorReadings()`.
4. **AssetMonitoringStore:**
   - los signals `sensorsSignal` y `readingsSignal`;
   - un `computed` `sensors` que enlaza cada sensor con su equipo;
   - los métodos `getReadingsByEquipment`, `assignSensor`, `unassignSensor` y `reloadReadings`, más el privado `saveSensor`;
   - la carga en `loadAll()`.
   - Si `assignTo` lanza un error, guárdenlo en `errorSignal` y no llamen a la API.
5. **Vistas:**
   - `sensor-list`: tabla con número de serie, modelo, equipo, estado y última señal, y botones asignar o desasignar.
   - `sensor-assign-form`: `mat-select` con los equipos, en la ruta `sensors/:id/assign`.
   - `reading-history`: selector de equipo, rango de fechas (`mat-date-range-input` con `provideNativeDateAdapter()`), tabla de lecturas de la más reciente a la más antigua y botón "Actualizar" que llama a `reloadReadings()`.
   - Si no hay lecturas en el rango, muestran "No hay lecturas registradas en este periodo" (criterio de US14).
6. **Rutas y menú:** `sensors`, `sensors/:id/assign` y `readings`. Opciones `option.sensors` y `option.readings`. Textos en `sensors.*` y `readings.*`.

Listo cuando:
- el sensor VS-1003 se asigna a un equipo;
- un sensor ya asignado no se puede asignar a otro;
- con `npm run simulator` encendido, "Actualizar" muestra lecturas nuevas.

## Tarea 4: Incidentes (US23, US25, US27)

Rama: `feature/incidents`. Diagrama: CD-09. Es un bounded context nuevo, con sus cuatro capas.

1. **domain/model:** `incident-status.ts`, `incident-category.ts` e `incident.entity.ts`. Métodos:
   - `startManagement()` y `resolve()`, que guardan la fecha del cambio;
   - `canBeRated()`: solo si está RESOLVED y no fue calificado;
   - `rate(score, comment)`: puntaje de 1 a 5; lanza un error si no se puede calificar.
2. **infrastructure:** `incidents-response.ts`, `incident-assembler.ts`, `incidents-api-endpoint.ts` e `incidents-api.ts` (`IncidentsApi extends BaseApi`).
3. **application:** `incidents.store.ts` (`IncidentsStore`). Métodos: `getIncidentById`, `reportIncident`, `startManagement`, `resolveIncident` y `rateIncident`, más los privados `save` y `loadIncidents`.
4. **Vistas:**
   - `incident-list`: tabla, y botones según el estado: "Iniciar gestión", "Resolver" y "Calificar".
   - `incident-form`:
     - edificio con los edificios de `AssetMonitoringStore`; es la única lectura entre contextos y aparece en CD-09;
     - equipo opcional, filtrado por el edificio elegido;
     - categoría y descripción.
     - Hasta tener IAM, el residente es la constante `CURRENT_RESIDENT_ID = 3`, con un comentario que lo explique.
   - `incident-rating-form`: puntaje con `mat-button-toggle-group` del 1 al 5 y comentario.
5. **Rutas:** `presentation/incidents.routes.ts` con `''`, `new` y `:id/rate`.
   - Agreguen `{ path: 'incidents', loadChildren: incidentsRoutes }` en `app.routes.ts`.
   - Opción de menú `option.incidents`. Textos en `incidents.*`.

Listo cuando:
- se reporta un incidente;
- cambia de Recibido a En gestión y a Resuelto;
- se califica una sola vez, y solo si está resuelto.
