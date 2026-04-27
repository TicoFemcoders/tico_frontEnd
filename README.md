<p align="center">
  <table>
    <tr>
      <td align="center" bgcolor="#202B45" style="padding:32px 48px; border-radius:12px;">
        <img src="src/assets/logoTico.png" alt="TICO" width="200" />
      </td>
    </tr>
  </table>
</p>

<h1 align="center">TICO — Frontend</h1>

<p align="center">
  Sistema de gestión de tickets de soporte para CoHispania
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/MUI-v9-007FFF?style=for-the-badge&logo=mui&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Router-v7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-1.x-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
</p>

---

## 📖 Sobre el proyecto

**TICO** (Tickets CoHispania) es una aplicación web interna para la gestión de tickets de soporte IT de CoHispania. Los empleados crean y hacen seguimiento de sus tickets, mientras que los administradores los gestionan, asignan, priorizan y cierran — todo en una interfaz clara y responsiva.

El proyecto fue desarrollado como proyecto final de bootcamp siguiendo un flujo de trabajo profesional con **React 19**, **MUI v9**, **React Router v7** y **autenticación JWT con control de acceso por rol**.

La aplicación consume una API REST en Spring Boot ([ver README Backend](../tico_backEnd/README.md)).

### 🎯 Objetivos del proyecto

- Construir una SPA completa con React 19 y React Router v7
- Consumir una API REST con Axios e interceptores JWT centralizados
- Implementar autenticación JWT con contexto persistente (localStorage)
- Gestionar la UI por rol (ADMIN vs EMPLOYEE) con rutas protegidas
- Aplicar un sistema de diseño consistente con MUI v9 y un tema personalizado (colores corporativos de CoHispania)
- Implementar scroll infinito y carga progresiva de tickets

---

## ✨ Funcionalidades principales

- 🔐 **Autenticación JWT** — login, sesión persistente via localStorage
- 🔑 **Control de acceso por rol** — ADMIN y EMPLOYEE con vistas y rutas diferenciadas
- ✉️ **Activación de cuenta** — página de activación con código recibido por email
- 🔒 **Reseteo de contraseña** — flujo completo de recuperación desde el login
- 🎫 **Mis tickets** — vista paginada con scroll infinito para el empleado
- 📋 **Todos los tickets** — vista global paginada para el ADMIN
- 🔎 **Detalle de ticket** — panel completo con historial de mensajes, estado, prioridad, etiquetas y acciones del admin
- 💬 **Mensajería interna** — envío y recepción de mensajes en el hilo del ticket
- 🔔 **Notificaciones** — campana en la topbar con contador y marcado como leídas
- 🏷️ **Gestión de etiquetas** — CRUD completo de etiquetas con colores personalizados (ADMIN)
- 👥 **Gestión de usuarios** — crear, editar, activar/desactivar empleados y admins (ADMIN)
- 🛡️ **Rutas protegidas** — públicas / autenticadas / restringidas por rol
- 📱 **Diseño responsivo** — tarjetas adaptadas a móvil en la vista de tickets

---

## 🛠️ Tecnologías

| Tecnología               | Uso                                              |
| ------------------------ | ------------------------------------------------ |
| React 19                 | Biblioteca UI, componentes funcionales y hooks   |
| React Router DOM v7      | SPA routing con rutas públicas y protegidas      |
| MUI v9 + Emotion         | Biblioteca de componentes con tema personalizado |
| notistack                | Toast notifications (snackbars)                  |
| react-colorful           | Color picker para etiquetas                      |
| Axios                    | Cliente HTTP con interceptores JWT               |
| Vite 8                   | Servidor de desarrollo y bundler de producción   |
| Vitest + Testing Library | Tests unitarios y de componentes                 |
| ESLint                   | Calidad y consistencia del código                |

---

## 📁 Estructura del proyecto

<details>
<summary><strong>Haz clic para expandir la estructura completa</strong></summary>

