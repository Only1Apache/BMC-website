// /.netlify/functions/delete-post — author or admin can delete
const apiBase = "https://api.netlify.com/api/v1";

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors() };
  if (event.httpMethod !== 'DELETE') return { statusCode: 405, headers: cors(), body: 'Method Not Allowed' };

  const user = context.clientContext && context.clientContext.user;
  if (!user) return { statusCode: 401, headers: cors(), body: 'Unauthorized' };

  const token = process.env.NETLIFY_TOKEN;
  if (!token) return { statusCode: 500, headers: cors(), body: 'Missing NETLIFY_TOKEN' };

  const id = (event.queryStringParameters && event.queryStringParameters.id) || null;
  if (!id) return { statusCode: 400, headers: cors(), body: 'Missing id' };

  try {
    const subResp = await fetch(`${apiBase}/submissions/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    if (!subResp.ok) return { statusCode: 404, headers: cors(), body: 'Not found' };
    const sub = await subResp.json();

    const isAdmin = (user.app_metadata?.roles || []).map(r=>String(r).toLowerCase()).includes('admin');
    const displayName = (user.user_metadata && (user.user_metadata.displayName || user.user_metadata.full_name)) || '';
    const ownerEmail = (sub.data && sub.data.owner_email) || sub.email || '';
    const isOwner = !!((user.email && ownerEmail && user.email.toLowerCase() === ownerEmail.toLowerCase())
      || (displayName && sub.data && sub.data.author && String(displayName).trim() === String(sub.data.author).trim()));
    if (!isAdmin && !isOwner) return { statusCode: 403, headers: cors(), body: 'Forbidden' };

    const del = await fetch(`${apiBase}/submissions/${id}`, { method:'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (!del.ok) { const t = await del.text(); return { statusCode: 502, headers: cors(), body: 'Delete failed: ' + t }; }

    return { statusCode: 200, headers: corsJson(), body: JSON.stringify({ ok:true }) };
  } catch (err) {
    return { statusCode: 500, headers: cors(), body: 'Error: '+(err.message||'Unknown') };
  }
};
function cors(){ return { 'access-control-allow-origin':'*','access-control-allow-methods':'DELETE, OPTIONS','access-control-allow-headers':'authorization, content-type' }; }
function corsJson(){ return { ...cors(), 'content-type': 'application/json' }; }
