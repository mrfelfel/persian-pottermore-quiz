'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { useTWA } from '@/components/TWAInit';
import { hapticFeedback, TG_EMOJI } from '@/lib/twa';
import { HOUSES, DEPARTMENTS, ROLE_NAMES, xpForLevel } from '@/lib/ministry/types';
import { getProfile, saveProfile, resetProfile } from '@/lib/ministry/store';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from 'cn';

export default function ProfilePage() {
  const { user } = useTWA();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) { router.push('/'); return; }
    const p = getProfile();
    if (p) setProfile(p);
  }, [user, router]);

  if (!user || !profile) return null;

  const house = profile.house ? HOUSES[profile.house as keyof typeof HOUSES] : null;
  const dept = profile.department ? DEPARTMENTS[profile.department as keyof typeof DEPARTMENTS] : null;
  const currentXp = profile.xp - Array.from({ length: profile.level - 1 }, (_, i) => (i + 1) * 100).reduce((a, b) => a + b, 0);
  const nextLevelXp = xpForLevel(profile.level);

  return (
    <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
      <main className="px-5 pt-6 max-w-lg mx-auto">

        {/* Header card */}
        <Card className="mb-4 border-0" style={{ background: 'var(--tg-bg-secondary)' }}>
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl"
              style={{ background: house ? house.colorBg : 'var(--tg-button)' }}>
              {house ? house.emoji : TG_EMOJI.wizard}
            </div>
            <h1 className="text-lg font-bold mb-0.5" style={{ color: 'var(--tg-text)' }}>
              {profile.name}
            </h1>
            <p className="text-xs mb-3" style={{ color: 'var(--tg-hint)' }}>
              {ROLE_NAMES[profile.role as keyof typeof ROLE_NAMES]}
            </p>

            {/* Level */}
            <div className="flex items-center justify-center gap-2 mb-1">
              <Badge variant="default" style={{ background: 'var(--tg-button)' }}>
                لول {profile.level}
              </Badge>
              <div className="flex-1 max-w-[160px] h-1.5 rounded-full"
                style={{ background: 'var(--tg-bg)' }}>
                <div className="h-full rounded-full" style={{
                  width: `${(currentXp / nextLevelXp) * 100}%`,
                  background: 'var(--tg-button)',
                }} />
              </div>
              <span className="text-[10px]" style={{ color: 'var(--tg-hint)' }}>
                {currentXp}/{nextLevelXp} XP
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Currency */}
        <Card className="mb-4 border-0" style={{ background: 'var(--tg-bg-secondary)' }}>
          <CardHeader className="pb-0 pt-6 px-6">
            <CardDescription className="text-xs" style={{ color: 'var(--tg-hint)' }}>
              {TG_EMOJI.crown} موجودی بانکی
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'گالیون', value: profile.currency.galleons, color: '#FFD700' },
                { label: 'دراخما', value: profile.currency.sickles, color: '#C0C0C0' },
                { label: 'کنت', value: profile.currency.knuts, color: '#CD7F32' },
              ].map(c => (
                <div key={c.label}>
                  <div className="text-lg font-bold" style={{ color: c.color }}>{c.value}</div>
                  <div className="text-[10px]" style={{ color: 'var(--tg-hint)' }}>{c.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* House info */}
        {house && (
          <Card className="mb-4 border-0" style={{ background: 'var(--tg-bg-secondary)' }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{house.emoji}</span>
                <div>
                  <div className="text-sm font-medium" style={{ color: house.colorBg }}>
                    {house.name}
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--tg-hint)' }}>
                    بنیان‌گذار: {house.founder} — {house.trait}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Department */}
        {dept && (
          <Card className="mb-4 border-0" style={{ background: 'var(--tg-bg-secondary)' }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{dept.emoji}</span>
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--tg-text)' }}>
                    {dept.name}
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--tg-hint)' }}>
                    {dept.nameEn}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Classes */}
        <Card className="mb-4 border-0" style={{ background: 'var(--tg-bg-secondary)' }}>
          <CardHeader className="pb-0 pt-6 px-6">
            <CardDescription className="text-xs" style={{ color: 'var(--tg-hint)' }}>
              {TG_EMOJI.book} کلاس‌های تکمیل شده
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="space-y-1.5">
              {Object.entries(profile.completedClasses || {}).filter(([_, c]) => (c as number) > 0).map(([classId, count]) => (
                <div key={classId} className="flex justify-between items-center text-[13px]">
                  <span style={{ color: 'var(--tg-text)' }}>{classId}</span>
                  <Badge variant="secondary" className="text-[11px]">{count as number} بار</Badge>
                </div>
              ))}
              {Object.keys(profile.completedClasses || {}).length === 0 && (
                <p className="text-xs" style={{ color: 'var(--tg-hint)' }}>هنوز کلاسی تکمیل نشده</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        {profile.badges.length > 0 && (
          <Card className="mb-4 border-0" style={{ background: 'var(--tg-bg-secondary)' }}>
            <CardHeader className="pb-0 pt-6 px-6">
              <CardDescription className="text-xs" style={{ color: 'var(--tg-hint)' }}>
                {TG_EMOJI.medal} نشان‌ها
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="flex flex-wrap gap-2">
                {profile.badges.map((b: string) => (
                  <Badge key={b} variant="outline">{b}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="space-y-2 mb-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-auto py-3.5 text-sm"
            style={{ background: 'var(--tg-bg-secondary)', color: 'var(--tg-text)' }}
            onClick={() => { hapticFeedback('medium'); router.push('/classes'); }}
          >
            <span className="text-lg">{TG_EMOJI.flask}</span>
            <span>رفتن به کلاس‌ها</span>
            <span className="mr-auto text-xs" style={{ color: 'var(--tg-hint)' }}>←</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-auto py-3.5 text-sm"
            style={{ background: 'var(--tg-bg-secondary)', color: 'var(--tg-text)' }}
            onClick={() => { hapticFeedback('medium'); router.push('/departments'); }}
          >
            <span className="text-lg">{TG_EMOJI.shield}</span>
            <span>انتخاب اداره</span>
            <span className="mr-auto text-xs" style={{ color: 'var(--tg-hint)' }}>←</span>
          </Button>
        </div>

        {/* Reset */}
        <Button
          variant="ghost"
          className="w-full text-xs"
          style={{ color: 'var(--tg-destructive)' }}
          onClick={() => { hapticFeedback('heavy'); resetProfile(); router.push('/'); }}
        >
          شروع مجدد
        </Button>
      </main>
      <NavBar />
    </div>
  );
}
