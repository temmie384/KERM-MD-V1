const { fetchJson } = require('../lib/functions');
const { cmd } = require('../command');
const axios = require('axios');
// 🟠 Command to download from XNXX
cmd(
  {
    pattern: 'xnxxdown',
    alias: ['dlxnxx', 'xnxxdl'],
    react: '📥',
    desc: 'Download videos from XNXX',
    category: 'nsfw',
    use: '.xnxx <link>',
    filename: __filename,
  },
  async (conn, mek, m, { args, reply }) => {
    try {
      if (!args[0]) return reply('*❌ Please provide a valid XNXX link!*');

      const url = args[0];
      const response = await fetchJson(`https://www.dark-yasiya-api.site/download/xnxx?url=${url}`);

      console.log('XNXX API Response:', response); // Debugging

      if (!response?.result?.files?.high) {
        return reply('*❌ Unable to fetch the video. The link may be invalid or the API is not responding.*');
      }

      await conn.sendMessage(
        m.from,
        { video: { url: response.result.files.high }, caption: `📌 *Title:* ${response.result.title}` },
        { quoted: mek }
      );

    } catch (error) {
      console.error('XNXX Error:', error);
      reply('*❌ An error occurred while downloading. Please try again later.*');
    }
  }
);

// 🔵 Command to download from XVideos
cmd(
  {
    pattern: 'xvdown',
    alias: ['dlxv', 'xvdl'],
    react: '📥',
    desc: 'Download videos from XVideos',
    category: 'nsfw',
    use: '.xv <link>',
    filename: __filename,
  },
  async (conn, mek, m, { args, reply }) => {
    try {
      if (!args[0]) return reply('*❌ Please provide a valid XVideos link!*');

      const url = args[0];
      const response = await fetchJson(`https://www.dark-yasiya-api.site/download/xvideo?url=${url}`);

      console.log('XVideos API Response:', response); // Debugging

      if (!response?.result?.dl_link) {
        return reply('*❌ Unable to fetch the video. The link may be invalid or the API is not responding.*');
      }

      const { title, views, like, deslike, size, dl_link } = response.result;

      const caption = `
      📌 *Title:* ${title}
      👀 *Views:* ${views}
      👍 *Likes:* ${like}
      👎 *Dislikes:* ${deslike}
      📂 *Size:* ${size}
      `;

      await conn.sendMessage(
        m.from,
        { video: { url: dl_link }, caption },
        { quoted: mek }
      );

    } catch (error) {
      console.error('XVideos Error:', error);
      reply('*❌ An error occurred while downloading. Please try again later.*');
    }
  }
);