```
src/
│
├── components/
│   ├── auth/                        # Formularios de autenticación
│   │   ├── AuthCodeForm.jsx           → Formulario de código de activación
│   │   └── CodeInputs.jsx             → Inputs individuales para el código
│   │
│   ├── common/                      # Componentes reutilizables globales
│   │   ├── AppModal.jsx               → Modal genérico
│   │   ├── AuthPageLayout.jsx         → Layout para páginas públicas
│   │   ├── BreadcrumbItem.jsx         → Migas de pan
│   │   ├── DataTable.jsx              → Tabla de datos genérica
│   │   ├── EnumChip.jsx               → Chip para enums (estado, prioridad)
│   │   ├── InfiniteScrollFooter.jsx   → Footer de carga para scroll infinito
│   │   ├── LabelChip.jsx              → Chip de etiqueta con color
│   │   ├── LoadingScreen.jsx          → Pantalla de carga global
│   │   ├── PageHeader.jsx             → Cabecera de página
│   │   ├── TableToolbar.jsx           → Barra de herramientas de tabla
│   │   ├── TicoLogo.jsx               → Logo de la app
│   │   └── UserAvatar.jsx             → Avatar con iniciales
│   │
│   ├── detailTicket/                # Componentes del detalle de ticket
│   │   ├── AssignAdminPanel.jsx       → Panel para asignar admin
│   │   ├── PriorityAndLabelsPanel.jsx → Panel de prioridad y etiquetas
│   │   ├── StatusActionsPanel.jsx     → Panel de cambio de estado y cierre
│   │   ├── TicketDescription.jsx      → Descripción del ticket
│   │   ├── TicketHistory.jsx          → Historial de mensajes
│   │   ├── TicketResponseBox.jsx      → Caja de respuesta
│   │   └── TicketSidebar.jsx          → Sidebar con metadatos del ticket
│   │
│   ├── labels/                      # Gestión de etiquetas
│   │   ├── CreateLabelModal.jsx
│   │   ├── EditLabelModal.jsx
│   │   ├── LabelForm.jsx
│   │   └── LabelTable.jsx
│   │
│   ├── layout/                      # Layout de la aplicación
│   │   ├── Navbar.jsx                 → Menú lateral (ítems por rol)
│   │   └── TopBar.jsx                 → Barra superior con campana de notificaciones
│   │
│   ├── login/                       # Componentes de login
│   │   ├── ForgotPasswordModal.jsx    → Modal de recuperación de contraseña
│   │   ├── LoginBrand.jsx             → Panel de marca (logo + colores)
│   │   └── LoginForm.jsx              → Formulario de login
│   │
│   ├── modals/                      # Modales de confirmación
│   │   ├── AlertModal.jsx
│   │   ├── CloseTicketModal.jsx       → Modal de cierre con mensaje
│   │   ├── ConfirmModal.jsx
│   │   └── LabelInUseModal.jsx        → Aviso de etiqueta en uso
│   │
│   ├── myTickets/                   # Vista de tickets del empleado
│   │   ├── LatestDateInfo.jsx         → Fecha del último evento
│   │   ├── StatCards.jsx              → Tarjetas de estadísticas por estado
│   │   ├── TicketCardMobile.jsx       → Tarjeta de ticket en móvil
│   │   ├── TicketLabels.jsx           → Etiquetas en la fila de ticket
│   │   └── TicketTable.jsx            → Tabla de tickets
│   │
│   ├── tickets/                     # Creación de tickets
│   │   └── CreateTicketForm.jsx       → Formulario de nuevo ticket
│   │
│   └── users/                       # Gestión de usuarios (ADMIN)
│       ├── CreateUserModal.jsx
│       ├── DeleteUserModal.jsx
│       ├── EditUserModal.jsx
│       ├── UserForm.jsx
│       └── UsersTable.jsx
│
├── context/                         # Gestión del estado de autenticación
│   ├── authContext.js                 → createContext
│   ├── AuthContext.jsx                → Provider (token, user, login, logout)
│   └── useAuth.js                     → Hook para acceder al contexto
│
├── hooks/                           # Custom hooks
│   ├── useInfiniteScroll.js           → Scroll infinito genérico
│   ├── useLabelForm.js                → Estado del formulario de etiquetas
│   ├── useLabels.js                   → Carga y gestión de etiquetas
│   ├── useProgressiveFetch.js         → Carga progresiva de datos paginados
│   ├── useTicketAttributes.js         → Atributos de ticket (estado, prioridad, admins)
│   └── useUsers.js                    → Carga y gestión de usuarios
│
├── pages/                           # Componentes de página (uno por ruta)
│   ├── ActivationPage.jsx             → Activación de cuenta por código
│   ├── DashboardAdmin.jsx             → Dashboard del administrador
│   ├── DetailTicketPage.jsx           → Detalle completo de un ticket
│   ├── LabelsPage.jsx                 → Gestión de etiquetas (ADMIN)
│   ├── LoginPage.jsx                  → Login
│   ├── MyTickets.jsx                  → Vista de tickets (employee / admin)
│   ├── ResetPasswordPage.jsx          → Reseteo de contraseña
│   ├── TicketPage.jsx                 → Creación de nuevo ticket
│   └── UsersPage.jsx                  → Gestión de usuarios (ADMIN)
│
├── routes/                          # Configuración de rutas
│   ├── router.jsx                     → Todas las definiciones de rutas
│   ├── ProtectedRoute.jsx             → Requiere autenticación
│   ├── ProtectedLayout.jsx            → Layout wrapper para páginas autenticadas
│   └── RoleRoute.jsx                  → Restringe rutas a un rol específico
│
├── services/                        # Capa de comunicación con la API
│   ├── api.js                         → Instancia Axios + interceptores JWT + manejo de 401
│   ├── authService.js                 → Login
│   ├── labelService.js                → CRUD etiquetas
│   ├── notificationService.js         → Notificaciones
│   ├── ticketMessageService.js        → Mensajes de ticket
│   ├── ticketService.js               → CRUD tickets + acciones
│   └── userService.js                 → CRUD usuarios
│
├── styles/
│   └── theme.js                       → Tema MUI (colores, tipografía, overrides de componentes)
│
├── utils/
│   ├── enums.js                       → Etiquetas y colores de enums (estado, prioridad)
│   ├── formatDate.js                  → Formateo de fechas
│   ├── formatTime.js                  → Formateo de horas
│   ├── getContrastText.js             → Color de texto sobre fondo dinámico
│   └── getInitials.js                 → Iniciales para avatares
│
├── App.jsx                            → Componente raíz (RouterProvider)
├── main.jsx                           → Punto de entrada (providers + render)
└── index.html                         → Plantilla HTML
```

