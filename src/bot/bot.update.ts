import { Update, Start, Ctx, On } from 'nestjs-telegraf';
import { UserService } from '../user/user.service';
import { CountryService } from '../country/country.service';
import { UserRole } from '../user/enum/enum.role';
import { Context, Markup } from 'telegraf';

@Update()
export class BotUpdate {
  constructor(
    private readonly userService: UserService,
    private readonly countryService: CountryService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context): Promise<any> {
    if (!ctx.from) {
      return ctx.reply('❗️ Foydalanuvchi maʼlumotlari topilmadi.');
    }

    const tgId = ctx.from.id;
    const username = ctx.from.username || '';
    const firstName = ctx.from.first_name || '';

    let user = await this.userService.findByTelegramId(tgId);

    if (!user) {
      user = await this.userService.create({
        telegramId: tgId,
        username,
        firstName,
        phoneNumber: '',
      });

      return ctx.reply(
        `👋 Assalomu alaykum, ${firstName}!\n\nSiz muvaffaqiyatli ro'yxatdan o'tdingiz.\nIltimos, telefon raqamingizni yuboring.`,
        Markup.keyboard([
          [Markup.button.contactRequest('📞 Telefon raqamni yuborish')],
          ['❌ Bekor qilish'],
        ])
          .oneTime()
          .resize(),
      );
    }

    if (!user.phoneNumber) {
      return ctx.reply(
        `🔔 Salom, ${user.firstName}!\nTelefon raqamingiz hali kiritilmagan.\nIltimos, quyidagi tugma orqali raqamingizni yuboring.`,
        Markup.keyboard([
          [Markup.button.contactRequest('📞 Telefon raqamni yuborish')],
          ['❌ Bekor qilish'],
        ])
          .oneTime()
          .resize(),
      );
    }

    const createdAtStr = (user as any).createdAt
      ? new Date((user as any).createdAt).toLocaleString()
      : 'Nomaʼlum';

    const infoText = `👤 Siz haqingizdagi maʼlumotlar:\n` +
      `- Ism: ${user.firstName}\n` +
      `- Telegram username: @${user.username || 'yo‘q'}\n` +
      `- Telefon: ${user.phoneNumber}\n` +
      `- Rol: ${user.role}\n` +
      `- Ro‘yxatdan o‘tgan vaqti: ${createdAtStr}`;

    if (user.role === UserRole.ADMIN) {
      return ctx.reply(
        `👋 Assalomu alaykum, Admin ${user.firstName}!\n\n` +
          `Bot buyruqlari:\n` +
          `• /list - davlatlar ro'yxati\n` +
          `• /add - yangi davlat qo‘shish\n` +
          `• /update - davlat nomini o‘zgartirish\n` +
          `• /delete - davlatni o‘chirish\n\n` +
          infoText,
        Markup.keyboard([
          ['/list', '/add', '/update', '/delete'],
          ['🔄 Kontaktni yangilash'],
          ['❌ Bekor qilish'],
        ])
          .oneTime()
          .resize(),
      );
    }

    return ctx.reply(
      `👋 Assalomu alaykum, ${user.firstName}!\n\n` +
      `/list buyrug‘i orqali mavjud davlatlarni ko‘rishingiz mumkin.\n\n` +
      infoText,
      Markup.keyboard([
        ['/list'],
        ['🔄 Kontaktni yangilash'],
        ['❌ Bekor qilish'],
      ])
        .oneTime()
        .resize(),
    );
  }

  @On('contact')
  async onContact(
    ctx: Context & { message: { contact: { phone_number: string; user_id: number } } },
  ): Promise<any> {
    if (!ctx.from) return ctx.reply('❗️ Foydalanuvchi maʼlumotlari topilmadi.');

    const tgId = ctx.from.id;
    const user = await this.userService.findByTelegramId(tgId);
    if (!user) return ctx.reply('Iltimos, /start buyrug‘ini bosing.');

    const phoneNumber = ctx.message.contact.phone_number;

    // @ts-ignore
    await this.userService.update(user._id.toString(), { phoneNumber });

    await ctx.reply(
      `✅ Telefon raqamingiz muvaffaqiyatli saqlandi: ${phoneNumber}`,
      Markup.removeKeyboard(),
    );

    return this.onStart(ctx);
  }

  @On('text')
  async onText(@Ctx() ctx: Context & { message: { text: string } }): Promise<any> {
    if (!ctx.from) return ctx.reply('❗️ Foydalanuvchi maʼlumotlari topilmadi.');

    const text = ctx.message.text.trim();
    const tgId = ctx.from.id;
    const user = await this.userService.findByTelegramId(tgId);
    if (!user) return ctx.reply('Iltimos, /start buyrug‘ini bosing.');

    // Bekor qilish tugmasi
    if (text === '❌ Bekor qilish') {
      await ctx.reply(
        'Operatsiya bekor qilindi.',
        Markup.removeKeyboard(),
      );
      return this.onStart(ctx);
    }

    if (text === '/list') {
      const countries = await this.countryService.findAll();
      if (!countries.length) return ctx.reply('📭 Hech qanday davlat mavjud emas.');

      const result = countries
        .map(
          c =>
            `🌍 <b>${c.name}</b> (${c.code})\n👥 Aholi: ${c.population}\n📐 Maydon: ${c.area} km²`,
        )
        .join('\n\n');

      return ctx.replyWithHTML(result);
    }

    if (user.role === UserRole.ADMIN && text.startsWith('/add ')) {
      const parts = text.split(' ');
      if (parts.length < 5)
        return ctx.reply(
          '❗ Buyruq formati noto‘g‘ri.\nTo‘g‘ri format: /add name code population area',
        );

      const [, name, code, population, area] = parts;

      try {
        await this.countryService.createCountry({
          name,
          code,
          population: Number(population),
          area: Number(area),
        });
        return ctx.reply(`✅ Davlat muvaffaqiyatli qo‘shildi: ${name}`);
      } catch (e: any) {
        return ctx.reply(`⚠️ Xatolik yuz berdi: ${e.message}`);
      }
    }

    if (user.role === UserRole.ADMIN && text.startsWith('/update ')) {
      const parts = text.split(' ');
      if (parts.length < 3)
        return ctx.reply('❗ Buyruq formati noto‘g‘ri.\nTo‘g‘ri format: /update oldName newName');

      const [, oldName, ...newNameParts] = parts;
      const newName = newNameParts.join(' ');
      const countries = await this.countryService.findAll();
      const country = countries.find(c => c.name === oldName);

      if (!country) return ctx.reply('❌ Bunday davlat topilmadi');

      country.name = newName;
      await country.save();

      return ctx.reply(`🔄 Davlat nomi yangilandi: ${oldName} → ${newName}`);
    }

    if (user.role === UserRole.ADMIN && text.startsWith('/delete ')) {
      const name = text.replace('/delete ', '').trim();
      const countries = await this.countryService.findAll();
      const country = countries.find(c => c.name === name);

      if (!country) return ctx.reply('❌ Davlat topilmadi');

      await country.deleteOne();

      return ctx.reply(`🗑️ Davlat o‘chirildi: ${name}`);
    }

    if (text === '🔄 Kontaktni yangilash') {
      return ctx.reply(
        `📞 Iltimos, yangi telefon raqamingizni yuboring.`,
        Markup.keyboard([
          [Markup.button.contactRequest('📞 Telefon raqamini yuborish')],
          ['❌ Bekor qilish'],
        ])
          .oneTime()
          .resize(),
      );
    }

    return ctx.reply('❗ Noto‘g‘ri buyruq. Iltimos, yordam uchun /start buyrug‘ini bosing.');
  }
}
