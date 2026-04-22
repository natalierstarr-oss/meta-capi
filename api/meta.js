export default async function handler(req, res) {
  try {
    const token = process.env.META_ACCESS_TOKEN;
    const pixel = process.env.PIXEL_ID;

    console.log("TOKEN:", token ? "exists" : "missing");
    console.log("PIXEL:", pixel);

    await fetch(`https://graph.facebook.com/v18.0/${pixel}/events?access_token=${token}`, {
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
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(200).json({ ok: true });
  }
}
