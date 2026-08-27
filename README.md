# Zertoo Eats!

Directorio de restaurantes — un proyecto **separado** del Zertoo
principal (`saas-platform`), en su propio dominio (`zertooeats.com`),
con su propio servicio en Railway.

> **Antes se llamaba "Zertoo Now"** y cubría también Citas/servicios
> (peluquerías, spas, etc.) — el usuario decidió reenfocarlo
> exclusivamente en restaurantes y renombrarlo a "Zertoo Eats". El
> dominio también migró, de `now.zertoo.app` a `zertooeats.com`
> (dominio propio, registrado por el usuario).

## ⚠️ Comparte la base de datos con el proyecto principal

Este proyecto **no tiene su propia base de datos** — usa exactamente
la misma que `saas-platform`, mediante la misma variable
`DATABASE_URL`. Por eso:

- **Nunca corras `prisma db push` ni `prisma migrate` desde acá.**
  El `package.json` de este proyecto a propósito solo corre `prisma
  generate` (que solo genera tipos de TypeScript, no toca la base de
  datos) — nunca algo que sincronice/modifique la estructura real.
  Cualquier cambio de esquema (agregar una tabla, un campo nuevo)
  tiene que hacerse desde `saas-platform`, que es el único lugar
  donde corresponde correr eso.
- Si `saas-platform` le agrega un campo nuevo a `Tenant` o `Review`
  que Zertoo Eats también necesite usar, hay que copiarlo a mano acá
  en `prisma/schema.prisma` — no se entera solo.

## Qué incluye esta versión

- Lista los negocios con `nowEnabled = true`, agrupados en
  "Destacados" (los que el admin marcó con `nowFeatured`, desde
  `/admin/now` en el proyecto principal) y el resto. **Solo
  restaurantes** — el enum `NowCategory` no tiene categorías de
  Citas/servicios.
- Muestra categoría y calificación promedio (de las reseñas ya
  publicadas)
- **Filtro por categoría** — solo se muestran como opción las
  categorías que de verdad tienen algún negocio activo, vía
  `?category=X` en la URL (compartible, indexable)
- **Buscador de texto libre** — filtra en tiempo real (sin recargar)
  por nombre del negocio, categoría específica, o tipo de negocio en
  general (`lib/categories.ts` → `BUSINESS_TYPE_LABELS`, hoy con un
  solo valor ya que todo es `RESTAURANT`, pero el mecanismo queda
  listo por si en el futuro se suma otro tipo de negocio de comida)
- **"Cerca de mí"** — pide la ubicación del navegador (con permiso
  explícito, un botón, nunca automático), y reordena por distancia
  real (fórmula de Haversine, calculado acá mismo, sin depender de
  ningún servicio externo). Con esto activo, se muestra un solo
  listado por distancia en vez de separar Destacados del resto — son
  dos criterios de orden distintos que podrían contradecirse. Los
  negocios sin coordenadas todavía (no geocodificados — ver el README
  del proyecto principal) quedan al final del listado.
- **Página de detalle por negocio** (`/[slug]`) — con botón "Cómo
  llegar" (Google Maps, con coordenadas o dirección de texto según lo
  que haya disponible), "Compartir por WhatsApp", y compartir nativo
  del teléfono (solo si el navegador lo soporta). Las tarjetas del
  listado principal llevan acá.
- Usa los mismos colores de marca que el resto de Zertoo

## Lo que todavía falta (próximas etapas)

Nada pendiente por ahora. Los 2 ítems que estaban acá antes ya se
resolvieron: "Share this moment" se descartó (decisión del usuario,
no se va a construir), y el cambio de dominio a `zertooeats.com` ya
se hizo.

## Variables de entorno

Ver `.env.example` — `DATABASE_URL` (la misma del proyecto principal)
y `NEXT_PUBLIC_SITE_URL`.

## Desplegar

```bash
npm install
npm run build   # corre `prisma generate` + `next build`, nunca db push
```

En Railway: agregar `DATABASE_URL` (copiada del servicio principal) y
`NEXT_PUBLIC_SITE_URL="https://zertooeats.com"` como variables de
entorno del servicio `zertoo.now`, y el dominio personalizado
`zertooeats.com` en su configuración de Networking.
