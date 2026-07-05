interface VercelRequest {
  url?: string;
}

interface VercelResponse {
  writeHead(status: number, headers?: Record<string, string>): void;
  end(body?: string): void;
}

export default function handler(req: VercelRequest, res: VercelResponse): void {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    res.writeHead(503, { "content-type": "text/plain; charset=utf-8" });
    res.end("OAuth no configurado: falta OAUTH_CLIENT_ID.");
    return;
  }

  const origin = new URL(req.url ?? "https://jdinamarca.dev").origin;
  const redirectUri = `${origin}/api/callback`;
  const state = crypto.randomUUID();

  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "repo,user");
  authUrl.searchParams.set("state", state);

  res.writeHead(302, {
    Location: authUrl.toString(),
    "Set-Cookie": `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
  });
  res.end();
}
