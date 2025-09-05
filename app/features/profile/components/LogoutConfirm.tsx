import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/shared/components/ui/alert-dialog";
import { buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/utils";
import { logout } from "@/features/profile/api/user";
import { useNavigate } from "react-router-dom";
import warningIcon from "@/assets/warning.svg";

type Props = {
  children: React.ReactNode;
  redirectTo?: string;
};

export default function LogoutConfirm({ children, redirectTo = "/" }: Props) {
  const navigate = useNavigate();

  const onConfirm = async () => {
    await logout();
    navigate(redirectTo, { replace: true });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent
        className={cn(
          "rounded-2xl px-7 py-4 max-w-xs shadow-md gap-2",
          "border border-[#E5E7EB] bg-white"
        )}
      >
        <AlertDialogHeader className="text-center p-0">
          <img src={warningIcon} alt="" aria-hidden className="mx-auto mb-1 h-10 w-10" />
          <AlertDialogTitle className="text-[15px] font-semibold text-[#111]">
            정말로 로그아웃할까요?
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-1 grid grid-cols-1 gap-2 px-3 sm:px-4">
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              buttonVariants(),
              "h-10 rounded-md text-sm font-semibold",
              "bg-[#FF6200] text-white hover:bg-[#FF6200]/90"
            )}
          >
            확인
          </AlertDialogAction>

          <AlertDialogCancel
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-10 rounded-md text-sm font-semibold",
              "border-[#FF6200] text-[#FF6200] bg-white hover:bg-white"
            )}
          >
            취소
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
