import { NextRequest, NextResponse } from "next/server";

// Un solo deploy de Next.js sirve DOS sitios distintos según el
// subdominio: zertooeats.com es la landing de marketing (la raíz de
// app/), y app.zertooeats.com es la web app real de consumidor — que
// vive en app/webapp/ (se movió ahí para dejarle la raíz a la
// landing). Los links viejos a zertooeats.com/algun-negocio (de
// cuando la app vivía en la raíz) siguen funcionando: se redirigen al
// subdominio nuevo en vez de dar 404.
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;
  const isAppSubdomain = host.startsWith("app.");

  if (isAppSubdomain) {
    const url = request.nextUrl.clone();
    url.pathname = `/webapp${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  if (pathname !== "/") {
    const url = request.nextUrl.clone();
    url.host = `app.${host}`;
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
