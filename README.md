# TP Integrador: Registro paso a paso

Este repositorio contiene la base del Trabajo Práctico Integrador de **Desarrollo de Aplicaciones Móviles con React Native + Expo**.

La idea general sigue siendo una app de registro que combine cámara, ubicación, notificaciones locales y vibración. Sin embargo, estamos avanzando **de a poco**. Por ahora el proyecto incluye:

- Proyecto Expo inicializado y listo para ejecutarse con `npm start` dentro de la carpeta `app`.
- React Navigation configurado con un stack muy simple y una sola pantalla (`Registro`).
- UI básica del formulario con campos de nombre y apellido y una sección donde listamos los próximos pasos pendientes.

## Próximos hitos

1. **Cámara:** habilitar la captura de imagen para la foto de perfil.
2. **Ubicación:** solicitar permisos y guardar la geolocalización del usuario.
3. **Notificaciones + Vibración:** enviar feedback local cuando el registro se confirme o falle.
4. **Tabs de Perfil y Ubicación:** mostrar los datos guardados una vez completado el flujo.

Cada funcionalidad se incorporará gradualmente para acompañar el proceso de aprendizaje y la defensa individual del TP.

## Cómo ejecutar el proyecto

```bash
cd app
npm install
npm start
```

Expo mostrará un QR para abrir la app en Expo Go. Por ahora solamente veremos la pantalla de registro con los campos de texto y los recordatorios de tareas pendientes.

## Compatibilidad

- Expo SDK 54 (React Native 0.81.4 / React 19.1)
- Funciona tanto en Android como en iOS a través de Expo Go.

## Organización

- `app/App.js`: configuración del stack de navegación.
- `app/src/screens/RegistrationScreen.js`: pantalla con el formulario inicial y notas sobre lo que falta implementar.

El objetivo es mantener el código ordenado e ir sumando componentes reutilizables a medida que se agreguen las funcionalidades más avanzadas.
