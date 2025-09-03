# INVERTRACK 📱

Aplicación móvil React Native para gestión integral de cultivos agrícolas, optimizada para productores misioneros.

## 🚀 Inicio Rápido

### Prerrequisitos
- **Node.js** 18 o superior
- **Android Studio** (para desarrollo Android)
- **JDK 11** o superior
- **Android SDK** API 34
- **Git**

### 1. Clonar el Repositorio
```bash
git clone https://github.com/DanielSanR/invertmisio.git
cd invertmisio
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Android (Windows)
```bash
# Asegurarse de que Android Studio esté instalado y configurado
# Verificar que tengas las siguientes variables de entorno:
# - ANDROID_HOME
# - JAVA_HOME
```

### 4. Ejecutar la Aplicación
```bash
# Iniciar Metro bundler
npm start

# En una nueva terminal, ejecutar en Android
npm run android
```

## 📋 Características Principales

- ✅ **Gestión de Lotes**: Seguimiento detallado de parcelas
- ✅ **Registro de Cultivos**: Historial completo de siembras
- ✅ **Tratamientos**: Control de aplicaciones fitosanitarias
- ✅ **Sanidad**: Monitoreo de problemas sanitarios
- ✅ **Infraestructura**: Control de condiciones de campo
- ✅ **Tareas**: Planificación y seguimiento de actividades
- ✅ **Reportes**: Generación de informes detallados
- ✅ **Mapas**: Visualización geográfica integrada
- ✅ **Imágenes**: Documentación visual del desarrollo

## 🔧 Configuración del Entorno de Desarrollo

### Android Studio Setup
1. Instalar Android Studio
2. Instalar SDK de Android API 34
3. Configurar variables de entorno:
   ```bash
   # En Windows, agregar a las variables de entorno del sistema:
   ANDROID_HOME = C:\Users\[TU_USUARIO]\AppData\Local\Android\Sdk
   JAVA_HOME = C:\Program Files\Android\Android Studio\jbr
   ```

### Verificación de Instalación
```bash
# Verificar Node.js
node --version
npm --version

# Verificar Android SDK
echo $ANDROID_HOME
echo $JAVA_HOME
```

## 🏗️ Arquitectura del Proyecto

```
invertmisio/
├── android/                 # Configuración nativa Android
├── ios/                     # Configuración nativa iOS
├── src/                     # Código fuente React Native
│   ├── components/          # Componentes reutilizables
│   ├── screens/             # Pantallas de la aplicación
│   ├── navigation/          # Configuración de navegación
│   ├── services/            # Servicios y APIs
│   ├── hooks/               # Custom hooks
│   ├── context/             # Context providers
│   ├── types/               # Definiciones TypeScript
│   └── theme.ts             # Configuración de tema
├── config/                  # Configuraciones por ambiente
├── scripts/                 # Scripts de construcción
└── ANDROID_BUILD_FIX.md     # Guía de solución de problemas
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm start              # Iniciar Metro bundler
npm run android        # Ejecutar en Android
npm run ios           # Ejecutar en iOS

# Construcción
npm run build:android  # Build Android release
npm run clean         # Limpiar caches y builds

# Utilidades
npm run lint          # Verificar código
npm test              # Ejecutar tests
```

## 🔧 Solución de Problemas Comunes

### Problema: "React Native Gradle Plugin no encontrado"
**Solución automática**: El proyecto incluye configuración híbrida que funciona tanto con como sin `node_modules`.

### Problema: "Archivos bloqueados en react-native-reanimated"
```bash
# Limpiar completamente
npm run clean

# Eliminar directorios de build específicos
Remove-Item -Recurse -Force node_modules\react-native-reanimated\android\.cxx -ErrorAction SilentlyContinue

# Reintentar
npx react-native run-android
```

### Problema: "Android SDK no encontrado"
1. Abrir Android Studio
2. Ir a Settings → Appearance & Behavior → System Settings → Android SDK
3. Instalar Android API 34
4. Verificar variables de entorno

### Problema: "Metro bundler no inicia"
```bash
# Limpiar cache de Metro
npx react-native start --reset-cache
```

## 📤 Compartir el Proyecto

### ✅ Método Recomendado: Git
```bash
# Compartir el repositorio
git clone https://github.com/DanielSanR/invertmisio.git
cd invertmisio
npm install
npx react-native run-android
```

### 📋 Método Alternativo: Compartir por ZIP
1. **Preparar el proyecto**:
   ```bash
   npm run clean
   rm -rf node_modules
   ```

2. **Comprimir y compartir**:
   - Comprimir toda la carpeta `invertmisio`
   - Compartir el archivo ZIP

3. **Configuración del receptor**:
   ```bash
   # Descomprimir
   unzip invertmisio.zip
   cd invertmisio

   # Instalar dependencias
   npm install

   # Ejecutar
   npx react-native run-android
   ```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch
```

## 📊 Build de Producción

### Android APK
```bash
npm run build:android
```

### iOS IPA (requiere macOS)
```bash
npm run build:ios
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📞 Soporte

- 📧 **Email**: [tu-email@ejemplo.com]
- 🐛 **Issues**: [GitHub Issues](https://github.com/DanielSanR/invertmisio/issues)
- 📖 **Documentación**: Ver `ANDROID_BUILD_FIX.md` para problemas específicos

## 📄 Licencia

Este proyecto está bajo licencia privada. Todos los derechos reservados.

---

**Desarrollado con ❤️ para productores misioneros**