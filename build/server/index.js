import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, useLoaderData, useLocation, Outlet, Link, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, redirect, useParams, useNavigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as React from "react";
import { createContext, useState, useCallback, useContext } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as ProgressPrimitive from "@radix-ui/react-progress";
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
function fetchAllExpenses() {
  if (typeof window !== "undefined" && window.Android && window.Android.getAllExpenses) {
    try {
      const expensesJson = window.Android.getAllExpenses();
      return JSON.parse(expensesJson || "[]");
    } catch (e) {
      console.error("Failed to parse expenses from native", e);
      return [];
    }
  }
  console.warn("Native bridge not found or SSR environment. Using mock data.");
  return [
    { id: "1", place: "스타벅스", amount: 6500, date: "2025-08-25T10:30:00Z", category: "unclassified", sharedWith: 1 },
    { id: "2", place: "Netflix", amount: 17e3, date: "2025-08-25T09:00:00Z", category: "fixed", sharedWith: 1 },
    { id: "3", place: "GS25", amount: 3200, date: "2025-08-24T18:00:00Z", category: "additional", sharedWith: 2 }
  ];
}
function updateExpense(expense) {
  if (typeof window !== "undefined" && window.Android && window.Android.updateExpense) {
    window.Android.updateExpense(JSON.stringify(expense));
  } else {
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
        content: "width=device-width, initial-scale=1"
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
  const getLinkClass = (path) => {
    const baseClass = "flex-1 text-center py-3 text-sm font-medium transition-colors";
    return location.pathname === path ? `${baseClass} text-primary bg-secondary` : `${baseClass} text-muted-foreground hover:text-foreground`;
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
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/expenses",
          className: getLinkClass("/expenses"),
          children: "지출내역"
        }), /* @__PURE__ */ jsx(Link, {
          to: "/report",
          className: getLinkClass("/report"),
          children: "리포트"
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
const expenses__index = UNSAFE_withComponentProps(function ExpensesIndex() {
  const {
    expenses
  } = useExpenses();
  const unclassified = expenses.filter((e) => e.category === "unclassified");
  const fixed = expenses.filter((e) => e.category === "fixed");
  const additional = expenses.filter((e) => e.category === "additional");
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
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "py-8",
          children: /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground text-center",
            children: "항목이 없습니다."
          })
        })
      });
    }
    return list.map((exp) => /* @__PURE__ */ jsx(Link, {
      to: `/expenses/${exp.id}`,
      className: "block",
      children: /* @__PURE__ */ jsx(Card, {
        className: "transition-all hover:shadow-md hover:border-primary/20",
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "p-4",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex justify-between items-center",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex-1",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "font-medium text-foreground",
                children: exp.place
              }), /* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground",
                children: formatDate(exp.date)
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "text-right",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "font-semibold text-foreground",
                children: [Math.floor(exp.amount / exp.sharedWith).toLocaleString(), "원"]
              }), exp.sharedWith > 1 && /* @__PURE__ */ jsxs(Badge, {
                variant: "secondary",
                className: "text-xs",
                children: [exp.sharedWith, "명"]
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
      children: /* @__PURE__ */ jsxs(CardHeader, {
        children: [/* @__PURE__ */ jsx(CardTitle, {
          children: "지출 내역"
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-muted-foreground",
          children: ["총 ", expenses.length, "개의 지출 항목"]
        })]
      })
    }), /* @__PURE__ */ jsxs("section", {
      className: "space-y-4",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-2",
        children: [/* @__PURE__ */ jsx(Badge, {
          variant: "destructive",
          className: "w-3 h-3 p-0 rounded-full"
        }), /* @__PURE__ */ jsxs("h3", {
          className: "text-lg font-semibold",
          children: ["미분류 (", unclassified.length, ")"]
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "space-y-3",
        children: renderList(unclassified)
      })]
    }), /* @__PURE__ */ jsxs("section", {
      className: "space-y-4",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-2",
        children: [/* @__PURE__ */ jsx(Badge, {
          className: "w-3 h-3 p-0 rounded-full bg-blue-500"
        }), /* @__PURE__ */ jsxs("h3", {
          className: "text-lg font-semibold",
          children: ["고정지출 (", fixed.length, ")"]
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "space-y-3",
        children: renderList(fixed)
      })]
    }), /* @__PURE__ */ jsxs("section", {
      className: "space-y-4",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-2",
        children: [/* @__PURE__ */ jsx(Badge, {
          className: "w-3 h-3 p-0 rounded-full bg-green-500"
        }), /* @__PURE__ */ jsxs("h3", {
          className: "text-lg font-semibold",
          children: ["추가지출 (", additional.length, ")"]
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "space-y-3",
        children: renderList(additional)
      })]
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
const expenses_$expenseId = UNSAFE_withComponentProps(function ExpenseDetail() {
  const {
    expenseId
  } = useParams();
  const navigate = useNavigate();
  const {
    expenses,
    updateExpense: updateExpense2
  } = useExpenses();
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const expense = expenses.find((e) => e.id === expenseId);
  if (!expense) {
    return /* @__PURE__ */ jsx("div", {
      className: "flex flex-col items-center justify-center min-h-[50vh]",
      children: /* @__PURE__ */ jsx(Card, {
        className: "w-full max-w-md",
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "text-center py-8",
          children: [/* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground text-lg mb-4",
            children: "지출 내역을 찾을 수 없습니다."
          }), /* @__PURE__ */ jsx(Button, {
            onClick: () => navigate(-1),
            children: "목록으로 돌아가기"
          })]
        })
      })
    });
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long"
    });
  };
  const getCategoryText = (category) => {
    switch (category) {
      case "fixed":
        return "고정지출";
      case "additional":
        return "추가지출";
      default:
        return "미분류";
    }
  };
  const handleCategorize = (newCategory) => {
    updateExpense2({
      ...expense,
      category: newCategory
    });
    setFeedbackMessage(`${getCategoryText(newCategory)}로 분류되었습니다.`);
    setTimeout(() => setFeedbackMessage(""), 2e3);
  };
  const handleSplit = (count) => {
    updateExpense2({
      ...expense,
      sharedWith: count
    });
    setFeedbackMessage(`${count}명으로 분할되었습니다.`);
    setTimeout(() => setFeedbackMessage(""), 2e3);
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6",
    children: [/* @__PURE__ */ jsx(Button, {
      variant: "ghost",
      onClick: () => navigate(-1),
      children: "← 뒤로가기"
    }), /* @__PURE__ */ jsxs(Card, {
      children: [/* @__PURE__ */ jsxs(CardHeader, {
        className: "text-center",
        children: [/* @__PURE__ */ jsx(CardTitle, {
          children: expense.place
        }), /* @__PURE__ */ jsx("p", {
          className: "text-muted-foreground",
          children: formatDate(expense.date)
        })]
      }), /* @__PURE__ */ jsxs(CardContent, {
        className: "space-y-4",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex justify-between items-center py-3 border-b",
          children: [/* @__PURE__ */ jsx("span", {
            className: "font-medium",
            children: "총 금액"
          }), /* @__PURE__ */ jsxs("span", {
            className: "text-xl font-bold",
            children: [expense.amount.toLocaleString(), "원"]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between items-center py-3 border-b",
          children: [/* @__PURE__ */ jsx("span", {
            className: "font-medium",
            children: "결제 분류"
          }), /* @__PURE__ */ jsx(Badge, {
            variant: expense.category === "unclassified" ? "destructive" : "default",
            children: getCategoryText(expense.category)
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between items-center py-3 border-b",
          children: [/* @__PURE__ */ jsx("span", {
            className: "font-medium",
            children: "분할 인원"
          }), /* @__PURE__ */ jsxs("span", {
            className: "text-lg font-semibold",
            children: [expense.sharedWith, "명"]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between items-center py-3 bg-secondary rounded-lg px-4",
          children: [/* @__PURE__ */ jsx("span", {
            className: "font-medium",
            children: "개인 부담금"
          }), /* @__PURE__ */ jsxs("span", {
            className: "text-xl font-bold",
            children: [Math.floor(expense.amount / expense.sharedWith).toLocaleString(), "원"]
          })]
        })]
      })]
    }), feedbackMessage && /* @__PURE__ */ jsx(Card, {
      className: "border-green-200 bg-green-50",
      children: /* @__PURE__ */ jsx(CardContent, {
        className: "py-3 text-center text-green-800",
        children: feedbackMessage
      })
    }), expense.category === "unclassified" && /* @__PURE__ */ jsxs(Card, {
      children: [/* @__PURE__ */ jsx(CardHeader, {
        children: /* @__PURE__ */ jsx(CardTitle, {
          className: "text-lg",
          children: "분류 지정"
        })
      }), /* @__PURE__ */ jsx(CardContent, {
        children: /* @__PURE__ */ jsxs("div", {
          className: "grid grid-cols-2 gap-3",
          children: [/* @__PURE__ */ jsx(Button, {
            onClick: () => handleCategorize("fixed"),
            className: "w-full",
            variant: "default",
            children: "고정지출"
          }), /* @__PURE__ */ jsx(Button, {
            onClick: () => handleCategorize("additional"),
            className: "w-full",
            variant: "default",
            children: "추가지출"
          })]
        })
      })]
    }), /* @__PURE__ */ jsxs(Card, {
      children: [/* @__PURE__ */ jsx(CardHeader, {
        children: /* @__PURE__ */ jsx(CardTitle, {
          className: "text-lg",
          children: "N분의 1 분할"
        })
      }), /* @__PURE__ */ jsx(CardContent, {
        children: /* @__PURE__ */ jsx("div", {
          className: "grid grid-cols-5 gap-2",
          children: [1, 2, 3, 4, 5].map((num) => /* @__PURE__ */ jsxs(Button, {
            onClick: () => handleSplit(num),
            disabled: expense.sharedWith === num,
            variant: expense.sharedWith === num ? "secondary" : "default",
            className: "w-full",
            children: [num, "명"]
          }, num))
        })
      })]
    })]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: expenses_$expenseId
}, Symbol.toStringTag, { value: "Module" }));
const Progress = React.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsx(
  ProgressPrimitive.Root,
  {
    ref,
    className: cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(
      ProgressPrimitive.Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = ProgressPrimitive.Root.displayName;
const report = UNSAFE_withComponentProps(function Report() {
  const {
    expenses
  } = useExpenses();
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const personalAmount = expenses.reduce((sum, exp) => sum + exp.amount / exp.sharedWith, 0);
  const unclassifiedCount = expenses.filter((e) => e.category === "unclassified").length;
  const fixedCount = expenses.filter((e) => e.category === "fixed").length;
  const additionalCount = expenses.filter((e) => e.category === "additional").length;
  const categoryStats = [{
    name: "미분류",
    count: unclassifiedCount,
    color: "red",
    amount: expenses.filter((e) => e.category === "unclassified").reduce((sum, e) => sum + e.amount, 0)
  }, {
    name: "고정지출",
    count: fixedCount,
    color: "blue",
    amount: expenses.filter((e) => e.category === "fixed").reduce((sum, e) => sum + e.amount, 0)
  }, {
    name: "추가지출",
    count: additionalCount,
    color: "green",
    amount: expenses.filter((e) => e.category === "additional").reduce((sum, e) => sum + e.amount, 0)
  }];
  if (expenses.length === 0) {
    return /* @__PURE__ */ jsx("div", {
      className: "flex flex-col items-center justify-center min-h-[50vh] text-center",
      children: /* @__PURE__ */ jsx(Card, {
        className: "w-full max-w-md",
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "py-12",
          children: [/* @__PURE__ */ jsx("div", {
            className: "text-6xl mb-4",
            children: "📊"
          }), /* @__PURE__ */ jsx(CardTitle, {
            className: "mb-2",
            children: "아직 지출 내역이 없어요"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground",
            children: "지출을 추가하면 리포트를 볼 수 있습니다."
          })]
        })
      })
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6",
    children: [/* @__PURE__ */ jsx(Card, {
      children: /* @__PURE__ */ jsxs(CardHeader, {
        children: [/* @__PURE__ */ jsx(CardTitle, {
          children: "지출 리포트"
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-muted-foreground",
          children: ["총 ", expenses.length, "개의 지출 항목"]
        })]
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "grid gap-4",
      children: [/* @__PURE__ */ jsx(Card, {
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "p-6",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground mb-1",
                children: "총 지출 금액"
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-2xl font-bold",
                children: [totalAmount.toLocaleString(), "원"]
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "text-4xl",
              children: "💰"
            })]
          })
        })
      }), /* @__PURE__ */ jsx(Card, {
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "p-6",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm text-muted-foreground mb-1",
                children: "개인 부담금"
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-2xl font-bold text-primary",
                children: [Math.floor(personalAmount).toLocaleString(), "원"]
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "text-4xl",
              children: "👤"
            })]
          })
        })
      })]
    }), /* @__PURE__ */ jsxs(Card, {
      children: [/* @__PURE__ */ jsx(CardHeader, {
        children: /* @__PURE__ */ jsx(CardTitle, {
          children: "카테고리별 분석"
        })
      }), /* @__PURE__ */ jsx(CardContent, {
        className: "space-y-4",
        children: categoryStats.map((stat) => /* @__PURE__ */ jsxs(Card, {
          className: "p-4",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between mb-3",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3",
              children: [/* @__PURE__ */ jsx(Badge, {
                variant: stat.color === "red" ? "destructive" : "default",
                children: stat.name
              }), /* @__PURE__ */ jsxs("span", {
                className: "text-sm text-muted-foreground",
                children: [stat.count, "개"]
              })]
            }), /* @__PURE__ */ jsxs("span", {
              className: "text-sm font-medium",
              children: [totalAmount > 0 ? Math.round(stat.amount / totalAmount * 100) : 0, "%"]
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex justify-between items-center mb-3",
            children: /* @__PURE__ */ jsxs("span", {
              className: "text-sm text-muted-foreground",
              children: ["총 금액: ", stat.amount.toLocaleString(), "원"]
            })
          }), /* @__PURE__ */ jsx(Progress, {
            value: totalAmount > 0 ? stat.amount / totalAmount * 100 : 0,
            className: "h-2"
          })]
        }, stat.name))
      })]
    }), /* @__PURE__ */ jsxs(Card, {
      children: [/* @__PURE__ */ jsx(CardHeader, {
        children: /* @__PURE__ */ jsx(CardTitle, {
          children: "📈 요약"
        })
      }), /* @__PURE__ */ jsxs(CardContent, {
        className: "space-y-4",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex justify-between items-center py-2",
          children: [/* @__PURE__ */ jsx("span", {
            className: "text-muted-foreground",
            children: "평균 지출 금액:"
          }), /* @__PURE__ */ jsxs("span", {
            className: "font-medium",
            children: [expenses.length > 0 ? Math.floor(totalAmount / expenses.length).toLocaleString() : 0, "원"]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between items-center py-2",
          children: [/* @__PURE__ */ jsx("span", {
            className: "text-muted-foreground",
            children: "가장 큰 지출:"
          }), /* @__PURE__ */ jsxs("span", {
            className: "font-medium",
            children: [expenses.length > 0 ? Math.max(...expenses.map((e) => e.amount)).toLocaleString() : 0, "원"]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between items-center py-2",
          children: [/* @__PURE__ */ jsx("span", {
            className: "text-muted-foreground",
            children: "분류 완료율:"
          }), /* @__PURE__ */ jsxs("span", {
            className: "font-medium",
            children: [Math.round((fixedCount + additionalCount) / Math.max(expenses.length, 1) * 100), "%"]
          })]
        })]
      })]
    })]
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: report
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BB3AomBP.js", "imports": ["/assets/chunk-PVWAREVJ-CitGXWPo.js", "/assets/index-_XKzHB16.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-DnFNjqiP.js", "imports": ["/assets/chunk-PVWAREVJ-CitGXWPo.js", "/assets/index-_XKzHB16.js", "/assets/ExpenseContext-dRyCgSrm.js"], "css": ["/assets/root-Q0r1FbOV.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_index-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/expenses._index": { "id": "routes/expenses._index", "parentId": "root", "path": "expenses", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/expenses._index-CcFP3YZF.js", "imports": ["/assets/chunk-PVWAREVJ-CitGXWPo.js", "/assets/ExpenseContext-dRyCgSrm.js", "/assets/badge-DD5JV3Nc.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/expenses.$expenseId": { "id": "routes/expenses.$expenseId", "parentId": "root", "path": "expenses/:expenseId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/expenses._expenseId-PpIHz3wl.js", "imports": ["/assets/chunk-PVWAREVJ-CitGXWPo.js", "/assets/ExpenseContext-dRyCgSrm.js", "/assets/badge-DD5JV3Nc.js", "/assets/index-CdLQGdTy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/report": { "id": "routes/report", "parentId": "root", "path": "report", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/report-C6jQ0RSg.js", "imports": ["/assets/chunk-PVWAREVJ-CitGXWPo.js", "/assets/ExpenseContext-dRyCgSrm.js", "/assets/badge-DD5JV3Nc.js", "/assets/index-_XKzHB16.js", "/assets/index-CdLQGdTy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-2b1e5623.js", "version": "2b1e5623", "sri": void 0 };
const assetsBuildDirectory = "build/client";
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
  },
  "routes/report": {
    id: "routes/report",
    parentId: "root",
    path: "report",
    index: void 0,
    caseSensitive: void 0,
    module: route4
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
