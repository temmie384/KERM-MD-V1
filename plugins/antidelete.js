const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const { downloadMediaMessage } = require('../lib/msg');
const fs = require("fs");

// Variable pour activer ou désactiver l'Anti-Delete
let antiDeleteEnabled = false;

cmd({
  pattern: "antidelete",
  desc: "Activate or deactivate anti-delete feature: Any deleted message in groups or DMs will be sent to your private chat (Owner only).",
  category: "utility",
  filename: __filename,
}, async (conn, mek, m, { isOwner, reply, args, isGroup, sender, from, quoted, participants }) => {
  if (!isOwner) return reply("❌ You are not the owner!");

  // Activation ou désactivation de l'Anti-Delete
  if (args[0] === "on") {
    antiDeleteEnabled = true;
    return reply("✅ Anti-Delete activé ! Les messages supprimés seront envoyés en privé à l'Owner.");
  }
  if (args[0] === "off") {
    antiDeleteEnabled = false;
    return reply("🚫 Anti-Delete désactivé ! Les messages supprimés ne seront plus interceptés.");
  }

  // Vérification de l'état d'activation avant d'exécuter
  if (!antiDeleteEnabled) return;

  try {
    if (!quoted || !quoted.isDeleted) return;

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

    const infoMessage = `🛑 *Message supprimé détecté !*\n📩 *Expéditeur:* ${deleterName}\n🕒 *Heure de suppression:* ${time}, le ${date}\n📥 *Groupe ou DM:* ${from}`;
    let messageOptions = {};

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
    console.error("Erreur dans la commande antidelete :", error);
    reply("❌ Une erreur est survenue lors du traitement de l'Anti-Delete.");
  }
});
