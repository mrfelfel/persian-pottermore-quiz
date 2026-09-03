// ── Houses ──────────────────────────────────────────────

export type HouseId = 'gryffindor' | 'ravenclaw' | 'hufflepuff' | 'slytherin';

export interface House {
  id: HouseId;
  name: string;
  nameEn: string;
  founder: string;
  trait: string;
  color: string;
  colorBg: string;
  emoji: string;
}

export const HOUSES: Record<HouseId, House> = {
  gryffindor: { id: 'gryffindor', name: 'گریفیندور', nameEn: 'Gryffindor', founder: 'گودریک گریفیندور', trait: 'شجاعت و جسارت', color: '#740001', colorBg: '#ae0001', emoji: '\u{1F981}' },
  ravenclaw: { id: 'ravenclaw', name: 'ریونکلاو', nameEn: 'Ravenclaw', founder: 'روئنا ریونکلاو', trait: 'خرد و خلاقیت', color: '#000a60', colorBg: '#222f5b', emoji: '\u{1F985}' },
  hufflepuff: { id: 'hufflepuff', name: 'هاگلپاف', nameEn: 'Hufflepuff', founder: 'هلگا هاگلپاف', trait: 'وفاداری و صبر', color: '#ecb939', colorBg: '#f0c75e', emoji: '\u{1F9A1}' },
  slytherin: { id: 'slytherin', name: 'اسلیترین', nameEn: 'Slytherin', founder: 'سالازار اسلیترین', trait: 'زیرکی و جاه‌طلبی', color: '#1a472a', colorBg: '#2a623d', emoji: '\u{1F40D}' },
};

// ── Currency ────────────────────────────────────────────

export interface Currency {
  galleons: number;
  sickles: number; // دراخما
  knuts: number;   // کnut
}

export function currencyStr(c: Currency): string {
  return `${c.galleons} گالیون | ${c.sickles} دراخما | ${c.knuts} کنت`;
}

export function addToCurrency(a: Currency, b: Currency): Currency {
  let knuts = a.knuts + b.knuts;
  let sickles = a.sickles + b.sickles + Math.floor(knuts / 29);
  knuts %= 29;
  let galleons = a.galleons + b.galleons + Math.floor(sickles / 17);
  sickles %= 17;
  return { galleons, sickles, knuts };
}

export function subtractCurrency(a: Currency, b: Currency): Currency | null {
  const totalA = a.galleons * 17 * 29 + a.sickles * 29 + a.knuts;
  const totalB = b.galleons * 17 * 29 + b.sickles * 29 + b.knuts;
  if (totalA < totalB) return null;
  const diff = totalA - totalB;
  const galleons = Math.floor(diff / (17 * 29));
  const rem = diff % (17 * 29);
  const sickles = Math.floor(rem / 29);
  const knuts = rem % 29;
  return { galleons, sickles, knuts };
}

// ── Departments ─────────────────────────────────────────

export type DeptId =
  | 'execution' | 'international' | 'investigation' | 'gringotts'
  | 'muggle' | 'accidents' | 'law' | 'records'
  | 'prophecy' | 'magical_creatures' | 'sports' | 'education'
  | 'transport' | 'weather' | 'press' | 'security'
  | 'health' | 'diplomatic' | 'economic' | 'intelligence'
  | 'cultural' | 'technology' | 'archive' | 'ceremony'
  | 'quidditch' | 'programming';

export interface Department {
  id: DeptId;
  name: string;
  nameEn: string;
  emoji: string;
  description: string;
}

