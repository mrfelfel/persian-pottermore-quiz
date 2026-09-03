export interface TWAUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface TWATheme {
  bgColor: string;
  textColor: string;
  hintColor: string;
  buttonColor: string;
  buttonTextColor: string;
  secondaryBgColor: string;
  linkColor: string;
  destructiveTextColor: string;
  colorScheme: 'light' | 'dark';
}

export function getTWA(): any {
  if (typeof window === 'undefined') return null;
  return (window as any).Telegram?.WebApp || null;
}

export function getTWAUser(): TWAUser | null {
  const tg = getTWA();
  const u = tg?.initDataUnsafe?.user;
  if (!u) return null;
  return {
    id: u.id,
    first_name: u.first_name,
    last_name: u.last_name,
    username: u.username,
    photo_url: u.photo_url,
  };
}

export function getTheme(): TWATheme {
  const tg = getTWA();
  const p = tg?.themeParams || {};
  return {
    bgColor: p.bg_color || '#17212b',
    textColor: p.text_color || '#f5f5f5',
    hintColor: p.hint_color || '#6d7f8f',
    buttonColor: p.button_color || '#5288c1',
    buttonTextColor: p.button_text_color || '#ffffff',
    secondaryBgColor: p.secondary_bg_color || '#1e2c3a',
    linkColor: p.link_color || '#6ab2f2',
    destructiveTextColor: p.destructive_text_color || '#e53935',
    colorScheme: tg?.colorScheme || 'dark',
  };
}

export function hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'error') {
  const tg = getTWA();
  if (!tg?.HapticFeedback) return;
  if (type === 'success') tg.HapticFeedback.notificationOccurred('success');
  else if (type === 'error') tg.HapticFeedback.notificationOccurred('error');
  else if (type === 'light') tg.HapticFeedback.impactOccurred('light');
  else if (type === 'medium') tg.HapticFeedback.impactOccurred('medium');
  else if (type === 'heavy') tg.HapticFeedback.impactOccurred('heavy');
}

export function showMainButton(text: string, onClick: () => void) {
  const tg = getTWA();
  if (!tg?.MainButton) return;
  tg.MainButton.setText(text);
  tg.MainButton.show();
  tg.MainButton.enable();
  tg.MainButton.onClick(onClick);
}

export function hideMainButton() {
  const tg = getTWA();
  if (!tg?.MainButton) return;
  tg.MainButton.hide();
  tg.MainButton.offClick();
}

export function showBackButton(onClick: () => void) {
  const tg = getTWA();
  if (!tg?.BackButton) return;
  tg.BackButton.show();
  tg.BackButton.onClick(onClick);
}

export function hideBackButton() {
  const tg = getTWA();
  if (!tg?.BackButton) return;
  tg.BackButton.hide();
  tg.BackButton.offClick();
}

// Telegram emoji pack for house results
export const TG_EMOJI = {
  wand: '\u{1FA84}',
  sparkle: '\u{2728}',
  fire: '\u{1F525}',
  star: '\u{2B50}',
  lightning: '\u{26A1}',
  trophy: '\u{1F3C6}',
  crown: '\u{1F451}',
  medal: '\u{1F3C5}',
  shield: '\u{1F6E1}',
  sword: '\u{1F5E1}',
  dragon: '\u{1F409}',
  phoenix: '\u{1F9A5}',
  owl: '\u{1F989}',
  lion: '\u{1F981}',
  eagle: '\u{1F985}',
  badger: '\u{1F9A1}',
  snake: '\u{1F40D}',
  heart: '\u{2764}',
  party: '\u{1F389}',
  crystal: '\u{1F48E}',
  book: '\u{1F4D6}',
  flask: '\u{1F9EA}',
  key: '\u{1F511}',
  castle: '\u{1F3F0}',
  wizard: '\u{1F9D9}',
  cat: '\u{1F431}',
  thunder: '\u{26C8}',
  lock: '\u{1F512}',
  bar_chart: '\u{1F4CA}',
} as const;
