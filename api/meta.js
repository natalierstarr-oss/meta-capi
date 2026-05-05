export default async function handler(req, res) {
  // ✅ always respond safely (prevents webhook disabling)
  let responded = false;
  const safeRespond = (msg) => {
    if (!responded) {
      responded = true;
      res.status(200).send(msg);
    }
  };

  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return safeRespond("ok");
    }

    const body = req.body || {};
    console.log("REQ BODY:", body);

    const booking = body.booking || {};

    if (!booking || typeof booking !== "object") {
      console.log("Invalid booking payload");
      return safeRespond("no booking");
    }

    // ✅ TRACKING ID FILTER (website only)
    const trackingId =
      booking.tracking_id ||
      booking.tid ||
      booking.meta?.tracking_id ||
      null;

    if (trackingId !== "website") {
      console.log("Skipping non-website booking:", trackingId);
      return safeRespond("skipped");
    }

    const customer = booking.customer || {};
    const order = booking.order || {};
    const items = order.items || {};

    // ✅ ONLY SEND REAL BOOKINGS (NOT FOOD / ADD-ONS)
    let isBooking = false;

    for (const key in items) {
      const item = items[key];
      const name = (item?.name || "").toLowerCase();

      if (
        name.includes("lodging") ||
        name.includes("cabin") ||
        name.includes("room") ||
        name.includes("retreat") ||
        name.includes("stay")
      ) {
        isBooking = true;
      }
    }

    if (!isBooking) {
      console.log("Skipping non-booking purchase");
      return safeRespond("skipped");
    }

    const email = customer.email || null;
    const value = Number(order?.total) || 0;

    console.log("EMAIL:", email);
    console.log("VALUE:", value);

    // ✅ HASH EMAIL FOR META
    let hashedEmail = null;
    if (email) {
      const crypto = await import("crypto");
      hashedEmail = crypto
        .createHash("sha256")
        .update(email.trim().toLowerCase())
        .digest("hex");
    }

    const pixel = "594259826536475";
    const token = "EAAcXbP1YQ78BRdxlO6wGcHuridZBLvraAeD5NwkI8BopZCaiflpFoWH8FwZAOZBZBH43AfecEMZAzGWM3td9tZBh18ZBlWEXUAgfmsMDmlAzoOM7bOPEo8bRviv6jdZB35jExPu61lUhsGkcPWqpxPOWiDqHnrzLqc9q3Lq7gC4b6bPkoNMC0bDmDJqeXdiUY4wZDZD";

    // ✅ SEND TO META (async so webhook never breaks)
    fetch(
      `https://graph.facebook.com/v18.0/${pixel}/events?access_token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    ).catch(err => console.error("Meta error:", err));

    return safeRespond("ok");

  } catch (err) {
    console.error("CRASH:", err);
    return safeRespond("error handled");
  }
}
