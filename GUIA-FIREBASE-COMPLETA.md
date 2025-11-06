# 🔥 Guía Completa - Configurar Firebase para Sincronización Automática

## 🎯 ¿Qué Vas a Lograr?

Con esta configuración, tu aplicación tendrá:
- ✅ **Sincronización automática** en todos tus dispositivos
- ✅ **Login con Google** - simple y seguro
- ✅ **Datos en la nube** - nunca los perderás
- ✅ **Acceso desde cualquier lugar** - PC, celular, tablet

---

## 📋 PASO 1: Crear Proyecto en Firebase

### 1.1 Ir a Firebase Console

Ve a: **https://console.firebase.google.com/**

### 1.2 Crear Nuevo Proyecto

1. Haz clic en **"Agregar proyecto"** o **"Add project"**
2. Nombre del proyecto: `expense-tracker` (o el nombre que prefieras)
3. Haz clic en **"Continuar"**
4. Google Analytics: Puedes **desactivarlo** para hacer esto más rápido
5. Haz clic en **"Crear proyecto"**
6. Espera unos segundos mientras Firebase crea tu proyecto
7. Haz clic en **"Continuar"** cuando termine

---

## 📋 PASO 2: Configurar Autenticación con Google

### 2.1 Habilitar Google Sign-In

1. En el menú lateral, haz clic en **"Authentication"** (Autenticación)
2. Haz clic en **"Get started"** o **"Comenzar"**
3. Ve a la pestaña **"Sign-in method"**
4. Busca **"Google"** en la lista
5. Haz clic en **"Google"**
6. Activa el switch para **"Habilitar"**
7. En "Correo electrónico de asistencia del proyecto", selecciona tu email
8. Haz clic en **"Guardar"**

✅ ¡Listo! Ahora los usuarios podrán iniciar sesión con Google.

---

## 📋 PASO 3: Configurar Firestore Database

### 3.1 Crear la Base de Datos

1. En el menú lateral, haz clic en **"Firestore Database"**
2. Haz clic en **"Crear base de datos"** o **"Create database"**
3. Selecciona **"Empezar en modo de producción"** (production mode)
4. Haz clic en **"Siguiente"**
5. Selecciona la ubicación más cercana a ti:
   - Para Argentina: `southamerica-east1 (São Paulo)`
   - Para España: `europe-west1 (Belgium)`
   - Para México: `us-central1 (Iowa)`
6. Haz clic en **"Habilitar"**

### 3.2 Configurar Reglas de Seguridad

1. Ve a la pestaña **"Reglas"** o **"Rules"**
2. **Reemplaza TODO el contenido** con estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Los usuarios solo pueden leer y escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Haz clic en **"Publicar"** o **"Publish"**

✅ ¡Perfecto! Ahora cada usuario solo puede ver sus propios datos.

---

## 📋 PASO 4: Obtener Credenciales de Firebase

### 4.1 Registrar tu Aplicación Web

1. En el menú lateral, haz clic en el **ícono de engranaje ⚙️** 
2. Selecciona **"Configuración del proyecto"** o **"Project settings"**
3. Baja hasta la sección **"Tus apps"** o **"Your apps"**
4. Haz clic en el ícono de **</> (Web)**
5. Nombre de la app: `Expense Tracker Web`
6. **NO marques** "También configurar Firebase Hosting" (déjalo desmarcado)
7. Haz clic en **"Registrar app"**

### 4.2 Copiar la Configuración

Firebase te mostrará un código como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbCdEf123456789-GhIjKlMnOpQr",
  authDomain: "expense-tracker-12345.firebaseapp.com",
  projectId: "expense-tracker-12345",
  storageBucket: "expense-tracker-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**📝 GUARDA ESTOS VALORES** - los necesitarás en el siguiente paso.

---

## 📋 PASO 5: Configurar la Aplicación

### 5.1 Crear Archivo de Configuración

1. Abre la carpeta de tu aplicación Firebase
2. Duplica el archivo `.env.local.template`
3. Renómbralo a `.env.local` (sin .template)
4. Abre `.env.local` con un editor de texto

### 5.2 Llenar las Variables

Usando los valores que copiaste de Firebase, completa:

