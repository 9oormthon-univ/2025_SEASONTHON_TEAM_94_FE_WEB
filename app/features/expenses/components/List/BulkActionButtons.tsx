import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/shared/components/ui/button';
import type { ExpenseType } from '@/shared/types/expense';

interface BulkActionButtonsProps {
  hasSelection: boolean;
  onBulkUpdate: (type: ExpenseType) => void;
  isLoading: boolean;
}

export function BulkActionButtons({
  hasSelection,
  onBulkUpdate,
  isLoading,
}: BulkActionButtonsProps) {
  return (
    <AnimatePresence>
      {hasSelection && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            duration: 0.2,
            ease: 'easeOut',
          }}
          className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 py-4 z-50"
        >
          <div className="flex gap-3">
            {/* 고정지출 버튼 */}
            <motion.div
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="flex-1"
            >
              <Button
                variant="outline"
                onClick={() => onBulkUpdate('FIXED_EXPENSE')}
                disabled={isLoading}
                className="w-full h-[52px] text-base font-bold text-main-orange border-main-orange hover:bg-orange-50 transition-colors rounded-[10px]"
              >
                고정지출
              </Button>
            </motion.div>

            {/* 초과지출 버튼 */}
            <motion.div
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="flex-1"
            >
              <Button
                onClick={() => onBulkUpdate('OVER_EXPENSE')}
                disabled={isLoading}
                className={`w-full h-[52px] text-white text-base font-bold rounded-[10px] transition-colors ${
                  isLoading
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-main-orange hover:bg-main-orange/90'
                }`}
              >
                {isLoading ? '처리 중...' : '초과지출'}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
