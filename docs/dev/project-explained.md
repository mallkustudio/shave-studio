# Guía del proyecto para desarrolladores nuevos

Este documento explica el proyecto desde cero. No asume que conoces TypeScript, Next.js, Prisma ni esta base de código.

---

## ¿Qué es este proyecto?

Es el sistema de reservas de **Shave Studio**, una barbería premium. El objetivo es que los clientes puedan reservar citas online eligiendo un barbero, un servicio, un día y una hora.

El sistema existe separado del sitio WordPress de la barbería. Eventualmente se integrará visualmente con ese sitio, pero por ahora es una aplicación independiente.

---

## ¿Qué tecnologías usa y para qué sirve cada una?

### Next.js
Es el framework principal. Hace dos cosas a la vez:
- Sirve las **páginas web** que ve el usuario (como `/reservas`)
- Sirve los **endpoints de API** que devuelven datos en formato JSON (como `/api/barbers`)

No necesitas un servidor separado para el backend. Todo vive en el mismo proyecto de Next.js.

### TypeScript
Es JavaScript con tipos. En lugar de escribir `let precio = 15`, escribes `let precio: number = 15`. Esto ayuda a detectar errores antes de ejecutar el código. Todos los archivos del proyecto terminan en `.ts` o `.tsx`.

### Tailwind CSS
Es una librería de estilos. En lugar de escribir un archivo CSS separado, pones las clases directamente en el HTML. Por ejemplo, `className="bg-zinc-950 text-zinc-100"` pone fondo oscuro y texto claro. El proyecto usa la versión 4.

### Prisma
Es la herramienta que conecta el código con la base de datos. En lugar de escribir SQL a mano, usas funciones de TypeScript como `prisma.barber.findMany(...)` y Prisma traduce eso a SQL automáticamente.

### PostgreSQL
Es la base de datos relacional donde se guardan todos los datos: barberos, servicios, reservas, disponibilidad. En este proyecto se usa en Supabase.

### Supabase
Es un servicio que ofrece una base de datos PostgreSQL lista para usar en la nube. No hay que instalar ni mantener una base de datos. Solo hay que conectarse con una URL.

### Vercel
Es el servicio donde se puede hacer deploy de la aplicación Next.js. Conectas tu repositorio y Vercel construye y publica la app automáticamente. **Actualmente no se usa Vercel en producción** — el proyecto corre localmente en desarrollo.

---

## ¿Cómo está organizada la carpeta del proyecto?

```
shave-booking/
├── src/
│   ├── app/                   ← Páginas y endpoints de la app
│   ├── modules/               ← Lógica reutilizable (consultas a la DB)
│   ├── lib/                   ← Configuración global (conexión a Prisma)
│   ├── components/            ← Componentes de UI reutilizables (vacío aún)
│   └── types/                 ← Tipos TypeScript compartidos (vacío aún)
├── prisma/
│   ├── schema.prisma          ← Definición de las tablas de la base de datos
│   ├── seed.ts                ← Script para cargar datos iniciales
│   └── migrations/            ← Historial de cambios en la base de datos
├── docs/                      ← Documentación del proyecto
├── .env.example               ← Plantilla de variables de entorno
└── CLAUDE.md                  ← Instrucciones de trabajo para Claude Code
```

---

## ¿Qué hay dentro de `src/app/`?

```
src/app/
├── (public)/
│   └── reservas/              ← Página pública de reservas: /reservas
│       ├── page.tsx           ← Servidor: carga datos y pasa a componentes
│       ├── BarberServicePicker.tsx  ← Cliente: pasos 1 y 2 (barbero y servicio)
│       └── DateTimePicker.tsx ← Cliente: pasos 3 y 4 (día y hora)
├── admin/
│   └── page.tsx               ← Placeholder: /admin (no implementado aún)
├── barber/
│   └── page.tsx               ← Placeholder: /barber (no implementado aún)
├── api/
│   ├── barbers/
│   │   └── route.ts           ← Endpoint: GET /api/barbers
│   └── availability/
│       └── route.ts           ← Endpoint: GET /api/availability
├── layout.tsx                 ← Plantilla HTML base (fuente, metadata)
└── globals.css                ← Estilos globales, importa Tailwind
```

### ¿Qué es `(public)`?
Los paréntesis en el nombre de carpeta son una convención de Next.js. Significa que es un **grupo de rutas** que no afecta la URL. La carpeta `(public)/reservas/page.tsx` se sirve en `/reservas`, no en `/public/reservas`.

