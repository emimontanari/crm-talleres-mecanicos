# 📘 TallerPro - Guía Completa de Desarrollo

## 📑 Tabla de Contenidos

- [1. Visión General del Proyecto](#1-visión-general-del-proyecto)
- [2. Arquitectura Técnica](#2-arquitectura-técnica)
- [3. Configuración Inicial del Entorno](#3-configuración-inicial-del-entorno)
- [4. Estructura del Proyecto](#4-estructura-del-proyecto)
- [5. Base de Datos y Schema](#5-base-de-datos-y-schema)
- [6. Backend - Funciones Convex](#6-backend---funciones-convex)
- [7. Integración n8n](#7-integración-n8n)
- [8. Frontend - Componentes y Vistas](#8-frontend---componentes-y-vistas)
- [9. Autenticación y Permisos](#9-autenticación-y-permisos)
- [10. Guía de Desarrollo por Módulos](#10-guía-de-desarrollo-por-módulos)
- [11. Testing](#11-testing)
- [12. Despliegue](#12-despliegue)
- [13. Mantenimiento y Escalabilidad](#13-mantenimiento-y-escalabilidad)

---

## 1. Visión General del Proyecto

### 1.1 Descripción del Producto

**TallerPro** es un sistema de gestión integral (SaaS) diseñado específicamente para talleres mecánicos que buscan digitalizar y optimizar sus operaciones diarias. El sistema proporciona una solución completa que abarca desde la gestión de clientes y vehículos hasta el control de inventario, facturación y automatización de comunicaciones.

### 1.2 Objetivos del Proyecto

**Objetivo Principal:** Crear un dashboard completo, intuitivo y profesional que permita a los talleres mecánicos:

- ✅ **Reducir el tiempo administrativo** en un 60% mediante la automatización de procesos
- ✅ **Mejorar la experiencia del cliente** con recordatorios automáticos y comunicación proactiva
- ✅ **Optimizar el control de inventario** con alertas automáticas de stock bajo
- ✅ **Aumentar la eficiencia operativa** con seguimiento en tiempo real de órdenes de trabajo
- ✅ **Facilitar la toma de decisiones** mediante reportes y KPIs en tiempo real

### 1.3 Características Principales

#### Para el Taller

1. **Dashboard Inteligente**
   - KPIs en tiempo real (órdenes activas, citas del día, ingresos mensuales)
   - Gráficos de rendimiento y tendencias
   - Acceso rápido a funciones más usadas

2. **Gestión de Clientes**
   - Base de datos completa de clientes
   - Historial de visitas y servicios
   - Comunicación integrada (WhatsApp, Email, SMS)

3. **Control de Vehículos**
   - Registro detallado de cada vehículo
   - Historial completo de servicios
   - Alertas de mantenimiento preventivo

4. **Sistema de Citas**
   - Calendario visual interactivo
   - Reservas online (widget embebible)
   - Confirmaciones y recordatorios automáticos

5. **Órdenes de Trabajo**
   - Seguimiento de estado en tiempo real
   - Asignación de mecánicos
   - Control de costos y tiempos

6. **Inventario Inteligente**
   - Control de stock en tiempo real
   - Alertas automáticas de reposición
   - Historial de uso por orden

7. **Facturación**
   - Generación automática de facturas
   - Control de pagos y vencimientos
   - Reportes financieros

#### Para los Clientes

8. **Notificaciones Automáticas**
   - Recordatorios de citas (24h antes)
   - Avisos de vehículo listo
   - Confirmaciones de pago
   - Solicitudes de feedback

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

### 2.1 Stack Tecnológico

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

### 2.2 Diagrama de Arquitectura

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
```

### 2.3 Flujo de Datos

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

### 2.4 Modelo de Datos Simplificado

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
Docker (opcional, para n8n)
```

### 3.2 Instalación Paso a Paso

#### Paso 1: Clonar el Repositorio Base

```bash
# Clonar tu repositorio actual
git clone <tu-repo-url> tallerpro
cd tallerpro

# Verificar estructura
ls -la
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
# 4. Copiar las keys:
#    - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
#    - CLERK_SECRET_KEY
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
# 1. Ir a Clerk Dashboard → Configure → JWT Templates
# 2. Crear nuevo template "convex"
# 3. Copiar el "Issuer URL"
#    Formato: https://tu-app.clerk.accounts.dev

# 4. Ir a Convex Dashboard → Settings → Environment Variables
# 5. Agregar variable:
#    Key: CLERK_JWT_ISSUER_DOMAIN
#    Value: tu-app.clerk.accounts.dev
```

#### Paso 7: Configurar n8n

**Opción A: Docker (Recomendado)**

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

volumes:
  n8n_data:
EOF

# Iniciar n8n
docker-compose up -d

# Ver logs
docker-compose logs -f n8n

# Acceder a: http://localhost:5678
```

**Opción B: npm Global**

```bash
# Instalar globalmente
npm install n8n -g

# Iniciar n8n
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

# Acceder a:
# - Web App: http://localhost:3000
# - Widget: http://localhost:3001
# - n8n: http://localhost:5678
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

### 4.1 Árbol del Proyecto

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
│   │   │   ├── dashboard/
│   │   │   ├── customers/
│   │   │   ├── vehicles/
│   │   │   ├── appointments/
│   │   │   ├── work-orders/
│   │   │   ├── inventory/
│   │   │   ├── invoicing/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   │
│   │   ├── lib/
│   │   ├── middleware.ts
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── widget/                           # Widget embebible
│       ├── app/
│       ├── components/
│       └── package.json
│
├── packages/
│   ├── backend/                          # Backend Convex
│   │   └── convex/
│   │       ├── _generated/
│   │       ├── auth.config.ts
│   │       ├── schema.ts
│   │       ├── customers.ts
│   │       ├── vehicles.ts
│   │       ├── appointments.ts
│   │       ├── workOrders.ts
│   │       ├── inventory.ts
│   │       ├── invoices.ts
│   │       ├── serviceHistory.ts
│   │       ├── mechanics.ts
│   │       ├── dashboard.ts
│   │       ├── n8nWebhooks.ts
│   │       └── lib/
│   │
│   ├── ui/                               # Componentes compartidos
│   │   └── src/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── lib/
│   │       └── styles/
│   │
│   ├── taller-types/                     # Types compartidos
│   │   └── src/
│   │       ├── customer.ts
│   │       ├── vehicle.ts
│   │       ├── appointment.ts
│   │       ├── work-order.ts
│   │       └── index.ts
│   │
│   ├── taller-utils/                     # Utilidades compartidas
│   │   └── src/
│   │       ├── formatters/
│   │       ├── validators/
│   │       └── constants/
│   │
│   ├── n8n-integrations/                 # Conectores n8n
│   │   └── src/
│   │       ├── webhook-manager.ts
│   │       └── workflows/
│   │
│   ├── eslint-config/
│   └── typescript-config/
│
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── CLAUDE.md
├── README.md
└── DESARROLLO_COMPLETO.md                # Este archivo
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

```typescript
// packages/backend/convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ==================== CLIENTES ====================
  customers: defineTable({
    organizationId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    notes: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_email", ["organizationId", "email"])
    .index("by_phone", ["organizationId", "phone"])
    .searchIndex("search_customers", {
      searchField: "firstName",
      filterFields: ["organizationId"],
    }),

  // ==================== VEHÍCULOS ====================
  vehicles: defineTable({
    organizationId: v.string(),
    customerId: v.id("customers"),
    brand: v.string(),
    model: v.string(),
    year: v.number(),
    licensePlate: v.string(),
    vin: v.optional(v.string()),
    color: v.optional(v.string()),
    engineType: v.optional(v.string()),
    transmission: v.optional(v.string()),
    mileage: v.number(),
    lastServiceDate: v.optional(v.number()),
    nextServiceDue: v.optional(v.number()),
    notes: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_customer", ["customerId"])
    .index("by_license_plate", ["organizationId", "licensePlate"])
    .searchIndex("search_vehicles", {
      searchField: "licensePlate",
      filterFields: ["organizationId"],
    }),

  // ==================== CITAS ====================
  appointments: defineTable({
    organizationId: v.string(),
    customerId: v.id("customers"),
    vehicleId: v.id("vehicles"),
    scheduledDate: v.number(),
    duration: v.number(),
    status: v.union(
      v.literal("scheduled"),
      v.literal("confirmed"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show")
    ),
    serviceType: v.string(),
    description: v.optional(v.string()),
    assignedMechanicId: v.optional(v.id("mechanics")),
    reminderSent: v.boolean(),
    reminderSentAt: v.optional(v.number()),
    cancellationReason: v.optional(v.string()),
    createdBy: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_customer", ["customerId"])
    .index("by_vehicle", ["vehicleId"])
    .index("by_date", ["organizationId", "scheduledDate"])
    .index("by_status", ["organizationId", "status"])
    .index("by_mechanic", ["assignedMechanicId", "scheduledDate"]),

  // ==================== ÓRDENES DE TRABAJO ====================
  workOrders: defineTable({
    organizationId: v.string(),
    appointmentId: v.optional(v.id("appointments")),
    customerId: v.id("customers"),
    vehicleId: v.id("vehicles"),
    orderNumber: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("waiting_parts"),
      v.literal("completed"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("urgent")
    ),
    mileageIn: v.number(),
    mileageOut: v.optional(v.number()),
    assignedMechanicId: v.optional(v.id("mechanics")),
    estimatedCost: v.number(),
    finalCost: v.optional(v.number()),
    estimatedTime: v.number(),
    actualTime: v.optional(v.number()),
    description: v.string(),
    diagnosis: v.optional(v.string()),
    customerNotes: v.optional(v.string()),
    mechanicNotes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    deliveredAt: v.optional(v.number()),
    createdBy: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_customer", ["customerId"])
    .index("by_vehicle", ["vehicleId"])
    .index("by_status", ["organizationId", "status"])
    .index("by_order_number", ["organizationId", "orderNumber"])
    .searchIndex("search_orders", {
      searchField: "orderNumber",
      filterFields: ["organizationId"],
    }),

  // ==================== SERVICIOS ====================
  workOrderServices: defineTable({
    organizationId: v.string(),
    workOrderId: v.id("workOrders"),
    serviceName: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    quantity: v.number(),
    unitPrice: v.number(),
    discount: v.optional(v.number()),
    tax: v.optional(v.number()),
    totalPrice: v.number(),
    isCompleted: v.boolean(),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_work_order", ["workOrderId"]),

  // ==================== INVENTARIO ====================
  inventoryItems: defineTable({
    organizationId: v.string(),
    partNumber: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    brand: v.optional(v.string()),
    supplier: v.optional(v.string()),
    currentStock: v.number(),
    minStock: v.number(),
    maxStock: v.optional(v.number()),
    unitCost: v.number(),
    sellingPrice: v.number(),
    location: v.optional(v.string()),
    barcode: v.optional(v.string()),
    isActive: v.boolean(),
    lastRestockDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_part_number", ["organizationId", "partNumber"])
    .index("by_category", ["organizationId", "category"])
    .index("by_low_stock", ["organizationId", "currentStock"])
    .searchIndex("search_parts", {
      searchField: "name",
      filterFields: ["organizationId"],
    }),

  // ==================== USO DE PIEZAS ====================
  inventoryUsage: defineTable({
    organizationId: v.string(),
    workOrderId: v.id("workOrders"),
    inventoryItemId: v.id("inventoryItems"),
    partNumber: v.string(),
    partName: v.string(),
    quantity: v.number(),
    unitCost: v.number(),
    sellingPrice: v.number(),
    totalCost: v.number(),
    usedBy: v.string(),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_work_order", ["workOrderId"])
    .index("by_inventory_item", ["inventoryItemId"])
    .index("by_date", ["organizationId", "createdAt"]),

  // ==================== MECÁNICOS ====================
  mechanics: defineTable({
    organizationId: v.string(),
    userId: v.optional(v.string()),
    employeeNumber: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    specialty: v.optional(v.string()),
    certification: v.optional(v.string()),
    hourlyRate: v.optional(v.number()),
    hireDate: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_user", ["userId"])
    .index("by_employee_number", ["organizationId", "employeeNumber"]),

  // ==================== FACTURAS ====================
  invoices: defineTable({
    organizationId: v.string(),
    workOrderId: v.id("workOrders"),
    customerId: v.id("customers"),
    invoiceNumber: v.string(),
    subtotal: v.number(),
    discount: v.number(),
    tax: v.number(),
    total: v.number(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("partially_paid"),
      v.literal("overdue"),
      v.literal("cancelled")
    ),
    dueDate: v.number(),
    paidDate: v.optional(v.number()),
    paidAmount: v.optional(v.number()),
    paymentMethod: v.optional(v.string()),
    paymentReference: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdBy: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_work_order", ["workOrderId"])
    .index("by_customer", ["customerId"])
    .index("by_status", ["organizationId", "status"])
    .index("by_invoice_number", ["organizationId", "invoiceNumber"])
    .searchIndex("search_invoices", {
      searchField: "invoiceNumber",
      filterFields: ["organizationId"],
    }),

  // ==================== HISTORIAL DE SERVICIOS ====================
  serviceHistory: defineTable({
    organizationId: v.string(),
    vehicleId: v.id("vehicles"),
    workOrderId: v.id("workOrders"),
    serviceDate: v.number(),
    mileage: v.number(),
    serviceSummary: v.string(),
    servicesPerformed: v.array(v.string()),
    partsReplaced: v.array(v.string()),
    cost: v.number(),
    mechanicId: v.optional(v.id("mechanics")),
    nextServiceDue: v.optional(v.number()),
    nextServiceMileage: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_vehicle", ["vehicleId"])
    .index("by_date", ["vehicleId", "serviceDate"]),

  // ==================== WEBHOOKS n8n ====================
  n8nWebhooks: defineTable({
    organizationId: v.string(),
    webhookType: v.union(
      v.literal("appointment_reminder"),
      v.literal("appointment_confirmation"),
      v.literal("low_stock_alert"),
      v.literal("order_completed"),
      v.literal("order_ready"),
      v.literal("invoice_sent"),
      v.literal("payment_reminder"),
      v.literal("feedback_request")
    ),
    webhookUrl: v.string(),
    isActive: v.boolean(),
    lastTriggered: v.optional(v.number()),
    triggerCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_type", ["organizationId", "webhookType"]),

  // ==================== CONFIGURACIÓN ====================
  organizationSettings: defineTable({
    organizationId: v.string(),
    workshopName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    taxId: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    currency: v.string(),
    timezone: v.string(),
    appointmentSlotDuration: v.number(),
    autoConfirmAppointments: v.boolean(),
    sendRemindersBefore: v.number(),
    lowStockThreshold: v.optional(v.number()),
    invoiceDueDays: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_organization", ["organizationId"]),

  // ==================== NOTIFICACIONES ====================
  notifications: defineTable({
    organizationId: v.string(),
    userId: v.string(),
    type: v.union(
      v.literal("appointment_created"),
      v.literal("appointment_updated"),
      v.literal("order_completed"),
      v.literal("low_stock"),
      v.literal("payment_received"),
      v.literal("overdue_invoice")
    ),
    title: v.string(),
    message: v.string(),
    relatedId: v.optional(v.string()),
    isRead: v.boolean(),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId", "isRead"])
    .index("by_organization", ["organizationId", "createdAt"]),
});
```

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
              ├── (1) INVOICE
              │
              └── (1) SERVICE_HISTORY
```

---

## 6. Backend - Funciones Convex

### 6.1 Ejemplo Completo: Módulo de Clientes

```typescript
// packages/backend/convex/customers.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ==================== QUERIES ====================

export const list = query({
  args: {
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const orgId = identity.orgId as string;
    if (!orgId) throw new Error("No pertenece a una organización");

    let customers = await ctx.db
      .query("customers")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Búsqueda local
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.firstName.toLowerCase().includes(searchLower) ||
          c.lastName.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.phone.includes(args.search!)
      );
    }

    // Paginación
    const offset = args.offset || 0;
    const limit = args.limit || 50;
    const paginatedCustomers = customers.slice(offset, offset + limit);

    return {
      customers: paginatedCustomers,
      total: customers.length,
      hasMore: offset + limit < customers.length,
    };
  },
});

export const getById = query({
  args: { id: v.id("customers") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const customer = await ctx.db.get(args.id);
    if (!customer) throw new Error("Cliente no encontrado");

    const orgId = identity.orgId as string;
    if (customer.organizationId !== orgId) {
      throw new Error("No autorizado");
    }

    // Obtener vehículos del cliente
    const vehicles = await ctx.db
      .query("vehicles")
      .withIndex("by_customer", (q) => q.eq("customerId", args.id))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Obtener última cita
    const lastAppointment = await ctx.db
      .query("appointments")
      .withIndex("by_customer", (q) => q.eq("customerId", args.id))
      .order("desc")
      .first();

    return {
      ...customer,
      vehicles,
      lastAppointment,
      vehicleCount: vehicles.length,
    };
  },
});

export const getStats = query({
  args: { id: v.id("customers") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const customer = await ctx.db.get(args.id);
    if (!customer) throw new Error("Cliente no encontrado");

    const orgId = identity.orgId as string;
    if (customer.organizationId !== orgId) {
      throw new Error("No autorizado");
    }

    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_customer", (q) => q.eq("customerId", args.id))
      .collect();

    const workOrders = await ctx.db
      .query("workOrders")
      .withIndex("by_customer", (q) => q.eq("customerId", args.id))
      .collect();

    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_customer", (q) => q.eq("customerId", args.id))
      .filter((q) => q.eq(q.field("status"), "paid"))
      .collect();

    const totalSpent = invoices.reduce((sum, inv) => sum + inv.total, 0);

    return {
      totalAppointments: appointments.length,
      totalWorkOrders: workOrders.length,
      totalSpent,
      averageOrderValue:
        workOrders.length > 0 ? totalSpent / workOrders.length : 0,
      lastVisit: appointments[appointments.length - 1]?.scheduledDate,
    };
  },
});

// ==================== MUTATIONS ====================

export const create = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const orgId = identity.orgId as string;
    if (!orgId) throw new Error("No pertenece a una organización");

    // Validar email único
    const existingByEmail = await ctx.db
      .query("customers")
      .withIndex("by_email", (q) =>
        q.eq("organizationId", orgId).eq("email", args.email)
      )
      .first();

    if (existingByEmail) {
      throw new Error("Ya existe un cliente con ese email");
    }

    // Validar teléfono único
    const existingByPhone = await ctx.db
      .query("customers")
      .withIndex("by_phone", (q) =>
        q.eq("organizationId", orgId).eq("phone", args.phone)
      )
      .first();

    if (existingByPhone) {
      throw new Error("Ya existe un cliente con ese teléfono");
    }

    const now = Date.now();

    const customerId = await ctx.db.insert("customers", {
      organizationId: orgId,
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return customerId;
  },
});

export const update = mutation({
  args: {
    id: v.id("customers"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const { id, ...updates } = args;

    const customer = await ctx.db.get(id);
    if (!customer) throw new Error("Cliente no encontrado");

    const orgId = identity.orgId as string;
    if (customer.organizationId !== orgId) {
      throw new Error("No autorizado");
    }

    // Validar email si se actualiza
    if (updates.email && updates.email !== customer.email) {
      const existingByEmail = await ctx.db
        .query("customers")
        .withIndex("by_email", (q) =>
          q.eq("organizationId", orgId).eq("email", updates.email!)
        )
        .first();

      if (existingByEmail && existingByEmail._id !== id) {
        throw new Error("Ya existe un cliente con ese email");
      }
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("customers") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const customer = await ctx.db.get(args.id);
    if (!customer) throw new Error("Cliente no encontrado");

    const orgId = identity.orgId as string;
    if (customer.organizationId !== orgId) {
      throw new Error("No autorizado");
    }

    // Verificar órdenes activas
    const activeOrders = await ctx.db
      .query("workOrders")
      .withIndex("by_customer", (q) => q.eq("customerId", args.id))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("status"), "in_progress")
        )
      )
      .collect();

    if (activeOrders.length > 0) {
      throw new Error("No se puede eliminar un cliente con órdenes activas");
    }

    await ctx.db.patch(args.id, {
      isActive: false,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});
```

### 6.2 Ejemplo: Citas con Integración n8n

```typescript
// packages/backend/convex/appointments.ts
import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const create = mutation({
  args: {
    customerId: v.id("customers"),
    vehicleId: v.id("vehicles"),
    scheduledDate: v.number(),
    duration: v.number(),
    serviceType: v.string(),
    description: v.optional(v.string()),
    assignedMechanicId: v.optional(v.id("mechanics")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const orgId = identity.orgId as string;
    const userId = identity.subject;

    // Validar cliente
    const customer = await ctx.db.get(args.customerId);
    if (!customer || customer.organizationId !== orgId) {
      throw new Error("Cliente no encontrado");
    }

    // Validar vehículo
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle || vehicle.organizationId !== orgId) {
      throw new Error("Vehículo no encontrado");
    }

    // Verificar disponibilidad
    const existingAppointments = await ctx.db
      .query("appointments")
      .withIndex("by_date", (q) => q.eq("organizationId", orgId))
      .filter((q) =>
        q.and(
          q.gte(q.field("scheduledDate"), args.scheduledDate),
          q.lt(
            q.field("scheduledDate"),
            args.scheduledDate + args.duration * 60000
          ),
          q.or(
            q.eq(q.field("status"), "scheduled"),
            q.eq(q.field("status"), "confirmed")
          )
        )
      )
      .collect();

    if (existingAppointments.length > 0) {
      throw new Error("Ya existe una cita en ese horario");
    }

    const now = Date.now();

    const appointmentId = await ctx.db.insert("appointments", {
      organizationId: orgId,
      ...args,
      status: "scheduled",
      reminderSent: false,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    });

    return appointmentId;
  },
});

export const sendReminder = action({
  args: { appointmentId: v.id("appointments") },
  handler: async (ctx, args) => {
    // Obtener webhook de n8n
    const webhook = await ctx.runQuery(api.n8nWebhooks.getByType, {
      type: "appointment_reminder",
    });

    if (!webhook || !webhook.isActive) {
      throw new Error("Webhook de n8n no configurado");
    }

    // Obtener datos de la cita (implementar query getById)
    // const appointment = await ctx.runQuery(api.appointments.getById, { id: args.appointmentId });

    // Enviar a n8n
    const response = await fetch(webhook.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointmentId: args.appointmentId,
        // ...resto de datos
      }),
    });

    if (response.ok) {
      await ctx.runMutation(api.appointments.markReminderSent, {
        id: args.appointmentId,
      });
    }

    return { success: response.ok };
  },
});

export const markReminderSent = mutation({
  args: { id: v.id("appointments") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      reminderSent: true,
      reminderSentAt: Date.now(),
    });
  },
});
```

---

## 7. Integración n8n

### 7.1 Configuración de n8n

#### Docker Setup

```yaml
# docker-compose.yml
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
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - NODE_ENV=production
      - WEBHOOK_URL=http://localhost:5678/
      - GENERIC_TIMEZONE=America/Argentina/Buenos_Aires
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

### 7.2 Workflows Principales

#### 1. Recordatorio de Citas

**Descripción:** Envía WhatsApp y Email 24h antes de la cita

**Nodos:**
1. Webhook - Recibe datos de la cita
2. Code - Formatea el mensaje
3. HTTP Request - Envía WhatsApp (Twilio)
4. Email - Envía correo
5. Respond to Webhook - Confirma envío

**Configuración del Webhook:**
- URL: `http://localhost:5678/webhook/appointment-reminder`
- Method: POST
- Expected data:
  ```json
  {
    "customerName": "string",
    "customerPhone": "string",
    "customerEmail": "string",
    "appointmentDate": "ISO date",
    "appointmentTime": "string",
    "serviceType": "string",
    "vehicleInfo": "string",
    "duration": "number"
  }
  ```

#### 2. Alerta de Stock Bajo

**Descripción:** Notifica cuando una pieza está bajo el stock mínimo

**Nodos:**
1. Webhook - Recibe alerta de stock
2. Code - Procesa y formatea
3. Email - Envía a admin
4. Google Sheets - Registra en hoja de cálculo
5. Respond to Webhook

**Configuración del Webhook:**
- URL: `http://localhost:5678/webhook/low-stock-alert`
- Method: POST
- Expected data:
  ```json
  {
    "itemName": "string",
    "partNumber": "string",
    "currentStock": "number",
    "minStock": "number"
  }
  ```

#### 3. Notificación de Orden Completada

**Descripción:** Avisa al cliente cuando su vehículo está listo

**Nodos:**
1. Webhook - Recibe orden completada
2. Code - Formatea mensajes
3. HTTP Request - WhatsApp
4. Email - Correo electrónico
5. Respond to Webhook

**Configuración del Webhook:**
- URL: `http://localhost:5678/webhook/order-completed`
- Method: POST
- Expected data:
  ```json
  {
    "customerName": "string",
    "customerPhone": "string",
    "customerEmail": "string",
    "orderNumber": "string",
    "vehicleInfo": "string",
    "totalCost": "number"
  }
  ```

### 7.3 Configuración en Convex

```typescript
// packages/backend/convex/n8nWebhooks.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const configure = mutation({
  args: {
    webhookType: v.union(
      v.literal("appointment_reminder"),
      v.literal("low_stock_alert"),
      v.literal("order_completed")
    ),
    webhookUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const orgId = identity.orgId as string;

    const existing = await ctx.db
      .query("n8nWebhooks")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .filter((q) => q.eq(q.field("webhookType"), args.webhookType))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        webhookUrl: args.webhookUrl,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("n8nWebhooks", {
      organizationId: orgId,
      webhookType: args.webhookType,
      webhookUrl: args.webhookUrl,
      isActive: true,
      triggerCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const getByType = query({
  args: {
    type: v.union(
      v.literal("appointment_reminder"),
      v.literal("low_stock_alert"),
      v.literal("order_completed")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const orgId = identity.orgId as string;

    return await ctx.db
      .query("n8nWebhooks")
      .withIndex("by_type", (q) =>
        q.eq("organizationId", orgId).eq("webhookType", args.type)
      )
      .first();
  },
});

export const incrementTriggerCount = mutation({
  args: { id: v.id("n8nWebhooks") },
  handler: async (ctx, args) => {
    const webhook = await ctx.db.get(args.id);
    if (!webhook) throw new Error("Webhook no encontrado");

    await ctx.db.patch(args.id, {
      triggerCount: webhook.triggerCount + 1,
      lastTriggered: Date.now(),
    });
  },
});
```

---

## 8. Frontend - Componentes y Vistas

### 8.1 Layout Principal

```typescript
// apps/web/components/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Car,
  Calendar,
  FileText,
  Package,
  DollarSign,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Vehículos", href: "/vehiculos", icon: Car },
  { name: "Citas", href: "/citas", icon: Calendar },
  { name: "Órdenes", href: "/ordenes", icon: FileText },
  { name: "Inventario", href: "/inventario", icon: Package },
  { name: "Facturación", href: "/facturacion", icon: DollarSign },
  { name: "Reportes", href: "/reportes", icon: BarChart3 },
  { name: "Configuración", href: "/configuracion", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r">
      <div className="flex h-16 items-center px-6 border-b">
        <h1 className="text-2xl font-bold text-primary">TallerPro</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
```

```typescript
// apps/web/components/header.tsx
"use client";

import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { Bell } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4">
        <OrganizationSwitcher hidePersonal />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </header>
  );
}
```

### 8.2 Dashboard Principal

```typescript
// apps/web/app/(dashboard)/page.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Wrench, Calendar, Users, DollarSign } from "lucide-react";

export default function DashboardPage() {
  const stats = useQuery(api.dashboard.getStats);

  if (!stats) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general del taller</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Órdenes Activas</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOrders}</div>
            <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.appointmentsToday}</div>
            <p className="text-xs text-muted-foreground">+5% desde ayer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clientes Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">+8% este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+15% desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### 8.3 Ejemplo de Formulario

```typescript
// apps/web/modules/customers/components/customer-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { useToast } from "@workspace/ui/hooks/use-toast";

const customerSchema = z.object({
  firstName: z.string().min(2, "Mínimo 2 caracteres"),
  lastName: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Teléfono inválido"),
  address: z.string().optional(),
  city: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export function CustomerForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const createCustomer = useMutation(api.customers.create);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      notes: "",
    },
  });

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      await createCustomer(data);
      toast({
        title: "Cliente creado",
        description: "El cliente ha sido creado exitosamente.",
      });
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el cliente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Juan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="juan@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="+54 9 11 1234-5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Av. Principal 123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ciudad (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Buenos Aires" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Notas adicionales..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Guardando..." : "Guardar Cliente"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

---

## 9. Autenticación y Permisos

### 9.1 Configuración de Clerk

```typescript
// apps/web/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

const isOrgFreeRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/org-selection(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  // Proteger rutas no públicas
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  // Verificar organización
  const { userId, orgId } = await auth();

  if (userId && !orgId && !isOrgFreeRoute(request)) {
    const orgSelection = new URL("/org-selection", request.url);
    return Response.redirect(orgSelection);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

### 9.2 Guards de Autenticación

```typescript
// apps/web/modules/auth/ui/components/auth-guard.tsx
"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/sign-in");
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded || !userId) {
    return <div>Cargando...</div>;
  }

  return <>{children}</>;
}
```

```typescript
// apps/web/modules/auth/ui/components/organization-guard.tsx
"use client";

import { useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function OrganizationGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, organization } = useOrganization();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !organization) {
      router.push("/org-selection");
    }
  }, [isLoaded, organization, router]);

  if (!isLoaded || !organization) {
    return <div>Cargando...</div>;
  }

  return <>{children}</>;
}
```

### 9.3 Layout con Guards

```typescript
// apps/web/app/(dashboard)/layout.tsx
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <OrganizationGuard>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
              {children}
            </main>
          </div>
        </div>
      </OrganizationGuard>
    </AuthGuard>
  );
}
```

---

## 10. Guía de Desarrollo por Módulos

### **Semana 1-2: Fundamentos y Configuración**

#### Checklist

- [ ] Configurar Turborepo y workspaces
- [ ] Instalar todas las dependencias
- [ ] Configurar Convex y crear proyecto
- [ ] Configurar Clerk y obtener keys
- [ ] Configurar variables de entorno
- [ ] Instalar y configurar n8n
- [ ] Definir schema completo en Convex
- [ ] Instalar componentes shadcn/ui
- [ ] Configurar Tailwind CSS
- [ ] Crear documentación de arquitectura

#### Entregables

- ✅ Proyecto configurado y corriendo
- ✅ Schema de base de datos definido
- ✅ Autenticación funcionando
- ✅ n8n instalado y accesible

---

### **Semana 3-4: Auth y Dashboard Base**

#### Checklist

- [ ] Implementar rutas de autenticación
- [ ] Configurar middleware de Clerk
- [ ] Crear guards de autenticación
- [ ] Implementar layout del dashboard
- [ ] Crear sidebar de navegación
- [ ] Crear header con perfil
- [ ] Implementar funciones de dashboard en Convex
- [ ] Crear página de dashboard con KPIs
- [ ] Crear paquetes compartidos (types, utils)

#### Entregables

- ✅ Sistema de login/registro completo
- ✅ Dashboard con navegación
- ✅ KPIs básicos funcionando
- ✅ Layout responsive

---

### **Semana 5-6: Clientes y Vehículos**

#### Checklist

**Clientes:**
- [ ] Funciones Convex (CRUD)
- [ ] Página de listado de clientes
- [ ] Búsqueda y filtros
- [ ] Formulario de creación
- [ ] Formulario de edición
- [ ] Página de detalle
- [ ] Soft delete

**Vehículos:**
- [ ] Funciones Convex (CRUD)
- [ ] Página de listado de vehículos
- [ ] Relación con clientes
- [ ] Formulario de registro
- [ ] Página de detalle con historial
- [ ] Alertas de mantenimiento

#### Entregables

- ✅ CRUD completo de clientes
- ✅ CRUD completo de vehículos
- ✅ Búsqueda funcionando
- ✅ Relaciones cliente-vehículo

---

### **Semana 7-8: Citas y Automatización**

#### Checklist

**Citas:**
- [ ] Funciones Convex para citas
- [ ] Integrar calendario (shadcn/ui)
- [ ] Vista mensual con citas
- [ ] Formulario de creación de cita
- [ ] Validación de disponibilidad
- [ ] Asignación de mecánicos
- [ ] Estados de cita

**n8n:**
- [ ] Crear workflow de recordatorios
- [ ] Configurar Twilio para WhatsApp
- [ ] Configurar SMTP para emails
- [ ] Webhook en Convex
- [ ] Action para enviar recordatorios
- [ ] Cron job para automatizar

#### Entregables

- ✅ Calendario funcional
- ✅ Sistema de reservas operativo
- ✅ Primera automatización n8n
- ✅ Recordatorios enviándose

---

### **Semana 9-10: Órdenes e Inventario**

#### Checklist

**Órdenes:**
- [ ] Funciones Convex para work orders
- [ ] Crear orden desde cita
- [ ] Flujo de estados
- [ ] Asignación de mecánicos
- [ ] Servicios en la orden
- [ ] Uso de piezas
- [ ] Cálculo de costos

**Inventario:**
- [ ] Funciones Convex para inventario
- [ ] CRUD de piezas
- [ ] Control de stock
- [ ] Alertas de stock bajo
- [ ] Workflow n8n para alertas
- [ ] Historial de movimientos

#### Entregables

- ✅ Órdenes de trabajo completas
- ✅ Inventario funcional
- ✅ Alertas automáticas
- ✅ 2 workflows adicionales

---

### **Semana 11: Facturación y Reportes**

#### Checklist

**Facturación:**
- [ ] Funciones Convex para invoices
- [ ] Generación desde orden
- [ ] Estados de factura
- [ ] Control de pagos
- [ ] Historial de pagos

**Reportes:**
- [ ] Reporte de ventas
- [ ] Reporte de inventario
- [ ] Dashboard de analíticas
- [ ] Gráficos (Recharts)
- [ ] Exportación a PDF

**Configuración:**
- [ ] Panel de configuración
- [ ] Config de webhooks n8n
- [ ] Gestión de usuarios
- [ ] Configuración de organización

#### Entregables

- ✅ Sistema de facturación
- ✅ Reportes principales
- ✅ Analíticas avanzadas
- ✅ Panel de configuración

---

### **Semana 12: Testing y Deploy**

#### Checklist

**Testing:**
- [ ] Tests unitarios de funciones críticas
- [ ] Tests de integración
- [ ] Testing manual de flujos
- [ ] Corrección de bugs
- [ ] Optimización de queries

**Deploy:**
- [ ] Deploy Convex a producción
- [ ] Deploy frontend a Vercel
- [ ] Configurar n8n en servidor
- [ ] Configurar dominio
- [ ] Variables de entorno producción
- [ ] Configurar monitoring
- [ ] Backups automáticos

**Documentación:**
- [ ] Manual de usuario
- [ ] Documentación técnica
- [ ] Videos tutoriales
- [ ] Guía de deployment

#### Entregables

- ✅ Aplicación en producción
- ✅ Tests pasando
- ✅ Documentación completa
- ✅ Monitoreo configurado

---

## 11. Testing

### 11.1 Tests Unitarios

```typescript
// packages/backend/convex/customers.test.ts
import { expect, test } from "vitest";
import { ConvexTestingHelper } from "convex-helpers/testing";
import { api } from "./_generated/api";
import schema from "./schema";

