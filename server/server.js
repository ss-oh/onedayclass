require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.post('/send-sms', async (req, res) => {
  const { name, phone, lesson } = req.body;
  const message = `[신청] ${name}님이 '${lesson}' 레슨 신청\n연락처: ${phone}`;

  try {
    const response = await axios.post(
      'https://api.coolsms.co.kr/messages/v4/send',
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
          Authorization: `HMAC ${process.env.API_KEY}:${process.env.API_SECRET}`,
          'Content-Type': 'application/json',
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