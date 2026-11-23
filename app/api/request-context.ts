// Refuses cross-origin browser requests so another origin cannot spend this app's model key or drive its tools.
export function isAllowedRequestContext(req: Request) {
  // Always permit requests during local development or testing
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  const origin = req.headers.get("origin");
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const reqUrl = new URL(req.url);

    // Allow local development hostnames
    if (
      originUrl.hostname === "localhost" ||
      originUrl.hostname === "127.0.0.1" ||
      originUrl.hostname === "::1"
    ) {
      return true;
    }

    const fetchSite = req.headers.get("sec-fetch-site");
    if (fetchSite !== null) {
      return (
        fetchSite === "same-origin" ||
        fetchSite === "none" ||
        fetchSite === "same-site"
      );
    }

    return originUrl.origin === reqUrl.origin;
  } catch {
    return true;
  }
}
