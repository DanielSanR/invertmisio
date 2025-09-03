## Problema: React Native Gradle Plugin no encontrado

## Descripción del Problema

Cuando se comparte un proyecto React Native por medio de un archivo ZIP, otras personas pueden encontrar el siguiente error al intentar compilar:

```
FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred configuring root project 'INVERTRACK'.
> Could not resolve all files for configuration ':classpath'.
   > Could not find com.facebook.react:react-native-gradle-plugin:.
     Required by:
         project :
```

## Problema Adicional: Archivos bloqueados en react-native-reanimated

Otro error común que puede ocurrir es:

```
FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':react-native-reanimated:configureCMakeDebug[armeabi-v7a]'.
> java.nio.file.FileSystemException: D:\invertmisio\node_modules\react-native-reanimated\android\.cxx\Debug\4g1a2u3s\armeabi-v7a\build.ninja.tmpa7477: El proceso no tiene acceso al archivo porque est� siendo utilizado por otro proceso
```

## Solución Implementada

Se implementó una solución híbrida que funciona tanto cuando `node_modules` existe como cuando no:t Native Gradle Plugin no encontrado

## Descripción del Problema

Cuando se comparte un proyecto React Native por medio de un archivo ZIP, otras personas pueden encontrar el siguiente error al intentar compilar:

```
FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred configuring root project 'INVERTRACK'.
> Could not resolve all files for configuration ':classpath'.
   > Could not find com.facebook.react:react-native-gradle-plugin:.
     Required by:
         project :
```

## Solución Implementada

Se implementó una solución híbrida que funciona tanto cuando `node_modules` existe como cuando no:

### 1. Configuración en `android/settings.gradle`
```gradle
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
    // Include React Native gradle plugin if node_modules exists
    def rnGradlePlugin = file("../node_modules/@react-native/gradle-plugin")
    if (rnGradlePlugin.exists()) {
        includeBuild("../node_modules/@react-native/gradle-plugin")
    }
}
```

### 2. Configuración en `android/build.gradle`
```gradle
dependencies {
    classpath("com.android.tools.build:gradle:8.1.1")
    // Fallback for React Native gradle plugin if includeBuild doesn't work
    def rnGradlePlugin = file("../node_modules/@react-native/gradle-plugin")
    if (!rnGradlePlugin.exists()) {
        classpath("com.facebook.react:react-native-gradle-plugin:0.72.6")
    }
}
```

## Cómo Funciona

1. **Si `node_modules` existe** (desarrollo normal):
   - Gradle usa `includeBuild` para incluir el plugin local
   - Más rápido y confiable

2. **Si `node_modules` NO existe** (proyecto compartido por ZIP):
   - Gradle descarga el plugin desde Maven Central
   - Requiere conexión a internet
   - Más lento pero funciona

## Solución para archivos bloqueados en react-native-reanimated

Si encuentras el error de "El proceso no tiene acceso al archivo", sigue estos pasos:

### 1. Limpiar el proyecto
```bash
npm run clean
```

### 2. Eliminar directorios de build bloqueados
```bash
# En Windows PowerShell
Remove-Item -Recurse -Force node_modules\react-native-reanimated\android\.cxx -ErrorAction SilentlyContinue
```

### 3. Limpiar Gradle cache (opcional)
```bash
cd android
./gradlew cleanBuildCache
cd ..
```

### 4. Reintentar el build
```bash
npx react-native run-android
```

## Instrucciones para Compartir Proyecto

### ✅ Método Recomendado: Usar Git
```bash
# Crear repositorio
git init
git add .
git commit -m "Initial commit"

# Compartir el repositorio (sin node_modules)
# La otra persona ejecuta:
git clone <url-del-repositorio>
cd proyecto
npm install  # Esto crea node_modules con el plugin
npx react-native run-android
```

### 📋 Checklist para compartir proyecto

Antes de compartir un proyecto React Native:

1. **Verificar package.json**: Asegurarse de que `"react-native": "0.72.6"` esté listado
2. **Verificar configuración Gradle**: Los archivos `android/build.gradle` y `android/settings.gradle` deben tener la configuración híbrida
3. **Crear .gitignore**: Excluir `node_modules/`, archivos temporales, etc.
4. **Documentar**: Crear README con instrucciones

## Verificación

Para verificar que el problema esté resuelto:

```bash
# Caso 1: Con node_modules (desarrollo normal)
npm install
npx react-native run-android

# Caso 2: Sin node_modules (proyecto compartido)
# Simular eliminando node_modules
rm -rf node_modules
npx react-native run-android  # Debería funcionar con Maven fallback
```

### Verificación adicional para archivos bloqueados:
Si encuentras errores de archivos bloqueados:
```bash
npm run clean
npx react-native run-android
```

## Notas Técnicas

- **React Native 0.72+** usa un sistema híbrido de plugins
- El `includeBuild` es más eficiente pero requiere `node_modules`
- El classpath Maven es más lento pero no requiere instalación local
- Esta solución es compatible con ambas situaciones
- Los archivos bloqueados en Windows son comunes con react-native-reanimated y se resuelven limpiando los directorios de build