export const DEPARTMENTS: Record<DeptId, Department> = {
  execution: { id: 'execution', name: 'اداره اجرای قوانین جادویی', nameEn: 'Law Enforcement', emoji: '\u{2694}', description: 'نظارت بر اجرای قوانین جادویی و مبارزه با سوءاستفاده از جادو' },
  international: { id: 'international', name: 'اداره همکاری‌های بین‌المللی', nameEn: 'International Cooperation', emoji: '\u{1F30D}', description: 'ارتباط با وزارتخانه‌های جادویی سایر کشورها' },
  investigation: { id: 'investigation', name: 'اداره تحقیقات ویژه', nameEn: 'Special Investigations', emoji: '\u{1F50D}', description: 'بررسی جرایم جادویی پیچیده و موارد خاص' },
  gringotts: { id: 'gringotts', name: 'گرینگوتس', nameEn: 'Gringotts Bank', emoji: '\u{1F3E6}', description: 'بانک جادوگران و مدیریت اقتصاد جامعه' },
  muggle: { id: 'muggle', name: 'اداره ماگل‌شناسی', nameEn: 'Muggle Affairs', emoji: '\u{1F468}‍\u{1F4BC}', description: 'حفظ رازداری در برابر ماگل‌ها و نظارت بر تعاملات' },
  accidents: { id: 'accidents', name: 'اداره حوادث جادویی', nameEn: 'Magical Accidents', emoji: '\u{26A0}', description: 'رسیدگی به حوادث جادویی و مهار آنها' },
  law: { id: 'law', name: 'اداره قوانین بین‌الملل', nameEn: 'International Law', emoji: '\u{2696}', description: 'تهیه و بازنگری قوانین جادویی بین‌المللی' },
  records: { id: 'records', name: 'ثبت احوال جادویی', nameEn: 'Magical Records', emoji: '\u{1F4DD}', description: 'ثبت تولد، مرگ و رویدادهای جادویی' },
  prophecy: { id: 'prophecy', name: 'اداره پیشگویی', nameEn: 'Prophecy', emoji: '\u{1F52E}', description: 'نگهداری و بررسی پیشگویی‌ها' },
  magical_creatures: { id: 'magical_creatures', name: 'اداره موجودات جادویی', nameEn: 'Magical Creatures', emoji: '\u{1F43E}', description: 'حفاظت و طبقه‌بندی موجودات جادویی' },
  sports: { id: 'sports', name: 'اداره ورزش‌های جادویی', nameEn: 'Magical Sports', emoji: '\u{1F3C6}', description: 'سازماندهی مسابقات و ورزش‌های جادویی' },
  education: { id: 'education', name: 'اداره آموزش', nameEn: 'Education', emoji: '\u{1F4D6}', description: 'نظارت بر مدارس جادویی و برنامه‌های درسی' },
  transport: { id: 'transport', name: 'اداره حمل‌ونقل جادویی', nameEn: 'Magical Transport', emoji: '\u{1F682}', description: 'مدیریت وسایل حمل‌ونقل جادویی' },
  weather: { id: 'weather', name: 'اداره آب‌وهوای جادویی', nameEn: 'Magical Weather', emoji: '\u{26C8}', description: 'کنترل و پیش‌بینی آب‌وهوای جادویی' },
  press: { id: 'press', name: 'روزنامه فانتزی ایران', nameEn: 'Fantasy Press', emoji: '\u{1F4F0}', description: 'نشریه رسمی جامعه جادوگری ایران' },
  security: { id: 'security', name: 'اداره امنیت', nameEn: 'Security', emoji: '\u{1F6E1}', description: 'حفاظت از وزارتخانه و مقامات جادویی' },
  health: { id: 'health', name: 'اداره بهداشت جادویی', nameEn: 'Magical Health', emoji: '\u{2695}', description: 'نظارت بر بیمارستان‌ها و درمانگاه‌های جادویی' },
  diplomatic: { id: 'diplomatic', name: 'اداره دیپلماسی', nameEn: 'Diplomatic Corps', emoji: '\u{1F54C}', description: 'روابط دیپلماتیک با جوامع جادویی جهان' },
  economic: { id: 'economic', name: 'اداره اقتصاد جادویی', nameEn: 'Magical Economy', emoji: '\u{1F4B0}', description: 'نظارت بر اقتصاد و تجارت جادویی' },
  intelligence: { id: 'intelligence', name: 'اداره اطلاعات', nameEn: 'Intelligence', emoji: '\u{1F441}', description: 'جمع‌آوری و تحلیل اطلاعات جادویی' },
  cultural: { id: 'cultural', name: 'اداره فرهنگ و هنر', nameEn: 'Culture & Arts', emoji: '\u{1F3AD}', description: 'ترویج فرهنگ و هنر جادویی' },
  technology: { id: 'technology', name: 'اداره تکنولوژی جادویی', nameEn: 'Magical Technology', emoji: '\u{1F527}', description: 'توسعه ابزارها و فناوری‌های جادویی' },
  archive: { id: 'archive', name: 'آرشیو وزارت', nameEn: 'Ministry Archive', emoji: '\u{1F4DA}', description: 'نگهداری اسناد و مدارک تاریخی وزارت' },
  ceremony: { id: 'ceremony', name: 'اداره تشریفات', nameEn: 'Ceremonies', emoji: '\u{1F389}', description: 'برگزاری مراسم و جشن‌های رسمی' },
  quidditch: { id: 'quidditch', name: 'اداره کوییدیچ', nameEn: 'Quidditch', emoji: '\u{1F3D3}', description: 'سازماندهی لیگ‌ها و مسابقات کوییدیچ' },
  programming: { id: 'programming', name: 'اداره برنامه‌نویسی', nameEn: 'Programming', emoji: '\u{1F4BB}', description: 'توسعه و نگهداری سیستم‌های فنی وزارت' },
};

