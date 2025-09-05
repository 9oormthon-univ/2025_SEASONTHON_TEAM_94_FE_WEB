import { Card, CardContent } from '@/shared/components/ui/card';
import Money from '@/features/reports/components/Money';
import { fmt } from '@/features/reports/utils/number';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

type Props = {
  total: number;
  onOpenExpenses: () => void;
};

export default function ExpenseCard({ total, onOpenExpenses }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card className="rounded-2xl cursor-pointer border-0 shadow-none">
        <CardContent
          className="p-5 min-h-[110px] flex items-center justify-between"
          onClick={onOpenExpenses}
        >
          <div className="flex flex-col justify-center">
            <div className="text-sm text-gray-900 font-medium">지출</div>
            <div className="mt-2 text-xl font-bold text-gray-900">
              <Money>- {fmt(total)}</Money>
            </div>
          </div>
          <motion.div
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
