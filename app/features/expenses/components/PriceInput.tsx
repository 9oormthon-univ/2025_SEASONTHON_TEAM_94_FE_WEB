import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import Edit from '@/assets/edit.svg';
import xIconUrl from '@/assets/X.svg?url';
import type { ExpenseFormData } from '@/features/expenses/utils/validation';

interface PriceInputProps {
  control: Control<ExpenseFormData>;
  errors: FieldErrors<ExpenseFormData>;
  setValue: (name: 'price', value: number) => void;
}

const PRICE_SUFFIX = '원';
const PRICE_PREFIX = '-';
const EDIT_GAP_PX = 6; // 텍스트와 아이콘 사이 간격

const toDigits = (v: string) => v.replace(/[^\d]/g, '');
const formatPriceDisplay = (n: number) => n ? `${PRICE_PREFIX}${n.toLocaleString()}${PRICE_SUFFIX}` : '';

export function PriceInput({ control, errors, setValue }: PriceInputProps) {
  const [priceInputFocused, setPriceInputFocused] = useState(false);
  const [priceInputPx, setPriceInputPx] = useState<number>(0);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const caretBeforeSuffix = (n: number) => {
    const before = n ? `${PRICE_PREFIX}${n.toLocaleString()}`.length : 0;
    requestAnimationFrame(() => {
      const el = priceInputRef.current;
      if (!el) return;
      try { 
        el.setSelectionRange(before, before); 
      } catch {}
    });
  };

  // 초기 렌더 직후(첫 페인트 전에) 현재 값 기준으로 즉시 폭 측정
  useLayoutEffect(() => {
    if (priceInputFocused) return;
    const raw = priceInputRef.current?.value ?? '';
    const n = Number(toDigits(raw) || '0');
    measurePriceWidth(n);
  }, []);

  const measurePriceWidth = (price: number) => {
    const el = priceInputRef.current;
    if (!el) return;
    const valueStr = formatPriceDisplay(price) || `${PRICE_PREFIX}0${PRICE_SUFFIX}`;

    const cs = getComputedStyle(el);
    const font = `${cs.fontStyle} ${cs.fontVariant} ${cs.fontWeight} ${cs.fontSize} / ${cs.lineHeight} ${cs.fontFamily}`;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return; 
    ctx.font = font;

    const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const extra = 2;
    const textWidth = ctx.measureText(valueStr).width + paddingX + extra;

    // 컨테이너 가용 폭(편집 버튼 영역 제외)으로 클램프
    let finalWidth = textWidth;
    if (!priceInputFocused) {
      const container = containerRef.current;
      if (container) {
        const btn = container.querySelector('[data-role="price-edit-btn"]') as HTMLElement | null;
        const containerWidth = container.clientWidth;
        let btnWidth = 0;
        if (btn) {
          const bcs = getComputedStyle(btn);
          btnWidth = btn.getBoundingClientRect().width
            + parseFloat(bcs.marginLeft || '0')
            + parseFloat(bcs.marginRight || '0');
        } else {
          btnWidth = 20; // 보수치
        }
        const available = Math.max(0, containerWidth - btnWidth);
        finalWidth = Math.min(textWidth, available);
      }
    }
    setPriceInputPx(finalWidth);
  };

  useEffect(() => {
    document.fonts?.ready?.then(() => { 
      if (!priceInputFocused) {
        const raw = priceInputRef.current?.value ?? '';
        const n = Number(toDigits(raw) || '0');
        measurePriceWidth(n);
      }
    });
  }, [priceInputFocused]);

  // 컨테이너 리사이즈에 반응
  useEffect(() => {
    if (priceInputFocused) return;
    const container = containerRef.current;
    if (!container) return;
    const recalc = () => {
      const raw = priceInputRef.current?.value ?? '';
      const n = Number(toDigits(raw) || '0');
      measurePriceWidth(n);
    };
    const RO: any = (window as any).ResizeObserver;
    const ro = RO ? new RO(() => recalc()) : undefined;
    ro?.observe(container);
    window.addEventListener('resize', recalc);
    return () => {
      ro?.disconnect?.();
      window.removeEventListener('resize', recalc);
    };
  }, [priceInputFocused]);

  // 값/포커스 변경 시 재측정 (비포커스 상태 우선)
  // 상세 값 변화는 Controller 내부에서 처리

  return (
    <div className="px-4 py-4">
      <div ref={containerRef} className="relative group">
        <Controller
          name="price"
          control={control}
          render={({ field }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => { 
              if (!priceInputFocused) measurePriceWidth(field.value); 
            }, [field.value, priceInputFocused]);

            return (
              <input
                ref={priceInputRef}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                onFocus={() => { 
                  setPriceInputFocused(true); 
                  caretBeforeSuffix(field.value); 
                }}
                onBlur={() => setPriceInputFocused(false)}
                style={{
                  width: priceInputFocused ? undefined : (priceInputPx || undefined),
                  textAlign: priceInputFocused ? undefined : 'right',
                  border: '0', 
                  borderRadius: 0, 
                  outline: 'none',
                  boxShadow: 'none', 
                  WebkitAppearance: 'none', 
                  appearance: 'none',
                }}
                className={`
                  w-full bg-transparent
                  outline-none ring-0 focus:ring-0
                  border-none
                  !text-2xl font-bold text-black
                  placeholder:text-[#B9B9B9] pb-2
                  ${priceInputFocused ? 'pr-9' : ''} 
                `}
                placeholder={`${PRICE_PREFIX}0${PRICE_SUFFIX}`}
                value={formatPriceDisplay(field.value)}
                onChange={(e) => {
                  const next = Number(toDigits(e.target.value) || '0');
                  field.onChange(next);
                  caretBeforeSuffix(next);
                }}
              />
            );
          }}
        />

        {!priceInputFocused && (
          <button
            type="button"
            aria-label="편집"
            className="absolute -translate-y-1/2 rounded hover:bg-black/5 active:bg-black/10"
            style={{
              top: (() => {
                const input = priceInputRef.current;
                if (!input) return '50%';
                const cs = getComputedStyle(input);
                const pt = parseFloat(cs.paddingTop || '0');
                const pb = parseFloat(cs.paddingBottom || '0');
                const h = input.clientHeight;
                const centerY = input.offsetTop + pt + Math.max(0, (h - pt - pb)) / 2;
                return centerY;
              })(),
              left: (() => {
                const input = priceInputRef.current;
                const container = containerRef.current;
                const px = (input ? (input.offsetLeft + (priceInputPx || 0) + EDIT_GAP_PX) : EDIT_GAP_PX);
                if (!container) return px;
                const maxLeft = container.clientWidth - (16 + EDIT_GAP_PX); // 아이콘 폭 + 간격 보수치
                return Math.min(px, Math.max(0, maxLeft));
              })(),
            }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { priceInputRef.current?.focus(); }}
            data-role="price-edit-btn"
          >
            <img src={Edit} alt="편집" className="w-4 h-4 opacity-70" />
          </button>
        )}

        {priceInputFocused && (
          <button
            type="button"
            aria-label="지우기"
            className="absolute right-0 -translate-y-1/2 p-3 rounded hover:bg-black/5 active:bg-black/10"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { 
              setValue('price', 0); 
              caretBeforeSuffix(0); 
              priceInputRef.current?.focus(); 
            }}
            style={{
              top: (() => {
                const input = priceInputRef.current;
                if (!input) return '50%';
                const cs = getComputedStyle(input);
                const pt = parseFloat(cs.paddingTop || '0');
                const pb = parseFloat(cs.paddingBottom || '0');
                const h = input.clientHeight;
                const centerY = input.offsetTop + pt + Math.max(0, (h - pt - pb)) / 2;
                return centerY;
              })(),
            }}
          >
            <img src={xIconUrl} alt="지우기" className="w-4 h-4 opacity-70" />
          </button>
        )}

        {/* 밑줄 애니메이션 */}
  <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-[2px] bg-black scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform duration-150" />

        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>
    </div>
  );
}
