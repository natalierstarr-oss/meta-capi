export default async function handler(req, res) {
  try {
    const pixel = "594259826536475";
    const token = "EAAMqbiedbBsBRR6oNsxTPZCMgR4pZCsu3fL7tjD1zoZCtATkZCTuhvZB14H7HJoxFVZBz8N1sQ94b1mwqIHdZCDB5QzW4m47Fcb4OHRbOZCsVQG9VwULfpr8PVSkBBNdaWr901Ylc4ZCU86ysWz44MGYqZC7GIe5wqqyT4Jw9pZCsBB9wUL2PHUcZAABBBYJlWbpHwZDZD";
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
          action_source: "website"
        }
      ]
    })
  }
);
