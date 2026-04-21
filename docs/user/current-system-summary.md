# Estado actual del sistema — Shave Studio Booking

Este documento explica en lenguaje simple qué puede hacer el sistema hoy y qué todavía no está listo.

---

## ¿Qué es este sistema?

Es una aplicación web para que los clientes de Shave Studio puedan reservar citas online. Está siendo construida de forma separada al sitio web de WordPress de la barbería, y eventualmente se integrará con él.

---

## ¿Qué funciona hoy?

### Flujo de reserva — hasta la selección de hora

Un cliente puede entrar a la dirección `/reservas` y hacer lo siguiente:

**Paso 1 — Elegir barbero**
Ve las tarjetas de los barberos disponibles con su nombre y descripción. Puede seleccionar uno.

**Paso 2 — Elegir servicio**
Después de elegir barbero, aparecen los servicios que ese barbero ofrece, con el nombre, duración y precio. Puede seleccionar uno.

**Paso 3 — Elegir día**
Aparece una tira con los próximos 21 días. Los días en que el barbero no trabaja se muestran desactivados. Puede elegir un día disponible.

**Paso 4 — Elegir hora**
Después de elegir el día, el sistema consulta los horarios disponibles del barbero para ese día, teniendo en cuenta:
- El horario de trabajo del barbero (por ejemplo: lunes a viernes de 09:00 a 19:00)
- La duración del servicio elegido
- Las reservas ya existentes para no generar conflictos

Se muestran los horarios libres y el cliente puede elegir uno.

**Lo que pasa al presionar "Continuar" en el paso 4**
Por ahora, no hace nada visible. La reserva **no se guarda**. Este es el próximo paso a desarrollar.

---

### Endpoint de datos públicos

Existe un endpoint técnico en `/api/barbers` que devuelve la lista de barberos activos con sus servicios. Este endpoint está listo y funcionando. Lo usa la página `/reservas` internamente y puede ser usado en el futuro para integrar con el sitio WordPress.

---

### Base de datos

La base de datos ya tiene estructura definida y datos de prueba cargados:

- 3 usuarios: 1 administrador y 2 barberos
- 2 perfiles de barbero: Carlos Méndez y Andrés Torres
- 4 servicios: Corte Clásico, Afeitado con Navaja, Corte y Barba, Tratamiento de Barba
- Horarios semanales para ambos barberos: lunes a viernes 09:00–19:00, sábados 10:00–16:00

---

## ¿Qué NO está listo todavía?

| Función | Estado |
|---|---|
| Guardar la reserva al confirmar | No implementado |
| Pantalla de confirmación para el cliente | No implementado |
| Email de confirmación al cliente | No implementado |
| Panel del barbero para ver y gestionar su agenda | No implementado |
| Panel del administrador | No implementado |
| Login para barberos y admin | No implementado |
| Crear reservas manuales (desde WhatsApp, por ejemplo) | No implementado |
| Editar o cancelar reservas | No implementado |
| Bloquear días u horas (vacaciones, pausas) | No implementado |
| Integración visual con el sitio WordPress | No implementado |

---

## Resumen

El sistema tiene construido el flujo visual completo de selección (barbero → servicio → día → hora) y la lógica que calcula qué horas están disponibles. La base de datos ya existe y tiene datos reales de prueba. El siguiente paso crítico es guardar la reserva cuando el cliente confirma.
