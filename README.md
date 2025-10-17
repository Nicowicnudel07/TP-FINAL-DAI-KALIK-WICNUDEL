# TP Integrador: Registro paso a paso

Este repo arranca la app del Trabajo Práctico Integrador de **Desarrollo de Aplicaciones Móviles con React Native + Expo**.

Por ahora solo tenemos lo mínimo indispensable:

- Proyecto Expo creado dentro de `app/`.
- React Navigation configurado con un stack y una única pantalla de registro.
- Formulario simple con campos de nombre y apellido (sin validaciones).
- Una lista de tareas pendientes para recordar qué falta construir.

La idea es ir sumando las funcionalidades (cámara, ubicación, notificaciones locales y vibración) de a una, sin apurarnos.

## Próximos hitos

1. Pedir foto usando la cámara y guardar la imagen.
2. Solicitar permisos de ubicación y almacenar las coordenadas.
3. Enviar una notificación local + vibración cuando el registro se confirme.
4. Agregar nuevas pantallas/tablas para mostrar la información registrada.

## Cómo ejecutar

```bash
cd app
npm install
npm start
```

Expo abrirá la interfaz de siempre (`npx expo start`). Por ahora vas a ver únicamente la pantalla de registro vacía.

## Compatibilidad

- Expo SDK 54 (React Native 0.81.4 / React 19.1).
- Funciona en Android e iOS usando Expo Go.

## Archivos principales

- `app/App.js`: define el stack de navegación.
- `app/src/screens/RegistrationScreen.js`: formulario inicial y recordatorios de TODO.

A medida que avancemos, este README se irá completando con librerías, comandos y capturas para la exposición final.
