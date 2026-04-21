export default async function handler(req, res) {
  try {
    const body = req.body || {};

    await fetch(`https://graph.facebook.com/v18.0/${process.env.PIXEL_ID}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: [
          {
            event_name: "Purchase",
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            event_source_url: body.booking_url || "",
            custom_data: {
              currency: "USD",
              value: 100
            }
          }
        ],
        access_token: process.env.META_ACCESS_TOKEN
      })
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
