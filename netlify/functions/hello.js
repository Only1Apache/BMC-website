// /.netlify/functions/hello
exports.handler = async () => {
  return {
    statusCode: 200,
    headers: { "content-type": "application/json", "cache-control": "no-store", "access-control-allow-origin": "*" },
    body: JSON.stringify({ ok: true, msg: "Functions are working 🎉" })
  };
};
