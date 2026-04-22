export default async function handler(req, res) {
  try {
    const body = req.body || {};

    // Safe fallback values
    const total = parseFloat(body.total || body.total_paid || 0) || 0;

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
            custom_data: {
              currency: "USD",
              value: total
            }
          }
        ],
        access_token: process.env.META_ACCESS_TOKEN
      })
    });

    // ALWAYS return success so Checkfront doesn't disable webhook
    res.status(200).json({ received: true });

  } catch (error) {
    console.error("Error:", error);

    // Still return 200 so webhook doesn't fail
    res.status(200).json({ received: true });
  }
}
