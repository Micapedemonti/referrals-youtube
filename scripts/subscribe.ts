import axios from "axios";
import "dotenv/config";

const HUB_URL = "https://pubsubhubbub.appspot.com/subscribe";
const CALLBACK_URL = `${process.env.PUBLIC_BASE_URL}/youtube/webhook`; 
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || ""; // Evitar el non-null assertion
const MODE = "subscribe"; // "subscribe" o "unsubscribe"

async function subscribe() {
  try {
    const response = await axios.post(
      HUB_URL,
      new URLSearchParams({
        "hub.callback": CALLBACK_URL,
        "hub.mode": MODE,
        "hub.topic": `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
        "hub.verify": "async",
        "hub.verify_token": process.env.YOUTUBE_WEBHOOK_TOKEN || "default_token",
        "hub.lease_seconds": "864000", // 10 días
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    console.log("✅ Suscripción enviada:", response.status, response.statusText);
  } catch (error) {
    console.error("❌ Error al suscribirse:", error.response?.data || error.message);
  }
}

subscribe();
