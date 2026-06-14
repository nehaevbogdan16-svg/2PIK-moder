require("dotenv").config();

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

const bannedWords = [

  "спам",

  "реклама",

  "скам"

];

const warnings = new Map();

bot.on("text", async (ctx) => {

  try {

    if (!ctx.chat || ctx.chat.type === "private") {

      return;

    }

    const text = ctx.message.text.toLowerCase();

    const userId = ctx.from.id;

    const foundWord = bannedWords.find(word =>

      text.includes(word)

    );

    if (!foundWord) {

      return;

    }

    await ctx.deleteMessage();

    const currentWarnings =

      (warnings.get(userId) || 0) + 1;

    warnings.set(userId, currentWarnings);

    await ctx.reply(

      `⚠️ ${ctx.from.first_name}, предупреждение ${currentWarnings}/3`

    );

    if (currentWarnings >= 3) {

      const untilDate =

        Math.floor(Date.now() / 1000) +

        24 * 60 * 60;

      await ctx.telegram.restrictChatMember(

        ctx.chat.id,

        userId,

        {

          permissions: {

            can_send_messages: false

          },

          until_date: untilDate

        }

      );

      await ctx.reply(

        `🔇 ${ctx.from.first_name} получил мут на 24 часа`

      );

    }

  } catch (err) {

    console.error(err);

  }

});

bot.command("warn", async (ctx) => {

  try {

    if (!ctx.message.reply_to_message) {

      return ctx.reply(

        "Ответьте на сообщение пользователя командой /warn"

      );

    }

    const userId =

      ctx.message.reply_to_message.from.id;

    const count =

      (warnings.get(userId) || 0) + 1;

    warnings.set(userId, count);

    await ctx.reply(

      `⚠️ Предупреждение выдано. Всего: ${count}`

    );

  } catch (err) {

    console.error(err);

  }

});

bot.command("unmute", async (ctx) => {

  try {

    if (!ctx.message.reply_to_message) {

      return;

    }

    const userId =

      ctx.message.reply_to_message.from.id;

    await ctx.telegram.restrictChatMember(

      ctx.chat.id,

      userId,

      {

        permissions: {

          can_send_messages: true,

          can_send_audios: true,

          can_send_documents: true,

          can_send_photos: true,

          can_send_videos: true,

          can_send_video_notes: true,

          can_send_voice_notes: true,

          can_send_polls: true,

          can_send_other_messages: true,

          can_add_web_page_previews: true

        }

      }

    );

    await ctx.reply("✅ Пользователь размучен");

  } catch (err) {

    console.error(err);

  }

});

bot.launch();

console.log("Moderator bot started");
