export default async function handler(req, res) {
  res.status(200).send("ok");

  try {
    const pixel = "594259826536475";
    const token = "EAAcXbP1YQ78BRdxlO6wGcHuridZBLvraAeD5NwkI8BopZCaiflpFoWH8FwZAOZBZBH43AfecEMZAzGWM3td9tZBh18ZBlWEXUAgfmsMDmlAzoOM7bOPEo8bRviv6jdZB35jExPu61lUhsGkcPWqpxPOWiDqHnrzLqc9q3Lq7gC4b6bPkoNMC0bDmDJqeXdiUY4wZDZD";

    const body = req.body;

    // 👇 Grab customer email from Checkfront
    const email = body?.customer?.email || "";

    // 👇 Hash email (Meta requires SHA256)
    const hashedEmail = email
      ? require("crypto")
          .createHash("sha256")
          .update(email.trim().toLowerCase())
          .digest("hex")
      : undefined;

    // 👇 Grab booking total
    const value = body?.total || 0;

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

  } catch (err) {
    console.error("META ERROR:", err);
  }
}
