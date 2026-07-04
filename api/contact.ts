import { Resend } from "resend";

const TO = "hola@jdinamarca.dev";
const FROM = process.env.RESEND_FROM ?? TO;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface VercelRequest {
  method?: string;
  body?: unknown;
}

interface VercelResponse {
  status(code: number): {
    json(body: unknown): void;
    end(): void;
  };
  json(body: unknown): void;
}

type Payload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  _gotcha?: unknown;
};

function isString(v: unknown, max: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Método no permitido." });
    return;
  }

  const data = (req.body ?? {}) as Payload;

  if (isString(data._gotcha, 2000)) {
    res.status(200).json({ ok: true });
    return;
  }

  const errors: Record<string, string> = {};
  if (!isString(data.name, 120)) errors.name = "Nombre requerido.";
  if (!isString(data.email, 254) || !EMAIL_RE.test((data.email as string).trim()))
    errors.email = "Correo inválido.";
  if (
    !isString(data.message, 5000) ||
    (data.message as string).trim().length < 10
  )
    errors.message = "Mensaje demasiado corto (mín. 10 caracteres).";

  if (Object.keys(errors).length > 0) {
    res
      .status(422)
      .json({ ok: false, error: "Validación fallida.", fields: errors });
    return;
  }

  const name = (data.name as string).trim();
  const email = (data.email as string).trim();
  const message = (data.message as string).trim();
  const subject = isString(data.subject, 200)
    ? (data.subject as string).trim()
    : `Contacto desde el sitio — ${name}`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY no definida.");
    res.status(503).json({ ok: false, error: "Servicio no configurado." });
    return;
  }

  const resend = new Resend(apiKey);

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject,
      text: `${message}\n\n— ${name} (${email})`,
      html: `<p>${message.replace(/</g, "&lt;").replace(/\n/g, "<br/>")}</p>
<p>— <strong>${name.replace(/</g, "&lt;")}</strong> (${email.replace(/</g, "&lt;")})</p>`,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      res.status(502).json({ ok: false, error: "No se pudo enviar el mensaje." });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Send exception:", err);
    res.status(502).json({ ok: false, error: "No se pudo enviar el mensaje." });
  }
}
