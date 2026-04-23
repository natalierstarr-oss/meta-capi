export default async function handler(req) {
  try {
    const body = await req.json();

    console.log("BODY:", body);

    const pixel = "594259826536475";
    const token = "EAAcXbP1YQ78BRdxlO6wGcHuridZBLvraAeD5NwkI8BopZCaiflpFoWH8FwZAOZBZBH43AfecEMZAzGWM3td9tZBh18ZBlWEXUAgfmsMDmlAzoOM7bOPEo8bRviv6jdZB35jExPu61lUhsGkcPWqpxPOWiDqHnrzLqc9q3Lq7gC4b6bPkoNMC0bDmDJqeXdiUY4wZDZD";

    const isBooking = !!body?.booking;

    let fbclid = body?.fbclid || null;

    console.log("FBCLID:", fbclid);

    let fbc = null;
    if (fbclid) {
      fbc = `fb.1.${Math.floor(Date.now() / 1000)}.${fbclid}`;
    }

    console.log("FBC:", fbc);

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
              event_name: isBooking ? "Purchase" : "PageView",
              event_time: Math.floor(Date.now() / 1000),
              action_source: "website",
              user_data: {
                fbc: fbc
              }
            }
          ]
        })
      }
    );

    return new Response("ok", { status: 200 });

  } catch (err) {
    console.error("ERROR:", err);
    return new Response("error", { status: 500 });
  }
}
