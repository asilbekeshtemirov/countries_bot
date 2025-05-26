import { Action, Ctx, InjectBot, Message, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { UserService } from '../modules/user/user.service';
import { CountryService } from '../modules/country/country.service';
import { Markup } from 'telegraf';

@Update()
export class BotUpdate {
  constructor(
    private readonly userService: UserService,
    private readonly countryService: CountryService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    await ctx.reply('Iltimos, kontakt yuboring', Markup.keyboard([
      Markup.button.contactRequest('📱 Kontakt yuborish')
    ]).resize());
  }

  @Message('contact')
  async onContact(@Ctx() ctx: Context) {
    const telegramId = String(ctx.from.id);
    const fullName = `${ctx.from.first_name || ''} ${ctx.from.last_name || ''}`.trim();
    const phoneNumber = ctx.message.contact.phone_number;

    const existing = await this.userService.findByTelegramId(telegramId);
    if (!existing) {
      await this.userService.create({ telegramId, fullName, phoneNumber, role: 'USER' });
    }

    await this.showMenu(ctx);
  }

  async showMenu(ctx: Context) {
    const user = await this.userService.findByTelegramId(String(ctx.from.id));
    if (user?.role === 'ADMIN') {
      await ctx.reply('Admin panel:', Markup.inlineKeyboard([
        [Markup.button.callback('➕ Davlat qo‘shish', 'add_country')],
        [Markup.button.callback('📄 Barcha davlatlar', 'list_countries')],
      ]));
    } else {
      await ctx.reply('Davlatlar ro‘yxati:', Markup.inlineKeyboard([
        [Markup.button.callback('📄 Davlatlar', 'list_countries')],
      ]));
    }
  }

  @Action('list_countries')
  async listCountries(@Ctx() ctx: Context) {
    const countries = await this.countryService.findAll();
    if (!countries.length) return ctx.reply('Davlatlar topilmadi.');

    const buttons = countries.map(c => [Markup.button.callback(c.name, `country_${c._id}`)]);
    await ctx.editMessageText('Davlatlar:', Markup.inlineKeyboard(buttons));
  }

  @Action(/^country_\w+/)
  async showCountry(@Ctx() ctx: Context) {
    const countryId = ctx.callbackQuery['data'].split('_')[1];
    const country = await this.countryService.findById(countryId);
    if (!country) return ctx.reply('Davlat topilmadi.');

    await ctx.editMessageText(
      `🌍 ${country.name}
🏙 Poytaxt: ${country.capital}
👥 Aholi: ${country.population}`
    );
  }

  @Action('add_country')
  async addCountry(@Ctx() ctx: Context) {
    await ctx.reply('Davlat nomini yuboring:');
  }
}
