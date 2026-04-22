export default async function handler(req, res) {
  const pixel = "594259826536475";
  const token = "PASTE_YOUR_TOKEN_HERE";

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pixel}/events?access_token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: [
            {
              event_name: "Purchase",
              event_time: Math.floor(Date.now() / 1000),
              action_source: "website"
            }
          ]
        })
      }
    );

    // IMPORTANT: use text() so it never crashes on JSON parsing
    const result = await response.text();

    return res.status(200).send(result);

  } catch (err) {
    return res.status(500).send("ERROR: " + err.message);
  }
}
