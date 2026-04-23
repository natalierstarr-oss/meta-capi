export default async function handler(req, res) {
  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const body = req.body || {};
    console.log("REQ BODY:", body);

    const pixel = "594259826536475";
    const token = "EAAcXbP1YQ78BRdxlO6wGcHuridZBLvraAeD5NwkI8BopZCaiflpFoWH8FwZAOZBZBH43AfecEMZAzGWM3td9tZBh18ZBlWEXUAgfmsMDmlAzoOM7bOPEo8bRviv6jdZB35jExPu61lUhsGkcPWqpxPOWiDqHnrzLqc9q3Lq7gC4b6bPkoNMC0bDmDJqeXdiUY4wZDZD";

    // 🔑 Pull booking data from Checkfront
    const booking = body.booking || null;

    // 👉 Value (THIS is what you were missing)
    const value = booking?.order?.total
      ? parseFloat(booking.order.total)
      : 0;

    console.log("VALUE:", value);

    // 👉 Email (for match quality)
    const email = booking?.customer?.email || null;

    // 👉 fbclid (if passed separately from browser)
    const fbclid = body.fbclid || null;

    let fbc = null;
    if (fbclid) {
      fbc = `fb.1.${Math.floor(Date.now() / 1000)}.${fbclid}`;
    }

    console.log("FBC:", fbc);

    // 👉 Hash email (Meta requirement)
    const hashedEmail = email
      ? require("crypto")
          .createHash("sha256")
          .update(email.trim().toLowerCase())
          .digest("hex")
      : undefined;

    await fetch(
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
              action_source: "website",

              user_data: {
                em: hashedEmail,
                fbc: fbc
              },

              custom_data: {
                value: value,
                currency: "USD"
              }
            }
          ]
        })
      }
    );

    res.status(200).send("ok");

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).send("error");
  }
}
