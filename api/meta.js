export default async function handler(req, res) {
  try {
    const pixel = "594259826536475";
    const token = "EAAcXbP1YQ78BRU5E8xSkSrE3ZC8G6T2IbkXoC0Bn6ZCXyVDykZCwBZAloewYyBiUAVeR0SYuuTLtfCjFtLwmG7Wq68Tbxpm3HHglw7ZCJLF7TuIJ7t4tkVwQ0th8rNdVBbZBHhZBFesgUTxAnZCZAGTZCfUYo4r5zGujmjWrd9z6v4cINBDVWIG0uM2i3i07whOwZDZD";
const response = await fetch(
  `https://graph.facebook.com/v18.0/${pixel}/events`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          user_data: {}
        }
      ]
    })
  }
);
