// /.netlify/functions/submit-post — admin/member only, saves role + display name; supports category/world_id
exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') { return { statusCode: 204, headers: cors() }; }
  if (event.httpMethod !== 'POST') { return { statusCode: 405, headers: cors(), body: 'Method Not Allowed' }; }

  const user = context.clientContext && context.clientContext.user;
  const roles = (user && user.app_metadata && user.app_metadata.roles) || [];
  const lowered = roles.map(r => String(r).toLowerCase());
  const allowedRoles = ['admin', 'member'];
  const hasAccess = lowered.some(r => allowedRoles.includes(r));

  if (!user)     return { statusCode: 401, headers: cors(), body: 'Unauthorized (login required)' };
  if (!hasAccess) return { statusCode: 403, headers: cors(), body: 'Forbidden (admin/member role required)' };

  let payload; try{ payload = JSON.parse(event.body || '{}'); }catch(e){ return { statusCode: 400, headers: cors(), body: 'Invalid JSON body' }; }
  const title = (payload.title || '').trim();
  const content = (payload.content || '').trim();
  const displayName = (payload.displayName || '').trim();
  const category = (payload.category || '').trim();
  const worldId  = (payload.world_id || '').trim();
  if (!title || !content || !displayName) return { statusCode: 400, headers: cors(), body: 'Missing title/content/displayName' };

  const primaryRole = lowered.includes('admin') ? 'admin' : (lowered.includes('member') ? 'member' : 'user');

  const formBody = new URLSearchParams();
  formBody.set('form-name', 'member-posts');
  formBody.set('author', displayName);
  formBody.set('title', title);
  formBody.set('content', content);
  formBody.set('role', primaryRole);
  const ownerEmail = (user && user.email) || '';
  formBody.set('owner_email', ownerEmail);
  if (category) formBody.set('category', category);
  if (worldId)  formBody.set('world_id', worldId);

  const host = event.headers['x-forwarded-host'] || event.headers.host;
  const siteUrl = `https://${host}`;

  try {
    const resp = await fetch(siteUrl + '/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formBody.toString() });
    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: 502, headers: cors(), body: 'Upstream submit failed: ' + resp.status + ' ' + text };
    }
    return { statusCode: 200, headers: corsJson(), body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, headers: cors(), body: 'Error: ' + (err.message || 'Unknown') };
  }
};
function cors(){ return { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'authorization, content-type' }; }
function corsJson(){ return { ...cors(), 'content-type': 'application/json' }; }
