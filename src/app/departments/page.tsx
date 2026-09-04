'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { useTWA } from '@/components/TWAInit';
import { hapticFeedback, TG_EMOJI } from '@/lib/twa';
import { DEPARTMENTS, DeptId } from '@/lib/ministry/types';
import { getProfile, setDepartment, addXp } from '@/lib/ministry/store';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from 'cn';

export default function DepartmentsPage() {
  const { user } = useTWA();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [selected, setSelected] = useState<DeptId | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user) { router.push('/'); return; }
    const p = getProfile();
    if (p) { setProfile(p); setSelected(p.department); }
  }, [user, router]);

  if (!user || !profile) return null;

  const handleSelect = (deptId: DeptId) => {
    hapticFeedback('medium');
    setDepartment(deptId);
    addXp(20);
    setProfile(getProfile());
    setSelected(deptId);
    setMsg(`${DEPARTMENTS[deptId].name} انتخاب شد! +20 XP`);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="min-h-[100dvh] pb-20" style={{ background: 'var(--tg-bg)' }}>
      <main className="px-5 pt-6 max-w-lg mx-auto">
        <h1 className="text-lg font-bold mb-2" style={{ color: 'var(--tg-text)' }}>
          {TG_EMOJI.shield} ادارات وزارت
        </h1>
        <p className="text-xs mb-5" style={{ color: 'var(--tg-hint)' }}>
          یک اداره انتخاب کن تا عضوش بشی (+20 XP)
        </p>

        {msg && (
          <div className="rounded-xl p-3 mb-4 text-center text-sm animate-fade-in"
            style={{ background: 'var(--tg-bg-secondary)', color: 'var(--tg-button)' }}>
            {msg}
          </div>
        )}

        <div className="space-y-2">
          {Object.values(DEPARTMENTS).map((dept) => {
            const isSelected = selected === dept.id;
            return (
              <Card
                key={dept.id}
                className={cn(
                  'border-0 py-3 cursor-pointer transition-all',
                  isSelected && 'ring-2 ring-primary'
                )}
                style={{
                  background: isSelected ? 'var(--tg-button)' : 'var(--tg-bg-secondary)',
                }}
                onClick={() => handleSelect(dept.id)}
              >
                <CardContent className="pt-0 px-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{dept.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium truncate"
                        style={{ color: isSelected ? 'var(--tg-button-text)' : 'var(--tg-text)' }}>
                        {dept.name}
                      </div>
                      <div className="text-[11px]"
                        style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--tg-hint)' }}>
                        {dept.nameEn}
                      </div>
                    </div>
                    {isSelected && (
                      <Badge variant="secondary" className="shrink-0 bg-white/20 text-white border-0">
                        عضو ✓
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
      <NavBar />
    </div>
  );
}
