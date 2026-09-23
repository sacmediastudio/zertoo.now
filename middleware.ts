import { NextRequest, NextResponse } from "next/server";

// Un solo deploy de Next.js sirve DOS sitios distintos según el
// subdominio: zertooeats.com es la landing de marketing (la raíz de
// app/), y app.zertooeats.com es la web app real de consumidor — que
// vive en app/webapp/ (se movió ahí para dejarle la raíz a la
// landing). Los links viejos a zertooeats.com/algun-negocio (de
// cuando la app vivía en la raíz) siguen funcionando: se redirigen al
// subdominio nuevo en vez de dar 404.
export function middleware(request: NextRequest) {
  // Railway pasa el Host interno con puerto (ej. "zertooeats.com:8080")
  // — hay que descartar el puerto antes de armar cualquier URL nueva,
  // si no el redirect termina apuntando a "app.zertooeats.com:8080".
  const hostname = (request.headers.get("host") || "").split(":")[0];
  const { pathname } = request.nextUrl;
  const isAppSubdomain = hostname.startsWith("app.");

  if (isAppSubdomain) {
    const url = request.nextUrl.clone();
    url.pathname = `/webapp${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  if (pathname !== "/") {
    const url = request.nextUrl.clone();
    url.protocol = "https";
    url.port = "";
    url.host = `app.${hostname}`;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Excluye archivos estáticos de /public (cualquier ruta con un punto,
  // ej. logo.svg, /landing/foo.webp) además de los internos de Next —
  // sin esto, pedidos de imágenes también se reescribían/redirigían
  // como si fueran páginas, rompiendo todos los assets.
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
