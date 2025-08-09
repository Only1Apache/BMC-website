// /.netlify/functions/get-posts (CommonJS, robust)
const apiBase = "https://api.netlify.com/api/v1";

exports.handler = async () => {
  const token = process.env.NETLIFY_TOKEN;
  const siteId = process.env.SITE_ID || process.env.WEB_ID;
  if (!token || !siteId) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
      body: JSON.stringify({ error: "Missing NETLIFY_TOKEN or SITE_ID/WEB_ID" })
    };
  }
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const formsResp = await fetch(`${apiBase}/sites/${siteId}/forms`, { headers });
    if (!formsResp.ok) throw new Error("Failed to list forms");
    const forms = await formsResp.json();
    if (!forms.length) return { statusCode: 200, headers: { "content-type": "application/json", "access-control-allow-origin": "*" }, body: JSON.stringify({ items: [] }) };

    // Prefer exact name; else fallback to newest form
    const preferred = forms.find(f => f.name === "member-posts") || forms.sort((a,b)=> new Date(b.created_at) - new Date(a.created_at))[0];

    const subsResp = await fetch(`${apiBase}/forms/${preferred.id}/submissions`, { headers });
    if (!subsResp.ok) throw new Error("Failed to list submissions");
    const subs = await subs.json();

    const items = subs.map(s => ({
      created_at: s.created_at,
      author: (s.data && s.data.author) || s.email || "Member",
      title: (s.data && s.data.title) || "",
      content: (s.data && s.data.content) || ""
    })).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    return {
      statusCode: 200,
      headers: { "content-type": "application/json", "cache-control": "no-store", "access-control-allow-origin": "*" },
      body: JSON.stringify({ items })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
      body: JSON.stringify({ error: err.message || "Unknown error" })
    };
  }
};
