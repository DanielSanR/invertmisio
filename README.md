# INVERTRACK

INVERTRACK es una aplicación móvil multiplataforma diseñada para la gestión integral de cultivos, enfocada en las necesidades específicas de los productores misioneros.

## Características Principales

- **Gestión de Lotes**: Identificación y seguimiento detallado de lotes
- **Registro de Cultivos**: Historial completo y seguimiento de cultivos
- **Tratamientos**: Control y seguimiento de aplicaciones
- **Sanidad**: Gestión de problemas sanitarios y observaciones
- **Infraestructura**: Monitoreo de condiciones de infraestructura
- **Tareas**: Planificación y seguimiento de actividades
- **Reportes**: Generación de informes detallados
- **Mapas**: Visualización geográfica de lotes
- **Imágenes**: Documentación visual del desarrollo

## Requisitos del Sistema

### Android
- Android Studio
- JDK 11 o superior
- Android SDK
- Node.js 18 o superior
- npm/yarn

### iOS
- macOS
- Xcode 14 o superior
- CocoaPods
- Node.js 18 o superior
- npm/yarn

## Configuración del Entorno

1. Clonar el repositorio:
\`\`\`bash
git clone [URL_DEL_REPOSITORIO]
cd invertrack
\`\`\`

2. Instalar dependencias:
\`\`\`bash
npm install
\`\`\`

3. Configurar variables de entorno:
   - Copiar \`config/production.example.json\` a \`config/production.json\`
   - Completar las variables con los valores correspondientes

4. Instalar dependencias iOS (solo macOS):
\`\`\`bash
cd ios && pod install && cd ..
\`\`\`

## Desarrollo

1. Iniciar Metro:
\`\`\`bash
npm start
\`\`\`

2. Ejecutar en Android:
\`\`\`bash
npm run android
\`\`\`

3. Ejecutar en iOS:
\`\`\`bash
npm run ios
\`\`\`

## Construcción de Producción

### Pre-requisitos
1. Verificar la configuración en \`config/production.json\`
2. Asegurar que todos los assets estén presentes
3. Ejecutar verificaciones previas:
\`\`\`bash
npm run check
\`\`\`

### Android
\`\`\`bash
npm run build:android
\`\`\`
El APK se generará en \`releases/invertrack-[FECHA].apk\`

### iOS
\`\`\`bash
npm run build:ios
\`\`\`
El IPA se generará en \`releases/invertrack-[FECHA].ipa\`

### Ambas Plataformas
\`\`\`bash
npm run build
\`\`\`

## Estructura del Proyecto

- `/src`: Código fuente
  - `/components`: Componentes reutilizables
  - `/screens`: Pantallas de la aplicación
  - `/navigation`: Configuración de navegación
  - `/services`: Servicios y APIs
  - `/hooks`: Custom hooks
  - `/context`: Context providers
  - `/types`: Definiciones de tipos
  - `/utils`: Utilidades
- `/assets`: Recursos estáticos
- `/config`: Configuraciones por ambiente
- `/scripts`: Scripts de construcción y utilidades

## Módulos Principales

1. **Gestión de Lotes**
   - Registro y seguimiento de lotes
   - Mapeo y geolocalización
   - Historial de cultivos

2. **Registro de Cultivos**
   - Seguimiento de ciclos
   - Registro de tratamientos
   - Documentación fotográfica

3. **Sanidad**
   - Registro de problemas
   - Seguimiento de tratamientos
   - Análisis de laboratorio

4. **Tareas**
   - Planificación
   - Calendario
   - Notificaciones

5. **Reportes**
   - Informes personalizados
   - Exportación de datos
   - Estadísticas

## Mantenimiento

### Limpieza
\`\`\`bash
npm run clean
\`\`\`

### Actualización de Dependencias
\`\`\`bash
npm update
\`\`\`

### Verificación de Código
\`\`\`bash
npm run lint
npm test
\`\`\`

## Soporte

Para reportar problemas o solicitar nuevas funcionalidades, por favor crear un issue en el repositorio.

## Licencia

Este proyecto está licenciado bajo términos privados. Todos los derechos reservados.