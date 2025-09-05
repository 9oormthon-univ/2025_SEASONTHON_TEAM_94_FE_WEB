import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/components/ui/drawer';
import { Calendar } from '@/shared/components/ui/calendar';
import { InputField } from './InputField';
import { formatDateForDisplay } from '@/features/expenses/utils/dateUtils';
import type { ExpenseFormData } from '@/features/expenses/_lib/validation';

interface DatePickerFieldProps {
  control: Control<ExpenseFormData>;
  errors: FieldErrors<ExpenseFormData>;
  isCalendarOpen: boolean;
  onCalendarOpenChange: (open: boolean) => void;
}

// 날짜 선택 핸들러 분리
const createDateSelectHandler = (
  currentDate: Date,
  onChange: (date: Date) => void,
  onClose: () => void
) => {
  return (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        currentDate.getHours(),
        currentDate.getMinutes(),
        currentDate.getSeconds(),
        currentDate.getMilliseconds()
      );
      onChange(newDate);
      onClose();
    }
  };
};

export function DatePickerField({ 
  control, 
  errors, 
  isCalendarOpen, 
  onCalendarOpenChange 
}: DatePickerFieldProps) {
  return (
    <InputField label="지출일시" error={errors.selectedDate?.message}>
      <Controller
        name="selectedDate"
        control={control}
        render={({ field }) => (
          <Drawer
            open={isCalendarOpen}
            onOpenChange={onCalendarOpenChange}
          >
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between text-base text-[#3d3d3d] font-normal h-[60px] border-sub-gray"
              >
                {formatDateForDisplay(field.value)}
                <CalendarIcon className="w-4 h-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="w-auto overflow-hidden p-0">
              <DrawerHeader className="sr-only">
                <DrawerTitle>날짜 선택</DrawerTitle>
                <DrawerDescription>
                  지출 날짜를 선택하세요
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex flex-col">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={createDateSelectHandler(
                    field.value,
                    field.onChange,
                    () => onCalendarOpenChange(false)
                  )}
                  captionLayout="dropdown"
                  className="mx-auto [--cell-size:clamp(0px,calc(100vw/7.5),52px)] border-none"
                />
                {/* Time Picker */}
                <div className="px-4 py-4 border-t border-gray-200 mb-4">
                  <div className="relative">
                    <Input
                      type="time"
                      value={`${String(field.value.getHours()).padStart(
                        2,
                        '0'
                      )}:${String(field.value.getMinutes()).padStart(
                        2,
                        '0'
                      )}`}
                      onChange={e => {
                        const [hours, minutes] = e.target.value
                          .split(':')
                          .map(Number);
                        const newDate = new Date(field.value);
                        newDate.setHours(hours || 0);
                        newDate.setMinutes(minutes || 0);
                        field.onChange(newDate);
                      }}
                      className="w-full h-[50px] text-base text-[#3d3d3d] font-normal text-center pr-10 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        )}
      />
    </InputField>
  );
}
