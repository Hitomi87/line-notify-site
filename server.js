const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// 🔒 LINE Developers で発行したアクセストークンをここに入れてください
const LINE_TOKEN = 'zW0dB3ADZFDgPhu35wwk9IWydyzusOfEuactjRUCjP/8b3Soc6SZKirdPQVbPkMC5uw6XBWx/JwiGBFtwLCM21DXc0g11q9GWyOHqpwfDsFkqHPzm0EiHnA2aUpTi+jqp2lrzHArRZSL693E3eEKQgdB04t89/1O/w1cDnyilFU=';

// 🔒 通知を送るユーザーの userId（友だち追加済みのユーザー）
const USER_IDS = ['U40f32b0c55f8572e77335c9446adf26a'];

app.use(express.static('public'));

app.post('/notify', async (req, res) => {
  try {
    for (const userId of USER_IDS) {
      await axios.post(
        'https://api.line.me/v2/bot/message/push',
        {
          to: userId,
          messages: [{ type: 'text', text: 'Google Classroomから通知が届きました！' }]
        },
        {
          headers: {
            Authorization: `Bearer ${LINE_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('通知エラー:', error);
    res.sendStatus(500);
  }
});

app.use(express.json()); // これも上のほうに必要です（bodyの中身を使うため）

app.post('/webhook', (req, res) => {
  const events = req.body.events;
  if (events && events.length > 0) {
    const event = events[0];
    const userId = event.source.userId;
    console.log("ユーザーID:", userId); // ← ここに表示される
  }
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`サーバー起動中: http://localhost:${PORT}`);
});
