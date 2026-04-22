export default async function handler(req, res) {
  // Always respond immediately (prevents webhook failures)
  res.status(200).send("ok");

  try {
    const pixel = "594259826536475";
    const token = "EAAcXbP1YQ78BRdxlO6wGcHuridZBLvraAeD5NwkI8BopZCaiflpFoWH8FwZAOZBZBH43AfecEMZAzGWM3td9tZBh18ZBlWEXUAgfmsMDmlAzoOM7bOPEo8bRviv6jdZB35jExPu61lUhsGkcPWqpxPOWiDqHnrzLqc9q3Lq7gC4b6bPkoNMC0bDmDJqeXdiUY4wZDZD";

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
              action_source: "website"
            }
          ]
        })
      }
    );

  } catch (err) {
    console.error("META ERROR:", err);
  }
}
