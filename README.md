# App-Proyecto-2026 — Cannibals Lara

Aplicación móvil desarrollada en **React Native (Expo Router)** para la gestión deportiva y administrativa del club de hockey en línea **Cannibals Lara**.

## Módulos incluidos

- **Panel de Control**: resumen de atletas activos, posiciones, inventario disponible, torneos próximos y distribución por categoría.
- **Administración**:
  - **Atletas**: registro paso a paso, consulta desplegable, edición, retiro y re-inscripción.
  - **Posiciones**: registro, modificación y eliminación de posiciones técnicas.
- **Inventario**:
  - **Inventario de Artículos**: piezas agrupadas por catálogo con códigos del club (`CL-XXXX`), registro por lote, estado físico y retiro/reincorporación.
  - **Catálogo**: definición de equipamiento, stock mínimo, tallas dinámicas y posición recomendada.
- **Competencias**:
  - **Torneos**: calendario de torneos, filtros por estatus (*Por Disputarse*, *En Curso*, *Finalizado*) y gestión completa.
- **Ajustes**: modo claro / oscuro y cierre de sesión.

## Requisitos previos

- [Node.js LTS](https://nodejs.org/es)
- App **Expo Go** en tu teléfono (Android / iOS) o navegador web.

## Instalación y ejecución

1. Clona el repositorio:
   ```bash
   git clone https://github.com/YonathanM02/App-Proyecto-2026.git
   cd App-Proyecto-2026
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npx expo start
   ```
   - Presiona **`w`** para abrirlo en el navegador web.
   - O escanea el código QR con **Expo Go** en tu teléfono.
   - Si usas VPN en la PC, ejecuta `npx expo start --tunnel`.
