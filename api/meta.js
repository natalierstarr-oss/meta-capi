export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  return res.status(200).send(
    JSON.stringify({
      success: true
    })
  );
}
if (req.method !== "POST") {
  return res.status(200).send(JSON.stringify({ ok: true }));
}
