from telegram import Update

from telegram.ext import (

    Application,

    MessageHandler,

    ContextTypes,

    filters,

)

TOKEN = "8992460588:AAHDOPItg7522yveDmfIGpr6dy56wJk9Tqw"

BAD_WORDS = [

    "спам",

    "реклама",

    "мат1",

    "мат2",

]

warnings = {}

async def moderate(update: Update, context: ContextTypes.DEFAULT_TYPE):

    if not update.message:

        return

    text = update.message.text.lower()

    for word in BAD_WORDS:

        if word in text:

            user = update.effective_user

            await update.message.delete()

            user_id = user.id

            warnings[user_id] = warnings.get(user_id, 0) + 1

            count = warnings[user_id]

            await context.bot.send_message(

                chat_id=update.effective_chat.id,

                text=f"⚠️ {user.first_name}, предупреждение {count}/3"

            )

            if count >= 3:

                await context.bot.restrict_chat_member(

                    chat_id=update.effective_chat.id,

                    user_id=user_id,

                    permissions={}

                )

                await context.bot.send_message(

                    chat_id=update.effective_chat.id,

                    text=f"🔇 {user.first_name} получил мут."

                )

            break

app = Application.builder().token(TOKEN).build()

app.add_handler(

    MessageHandler(filters.TEXT & ~filters.COMMAND, moderate)

)

app.run_polling()