test("crear cliente correctamente", async () => {
  const t = new ConvexTestingHelper(schema);

  await t.run(async (ctx) => {
    const customerId = await t.mutation(api.customers.create, {
      firstName: "Juan",
      lastName: "Pérez",
      email: "juan@example.com",
      phone: "+5491112345678",
    });

    expect(customerId).toBeDefined();

    const customer = await t.query(api.customers.getById, {
      id: customerId,
    });

    expect(customer?.firstName).toBe("Juan");
    expect(customer?.email).toBe("juan@example.com");
  });
});
```

### 11.2 Tests de Integración

```typescript
// apps/web/__tests__/customers.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomerForm } from "@/modules/customers/components/customer-form";

test("crear cliente desde formulario", async () => {
  const user = userEvent.setup();
  const onSuccess = jest.fn();

  render(<CustomerForm onSuccess={onSuccess} />);

  await user.type(screen.getByLabelText(/nombre/i), "Juan");
  await user.type(screen.getByLabelText(/apellido/i), "Pérez");
  await user.type(screen.getByLabelText(/email/i), "juan@example.com");
  await user.type(screen.getByLabelText(/teléfono/i), "+5491112345678");

  await user.click(screen.getByRole("button", { name: /guardar/i }));

  await waitFor(() => {
    expect(onSuccess).toHaveBeenCalled();
  });
});
```

---

## 12. Despliegue

### 12.1 Deploy de Convex

```bash
# Navegar al backend
cd packages/backend

