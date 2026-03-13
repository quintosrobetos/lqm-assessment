// api/send-report.js
// Vercel serverless function — sends LQM report email via Resend
// Environment variable required: RESEND_API_KEY

export default async function handler(req, res) {
  // CORS headers — allow requests from your domain
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).json({ error: "Method not allowed" });

  const {
    email,
    typeKey,        // 'A' | 'B' | 'C' | 'D'
    name,           // e.g. "The Systems Architect"
    arch,           // e.g. "Identity: The Builder"
    tag,            // one-line tagline
    hook,           // opening hook
    desc,           // full profile description
    identity,       // identity statement
    atomic,         // quantum insight
    strengths,      // string[]
    blindspots,     // string[]
    strategies,     // [{area, scenario, solution}]
    blue,           // accent colour hex e.g. "#00C8FF"
    deliveryRef,
    deliveryTs,
  } = req.body || {};

  // Validate
  if (!email || !typeKey || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRx.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not set");
    return res.status(500).json({ error: "Email service not configured" });
  }

  // ── Build the premium HTML email ────────────────────────────────────────────
  const accentColor  = blue || "#00C8FF";
  const bgDark       = "#070F1E";
  const bgCard       = "#0D1830";
  const bgCardLight  = "#111D35";
  const textMain     = "#FFFFFF";
  const textMuted    = "rgba(255,255,255,0.55)";
  const textDim      = "rgba(255,255,255,0.35)";
  const borderColor  = "rgba(255,255,255,0.08)";

  const symMap = { A:"◈", B:"◉", C:"◎", D:"◇" };
  const sym = symMap[typeKey] || "◈";

  function card(content, extraStyle = "") {
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;${extraStyle}">
      <tr><td style="background:${bgCard};border:1px solid ${borderColor};border-radius:16px;padding:28px 28px;">
        ${content}
      </td></tr>
    </table>`;
  }

  function sectionLabel(text, color = accentColor) {
    return `<p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${color};margin:0 0 14px 0;">${text}</p>`;
  }

  function strengthsHTML() {
    const widths = [92, 85, 78, 70];
    return (strengths || []).map((s, i) => `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
        <tr>
          <td style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:${textMain};">${s}</td>
          <td align="right" style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:${accentColor};">${widths[i] || 70}%</td>
        </tr>
        <tr><td colspan="2" style="padding-top:6px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="background:rgba(255,255,255,0.06);border-radius:100px;height:6px;">
              <table cellpadding="0" cellspacing="0" border="0"><tr>
                <td width="${widths[i] || 70}%" style="background:${accentColor};height:6px;border-radius:100px;"></td>
              </tr></table>
            </td>
          </tr></table>
        </td></tr>
      </table>`).join("");
  }

  function blindspotsHTML() {
    return (blindspots || []).map((b, i) => `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
        <tr>
          <td width="36" valign="top">
            <div style="width:28px;height:28px;background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.3);border-radius:8px;text-align:center;line-height:28px;font-size:13px;color:#FBBF24;font-weight:700;">${i+1}</div>
          </td>
          <td style="padding-left:10px;font-family:'Georgia',serif;font-size:14px;font-style:italic;color:rgba(255,255,255,0.78);line-height:1.7;">${b}</td>
        </tr>
      </table>`).join("");
  }

  function strategiesHTML() {
    const stratIcons = ["⟁", "◎", "◈"];
    return (strategies || []).map((s, i) => `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
        <tr><td style="background:${bgCardLight};border:1px solid ${borderColor};border-top:2px solid ${accentColor};border-radius:12px;overflow:hidden;">
          <!-- Card header -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding:14px 20px;background:rgba(0,0,0,0.2);">
                <table cellpadding="0" cellspacing="0" border="0"><tr>
                  <td style="width:28px;height:28px;background:${accentColor};border-radius:50%;text-align:center;line-height:28px;font-size:14px;color:#070F1E;font-weight:800;">${i+1}</td>
                  <td style="padding-left:12px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:${accentColor};letter-spacing:0.08em;text-transform:uppercase;">${s.area}</td>
                </tr></table>
              </td>
            </tr>
          </table>
          <!-- Scenario -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding:14px 20px;border-top:1px solid ${borderColor};">
                <p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:rgba(255,255,255,0.35);letter-spacing:0.14em;text-transform:uppercase;margin:0 0 8px 0;">THE SCENARIO</p>
                <p style="font-family:'Georgia',serif;font-size:14px;font-style:italic;color:rgba(255,255,255,0.75);line-height:1.7;margin:0;">&ldquo;${s.scenario}&rdquo;</p>
              </td>
            </tr>
          </table>
          <!-- Solution -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding:14px 20px;border-top:1px solid ${borderColor};">
                <p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:${accentColor};letter-spacing:0.14em;text-transform:uppercase;margin:0 0 8px 0;">→ YOUR QUANTUM SYSTEM</p>
                <p style="font-family:Arial,sans-serif;font-size:14px;color:rgba(255,255,255,0.78);line-height:1.85;margin:0;">${s.solution}</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>`).join("");
  }

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Your LQM Report — ${name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Crimson+Pro:ital,wght@0,400;1,300;1,400&display=swap" rel="stylesheet">
  <style>
    body { margin:0;padding:0;background-color:${bgDark}; }
    .EmailBody { background-color:${bgDark}; }
    @media (prefers-color-scheme:dark) { body, .EmailBody { background-color:${bgDark} !important; } }
  </style>
</head>
<body class="EmailBody" style="margin:0;padding:0;background-color:${bgDark};">

<!-- Preheader (hidden preview text) -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
  Your LQM Behavioural Intelligence Report — ${name}. Identity statement, strengths, blind spots and 3 quantum strategy cards inside.
  &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
</div>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${bgDark};min-width:100%;">
  <tr><td align="center" style="padding:40px 16px 60px;">

    <!-- Container -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

      <!-- ── HEADER ── -->
      <tr><td style="padding-bottom:24px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
          style="background:linear-gradient(145deg,${bgCard},${bgDark});border:1px solid ${accentColor}33;border-radius:20px;overflow:hidden;">
          <tr><td style="padding:40px 32px;text-align:center;">

            <!-- LQM wordmark -->
            <p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${accentColor};margin:0 0 8px 0;">LEARNING QUANTUM METHOD</p>
            <p style="font-family:Arial,sans-serif;font-size:11px;color:${textDim};margin:0 0 28px 0;letter-spacing:0.1em;">BEHAVIOURAL INTELLIGENCE REPORT</p>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
              <tr><td width="40%" style="height:1px;background:transparent;"></td>
              <td width="20%" style="height:1px;background:${accentColor};"></td>
              <td width="40%" style="height:1px;background:transparent;"></td></tr>
            </table>

            <!-- Archetype symbol -->
            <p style="font-family:Arial,sans-serif;font-size:52px;color:${accentColor};margin:0 0 8px 0;text-shadow:0 0 30px ${accentColor};">${sym}</p>

            <!-- Archetype name -->
            <h1 style="font-family:'Space Grotesk',Arial,sans-serif;font-size:32px;font-weight:700;color:${textMain};letter-spacing:0.04em;margin:0 0 6px 0;">${name}</h1>
            <p style="font-family:'Crimson Pro','Georgia',serif;font-size:17px;font-style:italic;color:${accentColor};margin:0 0 24px 0;">${arch}</p>

            <!-- Tagline pill -->
            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
              <tr><td style="background:${accentColor}18;border:1px solid ${accentColor}44;border-radius:100px;padding:8px 20px;">
                <p style="font-family:'Crimson Pro','Georgia',serif;font-size:16px;font-style:italic;color:${textMain};margin:0;">&ldquo;${tag}&rdquo;</p>
              </td></tr>
            </table>

          </td></tr>
        </table>
      </td></tr>

      <!-- ── DELIVERY CONFIRMATION ── -->
      ${deliveryRef ? `<tr><td style="padding-bottom:20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.2);border-radius:12px;padding:14px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#34D399;">✓ REPORT DELIVERED · ${deliveryTs || ""}</td>
              <td align="right" style="font-family:'Courier New',monospace;font-size:12px;color:#34D399;font-weight:700;">Ref: ${deliveryRef}</td>
            </tr></table>
          </td></tr>
        </table>
      </td></tr>` : ""}

      <!-- ── HOOK ── -->
      <tr><td style="padding-bottom:20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="background:${bgCard};border:1px solid ${accentColor}22;border-left:4px solid ${accentColor};border-radius:0 14px 14px 0;padding:20px 24px;">
            <p style="font-family:'Crimson Pro','Georgia',serif;font-size:18px;font-style:italic;color:${textMain};line-height:1.7;margin:0;">${hook}</p>
          </td></tr>
        </table>
      </td></tr>

      <!-- ── IDENTITY STATEMENT ── -->
      <tr><td style="padding-bottom:20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="background:${bgCard};border:1px solid ${accentColor}33;border-radius:16px;padding:28px;text-align:center;">
            ${sectionLabel("◈ Your Identity Statement")}
            <p style="font-family:'Crimson Pro','Georgia',serif;font-size:22px;font-style:italic;color:${textMain};line-height:1.65;margin:0 0 14px 0;">&ldquo;${identity}&rdquo;</p>
            <p style="font-family:Arial,sans-serif;font-size:13px;color:${textMuted};margin:0;">Repeat this daily. Identity precedes behaviour. Behaviour compounds into results.</p>
          </td></tr>
        </table>
      </td></tr>

      <!-- ── PROFILE OVERVIEW ── -->
      <tr><td style="padding-bottom:20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="background:${bgCard};border:1px solid ${borderColor};border-radius:16px;padding:28px;">
            ${sectionLabel("Profile Overview")}
            <p style="font-family:'Crimson Pro','Georgia',serif;font-size:16px;color:rgba(255,255,255,0.78);line-height:1.9;font-weight:300;margin:0;">${desc}</p>
          </td></tr>
        </table>
      </td></tr>

      <!-- ── QUANTUM INSIGHT ── -->
      <tr><td style="padding-bottom:20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="background:rgba(0,200,255,0.04);border:1px solid rgba(0,200,255,0.2);border-left:4px solid #00C8FF;border-radius:0 14px 14px 0;padding:22px 24px;">
            ${sectionLabel("⚛ LQM Quantum Insight", "#00C8FF")}
            <p style="font-family:Arial,sans-serif;font-size:15px;color:rgba(255,255,255,0.82);line-height:1.85;margin:0;">${atomic}</p>
          </td></tr>
        </table>
      </td></tr>

      <!-- ── STRENGTHS ── -->
      <tr><td style="padding-bottom:20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="background:${bgCard};border:1px solid ${borderColor};border-radius:16px;padding:28px;">
            ${sectionLabel("Core Strengths", accentColor)}
            ${strengthsHTML()}
          </td></tr>
        </table>
      </td></tr>

      <!-- ── BLIND SPOTS ── -->
      <tr><td style="padding-bottom:20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="background:${bgCard};border:1px solid ${borderColor};border-radius:16px;padding:28px;">
            ${sectionLabel("Blind Spots to Navigate", "rgba(251,191,36,0.9)")}
            <p style="font-family:'Georgia',serif;font-size:14px;font-style:italic;color:${textMuted};margin:0 0 18px 0;">These aren&rsquo;t weaknesses. They&rsquo;re patterns to recognise &mdash; awareness is the first step to transcendence.</p>
            ${blindspotsHTML()}
          </td></tr>
        </table>
      </td></tr>

      <!-- ── STRATEGY CARDS ── -->
      <tr><td style="padding-bottom:8px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="background:${bgCard};border:1px solid ${borderColor};border-radius:16px;padding:28px 28px 20px;">
            ${sectionLabel("Your 3 LQM Quantum Strategy Cards", accentColor)}
            <p style="font-family:'Georgia',serif;font-size:15px;font-style:italic;color:${textMuted};line-height:1.7;margin:0 0 20px 0;">The following systems are built specifically for your behavioural profile. Read them as instructions written for you alone.</p>
            ${strategiesHTML()}
          </td></tr>
        </table>
      </td></tr>

      <!-- ── CTA ── -->
      <tr><td style="padding:16px 0 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr><td style="background:${accentColor};border-radius:100px;">
                <a href="https://lqmmethod.com" style="display:inline-block;padding:14px 40px;font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:#070F1E;text-decoration:none;letter-spacing:0.06em;">Return to My LQM Hub →</a>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </td></tr>

      <!-- ── QUOTE FOOTER ── -->
      <tr><td style="padding-bottom:24px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="background:${bgCard};border:1px solid ${borderColor};border-radius:16px;padding:32px;text-align:center;">
            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
              <tr><td width="40%"></td><td width="20%" style="height:1px;background:${accentColor}44;"></td><td width="40%"></td></tr>
            </table>
            <p style="font-family:'Crimson Pro','Georgia',serif;font-size:18px;font-style:italic;color:${textMuted};line-height:1.75;max-width:420px;margin:0 auto 14px;">
              &ldquo;Small shifts, consistently honoured, produce quantum results. The habit is not the destination &mdash; it is the vehicle.&rdquo;
            </p>
            <p style="font-family:Arial,sans-serif;font-size:13px;color:${textDim};margin:0 0 20px 0;">&mdash; The Learning Quantum Method</p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
              <tr><td style="height:1px;background:${borderColor};"></td></tr>
            </table>
            <p style="font-family:Arial,sans-serif;font-size:12px;color:${textDim};margin:0;">LQM Behavioural Intelligence Report &middot; ${name}</p>
            ${deliveryRef ? `<p style="font-family:'Courier New',monospace;font-size:11px;color:${textDim};margin:6px 0 0 0;">Ref: ${deliveryRef}</p>` : ""}
          </td></tr>
        </table>
      </td></tr>

      <!-- ── LEGAL FOOTER ── -->
      <tr><td style="padding-bottom:0;text-align:center;">
        <p style="font-family:Arial,sans-serif;font-size:11px;color:${textDim};line-height:1.7;margin:0 0 6px 0;">
          &copy; 2026 Learning Quantum Method. All rights reserved.<br>
          This report was prepared exclusively for the purchaser and is for personal use only.
        </p>
        <p style="font-family:Arial,sans-serif;font-size:11px;color:${textDim};margin:0;">
          <a href="https://lqmmethod.com/privacy" style="color:${textDim};">Privacy Policy</a>
          &nbsp;&middot;&nbsp;
          <a href="mailto:lqm@lqmmethod.com" style="color:${textDim};">lqm@lqmmethod.com</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>

</body>
</html>`;

  // ── Call Resend API ──────────────────────────────────────────────────────────
  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LQM <noreply@lqmmethod.com>",
        to:   [email],
        subject: `Your LQM Report — ${name}`,
        html: htmlBody,
        tags: [
          { name: "archetype", value: typeKey },
          { name: "source",    value: "purchase" },
        ],
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend error:", resendData);
      return res.status(502).json({ error: "Failed to send email", detail: resendData });
    }

    return res.status(200).json({ success: true, id: resendData.id });

  } catch (err) {
    console.error("Send error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
