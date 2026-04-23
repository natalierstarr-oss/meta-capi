export default async function handler(req, res) {
  try {
    const body = req.body;

    console.log("REQ BODY:", JSON.stringify(body, null, 2));

    const pixel = "594259826536475";
    const token = "EAAcXbP1YQ78BRdxlO6wGcHuridZBLvraAeD5NwkI8BopZCaiflpFoWH8FwZAOZBZBH43AfecEMZAzGWM3td9tZBh18ZBlWEXUAgfmsMDmlAzoOM7bOPEo8bRviv6jdZB35jExPu61lUhsGkcPWqpxPOWiDqHnrzLqc9q3Lq7gC4b6bPkoNMC0bDmDJqeXdiUY4wZDZD";

    const isBooking = !!body?.booking;

    console.log("IS BOOKING:", isBooking);

    // EMAIL (safe, no crypto for now)
    const email = isBooking
      ? body?.booking?.customer?.email || ""
      : "";

    // VALUE
    const value = isBooking
      ? parseFloat(body?.booking?.order?.total) || 0
      : 0;

    // FBCLID (THIS is what we care about)
    let fbclid =
      body?.fbclid ||
      body?.booking?.fields?.fbclid ||
      body?.booking?.meta?.fbclid ||
      null;

    if (typeof fbclid === "object") {
      fbclid = null;
    }

    const fbc = fbclid
      ? `fb.1.${Math.floor(Date.now() / 1000)}.${fbclid}`
      : undefined;

    console.log("FBCLID:", fbclid);
    console.log("FBC:", fbc);

    const eventName = isBooking ? "Purchase" : "PageView";

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
              event_name: eventName,
              event_time: Math.floor(Date.now() / 1000),
              action_source: "website",
              user_data: {
                // removed hashing for now to avoid crash
                em: email || undefined,
                fbc: fbc
              },
              custom_data: isBooking
                ? {
                    value: value,
                    currency: "USD"
                  }
                : {}
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
