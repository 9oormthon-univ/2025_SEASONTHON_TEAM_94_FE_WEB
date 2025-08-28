import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, useLoaderData, useLocation, Outlet, Link, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, redirect, useSearchParams, useParams, useNavigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as React from "react";
import { createContext, useState, useCallback, useContext, useEffect, useMemo } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const EXPENSE_CATEGORIES$1 = {
  UNCLASSIFIED: "unclassified",
  FIXED: "fixed",
  ADDITIONAL: "additional"
};
function fetchAllExpenses() {
  var _a;
  if (typeof window !== "undefined" && window.Android && window.Android.getAllExpenses) {
    try {
      const expensesJson = window.Android.getAllExpenses();
      return JSON.parse(expensesJson || "[]");
    } catch (e) {
      console.error("Failed to parse expenses from native", e);
      return [];
    }
  }
  if (typeof window !== "undefined" && ((_a = process == null ? void 0 : process.env) == null ? void 0 : _a.NODE_ENV) === "development") {
    console.warn("Native bridge not found or SSR environment. Using mock data.");
  }
  return [
    { id: "1", place: "스타벅스", amount: 6500, date: "2025-08-25T10:30:00Z", category: EXPENSE_CATEGORIES$1.UNCLASSIFIED, sharedWith: 1 },
    { id: "2", place: "Netflix", amount: 17e3, date: "2025-08-25T09:00:00Z", category: EXPENSE_CATEGORIES$1.FIXED, sharedWith: 1 },
    { id: "3", place: "GS25", amount: 3200, date: "2025-08-24T18:00:00Z", category: EXPENSE_CATEGORIES$1.ADDITIONAL, sharedWith: 2 }
  ];
}
function updateExpense(expense) {
  var _a;
  if (typeof window !== "undefined" && window.Android && window.Android.updateExpense) {
    window.Android.updateExpense(JSON.stringify(expense));
  } else if (typeof window !== "undefined" && ((_a = process == null ? void 0 : process.env) == null ? void 0 : _a.NODE_ENV) === "development") {
    console.log("Mock update expense:", expense);
  }
}
const ExpenseContext = createContext(null);
function ExpenseProvider({
  children,
  initialExpenses
}) {
  const [expenses, setExpenses] = useState(initialExpenses || []);
  const updateExpense$1 = useCallback((updatedExpense) => {
    updateExpense(updatedExpense);
    setExpenses(
      (prev) => prev.map((exp) => exp.id === updatedExpense.id ? updatedExpense : exp)
    );
  }, []);
  const value = { expenses, updateExpense: updateExpense$1 };
  return /* @__PURE__ */ jsx(ExpenseContext.Provider, { value, children });
}
const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
async function loader$1() {
  const expenses = fetchAllExpenses();
  return {
    expenses
  };
}
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "ko",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
      }), /* @__PURE__ */ jsx("meta", {
        name: "format-detection",
        content: "telephone=no"
      }), /* @__PURE__ */ jsx("meta", {
        name: "apple-mobile-web-app-capable",
        content: "yes"
      }), /* @__PURE__ */ jsx("meta", {
        name: "apple-mobile-web-app-status-bar-style",
        content: "default"
      }), /* @__PURE__ */ jsx("meta", {
        name: "apple-mobile-web-app-title",
        content: "StopUsingIt"
      }), /* @__PURE__ */ jsx("meta", {
        name: "mobile-web-app-capable",
        content: "yes"
      }), /* @__PURE__ */ jsx("meta", {
        name: "theme-color",
        content: "#0f172a"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  const {
    expenses: initialExpenses
  } = useLoaderData();
  const location = useLocation();
  useEffect(() => {
    const preventZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    const preventContextMenu = (e) => {
      e.preventDefault();
    };
    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (e) => {
      const now = (/* @__PURE__ */ new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };
    const preventKeyboardShortcuts = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "-" || e.key === "=" || e.key === "0" || e.key === "9" || e.key === "c" || e.key === "v" || e.key === "x" || e.key === "a")) {
        e.preventDefault();
      }
      if (e.key === "F11" || e.key === "F12") {
        e.preventDefault();
      }
    };
    document.addEventListener("touchstart", preventZoom, {
      passive: false
    });
    document.addEventListener("touchend", preventDoubleTapZoom, {
      passive: false
    });
    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("keydown", preventKeyboardShortcuts);
    const preventScroll = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener("touchmove", preventScroll, {
      passive: false
    });
    return () => {
      document.removeEventListener("touchstart", preventZoom);
      document.removeEventListener("touchend", preventDoubleTapZoom);
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", preventKeyboardShortcuts);
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);
  const getLinkClass = (path, tab) => {
    const baseClass = "flex-1 text-center py-3 text-sm font-medium transition-all duration-200";
    const isActive = location.pathname === path && (tab ? new URLSearchParams(location.search).get("tab") === tab : true);
    return isActive ? `${baseClass} text-primary bg-accent` : `${baseClass} text-muted-foreground hover:text-foreground`;
  };
  return /* @__PURE__ */ jsx(ExpenseProvider, {
    initialExpenses,
    children: /* @__PURE__ */ jsxs("div", {
      className: "app-container",
      children: [/* @__PURE__ */ jsx("main", {
        className: "content",
        children: /* @__PURE__ */ jsx(Outlet, {})
      }), /* @__PURE__ */ jsxs("nav", {
        className: "bottom-nav",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/expenses?tab=unclassified",
          className: getLinkClass("/expenses", "unclassified"),
          children: [/* @__PURE__ */ jsx("svg", {
            className: "w-6 h-6",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /* @__PURE__ */ jsx("path", {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            })
          }), /* @__PURE__ */ jsx("span", {
            children: "미분류"
          })]
        }), /* @__PURE__ */ jsxs(Link, {
          to: "/expenses?tab=classified",
          className: getLinkClass("/expenses", "classified"),
          children: [/* @__PURE__ */ jsx("svg", {
            className: "w-6 h-6",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /* @__PURE__ */ jsx("path", {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            })
          }), /* @__PURE__ */ jsx("span", {
            children: "분류"
          })]
        })]
      })]
    })
  });
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
function loader() {
  return redirect("/expenses");
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const EXPENSE_CATEGORIES = {
  UNCLASSIFIED: "unclassified",
  FIXED: "fixed",
  ADDITIONAL: "additional"
};
const expenses__index = UNSAFE_withComponentProps(function ExpensesIndex() {
  const {
    expenses
  } = useExpenses();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "unclassified";
  const unclassified = expenses.filter((e) => e.category === EXPENSE_CATEGORIES.UNCLASSIFIED);
  const fixed = expenses.filter((e) => e.category === EXPENSE_CATEGORIES.FIXED);
  const additional = expenses.filter((e) => e.category === EXPENSE_CATEGORIES.ADDITIONAL);
  const classified = [...fixed, ...additional];
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric"
    });
  };
  const renderList = (list) => {
    if (list.length === 0) {
      return /* @__PURE__ */ jsx(Card, {
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "py-12 text-center",
          children: [/* @__PURE__ */ jsx("div", {
            className: "text-4xl mb-4",
            children: "📝"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground text-base",
            children: "항목이 없습니다."
          })]
        })
      });
    }
    return list.map((exp) => /* @__PURE__ */ jsx(Link, {
      to: `/expenses/${exp.id}`,
      className: "block",
      children: /* @__PURE__ */ jsx(Card, {
        className: "transition-all duration-200 hover:shadow-lg hover:border-primary/20 active:scale-[0.98]",
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "p-5",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex justify-between items-center",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex-1",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "font-bold text-lg text-foreground mb-1",
                children: exp.place
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-2",
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-sm text-muted-foreground",
                  children: formatDate(exp.date)
                }), /* @__PURE__ */ jsx(Badge, {
                  variant: exp.category === EXPENSE_CATEGORIES.UNCLASSIFIED ? "destructive" : "default",
                  className: "text-xs",
                  children: exp.category === EXPENSE_CATEGORIES.FIXED ? "고정" : exp.category === EXPENSE_CATEGORIES.ADDITIONAL ? "추가" : "미분류"
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "text-right",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "font-bold text-xl text-foreground mb-1",
                children: [Math.floor(exp.amount / exp.sharedWith).toLocaleString(), "원"]
              }), /* @__PURE__ */ jsxs("div", {
                className: "text-sm text-muted-foreground",
                children: ["총 ", exp.amount.toLocaleString(), "원"]
              }), exp.sharedWith > 1 && /* @__PURE__ */ jsxs(Badge, {
                variant: "secondary",
                className: "text-xs mt-1",
                children: [exp.sharedWith, "명 분할"]
              })]
            })]
          })
        })
      })
    }, exp.id));
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6",
    children: [/* @__PURE__ */ jsx(Card, {
      className: "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20",
      children: /* @__PURE__ */ jsxs(CardHeader, {
        className: "text-center pb-6",
        children: [/* @__PURE__ */ jsx("div", {
          className: "text-4xl mb-4",
          children: activeTab === "unclassified" ? "❓" : "✅"
        }), /* @__PURE__ */ jsx(CardTitle, {
          className: "text-2xl font-bold",
          children: activeTab === "unclassified" ? "미분류 지출" : "분류된 지출"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-muted-foreground text-base",
          children: activeTab === "unclassified" ? `${unclassified.length}개의 미분류 항목` : `${classified.length}개의 분류된 항목`
        })]
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "space-y-3",
      children: activeTab === "unclassified" ? unclassified.length > 0 ? renderList(unclassified) : /* @__PURE__ */ jsx(Card, {
        className: "border-dashed border-2 border-muted-foreground/25",
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "flex flex-col items-center justify-center py-8 text-center",
          children: [/* @__PURE__ */ jsx("div", {
            className: "text-4xl mb-4",
            children: "🎉"
          }), /* @__PURE__ */ jsx("h3", {
            className: "text-lg font-semibold mb-2",
            children: "모든 지출이 분류되었어요!"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground text-sm",
            children: "미분류 항목이 없습니다."
          })]
        })
      }) : classified.length > 0 ? renderList(classified) : /* @__PURE__ */ jsx(Card, {
        className: "border-dashed border-2 border-muted-foreground/25",
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "flex flex-col items-center justify-center py-8 text-center",
          children: [/* @__PURE__ */ jsx("div", {
            className: "text-4xl mb-4",
            children: "📝"
          }), /* @__PURE__ */ jsx("h3", {
            className: "text-lg font-semibold mb-2",
            children: "분류된 지출이 없어요"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground text-sm",
            children: "지출을 추가하고 분류해보세요."
          })]
        })
      })
    })]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: expenses__index
}, Symbol.toStringTag, { value: "Module" }));
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
function classifyCategory(text) {
  const t = (text || "").toLowerCase();
  if (/netflix|유튜브|youtube|디즈니|디즈니\+|구독|통신비|요금제/.test(t)) return EXPENSE_CATEGORIES.FIXED;
  if (/월세|관리비|전기|가스|수도|임대료/.test(t)) return EXPENSE_CATEGORIES.FIXED;
  if (/커피|카페|식당|편의점|gs25|cu|세븐일레븐|스타벅스|버거|치킨|피자|맥도날드|롯데리아|bhc/.test(t)) {
    return EXPENSE_CATEGORIES.ADDITIONAL;
  }
  return EXPENSE_CATEGORIES.UNCLASSIFIED;
}
const bareInput = "w-full h-10 bg-transparent px-0 border-0 focus:outline-none focus:ring-0 focus:border-b focus:border-foreground/30 placeholder:text-muted-foreground/70";
const bareNumber = `${bareInput} text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;
const cellControl = "h-9 bg-transparent border-0 focus:outline-none focus:ring-0 focus:border-b focus:border-foreground/30 text-sm";
function todayYMD() {
  const d = /* @__PURE__ */ new Date();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
const expenses_$expenseId = UNSAFE_withComponentProps(function ExpenseDetail() {
  const {
    expenseId
  } = useParams();
  const navigate = useNavigate();
  const {
    expenses,
    updateExpense: updateExpense2
  } = useExpenses();
  const origin = expenses.find((e) => String(e.id) === String(expenseId)) || null;
  const [draft, setDraft] = useState(origin ? {
    ...origin,
    date: origin.date || todayYMD()
  } : null);
  const [amountStr, setAmountStr] = useState(() => {
    if (!origin) return "";
    return String(Math.max(0, origin.amount || 0));
  });
  const [sharedWithStr, setSharedWithStr] = useState(() => {
    if (!origin) return "1";
    return String(Math.max(1, origin.sharedWith || 1));
  });
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
  if (!draft) return /* @__PURE__ */ jsx("div", {
    className: "p-6 text-center text-muted-foreground",
    children: "항목을 찾을 수 없습니다."
  });
  const save = () => {
    var _a;
    const next = {
      ...draft,
      amount: totalAmount,
      sharedWith,
      date: draft.date || todayYMD(),
      place: ((_a = draft.place) == null ? void 0 : _a.trim()) ?? "",
      memo: draft.memo ?? ""
    };
    try {
      updateExpense2(next);
    } catch (e) {
      console.warn("updateExpense error (ignored)", e);
    } finally {
      const nextTab = next.category === EXPENSE_CATEGORIES.UNCLASSIFIED ? "unclassified" : "classified";
      navigate(`/expenses?tab=${nextTab}`);
    }
  };
  const cancel = () => {
    const nextTab = draft.category === EXPENSE_CATEGORIES.UNCLASSIFIED ? "unclassified" : "classified";
    navigate(`/expenses?tab=${nextTab}`);
  };
  const reclassify = () => {
    const next = classifyCategory(`${draft.place} ${draft.memo ?? ""}`);
    setDraft({
      ...draft,
      category: next
    });
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "page-unboxed max-w-xl mx-auto px-4 py-3 space-y-6",
    children: [/* @__PURE__ */ jsxs("section", {
      children: [/* @__PURE__ */ jsx("input", {
        type: "date",
        value: draft.date || todayYMD(),
        onChange: (e) => setDraft({
          ...draft,
          date: e.target.value
        }),
        className: "text-xs text-muted-foreground mb-2 bg-transparent border-0 focus:outline-none focus:ring-0"
      }), /* @__PURE__ */ jsx("input", {
        value: draft.place,
        onChange: (e) => setDraft({
          ...draft,
          place: e.target.value
        }),
        placeholder: "상호/제목",
        className: `${bareInput} text-base font-semibold`
      }), /* @__PURE__ */ jsxs("div", {
        className: "mt-1 text-[12px] text-muted-foreground",
        children: ["총 ", totalAmount.toLocaleString(), "원 · ", sharedWith, "명"]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-end justify-between mt-4",
        children: [/* @__PURE__ */ jsx("div", {
          className: "text-[11px] text-muted-foreground",
          children: "총 금액"
        }), /* @__PURE__ */ jsxs("div", {
          className: "text-right",
          children: [/* @__PURE__ */ jsx("input", {
            type: "text",
            inputMode: "numeric",
            value: amountStr,
            onChange: (e) => {
              const v = e.target.value.replace(/[^0-9]/g, "");
              setAmountStr(v);
            },
            onBlur: () => {
              if (amountStr.trim() === "") setAmountStr("0");
            },
            className: `${bareNumber} text-2xl font-semibold w-44`
          }), sharedWith > 1 && /* @__PURE__ */ jsxs("div", {
            className: "mt-1 text-[11px] text-muted-foreground",
            children: ["1인 ", perPerson.toLocaleString(), "원"]
          })]
        })]
      })]
    }), /* @__PURE__ */ jsxs("section", {
      className: "rounded-xl border bg-background overflow-hidden",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between px-4 h-14 border-b",
        children: [/* @__PURE__ */ jsx("span", {
          className: "text-sm text-muted-foreground",
          children: "결제수단"
        }), /* @__PURE__ */ jsxs("select", {
          className: `${cellControl} pr-6`,
          value: draft.method,
          onChange: (e) => setDraft({
            ...draft,
            method: e.target.value
          }),
          children: [/* @__PURE__ */ jsx("option", {
            value: "현금",
            children: "현금"
          }), /* @__PURE__ */ jsx("option", {
            value: "카드",
            children: "카드"
          }), /* @__PURE__ */ jsx("option", {
            value: "계좌",
            children: "계좌"
          }), /* @__PURE__ */ jsx("option", {
            value: "기타",
            children: "기타"
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between px-4 h-14 border-b",
        children: [/* @__PURE__ */ jsx("span", {
          className: "text-sm text-muted-foreground",
          children: "더치 인원"
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-2",
          children: [/* @__PURE__ */ jsx("input", {
            type: "text",
            inputMode: "numeric",
            className: `${cellControl} w-20 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`,
            value: sharedWithStr,
            onChange: (e) => {
              const raw = e.target.value.replace(/[^0-9]/g, "");
              setSharedWithStr(raw);
            },
            onBlur: () => {
              if (sharedWithStr.trim() === "" || Number(sharedWithStr) < 1) {
                setSharedWithStr("1");
              }
            }
          }), /* @__PURE__ */ jsxs(Badge, {
            variant: "secondary",
            className: "text-[12px] px-2 h-6",
            children: [sharedWith, "명 · 1인 ", perPerson.toLocaleString(), "원"]
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between px-4 h-14 border-b",
        children: [/* @__PURE__ */ jsx("span", {
          className: "text-sm text-muted-foreground",
          children: "분류"
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-2",
          children: [/* @__PURE__ */ jsxs("select", {
            className: `${cellControl}`,
            value: draft.category,
            onChange: (e) => setDraft({
              ...draft,
              category: e.target.value
            }),
            children: [/* @__PURE__ */ jsx("option", {
              value: EXPENSE_CATEGORIES.UNCLASSIFIED,
              children: "미분류"
            }), /* @__PURE__ */ jsx("option", {
              value: EXPENSE_CATEGORIES.FIXED,
              children: "고정"
            }), /* @__PURE__ */ jsx("option", {
              value: EXPENSE_CATEGORIES.ADDITIONAL,
              children: "추가"
            })]
          }), /* @__PURE__ */ jsx(Button, {
            variant: "outline",
            size: "sm",
            className: "h-9 px-3 text-sm",
            type: "button",
            onClick: reclassify,
            children: "자동분류 재시도"
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "px-4 py-3",
        children: [/* @__PURE__ */ jsx("div", {
          className: "text-sm text-muted-foreground mb-1",
          children: "메모"
        }), /* @__PURE__ */ jsx("input", {
          value: draft.memo ?? "",
          onChange: (e) => setDraft({
            ...draft,
            memo: e.target.value
          }),
          placeholder: "예: 친구랑 커피",
          className: `${bareInput} text-sm`
        })]
      })]
    }), /* @__PURE__ */ jsxs("section", {
      className: "flex justify-end gap-2",
      children: [/* @__PURE__ */ jsx(Button, {
        variant: "outline",
        size: "sm",
        className: "h-9 px-3 text-sm",
        type: "button",
        onClick: cancel,
        children: "취소"
      }), /* @__PURE__ */ jsx(Button, {
        size: "sm",
        className: "h-9 px-4 text-sm",
        type: "button",
        onClick: save,
        children: "저장"
      })]
    })]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: expenses_$expenseId
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-N6gxNiiC.js", "imports": ["/assets/chunk-PVWAREVJ-DnzPyBVa.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-DF59YRIn.js", "imports": ["/assets/chunk-PVWAREVJ-DnzPyBVa.js", "/assets/ExpenseContext-dL53E0fq.js"], "css": ["/assets/root-DOMFUFUK.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_index-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/expenses._index": { "id": "routes/expenses._index", "parentId": "root", "path": "expenses", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/expenses._index-Cm9AtOtj.js", "imports": ["/assets/chunk-PVWAREVJ-DnzPyBVa.js", "/assets/ExpenseContext-dL53E0fq.js", "/assets/constants-CZolnTmg.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/expenses.$expenseId": { "id": "routes/expenses.$expenseId", "parentId": "root", "path": "expenses/:expenseId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/expenses._expenseId-ChYyi_h-.js", "imports": ["/assets/chunk-PVWAREVJ-DnzPyBVa.js", "/assets/ExpenseContext-dL53E0fq.js", "/assets/constants-CZolnTmg.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-9becf349.js", "version": "9becf349", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/expenses._index": {
    id: "routes/expenses._index",
    parentId: "root",
    path: "expenses",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/expenses.$expenseId": {
    id: "routes/expenses.$expenseId",
    parentId: "root",
    path: "expenses/:expenseId",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
