# BTG Funds App

Esta es una aplicación de simulación de fondos de inversión (FIC y FPV) desarrollada como prueba técnica. Permite a un usuario consultar fondos disponibles, suscribirse a ellos y cancelar suscripciones, manteniendo un historial de transacciones y un saldo simulado.

## 🚀 Tecnologías y Arquitectura

El proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 18+ y utiliza características modernas:

- **Standalone Components:** La aplicación no utiliza `NgModules`. Todos los componentes, directivas y pipes son independientes (standalone).
- **Manejo de Estado Reactivo:** El saldo del usuario y la comunicación entre componentes se realiza utilizando **RxJS** (`BehaviorSubject`), asegurando que cualquier componente que necesite el saldo (como el Header o el formulario de suscripción) se actualice instantáneamente.
- **Servicios Desacoplados:** La lógica de negocio y las llamadas a la API están centralizadas en servicios inyectables (`UserService`, `FundsService`, `TransactionsService`).
- **Tailwind CSS v4:** Utilizado para la maquetación y diseño UI responsivo, garantizando una interfaz de usuario atractiva y moderna sin sacrificar el rendimiento.
- **Mock Backend:** Debido a que el scope es frontend, se utiliza `json-server` para levantar una API REST falsa y persistir las transacciones en el archivo `src/app/mock/db.json`.

---

## ⚙️ Funcionalidades Principales

1. **Listado de Fondos (Disponibles):** Muestra una tabla con los fondos disponibles (nombre, categoría FIC/FPV, monto mínimo y rentabilidad esperada).
2. **Suscripción de Fondos:** Permite ingresar un monto a invertir. Valida que el monto no sea menor al mínimo requerido por el fondo y que el usuario tenga saldo suficiente. Incluye selección de **método de notificación** (Email o SMS).
3. **Historial de Transacciones:** Registra todas las suscripciones exitosas y permite ver el flujo detallado de caja.
4. **Cancelación de Suscripciones:** En el historial de transacciones, el usuario puede cancelar suscripciones previas, devolviendo automáticamente el monto exacto a su saldo disponible.
5. **Notificaciones (Toasts):** Alertas visuales (`ngx-toastr`) para casos de éxito (suscripciones confirmadas indicando el canal elegido) y errores (saltos insuficientes).

---

## 🛠️ Instrucciones de Ejecución

Para correr este proyecto en tu entorno local, necesitas tener [Node.js](https://nodejs.org/) instalado. Sigue estos pasos:

### 1. Clonar e Instalar dependencias

```bash
git clone https://github.com/Gatroxm/btg-funds-app.git
cd btg-funds-app
npm install
```

### 2. Iniciar el Servidor Mock (Base de datos local)

La aplicación necesita conectarse a una API. He configurado `json-server` para esto. En una terminal, ejecuta:

```bash
npm run server
```

> **Nota importante:** Este comando levantará la API en http://localhost:3000. Si intentas ejecutarlo y arroja el error `EADDRINUSE: address already in use :::3000`, significa que ya hay un proceso corriendo en ese puerto (posiblemente lo ejecutaste antes). Puedes detenerlo o cerrar esa terminal previa, o el proyecto funcionará con el que ya tienes abierto.

### 3. Iniciar la Interfaz de Angular

Abre **una segunda terminal** en la misma carpeta del proyecto y ejecuta el servidor de desarrollo de Angular:

```bash
npm start
```
*(Es equivalente a `ng serve`)*

Una vez compilado, abre en tu navegador la siguiente dirección: \
👉 **[http://localhost:4200/](http://localhost:4200/)**

---

## 📁 Estructura del Código

La estructura sigue buenas prácticas de separación por sub-dominios (features):

```text
src/
└── app/
    ├── core/                # Core de la app (Layouts, Navegación Header)
    ├── features/            # Módulos principales de negocio
    │   ├── funds/           # Feature: Visualización y Suscripción a fondos
    │   └── transactions/    # Feature: Historial y Cancelación de transacciones
    ├── mock/                # Archivo db.json para json-server
    ├── models/              # Interfaces y tipos de TypeScript (Domain Models)
    └── services/            # Servicios HTTP y manejo de Estado General
```

---

## ✅ Notas de Desarrollo

- Si llegas a ver un error en consola indicando `Angular requires Zone.js`, el proyecto ya ha sido parcheado (se añadió a los polyfills de `angular.json` y a `package.json`). Si la terminal nativa estaba corriendo previo a este cambio, simplemente detenla (`Ctrl + C`) y vuelve a ejecutar `npm start`.
- No es necesario ejecutar ng build o TSC a menos que se quiera probar el compilador local de producción. Todo el flujo principal fue verificado sin problemas de Typescript en entorno de desarrollo.
