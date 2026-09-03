import { UserProfile, HouseId, DeptId, ClassId, Currency } from './types';

const STORAGE_KEY = 'hp_ministry_profile';

// ── Get / Set ───────────────────────────────────────────

export function getProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function createProfile(name: string, username?: string, photoUrl?: string): UserProfile {
  const profile: UserProfile = {
    id: `hp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    username,
    photoUrl,
    house: null,
    role: 'student',
    department: null,
    level: 1,
    xp: 0,
    currency: { galleons: 50, sickles: 0, knuts: 0 }, // stipend
    completedClasses: {} as Record<ClassId, number>,
    badges: [],
    joinDate: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  };
  saveProfile(profile);
  return profile;
}

// ── Updates ─────────────────────────────────────────────

export function setHouse(house: HouseId): void {
  const p = getProfile();
  if (!p) return;
  p.house = house;
  saveProfile(p);
}

export function setDepartment(dept: DeptId): void {
  const p = getProfile();
  if (!p) return;
  p.department = dept;
  saveProfile(p);
}

export function addXp(amount: number): { levelUp: boolean; newLevel: number } {
  const p = getProfile();
  if (!p) return { levelUp: false, newLevel: 1 };

  const oldLevel = p.level;
  p.xp += amount;
  // Recalculate level
  let level = 1;
  let remaining = p.xp;
  while (remaining >= level * 100) {
    remaining -= level * 100;
    level++;
  }
  p.level = level;
  p.lastActive = new Date().toISOString();
  saveProfile(p);

  return { levelUp: level > oldLevel, newLevel: level };
}

export function addCurrency(amount: Currency): void {
  const p = getProfile();
  if (!p) return;
  let knuts = p.currency.knuts + amount.knuts;
  let sickles = p.currency.sickles + amount.sickles + Math.floor(knuts / 29);
  knuts %= 29;
  let galleons = p.currency.galleons + amount.galleons + Math.floor(sickles / 17);
  sickles %= 17;
  p.currency = { galleons, sickles, knuts };
  p.lastActive = new Date().toISOString();
  saveProfile(p);
}

export function spendCurrency(amount: Currency): boolean {
  const p = getProfile();
  if (!p) return false;

  const totalA = p.currency.galleons * 17 * 29 + p.currency.sickles * 29 + p.currency.knuts;
  const totalB = amount.galleons * 17 * 29 + amount.sickles * 29 + amount.knuts;
  if (totalA < totalB) return false;

  const diff = totalA - totalB;
  const galleons = Math.floor(diff / (17 * 29));
  const rem = diff % (17 * 29);
  const sickles = Math.floor(rem / 29);
  const knuts = rem % 29;
  p.currency = { galleons, sickles, knuts };
  p.lastActive = new Date().toISOString();
  saveProfile(p);
  return true;
}

export function completeClass(classId: ClassId): { xpGained: number; levelUp: boolean; newLevel: number } {
  const p = getProfile();
  if (!p) return { xpGained: 0, levelUp: false, newLevel: 1 };

  const currentCount = p.completedClasses[classId] || 0;
  p.completedClasses[classId] = currentCount + 1;

  // XP bonus for completing class
  const xp = 10 + currentCount * 2; // Increasing XP
  p.xp += xp;

  let level = 1;
  let remaining = p.xp;
  while (remaining >= level * 100) {
    remaining -= level * 100;
    level++;
  }
  const levelUp = level > p.level;
  p.level = level;
  p.lastActive = new Date().toISOString();
  saveProfile(p);

  return { xpGained: xp, levelUp, newLevel: level };
}

export function addBadge(badge: string): void {
  const p = getProfile();
  if (!p) return;
  if (!p.badges.includes(badge)) {
    p.badges.push(badge);
    saveProfile(p);
  }
}

export function resetProfile(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ── Leaderboard (local mock) ───────────────────────────

export interface LeaderboardEntry {
  name: string;
  house: HouseId;
  level: number;
  xp: number;
}

// Simulated leaderboard entries for visual purposes
const MOCK_ENTRIES: LeaderboardEntry[] = [
  { name: 'آودیتوره', house: 'slytherin', level: 42, xp: 4200 },
  { name: 'هری پاتر', house: 'gryffindor', level: 38, xp: 3800 },
  { name: 'هرمیون گرنجر', house: 'gryffindor', level: 40, xp: 4000 },
  { name: 'دامبلدور', house: 'gryffindor', level: 50, xp: 5000 },
  { name: 'اسنیپ', house: 'slytherin', level: 45, xp: 4500 },
  { name: 'لونا لاوگود', house: 'ravenclaw', level: 35, xp: 3500 },
  { name: 'سدریک دیگوری', house: 'hufflepuff', level: 30, xp: 3000 },
  { name: 'دریو مالفوی', house: 'slytherin', level: 28, xp: 2800 },
  { name: 'رون ویزلی', house: 'gryffindor', level: 25, xp: 2500 },
  { name: 'نیمफادورا تانکس', house: 'hufflepuff', level: 32, xp: 3200 },
];

export function getLeaderboard(): LeaderboardEntry[] {
  const p = getProfile();
  const entries = [...MOCK_ENTRIES];

  if (p && p.house) {
    // Insert user into leaderboard
    entries.push({
      name: p.name,
      house: p.house,
      level: p.level,
      xp: p.xp,
    });
  }

  return entries.sort((a, b) => b.xp - a.xp);
}
