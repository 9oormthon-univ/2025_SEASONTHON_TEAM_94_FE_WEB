// app/routes/expenses.$expenseId.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useExpenses } from "@/contexts/ExpenseContext";
import { EXPENSE_CATEGORIES, type Expense } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function classifyCategory(text: string): EXPENSE_CATEGORIES {
  const t = (text || "").toLowerCase();
  if (/netflix|유튜브|youtube|디즈니|디즈니\+|구독|통신비|요금제/.test(t)) return EXPENSE_CATEGORIES.FIXED;
  if (/월세|관리비|전기|가스|수도|임대료/.test(t)) return EXPENSE_CATEGORIES.FIXED;
  if (/커피|카페|식당|편의점|gs25|cu|세븐일레븐|스타벅스|버거|치킨|피자|맥도날드|롯데리아|bhc/.test(t)) {
    return EXPENSE_CATEGORIES.ADDITIONAL;
  }
  return EXPENSE_CATEGORIES.UNCLASSIFIED;
}

// 공통: 테두리 없는 인풋(포커스 시 밑줄만)
const bareInput =
  "w-full h-10 bg-transparent px-0 border-0 focus:outline-none focus:ring-0 " +
  "focus:border-b focus:border-foreground/30 placeholder:text-muted-foreground/70";