# Deploy a producción
npx convex deploy

# Configurar variables de entorno en Convex Dashboard
# - CLERK_JWT_ISSUER_DOMAIN
```

### 12.2 Deploy de Frontend (Vercel)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy web app
cd apps/web
vercel --prod

# Configurar variables de entorno en Vercel Dashboard:
# - NEXT_PUBLIC_CONVEX_URL
# - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# - CLERK_SECRET_KEY
```

### 12.3 Deploy de n8n

**Opción A: Docker en VPS**

```bash
# En tu servidor VPS
docker-compose up -d

# Configurar reverse proxy (nginx)
# Configurar SSL (Let's Encrypt)
```

**Opción B: n8n Cloud**

```bash
# Registrarse en https://n8n.io
# Crear workspace
# Importar workflows
# Configurar webhooks públicos
```

---

## 13. Mantenimiento y Escalabilidad

### 13.1 Monitoreo

- **Convex Dashboard:** Métricas de uso, errores, logs
- **Vercel Analytics:** Performance del frontend
- **n8n:** Historial de ejecuciones de workflows
- **Sentry:** Error tracking (opcional)

### 13.2 Backups

```bash
# Convex: Backups automáticos diarios
# n8n: Exportar workflows periódicamente
```

### 13.3 Escalabilidad

- **Horizontal:** Agregar más organizaciones (multi-tenant)
- **Vertical:** Optimizar queries, agregar índices
- **Cache:** Implementar caching en queries frecuentes

---

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Convex](https://docs.convex.dev)
- [Documentación de Clerk](https://clerk.com/docs)
- [Documentación de shadcn/ui](https://ui.shadcn.com)
- [Documentación de n8n](https://docs.n8n.io)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)

---

## 🎯 Criterios de Éxito

### Funcionales
- ✅ Todos los módulos implementados y funcionando
- ✅ Al menos 3 automatizaciones n8n operativas
- ✅ Multi-tenant con organizaciones
- ✅ Dashboard con KPIs en tiempo real
- ✅ Aplicación responsive

### Técnicos
- ✅ Type-safety completo
- ✅ Performance: Lighthouse > 90
- ✅ Código limpio y documentado
- ✅ Zero errores de TypeScript

### Negocio
- ✅ Reducción de tiempo administrativo
- ✅ Sistema intuitivo (< 30 min onboarding)
- ✅ Escalable a 100+ talleres
- ✅ Costo operativo < $100/mes

---

**Versión:** 1.0.0  
**Última actualización:** Noviembre 2025  
**Desarrollado con ❤️ para talleres mecánicos**