```env
VITE_FIREBASE_API_KEY=AIzaSyAbCdEf123456789-GhIjKlMnOpQr
VITE_FIREBASE_AUTH_DOMAIN=expense-tracker-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=expense-tracker-12345
VITE_FIREBASE_STORAGE_BUCKET=expense-tracker-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

**⚠️ IMPORTANTE:** Guarda el archivo `.env.local`

---

## 📋 PASO 6: Instalar y Ejecutar

### 6.1 Instalar Dependencias

Abre la terminal en la carpeta de tu proyecto y ejecuta:

```bash
npm install
```

Esto instalará Firebase y todas las dependencias necesarias.

### 6.2 Ejecutar en Desarrollo

```bash
npm run dev
```

Esto abrirá la aplicación en `http://localhost:5173`

### 6.3 Compilar para Producción

```bash
npm run build
```

Esto creará una carpeta `dist` que puedes subir a Netlify.

---

## 📋 PASO 7: Desplegar en Netlify

### 7.1 Agregar Variables de Entorno en Netlify

1. Ve a tu sitio en Netlify
2. Haz clic en **"Site settings"**
3. Ve a **"Environment variables"**
4. Agrega CADA variable de tu archivo `.env.local`:
   - Click en **"Add a variable"**
   - Key: `VITE_FIREBASE_API_KEY`
   - Value: Tu API key de Firebase
   - Repite para TODAS las variables

### 7.2 Subir la Aplicación

1. Compila el proyecto: `npm run build`
2. Sube la carpeta `dist` a Netlify (igual que antes)
3. ¡Listo!

---

## 🎉 ¡YA ESTÁ TODO CONFIGURADO!

### ¿Cómo Funciona Ahora?

1. **Primera vez:** Entras a tu app y haces login con Google
2. **Agregas gastos:** Se guardan automáticamente en Firebase
3. **Cambias de dispositivo:** Haces login con el mismo Google
4. **Ves tus datos:** ¡Están todos ahí! Sincronizados automáticamente

### Ventajas de esta Configuración

✅ **Sincronización en tiempo real** - Los cambios aparecen instantáneamente
✅ **Múltiples dispositivos** - PC, celular, tablet
✅ **Login simple** - Un clic con Google
✅ **Datos seguros** - Solo tú puedes verlos
✅ **Sin límite de dispositivos** - Usa cuantos quieras
✅ **Gratis** - Firebase tiene un plan gratuito muy generoso

---

## 🔐 Seguridad

- ✅ Cada usuario solo puede ver sus propios datos
- ✅ Las reglas de Firebase protegen tu información
- ✅ La autenticación es manejada por Google (muy seguro)
- ✅ Tus credenciales están en variables de entorno (no en el código)

---

## 📊 Límites del Plan Gratuito de Firebase

Firebase ofrece un plan gratuito muy generoso:

- **Firestore:** 1 GB de almacenamiento, 50,000 lecturas/día
- **Autenticación:** Usuarios ilimitados
- **Ancho de banda:** 10 GB/mes

Para una app personal de gastos, esto es **MÁS QUE SUFICIENTE**.

---

## 🆘 Solución de Problemas

### Error: "Firebase not configured"
**Solución:** Verifica que tu archivo `.env.local` exista y tenga todas las variables

### Error: "Permission denied"
**Solución:** Revisa las reglas de Firestore (Paso 3.2)

### No puedo iniciar sesión con Google
**Solución:** Verifica que Google esté habilitado en Authentication (Paso 2.1)

### Los cambios no se sincronizan
**Solución:** 
- Verifica tu conexión a Internet
- Revisa la consola del navegador (F12) para errores
- Asegúrate de estar logueado con la misma cuenta

---

## 📞 Recursos Útiles

- **Firebase Console:** https://console.firebase.google.com/
- **Documentación Firebase:** https://firebase.google.com/docs
- **Firestore Rules:** https://firebase.google.com/docs/firestore/security/get-started

---

## ✨ Próximos Pasos

Después de configurar Firebase:

1. ✅ Prueba la app en tu navegador
2. ✅ Haz login con Google
3. ✅ Agrega algunos gastos
4. ✅ Abre la app en tu celular
5. ✅ Haz login con el mismo Google
6. ✅ ¡Verás todos tus datos sincronizados!

---

¡Disfruta tu Smart Expense Tracker con sincronización automática! 🎊
