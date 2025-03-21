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

/*const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');

const fs = require("fs");

cmd({
    pattern: "vv",
    react: "💾",
    alias: ["retrive", "viewonce"],
    desc: "Fetch and resend a ViewOnce message content (image/video/voice).",
    category: "misc",
    use: "<query>",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        if (!m.quoted) return reply("Please reply to a ViewOnce message.");

        const mime = m.quoted.type;
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
        } else {
            return reply("Unsupported media type. Please reply to an image, video, or audio message.");
        }

        var buffer = await m.quoted.download();
        var filePath = `${Date.now()}.${ext}`;

        fs.writeFileSync(filePath, buffer); 

        let mediaObj = {};
        mediaObj[mediaType] = fs.readFileSync(filePath);

        await conn.sendMessage(m.chat, mediaObj);

        fs.unlinkSync(filePath);

    } catch (e) {
        console.log("Error:", e);
        reply("An error occurred while fetching the ViewOnce message.", e);
    }
});*/

const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const fs = require("fs");

cmd({
    pattern: "vv",
    react: "💾",
    alias: ["retrive", "viewonce"],
    desc: "Fetch and resend a ViewOnce message content (image/video/voice).",
    category: "misc",
    use: "<query>",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        if (!m.quoted) return reply("Répondez à un message 'View Once'.");

        const message = m.quoted.message;
        let mediaType, buffer;

        if (message.imageMessage) {
            mediaType = "image";
        } else if (message.videoMessage) {
            mediaType = "video";
        } else if (message.audioMessage) {
            mediaType = "audio";
        } else {
            return reply("Type de média non supporté. Répondez à une image, vidéo ou audio.");
        }

        buffer = await m.quoted.download();
        if (!buffer) return reply("Impossible de télécharger le média.");

        // Envoi du média téléchargé
        let mediaObj = {};
        mediaObj[mediaType] = buffer;

        await conn.sendMessage(m.chat, mediaObj, { quoted: m });

    } catch (e) {
        console.error("Erreur :", e);
        reply("Une erreur est survenue lors de la récupération du message 'View Once'.");
    }
});
