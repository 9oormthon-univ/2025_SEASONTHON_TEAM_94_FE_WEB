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
import { logout } from "@/features/more/api/user";
import { useNavigate } from "react-router-dom";

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
          "rounded-2xl border-2 shadow-md p-6 sm:p-8 max-w-xs",
          "border-[#0A2A5E]"
        )}
      >
        <AlertDialogHeader className="text-center">
          <AlertDialogTitle className="text-base sm:text-lg font-normal text-[#0A2A5E]">
            로그아웃 하시겠습니까?
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter
  className={cn(
    "mt-4 flex flex-row justify-center gap-4", 
  )}
>
  <AlertDialogCancel
    className={cn(
      buttonVariants({ variant: "outline" }),
      "h-11 px-6 rounded-lg text-sm border-[#0A2A5E] text-[#0A2A5E] bg-white"
    )}
  >
    취소
  </AlertDialogCancel>

  <AlertDialogAction
    onClick={onConfirm}
    className={cn(
      buttonVariants(),
      "h-11 px-6 rounded-lg text-sm bg-[#0A2A5E] text-white hover:bg-[#0A2A5E]/90"
    )}
  >
    확인
  </AlertDialogAction>
</AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
}
