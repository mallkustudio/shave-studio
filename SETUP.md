# Guía de instalación — Shave Studio

Esta guía está pensada para alguien que nunca configuró un proyecto de este tipo. Seguí los pasos en orden y vas a tener el sistema corriendo en tu computadora.

---

## 1. Requisitos previos

Antes de empezar necesitás instalar dos programas:

### Node.js
Es el motor que ejecuta el proyecto. Instalá la versión **20 LTS** (la más estable).

- Descarga: https://nodejs.org/en/download
- En la página elegí **"Windows Installer (.msi)"** → **LTS**
- Ejecutá el instalador y seguí los pasos (todo por defecto está bien)

Para verificar que quedó instalado, abrí una terminal y escribí:

```bash
node -v
```

Tiene que mostrarte algo como `v20.x.x`.

### Git
Es la herramienta para descargar y versionar el código.

- Descarga: https://git-scm.com/download/win
- Ejecutá el instalador (todo por defecto está bien)

Para verificar:

```bash
git -v
```

Tiene que mostrarte algo como `git version 2.x.x`.

---

### Cómo abrir una terminal en Windows

Una terminal es una ventana donde escribís comandos de texto. Para abrirla:

1. Presioná las teclas **Windows + R**
2. Escribí `cmd` y presioná Enter

O también podés buscar **"Símbolo del sistema"** en el menú de inicio.

---

## 2. Clonar el repositorio

"Clonar" significa descargar el código del proyecto a tu computadora.

1. Abrí una terminal
2. Navegá a la carpeta donde querés guardar el proyecto. Por ejemplo:

```bash
cd C:\dev
```

3. Ejecutá este comando para descargar el proyecto:

```bash
git clone https://github.com/mallkustudio/shave-studio.git
```

4. Entrá a la carpeta del proyecto:

```bash
cd shave-studio
```

---

## 3. Configurar las variables de entorno

Las variables de entorno son configuraciones privadas (contraseñas, URLs de base de datos, etc.) que el proyecto necesita para funcionar. No se suben a GitHub por seguridad.

1. En la raíz del proyecto, creá un archivo llamado exactamente `.env`
2. Copiá el siguiente contenido y completá los valores que te provea el responsable del proyecto:

```env
# Base de datos (Prisma)
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
DATABASE_URL=

# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Configuración del sistema
PAYMENT_WINDOW_MINUTES=
```

### Descripción de cada variable

| Variable | Descripción |
|---|---|
| `DB_HOST` | Dirección del servidor de base de datos |
| `DB_PORT` | Puerto de conexión a la base de datos |
| `DB_USER` | Usuario de la base de datos |
| `DB_PASSWORD` | Contraseña de la base de datos |
| `DB_NAME` | Nombre de la base de datos |
| `DATABASE_URL` | URL completa de conexión (la usa Prisma directamente) |
| `SUPABASE_URL` | URL del proyecto en Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio de Supabase (acceso total, no compartir) |
| `PAYMENT_WINDOW_MINUTES` | Minutos que tiene el cliente para subir el comprobante de pago |

> **Importante:** nunca subas el archivo `.env` a GitHub. Ya está en el `.gitignore` del proyecto, así que mientras no lo fuerces no hay problema.

Los valores reales los tiene que proveer el responsable del proyecto.

---

## 4. Instalar dependencias

Las dependencias son las librerías externas que usa el proyecto (React, Next.js, etc.). Están listadas en `package.json` pero no vienen con el código — hay que descargarlas.

Dentro de la carpeta del proyecto, ejecutá:

```bash
npm install
```

Esto puede tardar un par de minutos. Cuando termine vas a ver una carpeta `node_modules` en el proyecto.

---

## 5. Generar Prisma Client

Prisma es la herramienta que conecta el código con la base de datos. Para que funcione necesita generar un archivo de cliente basado en el esquema del proyecto.

```bash
npx prisma generate
```

Este comando lee el archivo `prisma/schema.prisma` y genera el código necesario. Hay que correrlo la primera vez que configurás el proyecto y cada vez que el esquema cambia.

---

## 6. Correr el proyecto

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Cuando veas en la terminal algo como:

```
▲ Next.js ready
- Local: http://localhost:3000
```

Abrí tu navegador y entrá a:

```
http://localhost:3000
```

Para detener el servidor presioná **Ctrl + C** en la terminal.

---

## 7. Rutas principales del sistema

| Ruta | Descripción |
|---|---|
| `/` | Sitio web público (home, about, galería, etc.) |
| `/reservas` | Flujo de reserva para clientes |
| `/admin` | Panel de administración |
| `/barber` | Panel del barbero |

---

## 8. Problemas comunes

### Error de Prisma: "Cannot read properties of undefined"

Significa que el cliente de Prisma no fue generado. Solución:

```bash
npx prisma generate
```

---

### Error de conexión a la base de datos

Causas posibles:

- Las variables de entorno en `.env` están vacías o mal escritas
- El proyecto en Supabase está pausado (pasa en planes gratuitos por inactividad)

Solución: revisá que el `.env` esté completo y que el proyecto en Supabase esté activo.

---

### Puerto 3000 ocupado

Si ves un error como `Port 3000 is already in use`, es porque ya hay otra instancia del proyecto corriendo.

Solución: cerrá la otra terminal donde está corriendo el proyecto, o reiniciá la computadora.

---

## ¿Dudas?

Contactá al responsable del proyecto para obtener los valores del `.env` o resolver cualquier problema de configuración.
