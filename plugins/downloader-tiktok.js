import ffmpeg from "fluent-ffmpeg";

var handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `*[❗] مثال: ${
      usedPrefix + command
    } https://www.tiktok.com/@tuanliebert/video/7313159590349212934?is_from_webapp=1&sender_device=pc`;
  }

  try {
    await conn.reply(
      m.chat,
      "انتظر قليلاً، يتم تنزيل الفيديو...",
      m,
    );

    const tiktokData = await tiktokdl(args[0]);

    if (!tiktokData) {
      throw "فشل في تنزيل الفيديو!";
    }

    const videoURL = tiktokData.data.play;

    const videoURLWatermark = tiktokData.data.wmplay;

    const infonya_gan = `العنوان: ${tiktokData.data.title}\nالتحميل: ${
      tiktokData.data.create_time
    }\n\nالحالة:\n=====================\nالإعجابات = ${
      tiktokData.data.digg_count
    }\nالتعليقات = ${tiktokData.data.comment_count}\nالمشاركات = ${
      tiktokData.data.share_count
    }\nالمشاهدات = ${tiktokData.data.play_count}\nالتحميلات = ${
      tiktokData.data.download_count
    }\n=====================\n\nالناشر: ${
      tiktokData.data.author.nickname || "لا توجد معلومات عن الكاتب"
    }\n(${tiktokData.data.author.unique_id} - https://www.tiktok.com/@${
      tiktokData.data.author.unique_id
    })\nالصوت: ${
      tiktokData.data.music
    }\n`;

    if (videoURL || videoURLWatermark) {
      await conn.sendFile(
        m.chat,
        videoURL,
        "tiktok.mp4",
        `ها هو الفيديو\n\n${infonya_gan}`,
        m,
      );
      setTimeout(async () => {
        await conn.sendFile(
          m.chat,
          videoURLWatermark,
          "tiktokwm.mp4",
          `*هذه النسخة مع العلامة المائية*\n\n${infonya_gan}`,
          m,
        );
        await conn.sendFile(
          m.chat,
          `${tiktokData.data.music}`,
          "lagutt.mp3",
          "هذا هو الصوت",
          m,
        );
        conn.reply(
          m.chat,
          "قم تلبية طلبك تابعني على إنستجرام \n \n https://instagram.com/7vkoq",
          m,
        );
      }, 1500);
    } else {
      throw "لا توجد روابط فيديو متاحة.";
    }
  } catch (error1) {
      conn.reply(m.chat, `خطأ: ${error1}`, m);
    }
  };

async function convertVideoToMp3(videoUrl, outputFileName) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoUrl)
      .toFormat("mp3")
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .save(outputFileName);
  });
}

handler.help = ["tiktok"].map((v) => v + " <url>");
handler.tags = ["downloader"];
handler.command = /^t(t|iktok(d(own(load(er)?)?|l))?|td(own(load(er)?)?|l))$/i;

export default handler;

async function tiktokdl(url) {
  let tikwm = `https://www.tikwm.com/api/?url=${url}?hd=1`
  let response = await (await fetch(tikwm)).json() 
  return response
}