### ¿Qué es `page.tsx` vs `route.ts`?
- `page.tsx` → es una **página web** que devuelve HTML visible para el usuario
- `route.ts` → es un **endpoint de API** que devuelve JSON (para que lo consuma código, no humanos)

---

## ¿Qué hay dentro de `src/modules/`?

```
src/modules/
├── barbers/
│   └── queries.ts     ← Función getPublicBarbers() + tipo PublicBarber
└── availability/
    └── queries.ts     ← Función getAvailableSlots()
```

Estos archivos contienen **lógica de negocio reutilizable**. Por ejemplo, la consulta para obtener los barberos activos con sus servicios se usa tanto en la página `/reservas` como en el endpoint `/api/barbers`. En lugar de duplicar el código, ambos llaman a `getPublicBarbers()` desde `src/modules/barbers/queries.ts`.

---

## ¿Qué hace `src/lib/prisma.ts`?

```ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
```

Este archivo crea **una sola instancia de Prisma** que se reutiliza en todo el proyecto. Si no hicieras esto, en desarrollo con hot-reload se crearían decenas de conexiones a la base de datos y el servidor colapsaría.

La variable `process.env.DATABASE_URL` viene del archivo `.env` local (nunca del código fuente). Contiene la URL de conexión a PostgreSQL, incluyendo usuario, contraseña y nombre de la base de datos.

**Importante:** este archivo es solo para el servidor. Nunca debe importarse desde un componente que corra en el navegador.

---

## ¿Cómo funciona `/api/barbers`?

**Archivo:** `src/app/api/barbers/route.ts`

Cuando alguien hace `GET /api/barbers`, Next.js ejecuta la función `GET` de ese archivo:

```ts
export async function GET() {
  const data = await getPublicBarbers();
  return NextResponse.json({ data });
}
```

`getPublicBarbers()` va a la base de datos y consulta:
- Todos los barberos donde `isActive = true`
- Para cada barbero: sus servicios activos
- Para cada servicio: usa `customPrice` del barbero si existe, si no usa el precio base del servicio

Devuelve un JSON con esta estructura:
```json
{
  "data": [
    {
      "id": "abc123",
      "displayName": "Carlos Méndez",
      "bio": "15 años de experiencia...",
      "avatarUrl": null,
      "availableDays": ["MON", "TUE", "WED", "THU", "FRI", "SAT"],
      "services": [
        { "id": "xyz789", "name": "Corte Clásico", "durationMinutes": 30, "price": 15 }
      ]
    }
  ]
}
```

---

## ¿Cómo funciona `/api/availability`?

**Archivo:** `src/app/api/availability/route.ts`

Recibe tres parámetros por URL: `barberId`, `date` (formato `YYYY-MM-DD`) y `durationMinutes`.

Ejemplo de llamada: `/api/availability?barberId=abc123&date=2026-04-21&durationMinutes=30`

Lo que hace:
1. Convierte la fecha a día de la semana (ej. `2026-04-21` → lunes → `MON`)
2. Busca si el barbero tiene disponibilidad para ese día (tabla `Availability`)
3. Si no tiene disponibilidad para ese día, devuelve `{ slots: [] }`
4. Si sí tiene, obtiene las reservas existentes de ese barbero para esa fecha
5. Genera los horarios posibles (ej. 09:00, 09:30, 10:00...) según la duración del servicio
6. Descarta los horarios que ya tienen una reserva activa
7. Devuelve los horarios disponibles como lista de strings `"HH:MM"`

---

## ¿Cómo funciona la página `/reservas`?

Esta página tiene **4 pasos** y está dividida en tres archivos:

### `page.tsx` — Componente servidor
Se ejecuta **en el servidor** al cargar la página. Consulta la base de datos directamente con `getPublicBarbers()` y pasa los datos a `BarberServicePicker`.

```ts
export default async function ReservasPage() {
  const barbers = await getPublicBarbers();
  return <BarberServicePicker barbers={barbers} />;
}
```

El usuario recibe el HTML ya con los datos cargados. No hay spinner de carga inicial.

### `BarberServicePicker.tsx` — Componente cliente (pasos 1 y 2)
Marcado con `"use client"` al inicio, lo que significa que **corre en el navegador**. Maneja el estado de qué barbero y qué servicio está seleccionado.

