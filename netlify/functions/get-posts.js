// /.netlify/functions/get-posts — hides emails; returns can_manage; includes category/world fields
const apiBase = "https://api.netlify.com/api/v1";

exports.handler = async (event, context) => {
  const token = process.env.NETLIFY_TOKEN;
  const siteId = process.env.WEB_ID || process.env.SITE_ID;
  if (!token || !siteId) {
    return { statusCode: 500, headers: json(), body: JSON.stringify({ error: "Missing NETLIFY_TOKEN or WEB_ID/SITE_ID" }) };
  }
  const headers = { Authorization: `Bearer ${token}` };

  const currentUser = context.clientContext && context.clientContext.user;
  const currentEmail = currentUser?.email || "";
  const isAdmin = ((currentUser?.app_metadata?.roles) || []).map(r=>String(r).toLowerCase()).includes("admin");

  try {
    const formsResp = await fetch(`${apiBase}/sites/${siteId}/forms`, { headers });
    if (!formsResp.ok) throw new Error("Failed to list forms");
    const forms = await formsResp.json();
    if (!forms.length) return { statusCode: 200, headers: json(), body: JSON.stringify({ items: [] }) };

    const preferred = forms.find(f => f.name === "member-posts") || forms.sort((a,b)=> new Date(b.created_at) - new Date(a.created_at))[0];
    const subsResp = await fetch(`${apiBase}/forms/${preferred.id}/submissions`, { headers });
    if (!subsResp.ok) throw new Error("Failed to list submissions");
    const subs = await subsResp.json();

    const items = subs.map(s => {
      const ownerEmail = (s.data && s.data.owner_email) || "";
      const canManage = isAdmin || (!!currentEmail && ownerEmail && currentEmail.toLowerCase() === ownerEmail.toLowerCase());
      return {
        id: s.id,
        created_at: s.created_at,
        author: (s.data && s.data.author) || "Member",
        title: (s.data && s.data.title) || "",
        content: (s.data && s.data.content) || "",
        role: (s.data && s.data.role) || "member",
        category: (s.data && s.data.category) || "",
        world_id: (s.data && s.data.world_id) || "",
        world_name: (s.data && s.data.world_name) || "",
        world_desc: (s.data && s.data.world_desc) || "",
        world_img: (s.data && s.data.world_img) || "",
        world_url: (s.data && s.data.world_url) || "",
        can_manage: !!canManage
      };
    }).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    return { statusCode: 200, headers: jsonNoStore(), body: JSON.stringify({ items }) };
  } catch (err) {
    return { statusCode: 500, headers: json(), body: JSON.stringify({ error: err.message || "Unknown error" }) };
  }
};
function json(){ return { "content-type": "application/json", "access-control-allow-origin": "*" }; }
function jsonNoStore(){ return { ...json(), "cache-control": "no-store" }; }
