import '@ncdai/react-wheel-picker/style.css';

import * as WheelPickerPrimitive from '@ncdai/react-wheel-picker';

import { cn } from '@/shared/libs/utils';

type WheelPickerOption = WheelPickerPrimitive.WheelPickerOption;
type WheelPickerClassNames = WheelPickerPrimitive.WheelPickerClassNames;

function WheelPickerWrapper({
  className,
  ...props
}: React.ComponentProps<typeof WheelPickerPrimitive.WheelPickerWrapper>) {
  return (
    <WheelPickerPrimitive.WheelPickerWrapper
      className={cn(
        'w-56 rounded-lg bg-white px-1 dark:border-zinc-700/80 dark:bg-zinc-900',
        '*:data-rwp:first:*:data-rwp-highlight-wrapper:rounded-s-md',
        '*:data-rwp:last:*:data-rwp-highlight-wrapper:rounded-e-md',
        className
      )}
      {...props}
    />
  );
}

function WheelPicker({
  classNames,
  ...props
}: React.ComponentProps<typeof WheelPickerPrimitive.WheelPicker>) {
  return (
    <WheelPickerPrimitive.WheelPicker
      classNames={{
        optionItem: 'text-sub-gray dark:text-sub-gray',
        highlightWrapper:
          'bg-[#FDE1D2] text-main-orange dark:bg-[#FDE1D2] dark:text-main-orange',
        ...classNames,
      }}
      {...props}
    />
  );
}

export { WheelPicker, WheelPickerWrapper };
export type { WheelPickerClassNames, WheelPickerOption };
