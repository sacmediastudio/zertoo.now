# Zertoo Now!

Directorio público de descubrimiento — un proyecto **separado** del
Zertoo principal (`saas-platform`), pensado para vivir en su propio
subdominio (`now.zertoo.app`), con su propio servicio en Railway.

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
  que Zertoo Now también necesite usar, hay que copiarlo a mano acá
  en `prisma/schema.prisma` — no se entera solo.

## Qué incluye esta primera versión

- Lista los negocios con `nowEnabled = true`, agrupados en
  "Destacados" (los que el admin marcó con `nowFeatured`, desde
  `/admin/now` en el proyecto principal) y el resto
- Muestra categoría y calificación promedio (de las reseñas ya
  publicadas)
- **Filtro por categoría** — solo se muestran como opción las
  categorías que de verdad tienen algún negocio activo, vía
  `?category=X` en la URL (compartible, indexable)
- **"Cerca de mí"** — pide la ubicación del navegador (con permiso
  explícito, un botón, nunca automático), y reordena por distancia
  real (fórmula de Haversine, calculado acá mismo, sin depender de
  ningún servicio externo). Con esto activo, se muestra un solo
  listado por distancia en vez de separar Destacados del resto — son
  dos criterios de orden distintos que podrían contradecirse. Los
  negocios sin coordenadas todavía (no geocodificados — ver el README
  del proyecto principal) quedan al final del listado.
- Usa los mismos colores de marca que el resto de Zertoo

## Lo que todavía falta (próximas etapas)

- Botones de "Cómo llegar" y compartir por WhatsApp en cada negocio
- El botón "Share this moment" en el menú/perfil público, y la
  bandeja de aprobación de fotos en el dashboard de cada negocio, y
  que el admin de Zertoo pueda borrar una foto (`Moment`) si hiciera
  falta (el modelo ya existe, falta toda esta funcionalidad)

## Variables de entorno

Ver `.env.example` — `DATABASE_URL` (la misma del proyecto principal)
y `NEXT_PUBLIC_SITE_URL`.

## Desplegar

```bash
npm install
npm run build   # corre `prisma generate` + `next build`, nunca db push
```

En Railway: agregar `DATABASE_URL` (copiada del servicio principal) y
`NEXT_PUBLIC_SITE_URL="https://now.zertoo.app"` como variables de
entorno del servicio `zertoo.now`, y el dominio personalizado
`now.zertoo.app` en su configuración de Networking.

