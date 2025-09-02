import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import Edit from '@/assets/edit.svg';
import xIconUrl from '@/assets/X.svg?url';
import type { ExpenseFormData } from '@/features/expenses/_lib/validation';

interface PriceInputProps {
  control: Control<ExpenseFormData>;
  errors: FieldErrors<ExpenseFormData>;
  setValue: (name: 'price', value: number) => void;
}

// 매직 넘버들을 명명된 상수로 분리 (가이드라인: Naming Magic Numbers)
const PRICE_SUFFIX = '원';
const PRICE_PREFIX = '-';
const EDIT_GAP_PX = 6; // 텍스트와 아이콘 사이 간격
const DEFAULT_BUTTON_WIDTH = 20;
const ICON_WIDTH_WITH_MARGIN = 16;
const TEXT_WIDTH_BUFFER = 2;

const toDigits = (v: string) => v.replace(/[^\d]/g, '');
const formatPriceDisplay = (n: number) => n ? `${PRICE_PREFIX}${n.toLocaleString()}${PRICE_SUFFIX}` : '';

export function PriceInput({ control, errors, setValue }: PriceInputProps) {
  const [priceInputFocused, setPriceInputFocused] = useState(false);
  const [priceInputPx, setPriceInputPx] = useState<number>(0);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Canvas를 컴포넌트 생명주기에 맞게 관리
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 복잡한 조건을 명명된 변수로 분리 (가이드라인: Naming Complex Conditions)
  const isInputFocused = priceInputFocused;
  const shouldRecalculateWidth = !isInputFocused;

  // Canvas 생성을 컴포넌트 레벨에서 관리
  const getCanvas = useCallback(() => {
    if (!canvasRef.current) {
      // 브라우저 환경에서만 Canvas 생성
      if (typeof document !== 'undefined') {
        canvasRef.current = document.createElement('canvas');
      }
    }
    return canvasRef.current;
  }, []);

  // 버튼 top 위치 계산 로직을 메모이제이션
  const calculateButtonTop = useCallback(() => {
    const input = priceInputRef.current;
    if (!input) return '50%';
    const computedStyle = getComputedStyle(input);
    const paddingTop = parseFloat(computedStyle.paddingTop || '0');
    const paddingBottom = parseFloat(computedStyle.paddingBottom || '0');
    const height = input.clientHeight;
    const centerY = input.offsetTop + paddingTop + Math.max(0, (height - paddingTop - paddingBottom)) / 2;
    return centerY;
  }, []);

  const caretBeforeSuffix = useCallback((numericValue: number) => {
    const caretPosition = numericValue ? `${PRICE_PREFIX}${numericValue.toLocaleString()}`.length : 0;
    requestAnimationFrame(() => {
      const element = priceInputRef.current;
      if (!element) return;
      try { 
        element.setSelectionRange(caretPosition, caretPosition); 
      } catch {
        // 선택 범위 설정 실패는 무시
      }
    });
  }, []);

  // 초기 렌더 직후(첫 페인트 전에) 현재 값 기준으로 즉시 폭 측정
  useLayoutEffect(() => {
    if (isInputFocused) return;
    const rawValue = priceInputRef.current?.value ?? '';
    const numericValue = Number(toDigits(rawValue) || '0');
    measurePriceWidth(numericValue);
  }, []);

  const measurePriceWidth = useCallback((price: number) => {
    const element = priceInputRef.current;
    if (!element) return;
    const valueString = formatPriceDisplay(price) || `${PRICE_PREFIX}0${PRICE_SUFFIX}`;

    const computedStyle = getComputedStyle(element);
    const font = `${computedStyle.fontStyle} ${computedStyle.fontVariant} ${computedStyle.fontWeight} ${computedStyle.fontSize} / ${computedStyle.lineHeight} ${computedStyle.fontFamily}`;
    
    // 컴포넌트 레벨에서 관리되는 Canvas 사용
    const canvas = getCanvas();
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return; 
    context.font = font;

    const paddingX = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
    const textWidth = context.measureText(valueString).width + paddingX + TEXT_WIDTH_BUFFER;

    // 컨테이너 가용 폭 계산을 별도 함수로 분리 (가이드라인: Abstracting Implementation Details)
    const calculateAvailableWidth = () => {
      if (isInputFocused) return textWidth;
      
      const container = containerRef.current;
      if (!container) return textWidth;
      
      const button = container.querySelector('[data-role="price-edit-btn"]') as HTMLElement | null;
      const containerWidth = container.clientWidth;
      
      const buttonWidth = button ? (() => {
        const buttonComputedStyle = getComputedStyle(button);
        return button.getBoundingClientRect().width
          + parseFloat(buttonComputedStyle.marginLeft || '0')
          + parseFloat(buttonComputedStyle.marginRight || '0');
      })() : DEFAULT_BUTTON_WIDTH;
      
      const availableWidth = Math.max(0, containerWidth - buttonWidth);
      return Math.min(textWidth, availableWidth);
    };

    setPriceInputPx(calculateAvailableWidth());
  }, [isInputFocused, getCanvas]);

  useEffect(() => {
    const handleFontsReady = () => {
      if (shouldRecalculateWidth) {
        const rawValue = priceInputRef.current?.value ?? '';
        const numericValue = Number(toDigits(rawValue) || '0');
        measurePriceWidth(numericValue);
      }
    };

    document.fonts?.ready?.then(handleFontsReady);
  }, [shouldRecalculateWidth, measurePriceWidth]);

  // 컨테이너 리사이즈에 반응
  useEffect(() => {
    if (isInputFocused) return;
    const container = containerRef.current;
    if (!container) return;
    
    const handleResize = () => {
      const rawValue = priceInputRef.current?.value ?? '';
      const numericValue = Number(toDigits(rawValue) || '0');
      measurePriceWidth(numericValue);
    };
    
    // ResizeObserver 존재 여부 확인을 명명된 변수로 분리
    const hasResizeObserver = typeof (window as any).ResizeObserver !== 'undefined';
    const resizeObserver = hasResizeObserver ? new (window as any).ResizeObserver(handleResize) : null;
    
    resizeObserver?.observe(container);
    window.addEventListener('resize', handleResize);
    
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [isInputFocused, measurePriceWidth]);

  // 편집 버튼 위치 계산을 별도 함수로 분리 (가이드라인: Abstracting Implementation Details)
  const calculateEditButtonPosition = useCallback(() => {
    const input = priceInputRef.current;
    const container = containerRef.current;
    const basePosition = input ? (input.offsetLeft + (priceInputPx || 0) + EDIT_GAP_PX) : EDIT_GAP_PX;
    
    if (!container) return basePosition;
    
    const maxLeftPosition = container.clientWidth - (ICON_WIDTH_WITH_MARGIN + EDIT_GAP_PX);
    return Math.min(basePosition, Math.max(0, maxLeftPosition));
  }, [priceInputPx]);

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
              if (shouldRecalculateWidth) {
                measurePriceWidth(field.value); 
              }
            }, [field.value, shouldRecalculateWidth, measurePriceWidth]);

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
                  width: isInputFocused ? undefined : (priceInputPx || undefined),
                  textAlign: isInputFocused ? undefined : 'right',
                }}
                className={`
                  w-full bg-transparent
                  border-0 rounded-none outline-none shadow-none
                  appearance-none
                  text-2xl font-bold text-black
                  placeholder:text-[#B9B9B9] pb-2
                  ${isInputFocused ? 'pr-9' : ''} 
                `}
                placeholder={`${PRICE_PREFIX}0${PRICE_SUFFIX}`}
                value={formatPriceDisplay(field.value)}
                onChange={(e) => {
                  const nextValue = Number(toDigits(e.target.value) || '0');
                  field.onChange(nextValue);
                  caretBeforeSuffix(nextValue);
                }}
              />
            );
          }}
        />

        {!isInputFocused && (
          <button
            type="button"
            aria-label="편집"
            className="absolute -translate-y-1/2 rounded p-1 hover:bg-black/5 active:bg-black/10 transition-colors"
            style={{
              top: calculateButtonTop(),
              left: calculateEditButtonPosition(),
            }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { priceInputRef.current?.focus(); }}
            data-role="price-edit-btn"
          >
            <img src={Edit} alt="편집" className="w-4 h-4 opacity-70" />
          </button>
        )}

        {isInputFocused && (
          <button
            type="button"
            aria-label="지우기"
            className="absolute right-0 -translate-y-1/2 p-3 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
            style={{
              top: calculateButtonTop(),
            }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { 
              setValue('price', 0); 
              caretBeforeSuffix(0); 
              priceInputRef.current?.focus(); 
            }}
          >
            <img src={xIconUrl} alt="지우기" className="w-4 h-4 opacity-70" />
          </button>
        )}

        {/* 밑줄 애니메이션 */}
        <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-0.5 bg-black scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform duration-150 ease-out" />

        {errors.price && (
          <p className="text-red-500 text-sm mt-2">{errors.price.message}</p>
        )}
      </div>
    </div>
  );
}
