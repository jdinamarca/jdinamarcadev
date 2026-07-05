interface VercelRequest {
  url?: string;
  headers?: { cookie?: string };
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
  <p>Completando inicio de sesión con GitHub…</p>
  <script>
    (function () {
      var provider = ${JSON.stringify(PROVIDER)};
      var result = ${JSON.stringify(result)};
      var token = ${tokenLiteral};
      var error = ${errorLiteral};
      var payload = token ? { provider: provider, token: token } : { provider: provider, error: error };

      function announce() {
        if (window.opener) {
          window.opener.postMessage("authorizing:" + provider, "*");
        }
      }

      window.addEventListener("message", function (e) {
        if (e.data === "authorizing:" + provider) {
          window.opener.postMessage(
            "authorization:" + provider + ":" + result + ":" + JSON.stringify(payload),
            e.origin
          );
          window.removeEventListener("message", arguments.callee);
          setTimeout(function () { window.close(); }, 200);
        }
      });

      announce();
    })();
  </script>
</body>
</html>`;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  const url = new URL(req.url ?? "https://jdinamarca.dev");
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");

  const cookie = req.headers?.cookie ?? "";
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

  const origin = url.origin;
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
