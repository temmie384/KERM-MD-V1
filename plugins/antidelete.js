const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const { downloadMediaMessage } = require('../lib/msg');
const fs = require("fs");

cmd({
  pattern: "antidelete",
  desc: "Activate anti-delete feature: Any deleted message in groups or DMs will be sent to your private chat (Owner only).",
  category: "utility",
  filename: __filename,
}, async (conn, mek, m, { isOwner, reply, isGroup, sender, from, quoted, participants }) => {
  if (!isOwner) return reply("❌ You are not the owner!");

  try {
    if (!quoted || !quoted.isDeleted) {
      return reply("❌ This command works automatically when a message is deleted.");
    }

    // Obtenir les informations sur l'utilisateur qui a supprimé le message
    const deleter = participants.find(p => p.id === sender) || { id: sender, name: "Inconnu" };
    const deleterName = deleter.name || deleter.id.split('@')[0];

    // Obtenir l'heure de la suppression
    const now = new Date();
    const time = now.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const date = now.toLocaleDateString("fr-FR");

    let mime = (quoted.msg || quoted).mimetype || "";
    let mediaType = "text";
    let mediaBuffer;

    if (mime.startsWith("image")) {
      mediaType = "image";
      mediaBuffer = await quoted.download();
    } else if (mime.startsWith("video")) {
      mediaType = "video";
      mediaBuffer = await quoted.download();
    } else if (mime.startsWith("audio")) {
      mediaType = "audio";
      mediaBuffer = await quoted.download();
    }

    let messageOptions = {};
    const infoMessage = `🛑 *Message supprimé détecté !*\n📩 *Expéditeur:* ${deleterName}\n🕒 *Heure de suppression:* ${time}, le ${date}\n📥 *Groupe ou DM:* ${from}`;

    if (mediaType === "text") {
      messageOptions = { text: `${infoMessage}\n\n💬 *Message supprimé:* ${quoted.text}` };
    } else if (mediaBuffer) {
      if (mediaType === "image") {
        messageOptions = { image: mediaBuffer, caption: infoMessage };
      } else if (mediaType === "video") {
        messageOptions = { video: mediaBuffer, caption: infoMessage, mimetype: 'video/mp4' };
      } else if (mediaType === "audio") {
        messageOptions = { audio: mediaBuffer, caption: infoMessage, mimetype: 'audio/mpeg' };
      }
    }

    // Envoie le message supprimé en privé à l'Owner
    await conn.sendMessage(m.sender, messageOptions);

  } catch (error) {
    console.error("Error in antidelete command:", error);
    reply("❌ An error occurred while processing the anti-delete feature.");
  }
});