// 숫자 인풋(스핀버튼 숨김 + 우측정렬)
const bareNumber =
  `${bareInput} text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;
// 셀 내부 오른쪽에 놓일 작은 컨트롤(밑줄만, 테두리X)
const cellControl =
  "h-9 bg-transparent border-0 focus:outline-none focus:ring-0 " +
  "focus:border-b focus:border-foreground/30 text-sm";

// 오늘(yyyy-MM-dd)
function todayYMD() {
  const d = new Date();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export default function ExpenseDetail() {
  const { expenseId } = useParams();
  const navigate = useNavigate();
  const { expenses, updateExpense } = useExpenses();

  const origin = expenses.find((e) => String(e.id) === String(expenseId)) || null;

  // draft 기본값: 날짜 없으면 오늘로 자동
  const [draft, setDraft] = useState<Expense | null>(
    origin ? { ...origin, date: origin.date || todayYMD() } : null
  );

  // ==== 총액/인원 입력을 문자열로 관리(편집 중 강제값 방지) ====
  // 총액 입력
  const [amountStr, setAmountStr] = useState<string>(() => {
    if (!origin) return "";
    return String(Math.max(0, origin.amount || 0));
  });

  // 더치 인원
  const [sharedWithStr, setSharedWithStr] = useState<string>(() => {
    if (!origin) return "1";
    return String(Math.max(1, origin.sharedWith || 1));
  });

  // 파생 숫자값
  const totalAmount = useMemo(() => {
    const v = Number((amountStr || "0").replace(/[^0-9]/g, ""));
    return Number.isFinite(v) ? Math.max(0, v) : 0;
  }, [amountStr]);

  const sharedWith = useMemo(() => {
    const n = Number((sharedWithStr || "").replace(/[^0-9]/g, ""));
    return Number.isFinite(n) && n >= 1 ? n : 1;
  }, [sharedWithStr]);

  const perPerson = useMemo(() => {
    if (sharedWith <= 0) return 0;
    return Math.ceil(totalAmount / sharedWith);
  }, [totalAmount, sharedWith]);

  if (!draft)
    return <div className="p-6 text-center text-muted-foreground">항목을 찾을 수 없습니다.</div>;

  // 저장: 총액 그대로 저장, 1인 금액은 파생표시만
  const save = () => {
    const next: Expense = {
      ...draft,
      amount: totalAmount,
      sharedWith,
      date: draft.date || todayYMD(),
      place: draft.place?.trim() ?? "",
      memo: draft.memo ?? "",
    };

    try {
      updateExpense(next);
    } catch (e) {
      console.warn("updateExpense error (ignored)", e);
    } finally {
      const nextTab =
        next.category === EXPENSE_CATEGORIES.UNCLASSIFIED ? "unclassified" : "classified";
      navigate(`/expenses?tab=${nextTab}`);
    }
  };

  // 취소: 카테고리 탭으로 명확히 이동
  const cancel = () => {
    const nextTab =
      draft.category === EXPENSE_CATEGORIES.UNCLASSIFIED ? "unclassified" : "classified";
    navigate(`/expenses?tab=${nextTab}`);
  };

  const reclassify = () => {
    const next = classifyCategory(`${draft.place} ${draft.memo ?? ""}`);
    setDraft({ ...draft, category: next });
  };

  return (
    <div className="page-unboxed max-w-xl mx-auto px-4 py-3 space-y-6">
      {/* 상단: 날짜 / 제목 / 금액 */}
      <section>
        {/* ⬇️ 상단에서 날짜 직접 입력 (정보 섹션의 날짜 행 제거됨) */}
        <input
          type="date"
          value={draft.date || todayYMD()}
          onChange={(e) => setDraft({ ...draft, date: e.target.value })}
          className="text-xs text-muted-foreground mb-2 bg-transparent border-0 focus:outline-none focus:ring-0"
        />

        {/* 제목 */}
        <input
          value={draft.place}
          onChange={(e) => setDraft({ ...draft, place: e.target.value })}
          placeholder="상호/제목"
          className={`${bareInput} text-base font-semibold`}
        />

        {/* 제목 밑: 총 금액 · 인원 */}
        <div className="mt-1 text-[12px] text-muted-foreground">
          총 {totalAmount.toLocaleString()}원 · {sharedWith}명
        </div>

        {/* 금액(총액 입력) */}
        <div className="flex items-end justify-between mt-4">
          <div className="text-[11px] text-muted-foreground">총 금액</div>
          <div className="text-right">
            <input
              type="text"
              inputMode="numeric"
              value={amountStr}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, "");
                setAmountStr(v);
              }}
              onBlur={() => {
                if (amountStr.trim() === "") setAmountStr("0");
              }}
              className={`${bareNumber} text-2xl font-semibold w-44`}
            />
            {sharedWith > 1 && (
              <div className="mt-1 text-[11px] text-muted-foreground">
                1인 {perPerson.toLocaleString()}원
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 정보 섹션 (날짜 행 제거됨) */}
      <section className="rounded-xl border bg-background overflow-hidden">
        {/* 결제수단 */}
        <div className="flex items-center justify-between px-4 h-14 border-b">
          <span className="text-sm text-muted-foreground">결제수단</span>
          <select
            className={`${cellControl} pr-6`}
            value={draft.method as any}
            onChange={(e) => setDraft({ ...draft, method: e.target.value as any })}
          >
            <option value="현금">현금</option>
            <option value="카드">카드</option>
            <option value="계좌">계좌</option>
            <option value="기타">기타</option>
          </select>
        </div>

        {/* 더치 인원 */}
        <div className="flex items-center justify-between px-4 h-14 border-b">
          <span className="text-sm text-muted-foreground">더치 인원</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              className={`${cellControl} w-20 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
              value={sharedWithStr}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                setSharedWithStr(raw);
              }}
              onBlur={() => {
                if (sharedWithStr.trim() === "" || Number(sharedWithStr) < 1) {
                  setSharedWithStr("1");
                }
              }}
            />
            <Badge variant="secondary" className="text-[12px] px-2 h-6">
              {sharedWith}명 · 1인 {perPerson.toLocaleString()}원
            </Badge>
          </div>
        </div>

        {/* 분류 + 자동분류 */}
        <div className="flex items-center justify-between px-4 h-14 border-b">
          <span className="text-sm text-muted-foreground">분류</span>
          <div className="flex items-center gap-2">
            <select
              className={`${cellControl}`}
              value={draft.category}
              onChange={(e) =>
                setDraft({ ...draft, category: e.target.value as Expense["category"] })
              }
            >
              <option value={EXPENSE_CATEGORIES.UNCLASSIFIED}>미분류</option>
              <option value={EXPENSE_CATEGORIES.FIXED}>고정</option>
              <option value={EXPENSE_CATEGORIES.ADDITIONAL}>추가</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 text-sm"
              type="button"
              onClick={reclassify}
            >
              자동분류 재시도
            </Button>
          </div>
        </div>

        {/* 메모 */}
        <div className="px-4 py-3">
          <div className="text-sm text-muted-foreground mb-1">메모</div>
          <input
            value={draft.memo ?? ""}
            onChange={(e) => setDraft({ ...draft, memo: e.target.value })}
            placeholder="예: 친구랑 커피"
            className={`${bareInput} text-sm`}
          />
        </div>
      </section>

      {/* 하단 액션 */}
      <section className="flex justify-end gap-2">
        <Button variant="outline" size="sm" className="h-9 px-3 text-sm" type="button" onClick={cancel}>
          취소
        </Button>
        <Button size="sm" className="h-9 px-4 text-sm" type="button" onClick={save}>
          저장
        </Button>
      </section>
    </div>
  );
}
