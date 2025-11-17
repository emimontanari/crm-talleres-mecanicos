# 📘 Manual Completo de Desarrollo - Dashboard para Talleres Mecánicos

## 📑 Tabla de Contenidos

1. [Visión General del Proyecto](#1-visión-general-del-proyecto)
2. [Arquitectura Técnica](#2-arquitectura-técnica)
3. [Configuración Inicial del Entorno](#3-configuración-inicial-del-entorno)
4. [Estructura del Proyecto](#4-estructura-del-proyecto)
5. [Base de Datos y Schema](#5-base-de-datos-y-schema)
6. [Backend - Funciones Convex](#6-backend---funciones-convex)
7. [Integración n8n](#7-integración-n8n)
8. [Frontend - Componentes y Vistas](#8-frontend---componentes-y-vistas)
9. [Autenticación y Permisos](#9-autenticación-y-permisos)
10. [Guía de Desarrollo por Módulos](#10-guía-de-desarrollo-por-módulos)
11. [Testing](#11-testing)
12. [Despliegue](#12-despliegue)
13. [Mantenimiento y Escalabilidad](#13-mantenimiento-y-escalabilidad)

---

## 1. Visión General del Proyecto

### 1.1 Descripción del Producto

**TallerPro** es un sistema de gestión integral para talleres mecánicos que proporciona:

- ✅ Gestión completa de clientes y vehículos
- ✅ Sistema de citas con calendario inteligente
- ✅ Control de órdenes de trabajo
- ✅ Inventario de piezas con alertas automáticas
- ✅ Facturación y reportes financieros
- ✅ Automatizaciones via n8n (WhatsApp, Email, SMS)
- ✅ Dashboard con KPIs en tiempo real

### 1.2 Objetivos del Proyecto

1. **Simplicidad**: Interfaz intuitiva para personal no técnico
2. **Eficiencia**: Reducir tiempo administrativo en un 60%
3. **Automatización**: Notificaciones automáticas sin intervención manual
4. **Escalabilidad**: Soportar desde 1 hasta 50+ talleres
5. **Tiempo Real**: Sincronización instantánea de datos

### 1.3 Stack Tecnológico

| Categoría | Tecnología | Versión | Propósito |
|-----------|------------|---------|-----------|
| **Build System** | Turborepo | 2.5.5 | Monorepo management |
| **Package Manager** | pnpm | 10.4.1 | Gestión de dependencias |
| **Frontend Framework** | Next.js | 15.x | App Router, SSR |
| **UI Library** | React | 19.x | Componentes UI |
| **Backend** | Convex | 1.25.4 | Database + Functions |
| **Auth** | Clerk | 6.34.2 | Autenticación/Orgs |
| **UI Components** | shadcn/ui | Latest | Componentes base |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS |
| **Automatización** | n8n | Latest | Workflows |
| **Language** | TypeScript | 5.7.3 | Type safety |

### 1.4 Alcance del MVP (12 semanas)

#### ✅ Incluido en MVP
- Gestión de clientes y vehículos
- Sistema de citas básico
- Órdenes de trabajo
- Inventario con alertas
- Facturación simple
- 3 automatizaciones n8n
- Dashboard con KPIs básicos

#### ❌ Post-MVP (Fase 2)
- App móvil nativa
- Portal de clientes
- Integración con proveedores
- BI avanzado
- Sistema de fidelización

---

## 2. Arquitectura Técnica

### 2.1 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         CAPA DE PRESENTACIÓN                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐         ┌──────────────────┐              │
│  │   Web App        │         │   Widget App     │              │
│  │   (Next.js 15)   │         │   (Embebible)    │              │
│  │   Puerto 3000    │         │   Puerto 3001    │              │
│  │                  │         │                  │              │
│  │  - Dashboard     │         │  - Reservas      │              │
│  │  - Gestión       │         │  - Consultas     │              │
│  │  - Reportes      │         │  - Sin Auth      │              │
│  └────────┬─────────┘         └────────┬─────────┘              │
│           │                            │                        │
│           └────────────┬───────────────┘                        │
│                        │                                        │
└────────────────────────┼────────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────────┐
│                   CAPA DE AUTENTICACIÓN                          │
├────────────────────────┼────────────────────────────────────────┤
│                        │                                        │
│              ┌─────────▼─────────┐                               │
│              │   Clerk Auth      │                               │
│              │   - JWT Tokens    │                               │
│              │   - Organizations │                               │
│              │   - Roles/Permisos│                               │
│              └─────────┬─────────┘                               │
│                        │                                        │
└────────────────────────┼────────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────────┐
│                    CAPA DE BACKEND                               │
├────────────────────────┼────────────────────────────────────────┤
│                        │                                        │
│              ┌─────────▼─────────┐                               │
│              │  Convex Backend   │                               │
│              │  (Serverless)     │                               │
│              │                   │                               │
│              │  - Queries        │                               │
│              │  - Mutations      │                               │
│              │  - Actions        │                               │
│              │  - Real-time DB   │                               │
│              └─────────┬─────────┘                               │
│                        │                                        │
│           ┌────────────┼────────────┐                            │
│           │            │            │                            │
│  ┌────────▼──────┐ ┌──▼─────┐ ┌────▼────────┐                   │
│  │   Database    │ │ Storage│ │  Scheduler  │                   │
│  │   (Tables)    │ │ (Files)│ │  (Cron)     │                   │
│  └───────────────┘ └────────┘ └─────────────┘                   │
│                                                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────────┐
│                 CAPA DE AUTOMATIZACIÓN                           │
├────────────────────────┼────────────────────────────────────────┤
│                        │                                        │
│              ┌─────────▼─────────┐                               │
│              │   n8n Platform    │                               │
│              │   (Workflows)     │                               │
│              │                   │                               │
│              │  Workflows:       │                               │
│              │  - Recordatorios  │                               │
│              │  - Alertas Stock  │                               │
│              │  - Notificaciones │                               │
│              │  - Reportes Auto  │                               │
│              └─────────┬─────────┘                               │
│                        │                                        │
│           ┌────────────┼────────────┐                            │
│           │            │            │                            │
│  ┌────────▼──────┐ ┌──▼─────┐ ┌────▼────────┐                   │
│  │   WhatsApp    │ │  Email │ │   SMS       │                   │
│  │   (Twilio)    │ │ (SMTP) │ │  (Twilio)   │                   │
│  └───────────────┘ └────────┘ └─────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE INTEGRACIONES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Google       │  │ Stripe/      │  │ Reporting    │          │
│  │ Calendar     │  │ MercadoPago  │  │ (Future)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Flujo de Datos

```
┌──────────────────────────────────────────────────────────────┐
│                    FLUJO TÍPICO DE USUARIO                    │
└──────────────────────────────────────────────────────────────┘

1. AUTENTICACIÓN
   Usuario → Clerk → JWT Token → Frontend

2. OPERACIÓN DE LECTURA
   Frontend → useQuery → Convex → Database → Real-time Update → Frontend

3. OPERACIÓN DE ESCRITURA
   Frontend → useMutation → Convex → Database → Trigger n8n Webhook
                                              → n8n Workflow
                                              → WhatsApp/Email/SMS

4. AUTOMATIZACIÓN PROGRAMADA
   Convex Cron → Check Conditions → Trigger n8n → Send Notifications
```

### 2.3 Modelo de Datos Simplificado

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  Customer   │◄───────►│  Vehicle    │◄───────►│ ServiceHist │
│             │ 1     * │             │ 1     * │             │
│ - name      │         │ - brand     │         │ - date      │
│ - phone     │         │ - model     │         │ - services  │
│ - email     │         │ - plate     │         │ - cost      │
└──────┬──────┘         └──────┬──────┘         └─────────────┘
       │                       │
       │ 1                   1 │
       │                       │
       │ *                   * │
┌──────▼──────┐         ┌──────▼──────┐
│ Appointment │         │  WorkOrder  │
│             │         │             │
│ - date      │         │ - status    │
│ - service   │         │ - services  │
│ - status    │         │ - parts     │
└─────────────┘         └──────┬──────┘
                               │
                               │ *
                               │
                        ┌──────▼──────┐
                        │   Invoice   │
                        │             │
                        │ - total     │
                        │ - status    │
                        │ - dueDate   │
                        └─────────────┘
```

---

## 3. Configuración Inicial del Entorno

### 3.1 Requisitos del Sistema

```bash
# Versiones requeridas
Node.js >= 20.0.0
pnpm >= 10.4.1
Git >= 2.40.0
```

### 3.2 Instalación Paso a Paso

#### Paso 1: Clonar el Repositorio Base

```bash
# Clonar tu repositorio actual
git clone <tu-repo-url> tallerpro
cd tallerpro

# Verificar estructura
tree -L 2
```

#### Paso 2: Instalar Dependencias

```bash
# Instalar todas las dependencias del monorepo
pnpm install

# Verificar instalación
pnpm --version  # Debe ser 10.4.1
node --version  # Debe ser >= 20.0.0
```

#### Paso 3: Configurar Convex

```bash
# Navegar al backend
cd packages/backend

# Inicializar Convex (solo primera vez)
pnpm setup
# Esto abrirá el navegador para crear/seleccionar proyecto

# Copiar la URL de Convex generada
# Formato: https://[tu-proyecto].convex.cloud

cd ../..
```

#### Paso 4: Configurar Clerk

```bash
# 1. Ir a https://dashboard.clerk.com
# 2. Crear nueva aplicación
# 3. Seleccionar: Email + Password (o Google, etc.)
# 4. Copiar las keys
```

#### Paso 5: Variables de Entorno

```bash
# Crear archivo de entorno en web app
cat > apps/web/.env.local << 'EOF'
# Convex
NEXT_PUBLIC_CONVEX_URL=https://tu-proyecto.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx
EOF

# Crear archivo para widget (opcional)
cat > apps/widget/.env.local << 'EOF'
NEXT_PUBLIC_CONVEX_URL=https://tu-proyecto.convex.cloud
EOF
```

#### Paso 6: Configurar JWT en Convex

```bash
# 1. Ir a Clerk Dashboard
# 2. Configure → JWT Templates
# 3. Crear nuevo template "convex"
# 4. Copiar el "Issuer URL"
# Formato: https://tu-app.clerk.accounts.dev

# 5. Ir a Convex Dashboard
# 6. Settings → Environment Variables
# 7. Agregar:
#    CLERK_JWT_ISSUER_DOMAIN=tu-app.clerk.accounts.dev
```

#### Paso 7: Configurar n8n

```bash
# Opción A: Docker (Recomendado para desarrollo)
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n

# Opción B: npm global
npm install n8n -g
n8n start

# Acceder a: http://localhost:5678
```

#### Paso 8: Iniciar el Proyecto

```bash
# Terminal 1: Iniciar Convex
cd packages/backend
pnpm dev

# Terminal 2: Iniciar Web App
cd apps/web
pnpm dev

# Terminal 3: Iniciar Widget (opcional)
cd apps/widget
pnpm dev

# Terminal 4: n8n (si no está en Docker)
n8n start
```

### 3.3 Verificación de la Instalación

```bash
# Verificar que todos los servicios están corriendo
curl http://localhost:3000  # Web App
curl http://localhost:3001  # Widget
curl http://localhost:5678  # n8n

# Verificar Convex
# Debería ver logs en la terminal de backend

# Verificar Clerk
# Ir a http://localhost:3000/sign-in
# Debe mostrar la página de login
```

---

## 4. Estructura del Proyecto

### 4.1 Árbol Completo del Proyecto

```
tallerpro/
│
├── apps/
│   ├── web/                              # Aplicación principal del dashboard
│   │   ├── app/
│   │   │   ├── (auth)/                   # Rutas de autenticación
│   │   │   │   ├── sign-in/
│   │   │   │   │   └── [[...sign-in]]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── sign-up/
│   │   │   │   │   └── [[...sign-up]]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── org-selection/
│   │   │   │   │   └── [[...org-selection]]/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── (dashboard)/              # Rutas protegidas
│   │   │   │   ├── page.tsx              # Dashboard principal
│   │   │   │   ├── layout.tsx            # Layout con guards
│   │   │   │   │
│   │   │   │   ├── clientes/             # Módulo de clientes
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── nuevo/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── vehiculos/            # Módulo de vehículos
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── nuevo/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── citas/                # Módulo de citas
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── calendario/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── nueva/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── ordenes/              # Órdenes de trabajo
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── nueva/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── inventario/           # Inventario
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── nuevo/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── facturacion/          # Facturación
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── reportes/             # Reportes
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── ventas/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── inventario/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   └── configuracion/        # Configuración
│   │   │   │       ├── page.tsx
│   │   │   │       ├── taller/
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── usuarios/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── integraciones/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── api/                      # API Routes
│   │   │   │   └── webhooks/
│   │   │   │       └── n8n/
│   │   │   │           └── route.ts
│   │   │   │
│   │   │   ├── layout.tsx                # Root layout
│   │   │   └── globals.css
│   │   │
│   │   ├── components/                   # Componentes globales
│   │   │   ├── providers.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── theme-provider.tsx
│   │   │
│   │   ├── modules/                      # Módulos de features
│   │   │   ├── auth/
│   │   │   │   └── ui/
│   │   │   │       ├── components/
│   │   │   │       │   ├── auth-guard.tsx
│   │   │   │       │   └── organization-guard.tsx
│   │   │   │       ├── layouts/
│   │   │   │       │   └── auth-layout.tsx
│   │   │   │       └── views/
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── components/
│   │   │   │   │   ├── stats-card.tsx
│   │   │   │   │   ├── recent-appointments.tsx
│   │   │   │   │   ├── revenue-chart.tsx
│   │   │   │   │   └── quick-actions.tsx
│   │   │   │   └── views/
│   │   │   │       └── dashboard-view.tsx
│   │   │   │
│   │   │   ├── customers/
│   │   │   │   ├── components/
│   │   │   │   │   ├── customer-list.tsx
│   │   │   │   │   ├── customer-form.tsx
│   │   │   │   │   ├── customer-detail.tsx
│   │   │   │   │   ├── customer-search.tsx
│   │   │   │   │   └── customer-filters.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── use-customers.ts
│   │   │   │   │   └── use-customer-form.ts
│   │   │   │   └── views/
│   │   │   │       ├── customers-view.tsx
│   │   │   │       └── customer-detail-view.tsx
│   │   │   │
│   │   │   ├── vehicles/
│   │   │   │   ├── components/
│   │   │   │   │   ├── vehicle-list.tsx
│   │   │   │   │   ├── vehicle-form.tsx
│   │   │   │   │   ├── vehicle-detail.tsx
│   │   │   │   │   ├── service-history.tsx
│   │   │   │   │   └── maintenance-alerts.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── use-vehicles.ts
│   │   │   │   └── views/
│   │   │   │       ├── vehicles-view.tsx
│   │   │   │       └── vehicle-detail-view.tsx
│   │   │   │
│   │   │   ├── appointments/
│   │   │   │   ├── components/
│   │   │   │   │   ├── calendar-view.tsx
│   │   │   │   │   ├── appointment-form.tsx
│   │   │   │   │   ├── appointment-list.tsx
│   │   │   │   │   ├── appointment-card.tsx
│   │   │   │   │   └── time-slot-picker.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── use-appointments.ts
│   │   │   │   │   └── use-calendar.ts
│   │   │   │   └── views/
│   │   │   │       └── appointments-view.tsx
│   │   │   │
│   │   │   ├── work-orders/
│   │   │   │   ├── components/
│   │   │   │   │   ├── work-order-list.tsx
│   │   │   │   │   ├── work-order-form.tsx
│   │   │   │   │   ├── work-order-detail.tsx
│   │   │   │   │   ├── service-items.tsx
│   │   │   │   │   ├── parts-usage.tsx
│   │   │   │   │   └── status-badge.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── use-work-orders.ts
│   │   │   │   └── views/
│   │   │   │       ├── work-orders-view.tsx
│   │   │   │       └── work-order-detail-view.tsx
│   │   │   │
│   │   │   ├── inventory/
│   │   │   │   ├── components/
│   │   │   │   │   ├── inventory-list.tsx
│   │   │   │   │   ├── inventory-form.tsx
│   │   │   │   │   ├── stock-alerts.tsx
│   │   │   │   │   ├── usage-history.tsx
│   │   │   │   │   └── low-stock-badge.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── use-inventory.ts
│   │   │   │   └── views/
│   │   │   │       └── inventory-view.tsx
│   │   │   │
│   │   │   ├── invoicing/
│   │   │   │   ├── components/
│   │   │   │   │   ├── invoice-list.tsx
│   │   │   │   │   ├── invoice-form.tsx
│   │   │   │   │   ├── invoice-preview.tsx
│   │   │   │   │   └── payment-status.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── use-invoices.ts
│   │   │   │   └── views/
│   │   │   │       └── invoicing-view.tsx
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── components/
│   │   │   │   │   ├── sales-report.tsx
│   │   │   │   │   ├── inventory-report.tsx
│   │   │   │   │   ├── performance-report.tsx
│   │   │   │   │   └── export-button.tsx
│   │   │   │   └── views/
│   │   │   │       └── reports-view.tsx
│   │   │   │
│   │   │   └── settings/
│   │   │       ├── components/
│   │   │       │   ├── n8n-webhook-config.tsx
│   │   │       │   ├── workshop-settings.tsx
│   │   │       │   ├── user-management.tsx
│   │   │       │   └── integration-card.tsx
│   │   │       └── views/
│   │   │           └── settings-view.tsx
│   │   │
│   │   ├── lib/                          # Utilidades específicas de web
│   │   │   ├── utils.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── middleware.ts                 # Middleware de Clerk
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── widget/                           # Widget embebible
│       ├── app/
│       │   ├── page.tsx
│       │   └── layout.tsx
│       ├── components/
│       │   ├── appointment-widget.tsx
│       │   └── providers.tsx
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       └── package.json
│
├── packages/
│   ├── backend/                          # Backend Convex
│   │   └── convex/
│   │       ├── _generated/               # Auto-generado (NO EDITAR)
│   │       │   ├── api.d.ts
│   │       │   ├── api.js
│   │       │   ├── dataModel.d.ts
│   │       │   └── server.d.ts
│   │       │
│   │       ├── auth.config.ts            # Config de Clerk
│   │       ├── schema.ts                 # Schema de DB
│   │       │
│   │       ├── customers.ts              # Funciones de clientes
│   │       ├── vehicles.ts               # Funciones de vehículos
│   │       ├── appointments.ts           # Funciones de citas
│   │       ├── workOrders.ts             # Órdenes de trabajo
│   │       ├── inventory.ts              # Inventario
│   │       ├── invoices.ts               # Facturación
│   │       ├── serviceHistory.ts         # Historial
│   │       ├── mechanics.ts              # Mecánicos
│   │       ├── dashboard.ts              # Stats y KPIs
│   │       ├── n8nWebhooks.ts            # Config webhooks
│   │       │
│   │       └── lib/                      # Utilidades backend
│   │           ├── validators.ts
│   │           └── helpers.ts
│   │
│   ├── ui/                               # Componentes compartidos
│   │   ├── src/
│   │   │   ├── components/               # shadcn/ui components
│   │   │   │   ├── ui/
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── input.tsx
│   │   │   │   │   ├── select.tsx
│   │   │   │   │   ├── dialog.tsx
│   │   │   │   │   ├── calendar.tsx
│   │   │   │   │   ├── table.tsx
│   │   │   │   │   ├── badge.tsx
│   │   │   │   │   ├── card.tsx
│   │   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   │   ├── form.tsx
│   │   │   │   │   ├── toast.tsx
│   │   │   │   │   ├── tabs.tsx
│   │   │   │   │   ├── avatar.tsx
│   │   │   │   │   ├── popover.tsx
│   │   │   │   │   ├── alert.tsx
│   │   │   │   │   ├── textarea.tsx
│   │   │   │   │   ├── checkbox.tsx
│   │   │   │   │   └── radio-group.tsx
│   │   │   │   │
│   │   │   │   └── shared/               # Componentes custom compartidos
│   │   │   │       ├── data-table.tsx
│   │   │   │       ├── empty-state.tsx
│   │   │   │       ├── loading-spinner.tsx
│   │   │   │       └── error-boundary.tsx
│   │   │   │
│   │   │   ├── hooks/                    # Custom hooks
│   │   │   │   ├── use-toast.ts
│   │   │   │   ├── use-media-query.ts
│   │   │   │   └── use-local-storage.ts
│   │   │   │
│   │   │   ├── lib/                      # Utilidades
│   │   │   │   └── utils.ts              # cn() function
│   │   │   │
│   │   │   └── styles/
│   │   │       └── globals.css           # Estilos globales
│   │   │
│   │   ├── postcss.config.mjs
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── taller-types/                     # Types compartidos
│   │   ├── src/
│   │   │   ├── customer.ts
│   │   │   ├── vehicle.ts
│   │   │   ├── appointment.ts
│   │   │   ├── work-order.ts
│   │   │   ├── inventory.ts
│   │   │   ├── invoice.ts
│   │   │   ├── mechanic.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── taller-utils/                     # Utilidades compartidas
│   │   ├── src/
│   │   │   ├── formatters/
│   │   │   │   ├── currency.ts
│   │   │   │   ├── date.ts
│   │   │   │   └── phone.ts
│   │   │   │
│   │   │   ├── validators/
│   │   │   │   ├── email.ts
│   │   │   │   ├── phone.ts
│   │   │   │   └── license-plate.ts
│   │   │   │
│   │   │   └── constants/
│   │   │       ├── status.ts
│   │   │       ├── service-types.ts
│   │   │       └── vehicle-brands.ts
│   │   │
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── n8n-integrations/                 # Conectores n8n
│   │   ├── src/
│   │   │   ├── webhook-manager.ts
│   │   │   ├── types.ts
│   │   │   └── workflows/
│   │   │       ├── appointment-reminders.ts
│   │   │       ├── stock-alerts.ts
│   │   │       └── order-notifications.ts
│   │   │
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── eslint-config/                    # Config ESLint
│   │   ├── next.js
│   │   ├── library.js
│   │   └── package.json
│   │
│   └── typescript-config/                # Config TypeScript
│       ├── base.json
│       ├── nextjs.json
│       ├── react-library.json
│       └── package.json
│
├── .github/                              # GitHub workflows (CI/CD)
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── docs/                                 # Documentación adicional
│   ├── API.md
│   ├── COMPONENTS.md
│   └── WORKFLOWS.md
│
├── .env.example                          # Ejemplo de variables de entorno
├── .gitignore
├── turbo.json                            # Config de Turborepo
├── pnpm-workspace.yaml                   # Config de workspaces
├── package.json                          # Root package.json
└── README.md                             # Este archivo
```

### 4.2 Convenciones de Nombres

#### Archivos y Carpetas

```
✅ CORRECTO:
- customer-list.tsx        (kebab-case para componentes)
- useCustomers.ts          (camelCase para hooks)
- customers.ts             (lowercase para Convex functions)
- CustomerForm             (PascalCase para component names)

❌ INCORRECTO:
- CustomerList.tsx
- use-customers.ts
- Customers.ts
```

#### Variables y Funciones

```typescript
// Variables: camelCase
const customerName = "Juan";
const totalAmount = 1000;

// Funciones: camelCase
function calculateTotal() {}
const handleSubmit = () => {};

// Componentes: PascalCase
function CustomerForm() {}
const AppointmentCard = () => {};

// Constantes: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_ENDPOINT = "https://api.example.com";

// Types/Interfaces: PascalCase
interface Customer {}
type AppointmentStatus = "pending" | "confirmed";
```

---

## 5. Base de Datos y Schema

### 5.1 Schema Completo de Convex

El schema completo incluye las siguientes tablas principales:

- **customers**: Gestión de clientes
- **vehicles**: Vehículos asociados a clientes
- **appointments**: Sistema de citas
- **workOrders**: Órdenes de trabajo
- **workOrderServices**: Servicios incluidos en órdenes
- **inventoryItems**: Piezas y repuestos
- **inventoryUsage**: Uso de piezas en órdenes
- **mechanics**: Personal mecánico
- **invoices**: Facturación
- **serviceHistory**: Historial de servicios
- **n8nWebhooks**: Configuración de webhooks
- **serviceCategories**: Categorías de servicios
- **organizationSettings**: Configuración por organización
- **notifications**: Sistema de notificaciones

### 5.2 Relaciones Entre Tablas

```
CUSTOMER (1) ──────── (*) VEHICLE
    │                        │
    │                        │
    │ (1)              (1)   │
    │                        │
    └── (*) APPOINTMENT (*) ─┘
              │
              │ (0..1)
              │
              ▼ (1)
        WORK_ORDER
              │
              ├── (*) WORK_ORDER_SERVICES
              │
              ├── (*) INVENTORY_USAGE
              │         │
              │         │ (*)
              │         ▼
              │   INVENTORY_ITEMS
              │
              └── (1) INVOICE
                    │
                    └── (1) SERVICE_HISTORY
```

### 5.3 Índices y Optimización

**Índices Primarios:**
- `by_organization`: Para filtrar por organización (multi-tenant)
- `by_customer`: Para consultas de cliente específico
- `by_date`: Para consultas temporales

**Índices de Búsqueda:**
- `search_customers`: Búsqueda de clientes por nombre
- `search_vehicles`: Búsqueda de vehículos por patente
- `search_orders`: Búsqueda de órdenes por número
- `search_parts`: Búsqueda de piezas por nombre

**Índices Compuestos:**
- `by_status` + `by_organization`: Para filtros combinados
- `by_date` + `by_organization`: Para reportes por fecha

---

## 6. Backend - Funciones Convex

### 6.1 Estructura de Funciones

Cada módulo tendrá su archivo de funciones en `packages/backend/convex/`:

```
convex/
├── customers.ts         # CRUD de clientes
├── vehicles.ts          # CRUD de vehículos
├── appointments.ts      # Gestión de citas
├── workOrders.ts        # Órdenes de trabajo
├── inventory.ts         # Inventario
├── invoices.ts          # Facturación
├── mechanics.ts         # Mecánicos
├── serviceHistory.ts    # Historial
├── dashboard.ts         # Stats y KPIs
├── n8nWebhooks.ts       # Config de webhooks
└── lib/
    ├── validators.ts    # Validadores Zod
    ├── helpers.ts       # Funciones auxiliares
    └── constants.ts     # Constantes
```

### 6.2 Tipos de Funciones

- **Queries**: Lectura de datos (tiempo real)
- **Mutations**: Escritura de datos (transaccionales)
- **Actions**: Operaciones con servicios externos (n8n, webhooks)

Ver ejemplos completos en la documentación extendida.

---

## 7. Integración n8n

### 7.1 Instalación y Configuración de n8n

#### Opción A: Docker (Recomendado)

```bash
# Crear docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=tu_password_seguro
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - NODE_ENV=production
      - WEBHOOK_URL=http://localhost:5678/
      - GENERIC_TIMEZONE=America/Argentina/Buenos_Aires
    volumes:
      - n8n_data:/home/node/.n8n
      - ./n8n/backup:/backup

volumes:
  n8n_data:
EOF

# Iniciar n8n
docker-compose up -d
```

#### Opción B: npm (Desarrollo local)

```bash
# Instalar globalmente
npm install n8n -g

# Iniciar n8n
n8n start

# Acceder a: http://localhost:5678
```

### 7.2 Workflows Principales

#### Workflow 1: Recordatorio de Citas (24h antes)
- Recibe datos de cita vía webhook
- Formatea mensaje personalizado
- Envía por WhatsApp y Email
- Actualiza estado en Convex

#### Workflow 2: Alerta de Stock Bajo
- Detecta cuando stock < mínimo
- Envía email a administrador
- Registra en Google Sheets
- Genera reporte automático

#### Workflow 3: Notificación de Orden Completada
- Se activa al completar orden
- Notifica al cliente
- Genera factura automática
- Solicita feedback

---

## 8. Frontend - Componentes y Vistas

### 8.1 Arquitectura de Componentes

```
app/
└── (dashboard)/
    ├── page.tsx              # Usa → modules/dashboard/views/dashboard-view.tsx
    ├── clientes/
    │   └── page.tsx          # Usa → modules/customers/views/customers-view.tsx
    └── citas/
        └── page.tsx          # Usa → modules/appointments/views/appointments-view.tsx
```

### 8.2 Patrón de Diseño

Cada módulo sigue la estructura:

```
modules/[feature]/
├── components/        # Componentes específicos del feature
├── hooks/            # Custom hooks para lógica de negocio
└── views/            # Vistas completas (páginas)
```

### 8.3 Ejemplo de Uso

```typescript
// app/(dashboard)/clientes/page.tsx
import { CustomersView } from "@/modules/customers/views/customers-view";

export default function ClientesPage() {
  return <CustomersView />;
}

// modules/customers/views/customers-view.tsx
import { CustomerList } from "../components/customer-list";
import { useCustomers } from "../hooks/use-customers";

export function CustomersView() {
  const { customers, loading } = useCustomers();

  return (
    <div>
      <h1>Clientes</h1>
      <CustomerList customers={customers} loading={loading} />
    </div>
  );
}
```

---

## 9. Autenticación y Permisos

### 9.1 Configuración de Clerk

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/(dashboard)(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});
```

### 9.2 Roles y Permisos

- **admin**: Acceso completo
- **manager**: Gestión de taller
- **mechanic**: Solo órdenes asignadas
- **receptionist**: Citas y clientes

### 9.3 Guards de Rutas

```typescript
// components/auth-guard.tsx
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <Loading />;
  if (!isSignedIn) redirect("/sign-in");

  return <>{children}</>;
}
```

---

## 10. Guía de Desarrollo por Módulos

### 10.1 Crear un Nuevo Módulo

1. **Crear estructura de carpetas**
```bash
mkdir -p apps/web/modules/mi-modulo/{components,hooks,views}
```

2. **Crear funciones Convex**
```bash
touch packages/backend/convex/miModulo.ts
```

3. **Actualizar schema** si es necesario
```typescript
// packages/backend/convex/schema.ts
miTabla: defineTable({
  // ... campos
})
```

4. **Crear componentes**
```bash
touch apps/web/modules/mi-modulo/components/mi-componente.tsx
```

5. **Crear vista**
```bash
touch apps/web/modules/mi-modulo/views/mi-vista.tsx
```

6. **Crear ruta**
```bash
mkdir -p apps/web/app/\(dashboard\)/mi-ruta
touch apps/web/app/\(dashboard\)/mi-ruta/page.tsx
```

### 10.2 Checklist de Desarrollo

- [ ] Schema definido en Convex
- [ ] Funciones backend (queries/mutations)
- [ ] Tipos TypeScript
- [ ] Componentes UI
- [ ] Hooks personalizados
- [ ] Vista principal
- [ ] Ruta en app router
- [ ] Tests unitarios
- [ ] Documentación

---

## 11. Testing

### 11.1 Estrategia de Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:coverage
```

### 11.2 Ejemplo de Test

```typescript
// __tests__/customers.test.ts
import { render, screen } from "@testing-library/react";
import { CustomerList } from "@/modules/customers/components/customer-list";

describe("CustomerList", () => {
  it("renders customer list", () => {
    const customers = [
      { id: "1", name: "Juan Pérez" }
    ];

    render(<CustomerList customers={customers} />);

    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
  });
});
```

---

## 12. Despliegue

### 12.1 Despliegue de Convex

```bash
cd packages/backend
pnpm deploy
```

### 12.2 Despliegue de Next.js (Vercel)

```bash
cd apps/web
vercel --prod
```

### 12.3 Despliegue de n8n

```bash
# Docker Compose en servidor
docker-compose up -d

# O usando n8n Cloud
# https://n8n.io/cloud
```

### 12.4 Variables de Entorno en Producción

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=https://tu-proyecto.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxx
CLERK_SECRET_KEY=sk_live_xxxx

# n8n
N8N_WEBHOOK_BASE_URL=https://n8n.tudominio.com
```

---

## 13. Mantenimiento y Escalabilidad

### 13.1 Monitoreo

- **Convex Dashboard**: Métricas de base de datos
- **Vercel Analytics**: Performance del frontend
- **n8n Logs**: Estado de workflows
- **Clerk Dashboard**: Autenticación y usuarios

### 13.2 Backup

```bash
# Backup de Convex (automático por defecto)
# Los datos se replican automáticamente

# Backup de n8n workflows
docker exec n8n n8n export:workflow --backup --output=/backup/

# Backup de configuración
git commit -am "backup: configuración $(date +%Y%m%d)"
git push
```

### 13.3 Escalabilidad

- **Convex**: Auto-scaling automático
- **Next.js en Vercel**: Edge functions globales
- **n8n**: Configurar workers adicionales
- **Clerk**: Soporta millones de usuarios

---

## 📞 Soporte y Contribución

### Recursos

- [Documentación de Convex](https://docs.convex.dev)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Clerk](https://clerk.com/docs)
- [Documentación de n8n](https://docs.n8n.io)
- [shadcn/ui Components](https://ui.shadcn.com)

### Contribuir

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/mi-feature`)
3. Commit tus cambios (`git commit -am 'Add: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/mi-feature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado y confidencial. Todos los derechos reservados.

---

**Desarrollado con ❤️ para talleres mecánicos modernos**
