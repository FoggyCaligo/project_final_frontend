const DEFAULT_ORIGINS = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:8081",
  "http://127.0.0.1:8081",
];

function normalizeOrigin(origin) {
  if (!origin || typeof origin !== "string") return null;
  return origin.trim().replace(/\/$/, "");
}

function getCandidateOrigins() {
  const envOrigins = [
    process.env.BACKEND_ORIGIN,
    process.env.NEXT_PUBLIC_BACKEND_ORIGIN,
  ]
    .map(normalizeOrigin)
    .filter(Boolean);

  const all = [...envOrigins, ...DEFAULT_ORIGINS];
  return [...new Set(all)];
}

function buildTargetUrl(origin, pathSegments = [], searchParams = "") {
  const safePath = pathSegments
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${origin}/api/v1/${safePath}${searchParams}`;
}

function getSetCookieHeaders(headers) {
  if (typeof headers.getSetCookie === "function") {
    return headers.getSetCookie();
  }

  const combinedCookie = headers.get("set-cookie");
  if (!combinedCookie) return [];

  return combinedCookie
    .split(/,(?=\s*[^;,=]+?=)/)
    .map((cookie) => cookie.trim())
    .filter(Boolean);
}

function copyResponseHeaders(headers) {
  const nextHeaders = new Headers();
  const setCookieHeaders = getSetCookieHeaders(headers);

  headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (
      lower === "content-encoding" ||
      lower === "set-cookie" ||
      lower === "transfer-encoding"
    ) {
      return;
    }
    nextHeaders.set(key, value);
  });

  setCookieHeaders.forEach((cookie) => {
    nextHeaders.append("set-cookie", cookie);
  });

  return nextHeaders;
}

function buildForwardHeaders(headers) {
  const nextHeaders = new Headers(headers);
  const blockedHeaders = [
    "host",
    "connection",
    "content-length",
    "expect",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
  ];

  blockedHeaders.forEach((header) => nextHeaders.delete(header));

  return nextHeaders;
}

async function proxyToBackend(request, context) {
  const { path = [] } = await context.params;
  const searchParams = request.nextUrl.search || "";
  const origins = getCandidateOrigins();

  const method = request.method;
  const requestHeaders = buildForwardHeaders(request.headers);

  const bodyBuffer = method === "GET" || method === "HEAD"
    ? null
    : await request.arrayBuffer();

  let lastError = null;

  for (const origin of origins) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const targetUrl = buildTargetUrl(origin, path, searchParams);
      const response = await fetch(targetUrl, {
        method,
        headers: requestHeaders,
        body: bodyBuffer,
        redirect: "manual",
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const headers = copyResponseHeaders(response.headers);
      const payload = await response.arrayBuffer();

      return new Response(payload, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
    }
  }

  return Response.json(
    {
      success: false,
      message: "백엔드 서버에 연결할 수 없습니다. 백엔드 실행/포트를 확인해 주세요.",
      candidates: origins,
      error: lastError?.message || "Unknown proxy error",
    },
    { status: 502 }
  );
}

export async function GET(request, context) {
  return proxyToBackend(request, context);
}

export async function POST(request, context) {
  return proxyToBackend(request, context);
}

export async function PUT(request, context) {
  return proxyToBackend(request, context);
}

export async function PATCH(request, context) {
  return proxyToBackend(request, context);
}

export async function DELETE(request, context) {
  return proxyToBackend(request, context);
}

export async function OPTIONS(request, context) {
  return proxyToBackend(request, context);
}

export async function HEAD(request, context) {
  return proxyToBackend(request, context);
}
