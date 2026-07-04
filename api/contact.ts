import { Resend } from "resend";

const TO = "hola@jdinamarca.dev";
const FROM = process.env.RESEND_FROM ?? TO;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  _gotcha?: unknown;
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function isString(v: unknown, max: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }
  if (req.method !== "POST") {
    return json({ ok: false, error: "Método no permitido." }, 405);
  }

  let data: Payload;
  try {
    data = (await req.json()) as Payload;
  } catch {
    return json({ ok: false, error: "Cuerpo inválido." }, 400);
  }

  if (isString(data._gotcha, 2000)) {
    return json({ ok: true }, 200);
  }

  const errors: Record<string, string> = {};
  if (!isString(data.name, 120)) errors.name = "Nombre requerido.";
  if (!isString(data.email, 254) || !EMAIL_RE.test(data.email.trim()))
    errors.email = "Correo inválido.";
  if (!isString(data.message, 5000) || data.message.trim().length < 10)
    errors.message = "Mensaje demasiado corto (mín. 10 caracteres).";

  if (Object.keys(errors).length > 0) {
    return json({ ok: false, error: "Validación fallida.", fields: errors }, 422);
  }

  const name = (data.name as string).trim();
  const email = (data.email as string).trim();
  const message = (data.message as string).trim();
  const subject =
    isString(data.subject, 200) ? (data.subject as string).trim() : `Contacto desde el sitio — ${name}`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY no definida.");
    return json({ ok: false, error: "Servicio no configurado." }, 503);
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
      return json({ ok: false, error: "No se pudo enviar el mensaje." }, 502);
    }

    return json({ ok: true }, 200);
  } catch (err) {
    console.error("Send exception:", err);
    return json({ ok: false, error: "No se pudo enviar el mensaje." }, 502);
  }
}
