import { useState, useCallback } from 'react';

/**
 * 일괄 선택 관리 훅
 * 여러 항목의 선택 상태를 관리하는 기능을 제공합니다.
 */
export function useBulkSelection<T extends { id: number }>() {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // 개별 항목 선택/해제 핸들러
  const handleItemSelect = useCallback((itemId: number, checked: boolean) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  }, []);

  // 전체 선택/해제 핸들러
  const handleSelectAll = useCallback((items: T[], checked: boolean) => {
    if (checked) {
      const allIds = new Set(items.map(item => item.id));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  }, []);

  // 선택된 항목들 반환
  const getSelectedItems = useCallback(
    (items: T[]) => {
      return items.filter(item => selectedIds.has(item.id));
    },
    [selectedIds]
  );

  // 선택 상태 초기화
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // 선택된 항목이 있는지 확인
  const hasSelection = selectedIds.size > 0;

  return {
    selectedIds,
    hasSelection,
    handleItemSelect,
    handleSelectAll,
    getSelectedItems,
    clearSelection,
  };
}