> Los componentes están organizados **por funcionalidad** (tickets, etiquetas, usuarios, layout) para mantener el código relacionado agrupado y fácil de navegar.

</details>

---

## 🚀 Instalación y configuración

### Requisitos previos

- **Node.js 18** o superior
- **npm 9** o superior
- El **Backend** corriendo en `http://localhost:8080` ([ver README Backend](../tico_backEnd/README.md))

> **Nota:** copia el archivo `logoTico.png` del backend (`tico_backEnd/src/main/resources/images/logoTico.png`) a `src/assets/logoTico.png` para que el logo aparezca correctamente.

### Pasos

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd tico_frontEnd
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar las variables de entorno**

```env
# .env
VITE_API_URL=http://localhost:8080
```

4. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 📜 Scripts disponibles

| Comando                 | Descripción                                   |
| ----------------------- | --------------------------------------------- |
| `npm run dev`           | Iniciar servidor de desarrollo con hot reload |
| `npm run build`         | Compilar para producción                      |
| `npm run preview`       | Previsualizar el build de producción          |
| `npm run lint`          | Verificar calidad de código con ESLint        |
| `npm run test`          | Ejecutar tests con Vitest                     |
| `npm run test:ui`       | Ejecutar tests con interfaz gráfica           |
| `npm run test:coverage` | Ejecutar tests con informe de cobertura       |

---

## 🗺️ Rutas de la aplicación

| Ruta                 | Página                | Acceso         |
| -------------------- | --------------------- | -------------- |
| `/login`             | Login                 | 🌐 Público     |
| `/activation`        | Activación de cuenta  | 🌐 Público     |
| `/reset-password`    | Reseteo de contraseña | 🌐 Público     |
| `/my-tickets`        | Mis tickets           | 🔒 Autenticado |
| `/tickets`           | Crear nuevo ticket    | 🔒 Autenticado |
| `/detail-ticket/:id` | Detalle de ticket     | 🔒 Autenticado |
| `/all-tickets`       | Todos los tickets     | 👑 ADMIN       |
| `/assigned`          | Mis tickets asignados | 👑 ADMIN       |
| `/users`             | Gestión de usuarios   | 👑 ADMIN       |
| `/labels`            | Gestión de etiquetas  | 👑 ADMIN       |

