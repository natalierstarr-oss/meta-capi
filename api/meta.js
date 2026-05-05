export default async function handler(req, res) {
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

    // ✅ SAFE BOOKING EXTRACTION
    const booking = body.booking || {};

    if (!booking || typeof booking !== "object") {
      console.log("Invalid booking payload");
      return res.status(200).send("no booking");
    }

    // ✅ SAFE TRACKING ID CHECK
    const trackingId =
      booking.tracking_id ||
      booking.meta?.tracking_id ||
      null;

    if (trackingId !== "website") {
      console.log("Skipping non-website booking:", trackingId);
      return res.status(200).send("skipped");
    }

    const customer = booking.customer || {};
    const order = booking.order || {};

    const email = customer.email || null;
    const value = Number(order?.total) || 0;

    console.log("EMAIL:", email);
    console.log("VALUE:", value);

    // ✅ HASH EMAIL (Meta requirement)
    let hashedEmail = null;
    if (email) {
      const crypto = await import("crypto");
      hashedEmail = crypto
        .createHash("sha256")
        .update(email.trim().toLowerCase())
        .digest("hex");
    }

    // ✅ SEND TO META
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
                em: hashedEmail
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

    return res.status(200).send("ok");

  } catch (err) {
    console.error("ERROR:", err);

    // ✅ NEVER let webhook fail
    return res.status(200).send("error handled");
  }
}
