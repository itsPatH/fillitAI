# Fill It AI Chrome Extension (MV3)

Esta carpeta usa un flujo de build específico para extensiones Chrome Manifest V3 con Vite.

## Build

```bash
npm run build
```

El build genera en `dist/`:

- `index.html` (popup)
- `background.js` (service worker)
- `contentScript.js` (content script)
- `manifest.json` (copiado durante el build)

## Cargar la extensión (unpacked)

1. Ejecuta `npm run build`.
2. Abre `chrome://extensions`.
3. Activa **Developer mode**.
4. Click en **Load unpacked**.
5. Selecciona la carpeta `extension/dist`.

## Notas de implementación

- Las entradas de Rollup se configuran explícitamente para `index.html`, `background.ts` y `src/scripts/contentScript.ts`.
- `manifest.json` referencia exactamente los artefactos emitidos en `dist`.
- El script obsoleto `src/scripts/content.ts` fue removido para evitar confusión.
