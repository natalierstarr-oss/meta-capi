export default async function handler(req, res) {
  try {
    const pixel = "594259826536475";
    const token = "EAAcXbP1YQ78BRdhyIycn0MSAN4Tcjx0ZA7prmWsjounsT4ES1fWW4Fd7f9mer51R2V1RwZAxrpdvyIEschRYecYSxy9uOrYH1UzWS50BN79lvbl3qugojwMJVvZCj3Tqzxhz2pcP4Nabm5A0XhhxhwCfqiCKEz8PtfrbiPWJMMnWSEJzg4ZCD1kfzFvIZBQZDZD";

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

    return res.status(200).json(data);

  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