- **Paso 1:** Muestra las tarjetas de barberos. Al hacer clic en uno, se resalta y aparece el paso 2.
- **Paso 2:** Muestra los servicios del barbero elegido. Al seleccionar uno, se habilita el botón "Continuar".
- Al presionar "Continuar", cambia el estado interno `step` de `"selection"` a `"datetime"` y renderiza `DateTimePicker`.

### `DateTimePicker.tsx` — Componente cliente (pasos 3 y 4)
También corre en el navegador.

- **Paso 3:** Muestra una tira horizontal con los próximos 21 días. Los días sin disponibilidad para ese barbero aparecen desactivados (gris). Al seleccionar un día, llama a `/api/availability` con `fetch`.
- **Paso 4:** Muestra los horarios disponibles en una grilla de 3 columnas. Al seleccionar uno, se habilita el botón "Continuar".

El botón "Continuar" del paso 4 actualmente solo hace `console.log`. La creación de la reserva aún no está implementada.

---

## ¿Cuál es la diferencia entre componente servidor y componente cliente?

| | Componente servidor | Componente cliente |
|---|---|---|
| ¿Dónde corre? | En el servidor (Node.js) | En el navegador |
| ¿Puede leer la DB? | Sí, directamente con Prisma | No |
| ¿Puede tener estado? | No (no hay `useState`) | Sí |
| ¿Responde a clics? | No | Sí |
| Marcador | Sin marcador (por defecto) | `"use client"` al inicio del archivo |

En Next.js App Router, **todos los componentes son servidor por defecto**. Solo los que necesitan interactividad se marcan con `"use client"`.

---

## ¿Cómo está conectado Prisma con la base de datos?

El flujo es:

```
schema.prisma → migración SQL → base de datos PostgreSQL (Supabase)
      ↓
   prisma generate → tipos TypeScript automáticos
      ↓
  src/lib/prisma.ts → instancia global de PrismaClient
      ↓
  src/modules/*/queries.ts → consultas usando prisma.modelo.operacion()
```

### `prisma/schema.prisma`
Define las tablas como si fueran clases. Ejemplo:
```prisma
model Barber {
  id          String  @id @default(cuid())
  displayName String
  isActive    Boolean @default(true)
  ...
}
```
Esto le dice a Prisma: "existe una tabla `Barber` con estas columnas".

### `prisma/migrations/`
Cada vez que cambias el schema, ejecutas `npx prisma migrate dev`. Esto genera un archivo SQL con los cambios (ej. `ALTER TABLE...`) y lo guarda en esta carpeta. Es el historial de evolución de la base de datos.

### `prisma/seed.ts`
Script que carga datos iniciales para desarrollo. Crea 3 usuarios (1 admin + 2 barberos), 2 perfiles de barbero, 4 servicios, las asignaciones de servicios por barbero y los horarios de disponibilidad semanal. Se ejecuta con `npx prisma db seed`.

---

## ¿Qué es frontend, qué es backend y qué es lógica compartida?

| Categoría | Archivos |
|---|---|
| **Frontend** (corre en el navegador) | `BarberServicePicker.tsx`, `DateTimePicker.tsx` |
| **Backend** (corre en el servidor) | `src/app/api/*/route.ts`, `src/lib/prisma.ts` |
| **Server components** (servidor, pero generan HTML) | `src/app/(public)/reservas/page.tsx` |
| **Lógica compartida** (llamada desde servidor) | `src/modules/barbers/queries.ts`, `src/modules/availability/queries.ts` |

---

## ¿Qué falta por construir?

El flujo de reserva llega hasta la selección de día y hora, pero no guarda nada todavía. Lo que falta en orden de prioridad:

1. **Crear la reserva** — guardar en la tabla `Booking` con los datos del cliente (nombre, email, teléfono)
2. **Confirmación de reserva** — pantalla de éxito + email de confirmación al cliente
3. **Panel del barbero** (`/barber`) — ver su agenda, gestionar reservas, crear citas manuales
4. **Panel del administrador** (`/admin`) — ver todas las reservas, gestionar barberos y servicios
5. **Autenticación** — login para barberos y administradores (el flujo público no requiere login)
6. **Editar y cancelar reservas** — tanto por el cliente como por el barbero/admin
7. **Tiempos bloqueados** — que el barbero pueda marcar vacaciones o pausas
