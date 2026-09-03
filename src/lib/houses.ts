export interface House {
  id: string;
  name: string;
  nameEn: string;
  trait: string;
  color: string;
  colorBg: string;
  emoji: string;
  description: string;
}

export const HOUSES: Record<string, House> = {
  gryffindor: {
    id: 'gryffindor',
    name: 'گریفیندور',
    nameEn: 'Gryffindor',
    trait: 'شجاعت و جسارت',
    color: '#740001',
    colorBg: '#ae0001',
    emoji: '🦁',
    description: 'گریفیندور ارزش شجاعت، شهامت، جسارت و عطوفت را در بالاترین حد قرار می‌دهد. اعضای این گروه همیشه آماده‌اند تا در برابر بی‌عدالتی بایستند.',
  },
  ravenclaw: {
    id: 'ravenclaw',
    name: 'ریونکلاو',
    nameEn: 'Ravenclaw',
    trait: 'خرد و خلاقیت',
    color: '#000a60',
    colorBg: '#222f5b',
    emoji: '🦅',
    description: 'ریونکلاو ذهن‌های کنجکاو، خلاق و باهوش را گرد هم می‌آورد. اعضای این گروه عاشق یادگیری و کشف حقایق جدید هستند.',
  },
  hufflepuff: {
    id: 'hufflepuff',
    name: 'هاگلپاف',
    nameEn: 'Hufflepuff',
    trait: 'وفاداری و صبر',
    color: '#ecb939',
    colorBg: '#f0c75e',
    emoji: '🦡',
    description: 'هاگلپاف وفاداری، صبر، عدالت و سخت‌کوشی را ستایش می‌کند. اعضای این گروه دوستان قابل اعتماد و مهربانی هستند.',
  },
  slytherin: {
    id: 'slytherin',
    name: 'اسلیترین',
    nameEn: 'Slytherin',
    trait: 'زیرکی و جاه‌طلبی',
    color: '#1a472a',
    colorBg: '#2a623d',
    emoji: '🐍',
    description: 'اسلیترین زیرکی، جاه‌طلبی و رهبری را ارج می‌نهد. اعضای این گروه باهوش، قاطع و همیشه در تلاش برای رسیدن به اهدافشان هستند.',
  },
};

export function getHouse(id: string): House {
  return HOUSES[id] || HOUSES.gryffindor;
}
