'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { useTWA } from '@/components/TWAInit';
import { hapticFeedback, TG_EMOJI } from '@/lib/twa';
import { getProfile, addCurrency, spendCurrency, addXp } from '@/lib/ministry/store';
import { Currency, currencyStr } from '@/lib/ministry/types';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from 'cn';

const SHOP_ITEMS = [
  { name: 'عصای جادویی', emoji: TG_EMOJI.wand, price: { galleons: 7, sickles: 0, knuts: 0 }, xp: 10 },
  { name: 'クロک باک', emoji: TG_EMOJI.book, price: { galleons: 2, sickles: 0, knuts: 0 }, xp: 5 },
  { name: 'قلم پرنده', emoji: TG_EMOJI.phoenix, price: { galleons: 3, sickles: 5, knuts: 0 }, xp: 8 },
  { name: 'گردنبند مشخصات', emoji: TG_EMOJI.crystal, price: { galleons: 5, sickles: 0, knuts: 0 }, xp: 12 },
  { name: 'دفتر طلسم', emoji: TG_EMOJI.book, price: { galleons: 4, sickles: 0, knuts: 0 }, xp: 7 },
  { name: 'گربه جادویی', emoji: TG_EMOJI.cat, price: { galleons: 10, sickles: 0, knuts: 0 }, xp: 15 },
];

const DAILY_REWARD: Currency = { galleons: 5, sickles: 0, knuts: 0 };

export default function BankPage() {
  const { user } = useTWA();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user) { router.push('/'); return; }
    setProfile(getProfile());
  }, [user, router]);

  if (!user || !profile) return null;

  const handleDaily = () => {
    hapticFeedback('success');
    addCurrency(DAILY_REWARD);
    addXp(5);
    setProfile(getProfile());
    setMsg('پاداش روزانه دریافت شد! +5 گالیون');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleBuy = (name: string, price: Currency, xp: number) => {
    hapticFeedback('medium');
    if (spendCurrency(price)) {
      addXp(xp);
      setProfile(getProfile());
      setMsg(`${name} خریداری شد!`);
    } else {
      setMsg('موجودی کافی نیست!');
    }
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
      <main className="px-5 pt-6 max-w-lg mx-auto">

        {/* Bank header */}
        <Card className="mb-5 border-0" style={{ background: 'var(--tg-bg-secondary)' }}>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl mb-2">{TG_EMOJI.castle}</div>
              <h1 className="text-lg font-bold mb-1" style={{ color: '#FFD700' }}>
                بانک گرینگوتس
              </h1>
              <p className="text-[11px] mb-4" style={{ color: 'var(--tg-hint)' }}>
                بانک رسمی جامعه جادوگری
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'گالیون', value: profile.currency.galleons, color: '#FFD700' },
                  { label: 'دراخما', value: profile.currency.sickles, color: '#C0C0C0' },
                  { label: 'کنت', value: profile.currency.knuts, color: '#CD7F32' },
                ].map(c => (
                  <div key={c.label} className="rounded-xl p-3"
                    style={{ background: 'var(--tg-bg)' }}>
                    <div className="text-xl font-bold" style={{ color: c.color }}>{c.value}</div>
                    <div className="text-[10px]" style={{ color: 'var(--tg-hint)' }}>{c.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message */}
        {msg && (
          <div className="rounded-xl p-3 mb-4 text-center text-sm animate-fade-in"
            style={{ background: 'var(--tg-bg-secondary)', color: 'var(--tg-button)' }}>
            {msg}
          </div>
        )}

        {/* Daily reward */}
        <Card
          className="mb-5 border-0 cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: 'var(--tg-bg-secondary)' }}
          onClick={handleDaily}
        >
          <CardContent className="pt-6 text-center">
            <span className="text-lg">{TG_EMOJI.star}</span>
            <div className="text-sm font-medium mt-1" style={{ color: 'var(--tg-text)' }}>
              پاداش روزانه
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: 'var(--tg-hint)' }}>
              +5 گالیون +5 XP
            </div>
          </CardContent>
        </Card>

        {/* Shop */}
        <div className="mb-4">
          <h2 className="text-xs font-medium mb-3" style={{ color: 'var(--tg-hint)' }}>
            {TG_EMOJI.sparkle} فروشگاه کوچه دیاگون
          </h2>
          <div className="space-y-2">
            {SHOP_ITEMS.map((item) => {
              const canBuy = profile.currency.galleons >= item.price.galleons;
              return (
                <Card key={item.name} className="border-0 py-3" style={{ background: 'var(--tg-bg-secondary)' }}>
                  <CardContent className="pt-0 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl shrink-0">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium" style={{ color: 'var(--tg-text)' }}>
                          {item.name}
                        </div>
                        <div className="text-[11px]" style={{ color: 'var(--tg-hint)' }}>
                          +{item.xp} XP
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="shrink-0 text-[11px] font-medium"
                        style={{ borderColor: 'var(--tg-button)', color: canBuy ? '#FFD700' : 'var(--tg-hint)' }}
                      >
                        {item.price.galleons}G
                      </Badge>
                      <Button
                        onClick={() => handleBuy(item.name, item.price, item.xp)}
                        disabled={!canBuy}
                        size="sm"
                        variant={canBuy ? 'default' : 'secondary'}
                        className={cn('shrink-0 text-[11px]', !canBuy && 'opacity-40')}
                      >
                        خرید
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      <NavBar />
    </div>
  );
}
