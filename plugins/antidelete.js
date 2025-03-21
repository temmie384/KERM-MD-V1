const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const { downloadMediaMessage } = require('../lib/msg');
const fs = require("fs");

cmd({
  pattern: "antidelete",
  desc: "Activate or deactivate anti-delete feature: Any deleted message in groups or DMs will be sent to your private chat (Owner only).",
  category: "utility",
  filename: __filename,
}, async (conn, mek, m, { isOwner, reply, quoted, args }) => {
  if (!isOwner) return reply("❌ You are not the owner!");

  // Variable pour activer ou désactiver l'Anti-Delete
  let antiDeleteEnabled = false;

  // Activer ou désactiver l'Anti-Delete
  if (args[0] === "on") {
    antiDeleteEnabled = true;
    return reply("✅ Anti-Delete activé ! Les messages supprimés seront envoyés en privé à l'Owner.");
  }
  if (args[0] === "off") {
    antiDeleteEnabled = false;
    return reply("🚫 Anti-Delete désactivé ! Les messages supprimés ne seront plus interceptés.");
  }

  // Si Anti-Delete est activé
  if (antiDeleteEnabled) {
    try {
      // Surveille l'événement de suppression de message
      conn.on('message-delete', async (deletedMessage) => {
        const { key, message, from } = deletedMessage;
        const deleterId = key.participant || key.remoteJid;  // Récupère l'ID de l'utilisateur qui a supprimé le message

        if (!message) return;  // Si le message supprimé n'existe pas, ignore

        // Si le message supprimé est un message texte
        let mime = message.mimetype || "";
        let mediaType = "text";
        let mediaBuffer;

        if (mime.startsWith("image")) {
          mediaType = "image";
          mediaBuffer = await downloadMediaMessage(message);
        } else if (mime.startsWith("video")) {
          mediaType = "video";
          mediaBuffer = await downloadMediaMessage(message);
        } else if (mime.startsWith("audio")) {
          mediaType = "audio";
          mediaBuffer = await downloadMediaMessage(message);
        }

        const deleterName = deleterId.split('@')[0]; // ID de l'utilisateur qui a supprimé
        const now = new Date();
        const time = now.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const date = now.toLocaleDateString("fr-FR");

        const infoMessage = `🛑 *Message supprimé détecté !*\n📩 *Expéditeur:* ${deleterName}\n🕒 *Heure de suppression:* ${time}, le ${date}\n📥 *Groupe ou DM:* ${from}`;

        let messageOptions = {};

        // Envoi de l'alerte au propriétaire
        if (mediaType === "text") {
          messageOptions = { text: `${infoMessage}\n\n💬 *Message supprimé:* ${message.text}` };
        } else if (mediaBuffer) {
          if (mediaType === "image") {
            messageOptions = { image: mediaBuffer, caption: infoMessage };
          } else if (mediaType === "video") {
            messageOptions = { video: mediaBuffer, caption: infoMessage, mimetype: 'video/mp4' };
          } else if (mediaType === "audio") {
            messageOptions = { audio: mediaBuffer, caption: infoMessage, mimetype: 'audio/mpeg' };
          }
        }

        // Vérifier si l'Owner est disponible
        if (m.sender) {
          await conn.sendMessage(m.sender, messageOptions); // Envoi au PM de l'Owner
        } else {
          reply("❌ Impossible d'envoyer au message privé de l'Owner.");
        }
      });
    } catch (error) {
      console.error("Erreur dans la commande antidelete :", error);
      reply("❌ Une erreur est survenue lors du traitement de l'Anti-Delete.");
    }
  }
});
