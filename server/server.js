require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.post("/send-sms", async (req, res) => {
  const { name, phone, lesson } = req.body;
  const message = `[신청] ${name}님이 '${lesson}' 레슨 신청\n연락처: ${phone}`;

  const apiKey = process.env.API_KEY;
  const apiSecret = process.env.API_SECRET;

  const date = new Date().toISOString(); // ISO 8601 포맷
  const salt = crypto.randomBytes(16).toString("hex"); // 32자리 랜덤 문자열
  const dataToSign = date + salt;

  // HMAC-SHA256 서명 생성
  const signature = crypto.createHmac("sha256", apiSecret).update(dataToSign).digest("hex");

  const authorizationHeader = `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;

  try {
    const response = await axios.post(
      "https://api.coolsms.co.kr/messages/v4/send",
      {
        messages: [
          {
            to: process.env.MY_PHONE,
            from: process.env.SENDER_PHONE,
            text: message,
          },
        ],
      },
      {
        headers: {
          Authorization: authorizationHeader,
          "Content-Type": "application/json",
        },
      }
    );

    res.send({ success: true, data: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
