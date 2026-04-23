export default async function handler(req, res) {
  try {
    console.log("REQ BODY:", req.body);

    const pixel = "594259826536475";
    const token = "EAAcXbP1YQ78BRdxlO6wGcHuridZBLvraAeD5NwkI8BopZCaiflpFoWH8FwZAOZBZBH43AfecEMZAzGWM3td9tZBh18ZBlWEXUAgfmsMDmlAzoOM7bOPEo8bRviv6jdZB35jExPu61lUhsGkcPWqpxPOWiDqHnrzLqc9q3Lq7gC4b6bPkoNMC0bDmDJqeXdiUY4wZDZD"; // 👈 KEEP YOUR REAL TOKEN

    const body = req.body;

    // 👇 Email (for match quality)
    const email = body?.customer?.email || "";

    const hashedEmail = email
      ? require("crypto")
          .createHash("sha256")
          .update(email.trim().toLowerCase())
          .digest("hex")
      : undefined;

    // 👇 Booking value
    const value = body?.total || 0;

    // 👇 Grab fbclid from ANY possible place
    const fbclid =
      body?.fbclid ||
      body?.query?.fbclid ||
      body?.meta?.fbclid ||
      null;

    // 👇 Convert to fbc (Meta format)
    const fbc = fbclid
      ? `fb.1.${Math.floor(Date.now() / 1000)}.${fbclid}`
      : undefined;

    console.log("FBCLID:", fbclid);
    console.log("FBC:", fbc);

    // 👇 Send to Meta
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
