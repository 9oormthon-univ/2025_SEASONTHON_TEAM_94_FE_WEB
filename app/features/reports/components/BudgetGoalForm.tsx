// features/reports/components/BudgetGoalForm.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import editIconUrl from '@/assets/edit.svg?url';
import xIconUrl from '@/assets/X.svg?url';

const SUFFIX = '원';
const PREFIX = '- ';

function toDigits(v: string) { return v.replace(/[^\d]/g, ''); }
function formatDisplay(n: number) { return n ? `${PREFIX}${n.toLocaleString()}${SUFFIX}` : ''; }
function fmtKRW(n: number) { return n.toLocaleString('ko-KR') + '원'; }

interface Props {
  value: number;
  onChange: (v: number) => void;
  loading?: boolean;
  saving?: boolean;
  changed: boolean;
  onSubmit: () => void | Promise<void>;
}

export default function BudgetGoalForm({
  value, onChange, loading, saving, changed, onSubmit,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [focused, setFocused] = useState(false);
  const [inputPx, setInputPx] = useState<number>(0); // 편집 전: 표시 문자열 실제 px

  const caretBeforeSuffix = (n: number) => {
    const before = n ? `${PREFIX}${n.toLocaleString()}`.length : 0;
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      try { el.setSelectionRange(before, before); } catch {}
    });
  };

  const measureWidth = () => {
    const el = inputRef.current;
    if (!el) return;
    const valueStr = formatDisplay(value) || `${PREFIX}0${SUFFIX}`;

    const cs = getComputedStyle(el);
    const font = `${cs.fontStyle} ${cs.fontVariant} ${cs.fontWeight} ${cs.fontSize} / ${cs.lineHeight} ${cs.fontFamily}`;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.font = font;

    const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const extra = 2;
    const w = ctx.measureText(valueStr).width + paddingX + extra;
    setInputPx(w);
  };

  useEffect(() => { if (!focused) measureWidth(); }, [value, focused]);
  useEffect(() => {
    document.fonts?.ready?.then(() => { if (!focused) measureWidth(); });
  }, []);

  const disabled = !!loading || !!saving || !changed;

  return (
    <div className="px-5 mt-25">
      <h2 className="top-5 text-2xl font-extrabold !text-[#002B5B]">
        이번 달에 얼마까지<br /> 지출할 건가요?
      </h2>
      <p className="mt-1 text-sm !text-[#757575]">이 금액은 온전히 통제해보세요.</p>

      <div className="mt-8 relative group">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          autoFocus
          onFocus={() => { setFocused(true); caretBeforeSuffix(value); }}
          onBlur={() => setFocused(false)}
          style={{
            width: focused ? undefined : (inputPx || undefined),
            border: '0', borderRadius: 0, outline: 'none',
            boxShadow: 'none', WebkitAppearance: 'none', appearance: 'none',
          }}
          className={`
            w-full bg-transparent
            outline-none ring-0 focus:ring-0
            border-none
            !text-xl font-bold text-[#333]
            placeholder:text-[#B9B9B9] pb-2
            ${focused ? 'pr-9' : ''} 
          `}
          placeholder={`${PREFIX}0${SUFFIX}`}
          value={formatDisplay(value)}
          onChange={(e) => {
            const next = Number(toDigits(e.target.value) || '0');
            onChange(next);
            caretBeforeSuffix(next);
          }}
        />

        {!focused && (
          <button
            type="button"
            aria-label="편집"
            className="absolute top-1/2 -translate-y-1/2 rounded hover:bg-black/5 active:bg-black/10"
            style={{ left: (inputRef.current ? (inputRef.current.offsetLeft + (inputPx || 0)) : 0) }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { inputRef.current?.focus(); caretBeforeSuffix(value); }}
          >
            <img src={editIconUrl} alt="편집" className="w-4 h-4 opacity-70" />
          </button>
        )}

        {focused && (
          <button
            type="button"
            aria-label="지우기"
            className="absolute right-0 top-1/2 -translate-y-1/2 p-7 rounded hover:bg-black/5 active:bg-black/10"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { onChange(0); caretBeforeSuffix(0); inputRef.current?.focus(); }}
          >
            <img src={xIconUrl} alt="지우기" className="w-4 h-4 opacity-70" />
          </button>
        )}

        {/* 밑줄(그대로 유지) */}
        <div className="pointer-events-none absolute left-0 right-6 -bottom-[3px] h-[2px] bg-black scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform duration-150" />
      </div>

      {/* 하단 CTA (그대로) */}
      <div className="fixed left-0 right-0 bottom-0 bg-white/90 backdrop-blur px-4 py-3">
        <Button
          className={`w-full !h-[20px] !rounded-[6px] !font-normal ${
            disabled ? '!bg-white !text-[#757575] border !border-[#002B5B]' : '!bg-[#002B5B] !text-white'
          }`}
          disabled={disabled}
          onClick={() => void onSubmit()}
        >
          저장
        </Button>
      </div>
    </div>
  );
}
