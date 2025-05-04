
import axios from 'axios';
import twilio from 'twilio';

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const USER_PHONE_NUMBER = process.env.USER_PHONE_NUMBER;

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
  try {
    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=London,GB&appid=${WEATHER_API_KEY}&units=metric`
    );

    const data = weatherRes.data;
    const today = data.list[0];
    const tonight = data.list.find(f => f.dt_txt.includes("21:00:00"));

    const temp = today.main.temp;
    const temp_min = tonight.main.temp_min;
    const wind = today.wind.speed;
    const rain = today.rain?.["3h"] || 0;

    let status = "Outside";
    if (temp_min < 10 || wind > 25 || rain > 3) {
      status = "Inside";
    }

    const hour = new Date().getUTCHours();
    if (hour >= 6 && hour <= 9) {
      await client.messages.create({
        body: `Avocado status for today: Keep it ${status.toLowerCase()} 🌱`,
        from: TWILIO_PHONE_NUMBER,
        to: USER_PHONE_NUMBER
      });
    }

    res.status(200).json({
      status,
      weather: {
        temp: Math.round(temp),
        temp_min: Math.round(temp_min),
        wind: Math.round(wind * 3.6),
        rain
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch weather or send SMS." });
  }
}