// ── Classes ─────────────────────────────────────────────

export type ClassId =
  | 'defense' | 'divination' | 'history' | 'charms'
  | 'potions' | 'transfiguration' | 'herbology' | 'muggle'
  | 'flying' | 'astronomy' | 'creatures' | 'geography'
  | 'singing' | 'math';

export interface MagicClass {
  id: ClassId;
  name: string;
  emoji: string;
  description: string;
  xpPerLesson: number;
}

export const MAGIC_CLASSES: Record<ClassId, MagicClass> = {
  defense: { id: 'defense', name: 'دفاع در برابر جادوی سیاه', emoji: '\u{1F6E1}', description: 'یادگیری دفاع در برابر موجودات و جادوهای تاریک', xpPerLesson: 15 },
  divination: { id: 'divination', name: 'طالع‌بینی', emoji: '\u{1F52E}', description: 'پیش‌بینی آینده از طریق نشانه‌ها', xpPerLesson: 10 },
  history: { id: 'history', name: 'تاریخ جادو', emoji: '\u{1F4DA}', description: 'آشنایی با تاریخ جادوگران و رویدادهای مهم', xpPerLesson: 10 },
  charms: { id: 'charms', name: 'افسون‌ها', emoji: '\u{1FA84}', description: 'یادگیری طلسم‌ها و افسون‌های کاربردی', xpPerLesson: 12 },
  potions: { id: 'potions', name: 'معجون‌سازی', emoji: '\u{1F9EA}', description: 'ساخت معجون‌ها و اکسیرهای جادویی', xpPerLesson: 12 },
  transfiguration: { id: 'transfiguration', name: 'تغییرشکل', emoji: '\u{1F984}', description: 'تبدیل اجسام و موجودات به شکل‌های دیگر', xpPerLesson: 15 },
  herbology: { id: 'herbology', name: 'گیاه‌شناسی', emoji: '\u{1F33F}', description: 'شناسایی و پرورش گیاهان جادویی', xpPerLesson: 10 },
  muggle: { id: 'muggle', name: 'ماگل‌شناسی', emoji: '\u{1F4F1}', description: 'آشنایی با دنیای ماگل‌ها و فناوری آنها', xpPerLesson: 8 },
  flying: { id: 'flying', name: 'پرواز', emoji: '\u{1F985}', description: 'آموزش پرواز با جارو پرنده', xpPerLesson: 14 },
  astronomy: { id: 'astronomy', name: 'نجوم', emoji: '\u{1FA90}', description: 'بررسی ستارگان و تأثیر آنها بر جادو', xpPerLesson: 10 },
  creatures: { id: 'creatures', name: 'مراقبت از موجودات جادویی', emoji: '\u{1F43E}', description: 'آشنایی و مراقبت از موجودات جادویی', xpPerLesson: 12 },
  geography: { id: 'geography', name: 'جغرافیای جادویی', emoji: '\u{1F5FA}', description: 'نقشه مکان‌های جادویی و مخفی', xpPerLesson: 8 },
  singing: { id: 'singing', name: 'سرود و آواز', emoji: '\u{1F3B5}', description: 'یادگیری سرودهای جادویی', xpPerLesson: 6 },
  math: { id: 'math', name: 'ریاضیات جادویی', emoji: '\u{1F522}', description: 'محاسبات جادویی و نجومی', xpPerLesson: 10 },
};

// ── User Profile ────────────────────────────────────────

export type UserRole = 'student' | 'professor' | 'head' | 'minister' | 'auror' | 'worker';

export interface UserProfile {
  id: string;
  name: string;
  username?: string;
  photoUrl?: string;
  house: HouseId | null;
  role: UserRole;
  department: DeptId | null;
  level: number;
  xp: number;
  currency: Currency;
  completedClasses: Record<ClassId, number>; // classId -> times completed
  badges: string[];
  joinDate: string;
  lastActive: string;
}

// ── Levels ──────────────────────────────────────────────

export function xpForLevel(level: number): number {
  return level * 100;
}

export function levelFromXp(xp: number): number {
  let level = 1;
  let remaining = xp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  return level;
}

// ── Role names ──────────────────────────────────────────

export const ROLE_NAMES: Record<UserRole, string> = {
  student: 'دانش‌آموز',
  professor: 'استاد',
  head: 'رئیس بخش',
  minister: 'وزیر',
  auror: 'آورور',
  worker: 'کارمند',
};
