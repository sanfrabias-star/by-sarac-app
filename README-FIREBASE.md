# 🔥 Smart Expense Tracker - Versión con Firebase

## 🎯 ¿Qué es Esto?

Esta es una versión **MEJORADA** de tu Smart Expense Tracker que incluye:

✨ **Sincronización Automática** - Tus datos se sincronizan en tiempo real entre todos tus dispositivos
✨ **Login con Google** - Acceso simple y seguro
✨ **Datos en la Nube** - Nunca perderás tu información
✨ **Múltiples Dispositivos** - PC, celular, tablet - todos sincronizados

---

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js instalado (versión 16 o superior)
- Una cuenta de Google
- 15 minutos para configurar Firebase

### Pasos Rápidos

1. **Configura Firebase** (solo una vez)
   - Lee: `GUIA-FIREBASE-COMPLETA.md`
   - Crea tu proyecto en Firebase
   - Obtén tus credenciales

2. **Configura la App**
   - Copia `.env.local.template` a `.env.local`
   - Llena tus credenciales de Firebase

3. **Instala y Ejecuta**
   ```bash
   npm install
   npm run dev
   ```

4. **¡Listo!**
   - Abre `http://localhost:5173`
   - Haz login con Google
   - Empieza a usar tu app

---

## 📁 Estructura del Proyecto

```
smart-expense-tracker-firebase/
├── src/
│   ├── config/
│   │   └── firebase.ts          # Configuración de Firebase
│   ├── contexts/
│   │   └── AuthContext.tsx      # Manejo de autenticación
│   ├── hooks/
│   │   └── useFirebaseData.ts   # Hook para sincronización
│   ├── components/
│   │   ├── Login.tsx            # Pantalla de login
│   │   ├── Header-Firebase.tsx  # Header con info de usuario
│   │   └── ... otros componentes
│   ├── App-Firebase.tsx         # App principal con Firebase
│   └── ...
├── .env.local.template          # Template de configuración
├── GUIA-FIREBASE-COMPLETA.md    # Guía paso a paso
└── package.json                 # Dependencias (incluye Firebase)
```

---

## 🔧 Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz con:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_dominio.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 2. Reglas de Firestore

Usa estas reglas en tu Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 📱 Cómo Usar en Múltiples Dispositivos

### En tu PC:
1. Ejecuta `npm run dev`
2. Haz login con Google
3. Agrega tus gastos

### En tu Celular:
1. Despliega la app en Netlify (con las variables de entorno)
2. Abre la URL de Netlify en tu celular
3. Haz login con el MISMO Google
4. ¡Verás todos tus datos!

### Sincronización Automática:
- Agrega un gasto en tu PC → Aparece inmediatamente en tu celular
- Edita en tu celular → Se actualiza en tu PC
- ¡Funciona en tiempo real!

---

## 🌐 Desplegar en Netlify

### 1. Compilar

```bash
npm run build
```

### 2. Configurar Variables en Netlify

En tu panel de Netlify:
- Site Settings → Environment Variables
- Agrega TODAS las variables de tu `.env.local`

### 3. Subir

- Arrastra la carpeta `dist` a Netlify
- ¡Listo!

---

## 💾 ¿Dónde se Guardan los Datos?

### Antes (versión sin Firebase):
- ❌ Solo en el navegador local (localStorage)
- ❌ Cada dispositivo tenía datos separados
- ❌ Si borrabas el caché, perdías todo

### Ahora (versión con Firebase):
- ✅ En la nube de Firebase (Firestore)
- ✅ Sincronizados entre todos tus dispositivos
- ✅ Respaldados automáticamente
- ✅ Accesibles desde cualquier lugar

---

## 🔐 Seguridad

- ✅ Cada usuario solo puede ver sus propios datos
- ✅ Autenticación manejada por Google
- ✅ Reglas de seguridad en Firestore
- ✅ Credenciales en variables de entorno

---

## 📊 Límites del Plan Gratuito

Firebase ofrece un plan gratuito muy generoso:

**Firestore:**
- 1 GB de almacenamiento
- 50,000 lecturas por día
- 20,000 escrituras por día

**Autenticación:**
- Usuarios ilimitados

Para uso personal, esto es **MÁS QUE SUFICIENTE**. Puedes usar la app durante años sin pagar nada.

---

## 🆘 Solución de Problemas

### La app no inicia
- Verifica que `npm install` se completó correctamente
- Asegúrate de tener Node.js instalado

### No puedo hacer login
- Verifica que Google Sign-In esté habilitado en Firebase
- Revisa la consola del navegador (F12) para errores

### Los datos no se sincronizan
- Verifica tu conexión a Internet
- Asegúrate de estar logueado con la misma cuenta de Google
- Revisa las reglas de Firestore

### Error de Firebase
- Verifica que tu `.env.local` tenga todas las variables correctas
- Asegúrate de que las credenciales sean de tu proyecto de Firebase

---

## 📚 Documentación

- **Guía Completa:** Lee `GUIA-FIREBASE-COMPLETA.md`
- **Firebase Docs:** https://firebase.google.com/docs
- **React + Firebase:** https://firebase.google.com/docs/web/setup

---

## 🎯 Diferencias con la Versión Anterior

| Característica | Sin Firebase | Con Firebase |
|----------------|--------------|--------------|
| Sincronización | ❌ No | ✅ Automática |
| Múltiples dispositivos | ❌ Datos separados | ✅ Mismos datos |
| Respaldo | ❌ Manual | ✅ Automático |
| Login | ❌ No hay | ✅ Con Google |
| Offline | ✅ Sí | ✅ Sí (con caché) |
| Configuración | ✅ Simple | ⚠️ Requiere setup |

---

## 💡 Recomendaciones

### Para Desarrollo Local:
```bash
npm run dev
```

### Para Producción:
1. Compila: `npm run build`
2. Sube `dist` a Netlify
3. Configura variables de entorno en Netlify

### Para Mantener Seguro:
- ⚠️ Nunca subas tu `.env.local` a GitHub
- ⚠️ Usa variables de entorno en Netlify
- ⚠️ Revisa las reglas de Firestore regularmente

---

## ✨ Características

- 🔐 Login seguro con Google
- 💾 Datos en la nube (Firestore)
- 🔄 Sincronización en tiempo real
- 📱 Responsive (funciona en celular)
- 🎨 Diseño moderno con Tailwind CSS
- ⚡ Rápido y eficiente
- 🌐 Accesible desde cualquier lugar

---

## 🎉 ¡Disfruta tu App!

Ya tienes todo listo para tener tus gastos sincronizados en todos tus dispositivos.

**Siguiente paso:** Lee `GUIA-FIREBASE-COMPLETA.md` y configura Firebase en 15 minutos.

---

**Versión:** 2.0.0 con Firebase
**Última actualización:** Octubre 2025
