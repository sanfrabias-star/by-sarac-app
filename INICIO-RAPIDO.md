# 🚀 INICIO RÁPIDO - Firebase Version

## ⏱️ 15 Minutos para Configurar

### ✅ PASO 1: Crear Proyecto Firebase (5 min)
1. Ve a https://console.firebase.google.com/
2. Clic en "Agregar proyecto"
3. Nombre: `expense-tracker`
4. Desactiva Google Analytics
5. Clic en "Crear proyecto"

### ✅ PASO 2: Habilitar Authentication (2 min)
1. Menú lateral → "Authentication"
2. Clic en "Get started"
3. Pestaña "Sign-in method"
4. Habilita "Google"
5. Guarda

### ✅ PASO 3: Crear Firestore (3 min)
1. Menú lateral → "Firestore Database"
2. "Crear base de datos"
3. Modo: "Producción"
4. Ubicación: La más cercana a ti
5. En "Reglas", pega esto:

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

### ✅ PASO 4: Obtener Credenciales (2 min)
1. Engranaje ⚙️ → "Configuración del proyecto"
2. Sección "Tus apps"
3. Clic en icono `</>`
4. Nombre: `Expense Tracker Web`
5. Copia las credenciales que aparecen

### ✅ PASO 5: Configurar App (2 min)
1. Copia `.env.local.template` a `.env.local`
2. Pega tus credenciales de Firebase:

```env
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### ✅ PASO 6: Ejecutar (1 min)

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## 🎉 ¡LISTO!

- Haz login con Google
- Agrega tus gastos
- Abre en otro dispositivo
- ¡Verás todo sincronizado!

---

## 📱 Usar en Celular

1. Compila: `npm run build`
2. Sube `dist` a Netlify
3. Agrega las variables de entorno en Netlify
4. Abre la URL en tu celular
5. Login con el mismo Google
6. ¡Todos tus datos ahí!

---

## 🆘 ¿Problemas?

Lee: `GUIA-FIREBASE-COMPLETA.md` para instrucciones detalladas.

---

**¡Ahora tienes sincronización automática en todos tus dispositivos!** 🎊
