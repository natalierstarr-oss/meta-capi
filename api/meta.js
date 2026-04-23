export default async function handler(req, res) {
  try {
    const body = req.body;

    console.log("REQ BODY:", JSON.stringify(body, null, 2));

    const pixel = "594259826536475";
    const token = "EAAcXbP1YQ78BRdxlO6wGcHuridZBLvraAeD5NwkI8BopZCaiflpFoWH8FwZAOZBZBH43AfecEMZAzGWM3td9tZBh18ZBlWEXUAgfmsMDmlAzoOM7bOPEo8bRviv6jdZB35jExPu61lUhsGkcPWqpxPOWiDqHnrzLqc9q3Lq7gC4b6bPkoNMC0bDmDJqeXdiUY4wZDZD"; // 👈 keep your real token

    // -----------------------------
    // EMAIL (for match quality)
    // -----------------------------
    const email =
      body?.booking?.customer?.email ||
      body?.customer?.email ||
      "";

    const crypto = require("crypto");

    const hashedEmail = email
      ? crypto
          .createHash("sha256")
          .update(email.trim().toLowerCase())
          .digest("hex")
      : undefined;

    // -----------------------------
    // VALUE
    // -----------------------------
    const value =
      parseFloat(body?.booking?.order?.total) ||
      body?.total ||
      0;

    // -----------------------------
    // FBCLID EXTRACTION
    // -----------------------------

    // 1. Try direct field (Checkfront custom field)
    let fbclid =
      body?.booking?.fields?.fbclid ||
      body?.booking?.meta?.fbclid ||
      null;

    // If it's empty object, ignore it
    if (typeof fbclid === "object") {
      fbclid = null;
    }

    // 2. Fallback: scan entire payload
    if (!fbclid) {
      const raw = JSON.stringify(body);

      const match1 = raw.match(/fbclid=([^&"]+)/);
      const match2 = raw.match(/"fbclid":"([^"]+)"/);

      fbclid = match1?.[1] || match2?.[1] || null;
    }

    // -----------------------------
    // FORMAT FBC
    // -----------------------------
    const fbc = fbclid
      ? `fb.1.${Math.floor(Date.now() / 1000)}.${fbclid}`
      : undefined;

    console.log("FBCLID:", fbclid);
    console.log("FBC:", fbc);

    // -----------------------------
    // SEND TO META
    // -----------------------------
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
