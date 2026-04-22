export default async function handler(req, res) {
  try {
    const pixel = "YOUR_PIXEL_ID";
    const token = "PASTE_YOUR_TOKEN_HERE";

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

    const data = await response.json();
    console.log("META RESPONSE:", data);

    res.status(200).json(data);

  } catch (err) {
    console.error(err);
    res.status(200).json({ error: "fail" });
  }
}
