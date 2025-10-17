# TP Integrador: Registro con Cámara, Location, Notificaciones y Vibración

Aplicación móvil desarrollada con **React Native** y **Expo** para el Trabajo Práctico Integrador de Desarrollo de Aplicaciones Móviles. La app guía al usuario por un flujo de registro que combina cuatro funcionalidades conectadas entre sí:

- **Push Notifications** para informar si el registro fue exitoso o hubo un error.
- **Acceso a la Cámara** para capturar la foto de perfil durante el alta.
- **Uso de Location** para obtener la ubicación actual del usuario.
- **Vibración / Haptics** como feedback físico tanto en los casos de éxito como de error.

La navegación está resuelta con React Navigation y organiza la experiencia en pantallas de registro, perfil y mapa.

## Stack y librerías principales

| Funcionalidad | Paquetes Expo / React Native |
| ------------- | ---------------------------- |
| Navegación | `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`, `react-native-screens`, `react-native-safe-area-context` |
| Cámara | `expo-camera` |
| Ubicación | `expo-location` |
| Notificaciones push locales | `expo-notifications`, `expo-device` |
| Vibración / Haptics | `expo-haptics` |
| Utilidades base | `expo`, `react`, `react-native`, `expo-status-bar` |

> Todas las dependencias son compatibles con **Expo SDK 54** (React Native 0.81.4 / React 19).

## Requisitos previos

- Node.js 18 o superior.
- Expo CLI (se instala automáticamente con `npx expo`).
- Dispositivo físico con Expo Go o emulador configurado.

## Instalación y ejecución

```bash
# Clonar el repositorio
 git clone https://github.com/<usuario>/TP-FINAL-DAI-KALIK-WICNUDEL.git
 cd TP-FINAL-DAI-KALIK-WICNUDEL/app

# Instalar dependencias
 npm install

# Levantar el proyecto (modo interactivo)
 npm start
```

Expo mostrará un QR para abrir la app en Expo Go (`npx expo start --tunnel` facilita la conexión remota durante la defensa).

## Estructura sugerida para la demo

1. Completar el formulario de registro con nombre y apellido.
2. Capturar la foto de perfil usando la cámara.
3. Solicitar y obtener la ubicación actual.
4. Confirmar el registro:
   - Si todo está completo → notificación local + vibración de éxito + navegación a la pantalla principal.
   - Si falta algún dato → notificación de error + vibración diferenciada.
5. Mostrar las tabs de Perfil (datos guardados) y Mapa (posición actual con marcador).

## Próximos pasos recomendados

- Persistir los datos de registro con `AsyncStorage` para mantener la sesión.
- Agregar un cálculo de distancia respecto a un punto de interés.
- Incluir íconos personalizados y tipografías para mejorar la UI.
- Preparar un README extendido con capturas y pasos para la exposición oral.

---

> Recordatorio: cada integrante debe conocer e explicar el flujo completo (permisos, manejo de estado, navegación y manejo de errores).
