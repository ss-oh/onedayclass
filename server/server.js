require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// 원데이클래스 신청 엔드포인트
app.post("/send-sms-onedayclass", async (req, res) => {
  const { name, phone, lesson, schedule } = req.body;
  const message = `[레슨 신청 접수]\n이름: ${name}\n연락처: ${phone}\n나이 선택: ${lesson}\n일정: ${schedule}`;

  await sendSms(message, res);
});

// acegreen 신청 엔드포인트
app.post("/send-sms-acegreen", async (req, res) => {
  const { name, phone, schedule } = req.body;
  const message = `[신청접수]\n상호명: ${name}\n연락처: ${phone}\n지역: ${schedule}`;

  await sendSms(message, res);
});

// SMS 전송 함수
async function sendSms(message, res) {
  const apiKey = process.env.API_KEY;
  const apiSecret = process.env.API_SECRET;

  const date = new Date().toISOString();
  const salt = crypto.randomBytes(16).toString("hex");
  const dataToSign = date + salt;

  const signature = crypto.createHmac("sha256", apiSecret).update(dataToSign).digest("hex");
  const authorizationHeader = `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;

  try {
    const response = await axios.post(
      "https://api.coolsms.co.kr/messages/v4/send",
      {
        message: {
          to: process.env.MY_PHONE,
          from: process.env.SENDER_PHONE,
          text: message,
        },
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
}

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
