import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

type NavToast = {
  type?: "success" | "error" | "info" | "warning";
  message: string;
  description?: string;
  duration?: number;
};

export function useNavToast() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const t = (location.state as any)?.toast as NavToast | undefined;
    if (!t) return;

    const fn = t.type ? (toast as any)[t.type] : toast;
    fn(t.message, { description: t.description, duration: t.duration ?? 2000 });

    navigate(location.pathname, { replace: true, state: {} });
  }, [location, navigate]);
}
