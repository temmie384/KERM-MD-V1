/*
_  ______   _____ _____ _____ _   _
| |/ / ___| |_   _| ____/___ | | | |
| ' / |  _    | | |  _|| |   | |_| |
| . \ |_| |   | | | |__| |___|  _  |
|_|\_\____|   |_| |_____\____|_| |_|

ANYWAY, YOU MUST GIVE CREDIT TO MY CODE WHEN COPY IT
CONTACT ME HERE +237656520674
YT: KermHackTools
Github: Kgtech-cmr
*/

/*const config = require('../config');
const { cmd, commands } = require('../command');
const { downloadMediaMessage } = require('../lib/msg');

cmd({
    pattern: "save",
    desc: "Envoie le message multimédia sauvegardé dans le PM du bot.",
    category: "owner",
    react: "👀",
    filename: __filename
}, async (conn, mek, m, { from, quoted, reply, botNumber }) => {
    try {
        if (!quoted) return reply("❌ Répondez à un message multimédia pour le sauvegarder !");

        // Récupération du type de message cité
        const mediaType = Object.keys(quoted.message)[0];
        const stream = await downloadMediaMessage(quoted);

        if (!stream) return reply("❌ Échec du téléchargement du média.");

        let messageOptions = {};
        if (mediaType.includes('image')) {
            messageOptions = { image: stream, caption: quoted.msg.caption || '' };
        } else if (mediaType.includes('video')) {
            messageOptions = { video: stream, caption: quoted.msg.caption || '' };
        } else if (mediaType.includes('audio')) {
            messageOptions = { audio: stream, mimetype: 'audio/mp4', ptt: quoted.msg.ptt || false };
        } else if (mediaType.includes('document')) {
            messageOptions = { document: stream, mimetype: quoted.msg.mimetype, fileName: quoted.msg.fileName };
        } else {
            return reply("❌ Type de média non supporté pour la sauvegarde.");
        }

        // Récupération du JID du bot
        const botJid = conn.user.jid; // Utilisation du JID du bot (conn.user.jid)

        // Envoi dans le PM du bot en utilisant son JID
        await conn.sendMessage(botJid, messageOptions);
        reply("✅ Média sauvegardé et envoyé dans le PM du bot !");
    } catch (error) {
        console.error("Erreur lors de la sauvegarde :", error);
        reply("❌ Une erreur est survenue lors de la sauvegarde du média.");
    }
});*/


const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const { downloadMediaMessage } = require('../lib/msg');
const fs = require("fs");
/*
cmd({
    pattern: "save",
    desc: "Envoie le message multimédia sauvegardé dans le PM du bot.",
    category: "owner",
    react: "💾",
    filename: __filename
}, async (conn, mek, m, { from, quoted, reply, botNumber }) => {
    try {
        if (!quoted) return reply("❌");
        
        const mime = quoted.type;
        let ext, mediaType;
        
        if (mime === "imageMessage") {
            ext = "jpg";
            mediaType = "image";
        } else if (mime === "videoMessage") {
            ext = "mp4";
            mediaType = "video";
        } else if (mime === "audioMessage") {
            ext = "mp3";
            mediaType = "audio";
        } else if (mime === "documentMessage") {
            ext = quoted.msg.fileName.split('.').pop();
            mediaType = "document";
        } else {
            return reply("❌.");
        }

        var buffer = await quoted.download();
        var filePath = `${Date.now()}.${ext}`;

        fs.writeFileSync(filePath, buffer); 

        let messageOptions = {};
        messageOptions[mediaType] = fs.readFileSync(filePath);

        if (mediaType === "document") {
            messageOptions.mimetype = quoted.msg.mimetype;
            messageOptions.fileName = quoted.msg.fileName;
        } else if (mediaType === "audio") {
            messageOptions.mimetype = 'audio/mp4';
            messageOptions.ptt = quoted.msg.ptt || false;
        } else {
            messageOptions.caption = quoted.msg.caption || '';
        }

        // Récupération du JID du bot
        const botJid = conn.user.jid;
        console.log("JID du bot :", botJid);

        // Envoi dans le PM du bot en utilisant son JID
        await conn.sendMessage(botJid, messageOptions);
        reply("✅");
        
        fs.unlinkSync(filePath);

    } catch (error) {
        console.error("Erreur lors de la sauvegarde :", error);
        reply("❌ Une erreur est survenue lors de la sauvegarde du média.");
    }
});
*/

cmd({
  pattern: "save",
  react: "🍆",
  desc: "Save a status/photo/video and send it to your private chat.",
  category: "utility",
  filename: __filename,
}, async (conn, mek, m, { reply, quoted }) => {
  try {
    // Vérifie que l'utilisateur a répondu à un message contenant un média
    if (!quoted) {
      return reply("❌ Please reply to a status, photo or video message to save it.");
    }
    
    // Détermine le type de média à partir du mimetype
    let mime = (quoted.msg || quoted).mimetype || "";
    let mediaType = "";
    if (mime.startsWith("image")) {
      mediaType = "image";
    } else if (mime.startsWith("video")) {
      mediaType = "video";
    } else if (mime.startsWith("audio")) {
      mediaType = "audio";
    } else {
      return reply("❌ Unsupported media type. Please reply to a status, photo, or video message.");
    }
    
    // Télécharge le média depuis le message cité
    const mediaBuffer = await quoted.download();
    if (!mediaBuffer) return reply("❌ Failed to download the media.");

    // Prépare les options d'envoi selon le type de média
    let messageOptions = {};
    if (mediaType === "image") {
      messageOptions = { image: mediaBuffer };
    } else if (mediaType === "video") {
      messageOptions = { video: mediaBuffer, mimetype: 'video/mp4' };
    } else if (mediaType === "audio") {
      messageOptions = { audio: mediaBuffer, mimetype: 'audio/mpeg' };
    }
    
    // Envoie le média dans le chat privé de l'utilisateur (m.sender)
    await conn.sendMessage(m.sender, messageOptions, { quoted: m });
    reply("✅ Media saved to your private chat!");
    
  } catch (error) {
    console.error("Error in save command:", error);
    reply("❌ An error occurred while saving the media.");
  }
});