---

## 🔗 Conexión con el backend

<details>
<summary><strong>Configuración Axios y servicios</strong></summary>

El frontend se comunica con la API REST mediante **Axios**. La URL base se configura mediante `VITE_API_URL`.

Los tokens JWT se inyectan automáticamente en cada petición mediante un **interceptor de request** en `api.js`. Ante una respuesta `401`, el interceptor cierra la sesión del usuario y redirige a `/login`.

| Servicio                  | Descripción                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| `authService.js`          | Login                                                                                     |
| `ticketService.js`        | CRUD completo de tickets + acciones (asignar, cambiar estado, cerrar, reabrir, etiquetas) |
| `ticketMessageService.js` | Mensajes de un ticket                                                                     |
| `labelService.js`         | CRUD etiquetas                                                                            |
| `userService.js`          | Crear, listar, editar, activar/desactivar usuarios                                        |
| `notificationService.js`  | Notificaciones: listar, marcar como leídas                                                |

</details>

---

## 🔐 Autenticación y autorización

El estado de autenticación se gestiona con un **React Context** (`AuthContext`):

- Al hacer login, el token JWT y los datos del usuario (`id`, `name`, `email`, `roles`) se almacenan en `localStorage` y en el contexto.
- `ProtectedRoute` redirige a los usuarios no autenticados a `/login`.
- `RoleRoute` restringe el acceso a las páginas exclusivas de ADMIN (usuarios, etiquetas, todos los tickets, tickets asignados).
- `Navbar` adapta sus ítems de menú en función del rol del usuario.
- `api.js` refresca el token automáticamente desde las cabeceras de respuesta y gestiona el logout ante un `401`.

---

## 🎨 Sistema de diseño

El tema está centralizado en `src/styles/theme.js`:

- **Color primario:** naranja `#f28a2e` (CoHispania)
- **Color secundario:** azul marino `#202B45` (CoHispania)
- **Fuente:** Inter, escala compacta (body a 13px)
- Todos los overrides de componentes MUI están en `theme.js` — extender allí, no con estilos inline

---

## 👥 Equipo

| Rol           | Nombre                  | GitHub                                                   | LinkedIn                                                         |
| ------------- | ----------------------- | -------------------------------------------------------- | ---------------------------------------------------------------- |
| Product Owner | Leonela Rivas           | [@Leonela88](https://github.com/Leonela88)               | [LinkedIn](https://www.linkedin.com/in/leonela-rivas-28a706246/) |
| Scrum Master  | Ingrid Lopez            | [@Nuclea88](https://github.com/Nuclea88)                 | [LinkedIn](https://www.linkedin.com/in/ingrid-lopez-poveda/)     |
| Developer     | Anna Costa              | [@annahico](https://github.com/annahico)                 | [LinkedIn](https://www.linkedin.com/in/annahico/)                |
| Developer     | Maria Jose Ozta         | [@majoz-t](https://github.com/majoz-t)                   | [LinkedIn](https://www.linkedin.com/in/maria-jose-ozta)          |
| Developer     | Sukaina Hadani          | [@sukisu91-alt](https://github.com/sukisu91-alt)         | [LinkedIn](https://www.linkedin.com/in/sukaina-hadani-97161b394) |
| Developer     | Marie-Charlotte Doulcet | [@Charlottedoulcet](https://github.com/Charlottedoulcet) | [LinkedIn](https://www.linkedin.com/in/marie-charlottedoulcet/)  |

> 💙 Proyecto desarrollado durante el **FemCoders Bootcamp — 7 al 20 de abril de 2026**

---

## 🌱 Posibles mejoras futuras

- 📎 **Adjuntos en tickets** — permitir adjuntar archivos o capturas de pantalla al crear un ticket
- 📊 **Dashboard empleado** — estadísticas propias (tickets abiertos, cerrados, tiempo medio de resolución)
- 🌗 **Modo oscuro / claro** — toggle de tema
