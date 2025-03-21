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

const fs = require("fs");
const path = require("path");
const { cmd, commands } = require('../command');

const mediaFolder = path.join(__dirname, "media_view_once");
if (!fs.existsSync(mediaFolder)) {
    fs.mkdirSync(mediaFolder);
}

cmd({
    pattern: "vv",
    react: "💾",
    alias: ["retrive", "viewonce"],
    desc: "Stocke et renvoie un message 'View Once' (image/vidéo/audio) de façon permanente.",
    category: "misc",
    use: "<query>",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        if (!m.quoted) {
            return reply("❌ Répondez à un message 'View Once' pour le stocker.");
        }

        const message = m.quoted.message;
        const messageId = m.quoted.id;

        let mediaType, extension;

        if (message.imageMessage?.viewOnce) {
            mediaType = "image";
            extension = "jpg";
        } else if (message.videoMessage?.viewOnce) {
            mediaType = "video";
            extension = "mp4";
        } else if (message.audioMessage) {
            mediaType = "audio";
            extension = "mp3";
        } else {
            return reply("❌ Type de média non pris en charge ou ce n'est pas un message 'View Once'.");
        }

        // Chemin de stockage du fichier
        const filePath = path.join(mediaFolder, `${messageId}.${extension}`);

        // Vérifier si le média est déjà stocké
        if (fs.existsSync(filePath)) {
            const buffer = fs.readFileSync(filePath);
            await conn.sendMessage(m.chat, { [mediaType]: buffer }, { quoted: m });
            return reply("✅ Média déjà stocké. Affichage du fichier.");
        }

        // Téléchargement du média "View Once"
        const buffer = await m.quoted.download();
        if (!buffer) {
            return reply("❌ Impossible de télécharger le média. Assurez-vous d'avoir bien répondu à un message 'View Once'.");
        }

        // Stockage du média
        fs.writeFileSync(filePath, buffer);

        // Envoi du média
        await conn.sendMessage(m.chat, { [mediaType]: buffer }, { quoted: m });
        reply("✅ Média téléchargé, stocké et affiché avec succès.");

    } catch (e) {
        console.error("Erreur de traitement :", e);
        reply("❌ Une erreur est survenue lors du traitement du message 'View Once'.");
    }
});
