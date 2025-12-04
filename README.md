# Formula 1 Dashboard PWA 🏎️

Una Progressive Web App (PWA) para fanáticos de la Fórmula 1 con datos en tiempo real desde OpenF1.

## 🚀 Características PWA

- ✅ **Instalable** - Se puede instalar como una app nativa
- ⚡ **Offline First** - Funciona sin conexión una vez cargada
- 📱 **Responsive** - Optimizada para móvil, tablet y desktop
- 🔄 **Auto-actualización** - Se actualiza automáticamente
- 📊 **Datos en tiempo real** - API de OpenF1 con cache inteligente
- 🎨 **Diseño moderno** - Interface elegante con Tailwind CSS

## 📱 Instalación

### En móvil:
1. Abre la app en tu navegador móvil
2. Aparecerá un prompt para "Instalar F1 Dashboard"
3. Toca "Instalar" y la app se agregará a tu pantalla de inicio

### En desktop:
1. Busca el ícono de instalación en la barra de direcciones
2. Haz clic en "Instalar F1 Dashboard"
3. La app se instalará como una aplicación nativa

## 🛠️ Desarrollo

Este proyecto usa Vue 3 + TypeScript + Vite + PWA.

### Instalación

```sh
npm install
```

### Desarrollo

```sh
npm run dev
```

### Build para producción

```sh
npm run build
```

### Preview de producción

```sh
npm run preview
```

## 🔧 Configuración PWA

- **Service Worker**: Cache automático de recursos y APIs
- **Manifest**: Configuración completa para instalación
- **Offline Support**: Los datos se guardan para uso sin conexión
- **Update Notifications**: Notifica cuando hay actualizaciones

## 📊 APIs Utilizadas

- **OpenF1**: Datos en tiempo real de F1
- **FlagCDN**: Banderas de países
- **Wikipedia**: Logo oficial de F1

## 🎨 Tecnologías

- Vue 3 (Composition API)
- TypeScript
- Tailwind CSS
- Vite PWA Plugin
- Workbox (Service Worker)
- Axios (HTTP Client)
- Pinia (State Management)

## 📱 Compatibilidad

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (iOS/macOS)
- ✅ Samsung Internet
- ✅ Opera

## 🚀 Deploy

La app está optimizada para deploy en:
- Vercel
- Netlify
- GitHub Pages
- Cualquier servidor estático

---

**¡Disfruta de la velocidad de la F1! 🏁**
