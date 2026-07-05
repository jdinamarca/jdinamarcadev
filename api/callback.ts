interface VercelRequest {
  url?: string;
  headers?: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
  writeHead(status: number, headers?: Record<string, string>): void;
  end(body?: string): void;
}

const PROVIDER = "github";

function renderHandshake(payload: { token?: string; error?: string }): string {
  const result = payload.token ? "success" : "error";
  const tokenLiteral = payload.token ? JSON.stringify(payload.token) : "null";
  const errorLiteral = JSON.stringify(payload.error ?? "unknown");
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Completando inicio de sesión…</title>
  <style>
    body { font-family: ui-monospace, monospace; padding: 2rem; color: #0e0e0e; background: #e8e8e6; }
  </style>
</head>
<body>
  <p id="status">Completando inicio de sesión con GitHub…</p>
  <script>
    (function () {
      var provider = ${JSON.stringify(PROVIDER)};
      var result = ${JSON.stringify(result)};
      var token = ${tokenLiteral};
      var error = ${errorLiteral};
      var payload = token ? { provider: provider, token: token } : { provider: provider, error: error };
      var status = document.getElementById("status");
      var log = function (msg) {
        try { console.log("[oauth-callback] " + msg); } catch (e) {}
      };
      var echoed = false;
      var ticks = 0;

      log("loaded; opener=" + (!!window.opener) + " origin=" + window.location.origin + " result=" + result + " hasToken=" + !!token);

      function setStatus(msg) { if (status) { status.textContent = msg; } }

      function sendAuthorization(targetOrigin) {
        if (!window.opener) { log("sendAuthorization: sin opener"); return false; }
        try {
          window.opener.postMessage(
            "authorization:" + provider + ":" + result + ":" + JSON.stringify(payload),
            targetOrigin
          );
          log("authorization -> " + targetOrigin);
          return true;
        } catch (e) { log("sendAuthorization falló: " + e); return false; }
      }

      function onMessage(e) {
        log("recv from " + e.origin + " data=" + e.data);
        if (e.data === "authorizing:" + provider) {
          echoed = true;
          clearInterval(timer);
          sendAuthorization(e.origin);
          setStatus("Sesión confirmada. Cerrando…");
          window.removeEventListener("message", onMessage);
          setTimeout(function () { log("closing popup"); window.close(); }, 300);
        }
      }

      function announce() {
        if (!window.opener) { return; }
        try {
          window.opener.postMessage("authorizing:" + provider, window.location.origin);
        } catch (e) { log("announce failed: " + e); }
      }

      window.addEventListener("message", onMessage);
      announce();

      var timer = setInterval(function () {
        ticks++;
        if (echoed || ticks > 20) { clearInterval(timer); return; }
        announce();
        if (ticks >= 4) {
          log("sin echo tras " + (ticks * 0.5) + "s — fallback: envío directo de authorization");
          sendAuthorization("*");
          setStatus("Confirmando sesión con el editor…");
        }
        if (ticks === 20) {
          log("FIN: opener=" + !!window.opener + " echoed=" + echoed);
          setStatus(window.opener
            ? "Si el editor no reacciona, vuelve a la pestaña del CMS e inténtalo de nuevo."
            : "No se encontró la ventana del editor. Cierra e inténtalo de nuevo.");
        }
      }, 500);
    })();
  </script>
</body>
</html>`;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  const proto = req.headers?.["x-forwarded-proto"] ?? "https";
  const host = req.headers?.host ?? "jdinamarca.dev";
  const base = `${proto}://${host}`;
  const url = new URL(req.url ?? "/", base);
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");

  const cookie = (req.headers?.cookie as string | undefined) ?? "";
  const expectedState = (cookie.match(/oauth_state=([^;]+)/) ?? [, ""])[1];

  if (!code || !returnedState || returnedState !== expectedState) {
    res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
    res.end("Estado OAuth inválido o código ausente.");
    return;
  }

  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    res.writeHead(503, { "content-type": "text/plain; charset=utf-8" });
    res.end("OAuth no configurado: faltan credenciales.");
    return;
  }

  const origin = base;
  const redirectUri = `${origin}/api/callback`;

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const json = (await tokenRes.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (!json.access_token) {
      console.error("GitHub no devolvió token:", json);
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(renderHandshake({ error: json.error ?? "no_token" }));
      return;
    }

    res.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "Set-Cookie": "oauth_state=; Path=/; Max-Age=0",
    });
    res.end(renderHandshake({ token: json.access_token }));
  } catch (err) {
    console.error("Intercambio de token falló:", err);
    res.writeHead(502, { "content-type": "text/html; charset=utf-8" });
    res.end(renderHandshake({ error: "token_exchange_failed" }));
  }
}
