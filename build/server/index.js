var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, useLocation, Outlet, Link, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, redirect, useSearchParams, useParams, useNavigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as React from "react";
import { createContext, useState, useCallback, useEffect, useContext } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import "@hookform/resolvers/zod";
import { z } from "zod";
import { motion as motion$1, AnimatePresence as AnimatePresence$1 } from "framer-motion";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronLeft, Pencil, ChevronRight } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { getDefaultClassNames, DayPicker } from "react-day-picker";
import { useNavigate as useNavigate$1, Link as Link$1 } from "react-router-dom";
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
function getApiBaseUrl() {
  return "https://api.stopusing.klr.kr";
}
const API_CONFIG = {
  TIMEOUT: 1e4,
  // 10초
  RETRY_COUNT: 3
};
const AUTH_CONFIG = {
  TOKEN_KEY: "stopusing_auth_token",
  REFRESH_TOKEN_KEY: "stopusing_refresh_token",
  TOKEN_EXPIRY_KEY: "stopusing_token_expiry"
};
const MOCK_USER_UID = "a";
const API_ENDPOINTS = {
  TRANSACTIONS: "/api/v1/transactions",
  TRANSACTION_BY_ID: (id) => `/api/v1/transactions/${id}`,
  TRANSACTIONS_REPORT: "/api/v1/transactions/report",
  CATEGORIES: "/api/v1/transactions/categories",
  // budget goals
  BUDGET_GOALS: "/api/v1/budgetgoals",
  BUDGET_GOAL_BY_ID: (id) => `/api/v1/budgetgoals/${id}`,
  // user/auth (실제 백엔드 경로와 다르면 여기만 바꾸면 됨)
  USERS_ME: "/api/v1/users/me",
  AUTH_LOGOUT: "/api/logout"
};
const TIMEOUT_DURATION = API_CONFIG.TIMEOUT;
const MAX_RETRIES = API_CONFIG.RETRY_COUNT;
const RETRY_DELAY = 1e3;
class HttpError extends Error {
  constructor(message, status, response, responseBody) {
    super(message);
    this.status = status;
    this.response = response;
    this.responseBody = responseBody;
    this.name = "HttpError";
  }
}
class NetworkError extends Error {
  constructor(message, originalError) {
    super(message);
    this.originalError = originalError;
    this.name = "NetworkError";
  }
}
class TimeoutError extends Error {
  constructor(message = "요청이 시간 초과되었습니다") {
    super(message);
    this.name = "TimeoutError";
  }
}
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function shouldRetry(error, attempt, maxRetries) {
  if (attempt >= maxRetries) return false;
  if (error instanceof NetworkError) return true;
  if (error instanceof HttpError && error.status >= 500) return true;
  return false;
}
function isServerEnvironment() {
  return typeof window === "undefined";
}
class HttpService {
  constructor() {
    __publicField(this, "headerInterceptor");
    this.setHeaderInterceptor(() => {
      const headers = {};
      if (typeof window !== "undefined") {
        const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY) || sessionStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }
      return headers;
    });
  }
  setHeaderInterceptor(interceptor) {
    this.headerInterceptor = interceptor;
  }
  clearAuthData() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.TOKEN_EXPIRY_KEY);
      sessionStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    }
  }
  // 환경별 URL 생성
  createUrl(endpoint, params) {
    let apiPath;
    if (endpoint.startsWith("http")) {
      apiPath = endpoint;
    } else if (endpoint.startsWith("/")) {
      apiPath = endpoint;
    } else {
      apiPath = `/api/v1/${endpoint}`;
    }
    let fullUrl;
    if (isServerEnvironment()) {
      const baseUrl = getApiBaseUrl();
      if (!baseUrl) {
        throw new Error("API Base URL이 설정되지 않았습니다");
      }
      fullUrl = endpoint.startsWith("http") ? endpoint : `${baseUrl}${apiPath}`;
    } else {
      if (endpoint.startsWith("http")) {
        fullUrl = endpoint;
      } else {
        const baseUrl = getApiBaseUrl();
        fullUrl = `${baseUrl}${apiPath}`;
      }
    }
    if (params) {
      const url = new URL(fullUrl);
      Object.entries(params).forEach(([key, value]) => {
        if (value !== void 0 && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
      return url.toString();
    }
    return fullUrl;
  }
  getHeaders(customHeaders) {
    var _a;
    const baseHeaders = { "Content-Type": "application/json" };
    const interceptedHeaders = ((_a = this.headerInterceptor) == null ? void 0 : _a.call(this)) || {};
    return {
      ...baseHeaders,
      ...interceptedHeaders,
      ...customHeaders
      // 커스텀 헤더가 최우선
    };
  }
  async handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401) {
        this.clearAuthData();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
      let responseBody;
      try {
        responseBody = await response.json();
      } catch {
        try {
          responseBody = await response.text();
        } catch {
          responseBody = null;
        }
      }
      const message = `HTTP ${response.status}: ${response.statusText}`;
      throw new HttpError(message, response.status, response, responseBody);
    }
    try {
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(
        "응답 파싱 중 오류가 발생했습니다",
        response.status,
        response
      );
    }
  }
  async request(endpoint, config = {}) {
    const maxRetries = config.retries ?? MAX_RETRIES;
    const timeout = config.timeout ?? TIMEOUT_DURATION;
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      try {
        const options = {
          method: config.method || "GET",
          headers: this.getHeaders(config.headers),
          signal: controller.signal
        };
        if (config.body !== void 0) {
          options.body = JSON.stringify(config.body);
        }
        const url = this.createUrl(endpoint, config.params);
        const response = await fetch(url, options);
        clearTimeout(timeoutId);
        return await this.handleResponse(response);
      } catch (error) {
        clearTimeout(timeoutId);
        const processedError = this.processError(error);
        lastError = processedError;
        if (shouldRetry(processedError, attempt, maxRetries)) {
          console.warn(
            `HTTP 요청 실패, 재시도 중... (${attempt + 1}/${maxRetries})`,
            {
              endpoint,
              error: processedError.message
            }
          );
          await delay(RETRY_DELAY * Math.pow(2, attempt));
          continue;
        }
        throw processedError;
      }
    }
    throw lastError;
  }
  processError(error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return new TimeoutError();
      }
      if (error instanceof HttpError) {
        return error;
      }
      return new NetworkError("네트워크 오류가 발생했습니다", error);
    }
    return new NetworkError("알 수 없는 오류가 발생했습니다");
  }
  // 편의 메서드들
  async get(endpoint, params, config) {
    return this.request(endpoint, { ...config, method: "GET", params });
  }
  async post(endpoint, body, config) {
    return this.request(endpoint, { ...config, method: "POST", body });
  }
  async put(endpoint, body, config) {
    return this.request(endpoint, { ...config, method: "PUT", body });
  }
  async patch(endpoint, body, config) {
    return this.request(endpoint, { ...config, method: "PATCH", body });
  }
  async delete(endpoint, config) {
    return this.request(endpoint, { ...config, method: "DELETE" });
  }
}
const httpService = new HttpService();
const httpClient = httpService;
const EXPENSE_TYPES = {
  OVER_EXPENSE: "OVER_EXPENSE",
  FIXED_EXPENSE: "FIXED_EXPENSE",
  NONE: "NONE"
};
const EXPENSE_CATEGORIES = {
  FOOD: "FOOD",
  GROCERIES: "GROCERIES",
  TRANSPORT: "TRANSPORT",
  CAR: "CAR",
  HOUSING: "HOUSING",
  UTILITIES: "UTILITIES",
  TELECOM: "TELECOM",
  SUBSCRIPTIONS: "SUBSCRIPTIONS",
  SHOPPING: "SHOPPING",
  BEAUTY: "BEAUTY",
  HEALTHCARE: "HEALTHCARE",
  EDUCATION: "EDUCATION",
  ENTERTAINMENT: "ENTERTAINMENT",
  TRAVEL: "TRAVEL",
  PETS: "PETS",
  GIFTS_OCCASIONS: "GIFTS_OCCASIONS",
  INSURANCE: "INSURANCE",
  TAXES_FEES: "TAXES_FEES",
  DONATION: "DONATION",
  OTHER: "OTHER"
};
async function fetchTransactions(filter) {
  const response = await httpClient.get(
    API_ENDPOINTS.TRANSACTIONS,
    filter
  );
  return response.data;
}
async function fetchTransactionById(userUid, id) {
  const response = await httpClient.get(
    API_ENDPOINTS.TRANSACTION_BY_ID(id),
    { userUid }
  );
  return response.data;
}
async function createTransaction(transaction) {
  const response = await httpClient.post(
    API_ENDPOINTS.TRANSACTIONS,
    transaction
  );
  return response.data;
}
async function updateTransaction(userUid, id, transaction) {
  const response = await httpClient.put(
    `${API_ENDPOINTS.TRANSACTION_BY_ID(id)}?userUid=${userUid}`,
    transaction
  );
  return response.data;
}
async function deleteTransaction(userUid, id) {
  await httpClient.delete(
    `${API_ENDPOINTS.TRANSACTION_BY_ID(id)}?userUid=${userUid}`
  );
}
const ExpenseContext = createContext(null);
function ExpenseProvider({
  children,
  initialExpenses,
  userUid = MOCK_USER_UID,
  // 실제로는 사용자 인증에서 가져옴
  defaultType = "NONE"
  // 기본 타입 추가
}) {
  const [expenses, setExpenses] = useState(
    initialExpenses || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const refreshExpenses = useCallback(
    async (filter) => {
      try {
        setLoading(true);
        setError(null);
        const finalFilter = {
          userUid,
          type: defaultType,
          ...filter
        };
        const data = await fetchTransactions(finalFilter);
        setExpenses(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "지출 데이터를 불러오는데 실패했습니다."
        );
      } finally {
        setLoading(false);
      }
    },
    [userUid, defaultType]
  );
  const updateExpense = useCallback(
    async (userId, id, updatedExpense) => {
      try {
        setExpenses(
          (prev) => prev.map(
            (expense) => expense.id === id ? { ...expense, ...updatedExpense } : expense
          )
        );
        await updateTransaction(userId, id, updatedExpense);
        await refreshExpenses();
      } catch (error2) {
        await refreshExpenses();
        throw error2;
      }
    },
    [refreshExpenses]
  );
  const createExpense = useCallback(
    async (newExpense) => {
      try {
        const createdExpense = await createTransaction(newExpense);
        setExpenses((prev) => [createdExpense, ...prev]);
        await refreshExpenses();
      } catch (error2) {
        await refreshExpenses();
        throw error2;
      }
    },
    [refreshExpenses]
  );
  const deleteExpense = useCallback(
    async (userId, id) => {
      try {
        setExpenses((prev) => prev.filter((expense) => expense.id !== id));
        await deleteTransaction(userId, id);
        await refreshExpenses();
      } catch (error2) {
        await refreshExpenses();
        throw error2;
      }
    },
    [refreshExpenses]
  );
  useEffect(() => {
    if (!initialExpenses || initialExpenses.length === 0) {
      refreshExpenses();
    }
  }, [refreshExpenses, initialExpenses]);
  const value = {
    expenses,
    loading,
    error,
    refreshExpenses,
    updateExpense,
    createExpense,
    deleteExpense
  };
  return /* @__PURE__ */ jsx(ExpenseContext.Provider, { value, children });
}
const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};
const SvgHome = (props) => /* @__PURE__ */ React.createElement("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ React.createElement("mask", { id: "mask0_185_84", style: {
  maskType: "alpha"
}, maskUnits: "userSpaceOnUse", x: 0, y: 0, width: 24, height: 24 }, /* @__PURE__ */ React.createElement("rect", { width: 24, height: 24, fill: "#D9D9D9" })), /* @__PURE__ */ React.createElement("g", { mask: "url(#mask0_185_84)" }, /* @__PURE__ */ React.createElement("path", { d: "M19.5 9.25V20.5H14.5V13.5H9.5V20.5H4.5V9.25L12 3.625L19.5 9.25Z", stroke: "black" })));
const SvgReport = (props) => /* @__PURE__ */ React.createElement("svg", { width: 18, height: 21, viewBox: "0 0 18 21", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ React.createElement("path", { d: "M7.75601 11.2055L10.2438 11.2055L10.2438 20L7.75601 20L7.75601 11.2055Z", stroke: "black", strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M0.499999 2.41211L2.98781 2.41211L2.98781 20L0.5 20L0.499999 2.41211Z", stroke: "black", strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M15.0122 2.41211L17.5 2.41211L17.5 20L15.0122 20L15.0122 2.41211Z", stroke: "black", strokeLinejoin: "round" }));
const SvgMore = (props) => /* @__PURE__ */ React.createElement("svg", { width: 20, height: 6, viewBox: "0 0 20 6", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ React.createElement("path", { d: "M2.5 1C3.05384 1 3.51555 1.19133 3.91211 1.58789C4.30867 1.98445 4.5 2.44616 4.5 3C4.5 3.55384 4.30867 4.01555 3.91211 4.41211C3.51555 4.80867 3.05384 5 2.5 5C1.94616 5 1.48445 4.80867 1.08789 4.41211C0.691327 4.01555 0.5 3.55384 0.5 3C0.5 2.44616 0.691327 1.98445 1.08789 1.58789C1.48445 1.19133 1.94616 1 2.5 1ZM10 1C10.5538 1 11.0155 1.19133 11.4121 1.58789C11.8087 1.98445 12 2.44616 12 3C12 3.55384 11.8087 4.01555 11.4121 4.41211C11.0155 4.80867 10.5538 5 10 5C9.44616 5 8.98445 4.80867 8.58789 4.41211C8.19133 4.01555 8 3.55384 8 3C8 2.44616 8.19133 1.98445 8.58789 1.58789C8.98445 1.19133 9.44616 1 10 1ZM17.5 1C18.0538 1 18.5155 1.19133 18.9121 1.58789C19.3087 1.98445 19.5 2.44616 19.5 3C19.5 3.55384 19.3087 4.01555 18.9121 4.41211C18.5155 4.80867 18.0538 5 17.5 5C16.9462 5 16.4845 4.80867 16.0879 4.41211C15.6913 4.01555 15.5 3.55384 15.5 3C15.5 2.44616 15.6913 1.98445 16.0879 1.58789C16.4845 1.19133 16.9462 1 17.5 1Z", stroke: "black" }));
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
}, {
  rel: "stylesheet",
  href: "//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css"
}];
async function loader$1() {
  return {};
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
  const location = useLocation();
  return /* @__PURE__ */ jsx(ExpenseProvider, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "app-container",
      children: [/* @__PURE__ */ jsx("main", {
        className: "content",
        children: /* @__PURE__ */ jsx(Outlet, {})
      }), /* @__PURE__ */ jsxs("nav", {
        className: "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-1",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/expenses",
          className: `flex flex-col items-center py-1 px-4 ${location.pathname.startsWith("/expenses") ? "text-black" : "text-gray-500"}`,
          children: [/* @__PURE__ */ jsx(SvgHome, {
            className: `w-6 h-6 mb-1 ${location.pathname.startsWith("/expenses") ? "text-black fill-current" : "text-gray-500"}`
          }), /* @__PURE__ */ jsx("span", {
            className: "text-xs",
            children: "홈"
          })]
        }), /* @__PURE__ */ jsxs(Link, {
          to: "/report",
          className: `flex flex-col items-center py-1 px-4 ${location.pathname.startsWith("/report") ? "text-black" : "text-gray-500"}`,
          children: [/* @__PURE__ */ jsx(SvgReport, {
            className: `w-6 h-6 mb-1 ${location.pathname.startsWith("/report") ? "text-black fill-current" : "text-gray-500"}`
          }), /* @__PURE__ */ jsx("span", {
            className: "text-xs",
            children: "리포트"
          })]
        }), /* @__PURE__ */ jsxs(Link, {
          to: "/more",
          className: `flex flex-col items-center py-1 px-4 ${location.pathname.startsWith("/more") ? "text-black" : "text-gray-500"}`,
          children: [/* @__PURE__ */ jsx(SvgMore, {
            className: `w-6 h-6 mb-1 ${location.pathname.startsWith("/more") ? "text-black fill-current" : "text-gray-500"}`
          }), /* @__PURE__ */ jsx("span", {
            className: "text-xs",
            children: "더보기"
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
function formatExpenseDate(dateStr) {
  try {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일"
    ][date.getDay()];
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${month}월 ${day}일 ${dayOfWeek} ${hours}:${minutes}:${seconds}`;
  } catch {
    return dateStr;
  }
}
const ANIMATION_DELAY_MS = 300;
function UncategorizedExpenseList({
  expenses,
  emptyState,
  onTransactionUpdate
}) {
  const [removingIds, setRemovingIds] = useState(/* @__PURE__ */ new Set());
  const handleTransactionUpdate = useCallback(
    async (expenseId, type) => {
      setRemovingIds((prev) => /* @__PURE__ */ new Set([...prev, expenseId]));
      try {
        const expense = expenses.find((e) => e.id === expenseId);
        if (expense) {
          await updateTransaction(expense.userUid, expenseId, {
            price: expense.price,
            title: expense.title,
            type,
            category: expense.category
          });
          setTimeout(() => {
            onTransactionUpdate == null ? void 0 : onTransactionUpdate(expenseId, type);
          }, ANIMATION_DELAY_MS);
        }
      } catch (error) {
        console.error("Transaction update failed:", error);
        setRemovingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(expenseId);
          return newSet;
        });
      }
    },
    [expenses, onTransactionUpdate]
  );
  if (expenses.length === 0 && emptyState) {
    return /* @__PURE__ */ jsxs("div", { className: "py-12 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4", children: emptyState.icon }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: emptyState.title }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: emptyState.description })
    ] });
  }
  if (expenses.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "py-12 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4", children: "📝" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-base", children: "미분류 항목이 없습니다." })
    ] });
  }
  const visibleExpenses = expenses.filter(
    (expense) => !removingIds.has(expense.id)
  );
  return /* @__PURE__ */ jsx("div", { className: "space-y-6 pb-32", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "popLayout", children: visibleExpenses.map((expense) => /* @__PURE__ */ jsx(
    motion.div,
    {
      layout: true,
      initial: { opacity: 1, y: 0 },
      exit: {
        opacity: 0,
        x: -100,
        transition: {
          duration: ANIMATION_DELAY_MS / 1e3,
          ease: "easeInOut"
        }
      },
      transition: {
        layout: {
          duration: ANIMATION_DELAY_MS / 1e3,
          ease: "easeInOut"
        }
      },
      children: /* @__PURE__ */ jsx(
        UncategorizedExpenseItem,
        {
          expense,
          onUpdate: handleTransactionUpdate
        }
      )
    },
    expense.id
  )) }) });
}
function UncategorizedExpenseItem({
  expense,
  onUpdate
}) {
  const bankName = expense.title.split(" ")[0] || "은행";
  const handleFixedExpenseClick = (e) => {
    e.preventDefault();
    onUpdate(expense.id, "FIXED_EXPENSE");
  };
  const handleOverExpenseClick = (e) => {
    e.preventDefault();
    onUpdate(expense.id, "OVER_EXPENSE");
  };
  return /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col gap-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[10px] p-4 mb-1.5 flex flex-col", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[12px] text-[#101010] mb-1 font-medium", children: formatExpenseDate(expense.startedAt) }),
      /* @__PURE__ */ jsxs("div", { className: "text-base text-[#101010] mb-3 font-medium", children: [
        /* @__PURE__ */ jsx("span", { className: "text-black", children: bankName }),
        /* @__PURE__ */ jsx("span", { className: "text-[#bfbfbf] ml-1", children: "에서 온 알림" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `text-2xl font-medium 'text-black'}`, children: [
        "- ",
        expense.price.toLocaleString(),
        "원"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex space-x-1.5", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          onClick: handleFixedExpenseClick,
          className: "flex-1 h-[45px] bg-white border border-[#ff6200] rounded-[10px] flex items-center justify-center",
          children: /* @__PURE__ */ jsx("span", { className: "text-[16px] font-bold text-[#ff6200]", children: "고정지출" })
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          onClick: handleOverExpenseClick,
          className: "flex-1 h-[45px] bg-[#ff6200] rounded-[10px] flex items-center justify-center",
          children: /* @__PURE__ */ jsx("span", { className: "text-[16px] font-bold text-[#fffefb]", children: "초과지출" })
        }
      )
    ] })
  ] });
}
function CategorizedExpenseList({
  expenses,
  emptyState,
  onExpenseUpdate
}) {
  const [isOverExpenseExpanded, setIsOverExpenseExpanded] = useState(false);
  const [isFixedExpenseExpanded, setIsFixedExpenseExpanded] = useState(false);
  if (expenses.length === 0 && emptyState) {
    return /* @__PURE__ */ jsxs("div", { className: "py-12 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4", children: emptyState.icon }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: emptyState.title }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: emptyState.description })
    ] });
  }
  if (expenses.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "py-12 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4", children: "📊" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-base", children: "분류된 항목이 없습니다." })
    ] });
  }
  const overExpenses = expenses.filter(
    (expense) => expense.type === EXPENSE_TYPES.OVER_EXPENSE
  );
  const fixedExpenses = expenses.filter(
    (expense) => expense.type === EXPENSE_TYPES.FIXED_EXPENSE
  );
  const overTotal = overExpenses.reduce(
    (sum, expense) => sum + expense.price,
    0
  );
  const fixedTotal = fixedExpenses.reduce(
    (sum, expense) => sum + expense.price,
    0
  );
  const ITEMS_PER_PAGE = 3;
  return /* @__PURE__ */ jsxs("div", { className: "pb-32", children: [
    overExpenses.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx(
        ExpenseSectionHeader,
        {
          title: "초과지출",
          subtitle: "이제 차근차근 줄여보세요!",
          total: overTotal,
          count: overExpenses.length
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 mt-6", children: [
        overExpenses.slice(0, ITEMS_PER_PAGE).map((expense) => /* @__PURE__ */ jsx(
          CategorizedExpenseItem,
          {
            expense,
            onUpdate: onExpenseUpdate
          },
          expense.id
        )),
        /* @__PURE__ */ jsx(AnimatePresence, { children: isOverExpenseExpanded && overExpenses.slice(ITEMS_PER_PAGE).map((expense, index) => /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, height: 0, y: -10 },
            animate: { opacity: 1, height: "auto", y: 0 },
            exit: { opacity: 0, height: 0, y: -10 },
            transition: {
              duration: 0.3,
              delay: index * 0.05,
              // 각 아이템마다 약간의 딜레이로 순차적 애니메이션
              ease: "easeOut"
            },
            style: { overflow: "hidden" },
            children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
              CategorizedExpenseItem,
              {
                expense,
                onUpdate: onExpenseUpdate
              }
            ) })
          },
          expense.id
        )) })
      ] }),
      overExpenses.length > ITEMS_PER_PAGE && /* @__PURE__ */ jsx("div", { className: "text-center mt-4", children: /* @__PURE__ */ jsx(
        motion.div,
        {
          onClick: () => setIsOverExpenseExpanded(!isOverExpenseExpanded),
          className: "text-[#8e8e8e] text-[13px] tracking-[-0.26px] hover:text-[#6b6b6b] transition-colors",
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          transition: { type: "spring", stiffness: 400, damping: 17 },
          children: isOverExpenseExpanded ? "접기" : `더보기`
        }
      ) })
    ] }),
    fixedExpenses.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(
        ExpenseSectionHeader,
        {
          title: "고정지출",
          total: fixedTotal,
          count: fixedExpenses.length
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6 mt-6", children: [
        fixedExpenses.slice(0, ITEMS_PER_PAGE).map((expense) => /* @__PURE__ */ jsx(
          CategorizedExpenseItem,
          {
            expense,
            onUpdate: onExpenseUpdate
          },
          expense.id
        )),
        /* @__PURE__ */ jsx(AnimatePresence, { children: isFixedExpenseExpanded && fixedExpenses.slice(ITEMS_PER_PAGE).map((expense, index) => /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, height: 0, y: -10 },
            animate: { opacity: 1, height: "auto", y: 0 },
            exit: { opacity: 0, height: 0, y: -10 },
            transition: {
              duration: 0.3,
              delay: index * 0.05,
              // 각 아이템마다 약간의 딜레이로 순차적 애니메이션
              ease: "easeOut"
            },
            style: { overflow: "hidden" },
            children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
              CategorizedExpenseItem,
              {
                expense,
                onUpdate: onExpenseUpdate
              }
            ) })
          },
          expense.id
        )) })
      ] }),
      fixedExpenses.length > ITEMS_PER_PAGE && /* @__PURE__ */ jsx("div", { className: "text-center mt-4", children: /* @__PURE__ */ jsx(
        motion.div,
        {
          onClick: () => setIsFixedExpenseExpanded(!isFixedExpenseExpanded),
          className: "text-[#8e8e8e] text-[13px] tracking-[-0.26px] hover:text-[#6b6b6b] transition-colors",
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          transition: { type: "spring", stiffness: 400, damping: 17 },
          children: isFixedExpenseExpanded ? "접기" : `더보기`
        }
      ) })
    ] })
  ] });
}
function ExpenseSectionHeader({
  title,
  subtitle,
  total,
  count
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[24px] font-bold text-[#002b5b]", children: title }),
      subtitle && /* @__PURE__ */ jsx("div", { className: "text-[15px] text-[#1e1e1e]", children: subtitle }),
      /* @__PURE__ */ jsxs("div", { className: "text-[24px] font-bold text-[#ff6200]", children: [
        "- ",
        total.toLocaleString(),
        "원"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center text-[13px] text-[#8e8e8e] tracking-[-0.26px] my-2", children: [
      /* @__PURE__ */ jsx("span", { children: "8월 1일 - 8월 28일" }),
      /* @__PURE__ */ jsx("span", { className: "mx-2", children: "·" }),
      /* @__PURE__ */ jsxs("span", { children: [
        count,
        "회 지출"
      ] })
    ] })
  ] });
}
function CategorizedExpenseItem({
  expense,
  onUpdate
}) {
  const bankName = expense.title.split(" ")[0] || "은행";
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[10px] p-4 flex flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[12px] text-[#101010] mb-1 font-medium", children: formatExpenseDate(expense.startedAt) }),
    /* @__PURE__ */ jsxs("div", { className: "text-base text-[#101010] mb-3 font-medium", children: [
      /* @__PURE__ */ jsx("span", { className: "text-black", children: bankName }),
      /* @__PURE__ */ jsx("span", { className: "text-[#bfbfbf] ml-1", children: "에서 온 알림" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `text-2xl font-medium 'text-black'}`, children: [
      "- ",
      expense.price.toLocaleString(),
      "원"
    ] })
  ] }) });
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function ExpenseDetail({
  expense,
  onSave,
  onCancel,
  onDelete
}) {
  if (!expense) {
    return /* @__PURE__ */ jsx("div", { className: "p-6 text-center text-muted-foreground", children: "항목을 찾을 수 없습니다." });
  }
  return /* @__PURE__ */ jsx("div", { className: "max-w-xl mx-auto px-4 py-3 space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-4", children: "지출 상세" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm text-gray-600", children: "제목" }),
        /* @__PURE__ */ jsx("p", { className: "font-semibold", children: expense.title })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm text-gray-600", children: "금액" }),
        /* @__PURE__ */ jsxs("p", { className: "font-semibold text-lg", children: [
          expense.price.toLocaleString(),
          "원"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm text-gray-600", children: "날짜" }),
        /* @__PURE__ */ jsx("p", { children: new Date(expense.startedAt).toLocaleDateString("ko-KR") })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm text-gray-600", children: "타입" }),
        /* @__PURE__ */ jsx("p", { children: expense.type === "FIXED_EXPENSE" ? "고정지출" : expense.type === "OVER_EXPENSE" ? "초과지출" : "미분류" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm text-gray-600", children: "카테고리" }),
        /* @__PURE__ */ jsx("p", { children: expense.category })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mt-6", children: [
      onDelete && /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: onDelete,
          className: "text-red-600 border-red-600 hover:bg-red-50",
          children: "삭제"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 ml-auto", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: onCancel, children: "취소" }),
        /* @__PURE__ */ jsx(Button, { size: "sm", onClick: () => onSave(expense), children: "확인" })
      ] })
    ] })
  ] }) });
}
const logoSvg = "data:image/svg+xml,%3csvg%20width='69'%20height='25'%20viewBox='0%200%2069%2025'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_7_1522)'%3e%3cpath%20d='M22.6125%2022.218H0V18.8928H22.6125V22.218ZM19.9816%205.41042C19.9816%207.78771%2019.9303%209.83967%2019.8304%2011.5612C19.7305%2013.2852%2019.4871%2015.2936%2019.1054%2017.5915L15.0553%2017.2277C15.437%2015.1322%2015.6753%2013.2263%2015.7649%2011.515C15.8546%209.80124%2015.9007%207.77747%2015.9007%205.4386H2.32862V2.20312H19.9816V5.40786V5.41042Z'%20fill='%23FF6200'/%3e%3cpath%20d='M36.2153%2014.42H24.1546V1.99561H36.2153V14.42ZM44.1054%2025H27.0571V16.6872H30.9868V21.7953H44.1054V25ZM28.1125%2011.2153H32.283V5.22853H28.1125V11.2153ZM43.2882%207.19594H46.5237V10.5518H43.2882V18.5035H39.3278V0.0307617H43.2882V7.19594Z'%20fill='%23FF6200'/%3e%3cpath%20d='M68.1397%2020.5554H65.0835L64.5712%2011.8506H61.7891V8.31284H64.5712V0H68.652L68.1397%2020.5554Z'%20fill='%23FF6200'/%3e%3cpath%20d='M64.5712%208.31284V0H68.652L68.1397%2021.3239H65.0835L64.5712%2011.8506H61.7891V8.31284H64.5712Z'%20fill='%23FF6200'/%3e%3cpath%20d='M53.6069%209.76282C53.8093%2011.1846%2054.2013%2012.4885%2054.7853%2013.6772C55.3694%2012.509%2055.7562%2011.2128%2055.9484%209.79356C56.1405%208.37179%2056.2353%206.74509%2056.2353%204.91089V1.13232H60.0753V4.91089C60.0753%207.59047%2060.2982%209.86273%2060.7414%2011.7277C61.1846%2013.5926%2062.1324%2015.1194%2063.5823%2016.3081L61.1641%2019.2412C59.732%2018.0731%2058.7048%2016.349%2058.0797%2014.0717C57.3932%2016.4694%2056.2968%2018.255%2054.7853%2019.4231C53.3149%2018.2755%2052.2262%2016.5412%2051.5217%2014.2228C50.8966%2016.3183%2049.9488%2017.9117%2048.6807%2018.9979L46.0498%2016.3081C47.0566%2015.4627%2047.8174%2014.438%2048.3323%2013.2391C48.8472%2012.0402%2049.1777%2010.785%2049.3288%209.4759C49.48%208.16686%2049.5543%206.64518%2049.5543%204.91089V1.13232H53.3021V4.91089C53.3021%206.7246%2053.402%208.34106%2053.6044%209.76282H53.6069Z'%20fill='%23FF6200'/%3e%3cpath%20d='M68.1294%2021.8567H65.1732V24.8129H68.1294V21.8567Z'%20fill='%23FF6200'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_7_1522'%3e%3crect%20width='68.652'%20height='25'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
function ExpenseHeader() {
  return /* @__PURE__ */ jsx("div", { className: "bg-white", children: /* @__PURE__ */ jsx("div", { className: "flex justify-center px-6 pt-6 pb-6", children: /* @__PURE__ */ jsx("img", { src: logoSvg, alt: "그만써", className: "h-[25px]" }) }) });
}
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
function Popover({
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Root, { "data-slot": "popover", ...props });
}
function PopoverTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Trigger, { "data-slot": "popover-trigger", ...props });
}
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    PopoverPrimitive.Content,
    {
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
        className
      ),
      ...props
    }
  ) });
}
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  return /* @__PURE__ */ jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn(
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      ),
      captionLayout,
      formatters: {
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters
      },
      classNames: {
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative",
          defaultClassNames.months
        ),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute bg-popover inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label" ? "text-sm" : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-muted-foreground",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-l-md bg-accent",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-accent", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames
      },
      components: {
        Root: ({ className: className2, rootRef, ...props2 }) => {
          return /* @__PURE__ */ jsx(
            "div",
            {
              "data-slot": "calendar",
              ref: rootRef,
              className: cn(className2),
              ...props2
            }
          );
        },
        Chevron: ({ className: className2, orientation, ...props2 }) => {
          if (orientation === "left") {
            return /* @__PURE__ */ jsx(ChevronLeftIcon, { className: cn("size-4", className2), ...props2 });
          }
          if (orientation === "right") {
            return /* @__PURE__ */ jsx(
              ChevronRightIcon,
              {
                className: cn("size-4", className2),
                ...props2
              }
            );
          }
          return /* @__PURE__ */ jsx(ChevronDownIcon, { className: cn("size-4", className2), ...props2 });
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props2 }) => {
          return /* @__PURE__ */ jsx("td", { ...props2, children: /* @__PURE__ */ jsx("div", { className: "flex size-(--cell-size) items-center justify-center text-center", children }) });
        },
        ...components
      },
      ...props
    }
  );
}
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef(null);
  React.useEffect(() => {
    var _a;
    if (modifiers.focused) (_a = ref.current) == null ? void 0 : _a.focus();
  }, [modifiers.focused]);
  return /* @__PURE__ */ jsx(
    Button,
    {
      ref,
      variant: "ghost",
      size: "icon",
      "data-day": day.date.toLocaleDateString(),
      "data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
      "data-range-start": modifiers.range_start,
      "data-range-end": modifiers.range_end,
      "data-range-middle": modifiers.range_middle,
      className: cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      ),
      ...props
    }
  );
}
z.object({
  price: z.number({ message: "올바른 금액을 입력해주세요." }).min(0, "금액은 0 이상이어야 합니다.").int("금액은 정수여야 합니다."),
  title: z.string({ message: "제목을 입력해주세요." }).min(1, "제목을 입력해주세요.").max(200, "제목은 200자 이하로 입력해주세요."),
  userUid: z.string({ message: "사용자 정보가 필요합니다." }).min(1, "사용자 정보가 필요합니다."),
  startAt: z.string().datetime("올바른 날짜 형식이 아닙니다.").optional(),
  type: z.enum([EXPENSE_TYPES.OVER_EXPENSE, EXPENSE_TYPES.FIXED_EXPENSE, EXPENSE_TYPES.NONE]).optional(),
  category: z.enum([
    EXPENSE_CATEGORIES.FOOD,
    EXPENSE_CATEGORIES.GROCERIES,
    EXPENSE_CATEGORIES.TRANSPORT,
    EXPENSE_CATEGORIES.CAR,
    EXPENSE_CATEGORIES.HOUSING,
    EXPENSE_CATEGORIES.UTILITIES,
    EXPENSE_CATEGORIES.TELECOM,
    EXPENSE_CATEGORIES.SUBSCRIPTIONS,
    EXPENSE_CATEGORIES.SHOPPING,
    EXPENSE_CATEGORIES.BEAUTY,
    EXPENSE_CATEGORIES.HEALTHCARE,
    EXPENSE_CATEGORIES.EDUCATION,
    EXPENSE_CATEGORIES.ENTERTAINMENT,
    EXPENSE_CATEGORIES.TRAVEL,
    EXPENSE_CATEGORIES.PETS,
    EXPENSE_CATEGORIES.GIFTS_OCCASIONS,
    EXPENSE_CATEGORIES.INSURANCE,
    EXPENSE_CATEGORIES.TAXES_FEES,
    EXPENSE_CATEGORIES.DONATION,
    EXPENSE_CATEGORIES.OTHER
  ]).optional()
});
z.object({
  // API 필드들
  price: z.number({ message: "올바른 금액을 입력해주세요." }).min(0, "금액은 0 이상이어야 합니다.").int("금액은 정수여야 합니다."),
  title: z.string({ message: "제목을 입력해주세요." }).min(1, "제목을 입력해주세요.").max(200, "제목은 200자 이하로 입력해주세요."),
  userUid: z.string({ message: "사용자 정보가 필요합니다." }).min(1, "사용자 정보가 필요합니다."),
  startAt: z.string().datetime("올바른 날짜 형식이 아닙니다.").optional(),
  type: z.enum([EXPENSE_TYPES.OVER_EXPENSE, EXPENSE_TYPES.FIXED_EXPENSE, EXPENSE_TYPES.NONE]).optional(),
  category: z.enum([
    EXPENSE_CATEGORIES.FOOD,
    EXPENSE_CATEGORIES.GROCERIES,
    EXPENSE_CATEGORIES.TRANSPORT,
    EXPENSE_CATEGORIES.CAR,
    EXPENSE_CATEGORIES.HOUSING,
    EXPENSE_CATEGORIES.UTILITIES,
    EXPENSE_CATEGORIES.TELECOM,
    EXPENSE_CATEGORIES.SUBSCRIPTIONS,
    EXPENSE_CATEGORIES.SHOPPING,
    EXPENSE_CATEGORIES.BEAUTY,
    EXPENSE_CATEGORIES.HEALTHCARE,
    EXPENSE_CATEGORIES.EDUCATION,
    EXPENSE_CATEGORIES.ENTERTAINMENT,
    EXPENSE_CATEGORIES.TRAVEL,
    EXPENSE_CATEGORIES.PETS,
    EXPENSE_CATEGORIES.GIFTS_OCCASIONS,
    EXPENSE_CATEGORIES.INSURANCE,
    EXPENSE_CATEGORIES.TAXES_FEES,
    EXPENSE_CATEGORIES.DONATION,
    EXPENSE_CATEGORIES.OTHER
  ]).optional(),
  // UI 전용 필드들
  selectedDate: z.date({ message: "날짜를 선택해주세요." }),
  dutchPayCount: z.number().min(1, "더치페이 인원은 1명 이상이어야 합니다.").max(20, "더치페이 인원은 20명 이하로 설정해주세요.").int("더치페이 인원은 정수여야 합니다."),
  app: z.string()
});
const SvgKeyboardArrowDown = (props) => /* @__PURE__ */ React.createElement("svg", { width: 11, height: 7, viewBox: "0 0 11 7", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ React.createElement("path", { d: "M5.5 7L0 1.32432L1.28333 0L5.5 4.35135L9.71667 0L11 1.32432L5.5 7Z", fill: "#757575" }));
const SvgPlus = (props) => /* @__PURE__ */ React.createElement("svg", { width: 35, height: 35, viewBox: "0 0 35 35", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props }, /* @__PURE__ */ React.createElement("rect", { x: 0.5, y: 0.5, width: 34, height: 34, rx: 17, fill: "white", stroke: "#002B5B" }), /* @__PURE__ */ React.createElement("path", { d: "M10 18.608V17.104H16.56V10H18.192V17.104H24.72V18.608H18.192V25.712H16.56V18.608H10Z", fill: "#002B5B" }));
function ExpensesPage() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "unclassified";
  const [selectedMonth, setSelectedMonth] = useState("8월 1일 - 8월 28일");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      let data = [];
      if (activeTab === "unclassified") {
        data = await fetchTransactions({
          userUid: MOCK_USER_UID,
          type: EXPENSE_TYPES.NONE
        });
      } else {
        const [overExpenses, fixedExpenses] = await Promise.all([
          fetchTransactions({
            userUid: MOCK_USER_UID,
            type: EXPENSE_TYPES.OVER_EXPENSE
          }),
          fetchTransactions({
            userUid: MOCK_USER_UID,
            type: EXPENSE_TYPES.FIXED_EXPENSE
          })
        ]);
        data = [...overExpenses, ...fixedExpenses];
      }
      setExpenses(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "지출 데이터를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadExpenses();
  }, [activeTab]);
  const handleTransactionUpdate = useCallback((expenseId) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== expenseId));
  }, []);
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-red-200 p-6 max-w-md", children: /* @__PURE__ */ jsxs("div", { className: "text-red-600 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4", children: "⚠️" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "오류가 발생했습니다" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-4", children: error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: loadExpenses,
          className: "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700",
          children: "다시 시도"
        }
      )
    ] }) }) });
  }
  const renderContent = () => {
    if (activeTab === "unclassified") {
      return /* @__PURE__ */ jsx(
        UncategorizedExpenseList,
        {
          expenses,
          emptyState: {
            icon: "🎉",
            title: "미분류 지출이 없어요!",
            description: "모든 지출이 분류되었습니다."
          },
          onTransactionUpdate: handleTransactionUpdate
        }
      );
    }
    return /* @__PURE__ */ jsx(
      CategorizedExpenseList,
      {
        expenses,
        emptyState: {
          icon: "📝",
          title: "분류된 지출이 없어요",
          description: "지출을 추가하고 분류해보세요."
        },
        onExpenseUpdate: loadExpenses
      }
    );
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[rgba(235,235,235,0.35)] relative max-w-md mx-auto", children: [
    /* @__PURE__ */ jsx(ExpenseHeader, {}),
    /* @__PURE__ */ jsx("div", { className: "bg-white h-[60px]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/expenses?tab=unclassified",
              className: `py-2 text-2xl font-bold transition-colors duration-200 ${activeTab === "unclassified" ? "text-[#002b5b]" : "text-[#bfbfbf]"}`,
              children: "미분류"
            }
          ),
          activeTab === "unclassified" && /* @__PURE__ */ jsx(
            motion$1.div,
            {
              layoutId: "tabIndicator",
              className: "absolute -bottom-2 left-0 right-0 h-1 bg-[#002b5b]",
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 30
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative ml-6", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/expenses?tab=classified",
              className: `py-2 text-2xl font-bold transition-colors duration-200 ${activeTab === "classified" ? "text-[#002b5b]" : "text-[#bfbfbf]"}`,
              children: "분류"
            }
          ),
          activeTab === "classified" && /* @__PURE__ */ jsx(
            motion$1.div,
            {
              layoutId: "tabIndicator",
              className: "absolute -bottom-2 left-0 right-0 h-1 bg-[#002b5b]",
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 30
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/expenses/add", children: /* @__PURE__ */ jsx(SvgPlus, { className: "w-9 h-9" }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "text-sm text-[#757575] px-6 pt-4 pb-2 flex items-center", children: [
      selectedMonth,
      /* @__PURE__ */ jsx(SvgKeyboardArrowDown, { className: "w-3 h-3 ml-2" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-6 pt-2", children: loading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center py-12", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6200]" }) }) : /* @__PURE__ */ jsx(AnimatePresence$1, { mode: "wait", children: /* @__PURE__ */ jsx(
      motion$1.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: {
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        },
        children: renderContent()
      },
      activeTab
    ) }) })
  ] });
}
function ExpenseDetailPage() {
  const { expenseId } = useParams();
  const navigate = useNavigate();
  const { updateExpense, deleteExpense } = useExpenses();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userUid = MOCK_USER_UID;
  useEffect(() => {
    const loadExpense = async () => {
      if (!expenseId) {
        setError("지출 ID가 없습니다.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchTransactionById(userUid, Number(expenseId));
        setExpense(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "지출을 불러오는데 실패했습니다."
        );
      } finally {
        setLoading(false);
      }
    };
    loadExpense();
  }, [expenseId, userUid]);
  const handleSave = async (updatedExpense) => {
    try {
      await updateExpense(userUid, updatedExpense.id, {
        title: updatedExpense.title,
        price: updatedExpense.price,
        type: updatedExpense.type,
        category: updatedExpense.category,
        startAt: updatedExpense.startedAt
      });
      const nextTab = updatedExpense.type === EXPENSE_TYPES.NONE ? "unclassified" : "classified";
      navigate(`/expenses?tab=${nextTab}`);
    } catch (e) {
      console.error("updateExpense error:", e);
      alert("지출 수정에 실패했습니다.");
    }
  };
  const handleDelete = async () => {
    if (!expense) return;
    if (confirm("정말로 이 지출을 삭제하시겠습니까?")) {
      try {
        await deleteExpense(userUid, expense.id);
        navigate("/expenses");
      } catch (e) {
        console.error("deleteExpense error:", e);
        alert("지출 삭제에 실패했습니다.");
      }
    }
  };
  const handleCancel = () => {
    const nextTab = (expense == null ? void 0 : expense.type) === EXPENSE_TYPES.NONE ? "unclassified" : "classified";
    navigate(`/expenses?tab=${nextTab}`);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center min-h-screen", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-red-200 p-6 max-w-md", children: /* @__PURE__ */ jsxs("div", { className: "text-red-600 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4", children: "⚠️" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "오류가 발생했습니다" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-4", children: error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/expenses"),
          className: "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700",
          children: "목록으로 돌아가기"
        }
      )
    ] }) }) });
  }
  return /* @__PURE__ */ jsx(
    ExpenseDetail,
    {
      expense,
      onSave: handleSave,
      onCancel: handleCancel,
      onDelete: handleDelete
    }
  );
}
const expenses__index = UNSAFE_withComponentProps(function ExpensesIndex() {
  return /* @__PURE__ */ jsx(ExpensesPage, {});
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: expenses__index
}, Symbol.toStringTag, { value: "Module" }));
const expenses_$expenseId = UNSAFE_withComponentProps(function ExpenseDetail2() {
  return /* @__PURE__ */ jsx(ExpenseDetailPage, {});
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: expenses_$expenseId
}, Symbol.toStringTag, { value: "Module" }));
const expenses_add = UNSAFE_withComponentProps(function AddExpensePage() {
  const navigate = useNavigate();
  const [expenseType, setExpenseType] = useState(EXPENSE_TYPES.OVER_EXPENSE);
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [app, setApp] = useState("");
  const [selectedDate, setSelectedDate] = useState(/* @__PURE__ */ new Date());
  const [dutchPayCount, setDutchPayCount] = useState(0);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formatDate = (date2) => {
    const year = date2.getFullYear().toString().slice(-2);
    const month = String(date2.getMonth() + 1).padStart(2, "0");
    const day = String(date2.getDate()).padStart(2, "0");
    const hours = String(date2.getHours()).padStart(2, "0");
    const minutes = String(date2.getMinutes()).padStart(2, "0");
    return `${year}년 ${month}월 ${day}일 | ${hours}:${minutes}`;
  };
  const calculateDutchPayAmount = () => {
    if (dutchPayCount <= 1 || !amount) return amount;
    const totalAmount = parseInt(amount.replace(/[^0-9]/g, "")) || 0;
    return Math.floor(totalAmount / dutchPayCount).toLocaleString();
  };
  const handleAmountChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue) {
      const formattedValue = parseInt(numericValue).toLocaleString();
      setAmount(formattedValue);
    } else {
      setAmount("");
    }
  };
  const handleSave = async () => {
    if (!amount || !merchant) {
      alert("금액과 거래처를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const numericAmount = parseInt(amount.replace(/[^0-9]/g, "")) || 0;
      const finalAmount = dutchPayCount > 1 ? Math.floor(numericAmount / dutchPayCount) : numericAmount;
      const transactionData = {
        price: finalAmount,
        startAt: selectedDate.toISOString(),
        title: merchant,
        userUid: MOCK_USER_UID
      };
      await createTransaction(transactionData);
      navigate("/expenses");
    } catch (error) {
      console.error("지출 저장 실패:", error);
      alert("지출 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(void 0);
  return /* @__PURE__ */ jsxs(motion.div, {
    initial: {
      opacity: 0,
      x: 20
    },
    animate: {
      opacity: 1,
      x: 0
    },
    exit: {
      opacity: 0,
      x: -20
    },
    transition: {
      duration: 0.3
    },
    className: "bg-white min-h-screen max-w-md mx-2 relative pb-20",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex items-center justify-between px-4 sm:px-6 py-4",
      children: [/* @__PURE__ */ jsx("div", {
        onClick: () => navigate("/expenses"),
        className: "p-0 cursor-pointer",
        children: /* @__PURE__ */ jsx(ChevronLeft, {
          className: "w-6 h-6"
        })
      }), /* @__PURE__ */ jsx("h1", {
        className: "text-[15px] font-medium text-black tracking-[-0.165px]",
        children: "지출 추가"
      }), /* @__PURE__ */ jsx("div", {
        className: "w-6"
      }), " "]
    }), /* @__PURE__ */ jsx("div", {
      className: "px-4 sm:px-6 pt-2 pb-4",
      children: /* @__PURE__ */ jsxs("div", {
        className: "bg-[#e6e6e6] rounded-[10px] h-[45px] flex p-1 relative",
        children: [/* @__PURE__ */ jsx("div", {
          className: cn("absolute top-1 h-[37px] w-1/2 bg-[#ff6200] rounded-[8px] transition-all duration-300 ease-in-out shadow-sm", expenseType === EXPENSE_TYPES.FIXED_EXPENSE ? "translate-x-full" : "translate-x-0")
        }), /* @__PURE__ */ jsx("button", {
          onClick: () => setExpenseType(EXPENSE_TYPES.OVER_EXPENSE),
          className: cn("relative z-10 flex-1 h-[37px] rounded-[8px] flex items-center justify-center text-[16px] font-bold transition-colors duration-300", expenseType === EXPENSE_TYPES.OVER_EXPENSE ? "text-white" : "text-gray-600"),
          children: "초과지출"
        }), /* @__PURE__ */ jsx("button", {
          onClick: () => setExpenseType(EXPENSE_TYPES.FIXED_EXPENSE),
          className: cn("relative z-10 flex-1 h-[37px] rounded-[8px] flex items-center justify-center text-[16px] font-bold transition-colors duration-300", expenseType === EXPENSE_TYPES.FIXED_EXPENSE ? "text-white" : "text-gray-600"),
          children: "고정지출"
        })]
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "px-4 sm:px-6 pb-8",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-3",
        children: [/* @__PURE__ */ jsx("div", {
          className: "flex-1",
          children: /* @__PURE__ */ jsx(Input, {
            type: "text",
            value: amount ? `-${amount}원` : "",
            onChange: (e) => {
              const value = e.target.value.replace(/[-원]/g, "");
              handleAmountChange(value);
            },
            placeholder: "금액을 입력하세요",
            className: "!text-2xl !font-bold !text-black !bg-transparent !border-none !outline-none !shadow-none !p-0 !h-auto",
            style: {
              fontSize: "1.5rem"
            }
          })
        }), /* @__PURE__ */ jsx(Pencil, {
          className: "w-4 h-4 text-gray-400"
        })]
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "px-4 sm:px-6 space-y-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between py-4 border-b border-gray-200 min-h-[52px]",
        children: [/* @__PURE__ */ jsx("label", {
          className: "text-[16px] text-[#757575] tracking-[-0.176px] flex-shrink-0",
          children: "거래처"
        }), /* @__PURE__ */ jsx(Input, {
          type: "text",
          value: merchant,
          onChange: (e) => setMerchant(e.target.value),
          placeholder: "거래처를 입력하세요.",
          className: "!text-base !text-[#3d3d3d] !placeholder:text-[#bfbfbf] !text-right !bg-transparent !border-none !outline-none !shadow-none flex-1 ml-4 !p-0 !h-auto"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between py-4 border-b border-gray-200 min-h-[52px]",
        children: [/* @__PURE__ */ jsx("label", {
          className: "text-base text-[#757575] tracking-[-0.176px] flex-shrink-0",
          children: "앱"
        }), /* @__PURE__ */ jsx(Input, {
          type: "text",
          value: app,
          onChange: (e) => setApp(e.target.value),
          placeholder: "앱을 선택하세요",
          className: "!text-base !text-[#3d3d3d] !placeholder:text-[#bfbfbf] !text-right !bg-transparent !border-none !outline-none !shadow-none flex-1 ml-4 !p-0 !h-auto"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between py-4 border-b border-gray-200 min-h-[52px]",
        children: [/* @__PURE__ */ jsx("label", {
          className: "text-base text-[#757575] tracking-[-0.176px]",
          children: "날짜"
        }), /* @__PURE__ */ jsxs(Popover, {
          open: isDatePickerOpen,
          onOpenChange: setIsDatePickerOpen,
          children: [/* @__PURE__ */ jsx(PopoverTrigger, {
            asChild: true,
            children: /* @__PURE__ */ jsxs(Button, {
              variant: "ghost",
              className: "text-base text-[#3d3d3d] text-right tracking-[-0.176px] p-0 h-auto font-normal",
              children: [formatDate(selectedDate), /* @__PURE__ */ jsx(ChevronRight, {
                className: "w-3 h-3"
              })]
            })
          }), /* @__PURE__ */ jsx(PopoverContent, {
            className: "w-auto p-3",
            align: "center",
            side: "top",
            sideOffset: 8,
            avoidCollisions: true,
            children: /* @__PURE__ */ jsx(Calendar, {
              mode: "single",
              selected: selectedDate,
              onSelect: (date2) => {
                if (date2) {
                  setSelectedDate(date2);
                  setIsDatePickerOpen(false);
                }
              },
              className: "rounded-md"
            })
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between py-4 border-b border-gray-200 min-h-[52px]",
        children: [/* @__PURE__ */ jsx("label", {
          className: "text-[16px] text-[#757575] tracking-[-0.176px] flex-shrink-0",
          children: "더치페이"
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-2",
          children: [/* @__PURE__ */ jsx(Input, {
            type: "text",
            value: dutchPayCount || "",
            onChange: (e) => {
              const value = e.target.value;
              const numericValue = value.replace(/[^0-9]/g, "");
              const parsedValue = numericValue === "" ? 0 : parseInt(numericValue, 10);
              setDutchPayCount(parsedValue);
            },
            placeholder: "0",
            className: "!w-[55px] !h-[35px] !text-center !text-[16px] !text-[#3d3d3d] !font-medium"
          }), dutchPayCount > 1 && amount && /* @__PURE__ */ jsxs("div", {
            className: "text-sm text-[#757575]",
            children: ["(1인당: ", calculateDutchPayAmount(), "원)"]
          })]
        })]
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "fixed bottom-16 left-0 right-0 px-4 sm:px-6 max-w-md mx-auto",
      children: /* @__PURE__ */ jsx("div", {
        className: "flex",
        children: /* @__PURE__ */ jsx(Button, {
          onClick: handleSave,
          disabled: isLoading,
          variant: "outline",
          style: {
            backgroundColor: isLoading ? "#002b5b" : "#002b5b",
            color: "#fff"
          },
          className: "flex-1 h-[45px] bg-[#002b5b] text-white text-[15px] font-medium rounded-[10px] hover:bg-[#002b5b]/90 disabled:opacity-50",
          children: isLoading ? "저장 중..." : "저장"
        })
      })
    })]
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: expenses_add
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
function ProgressBar({
  barPercent,
  percentCenterLeft,
  barLabel
}) {
  const pct = Math.max(0, Math.min(100, barPercent));
  const EDGE_INSET_PX = 6;
  const isStart = pct <= 0.5;
  const isEnd = pct >= 99.5;
  const edgeAdjustPx = isEnd ? -EDGE_INSET_PX : isStart ? EDGE_INSET_PX : 0;
  const labelTx = isStart ? "50%" : isEnd ? "-50%" : "0%";
  return /* @__PURE__ */ jsxs("div", { className: "relative pt-7", children: [
    /* @__PURE__ */ jsx(Progress, { value: pct, className: "h-10 rounded-md" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute top-1/2 -translate-y-1/2 text-[11px] font-medium text-white",
        style: { left: `calc(${percentCenterLeft}% )`, transform: "translate(-50%,+70%)" },
        children: pct === 0 || pct === 100 ? `${pct}%` : `${pct.toFixed(2)}%`
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "absolute flex flex-col items-center pointer-events-none z-10",
        style: {
          left: `calc(${pct}% + ${edgeAdjustPx}px)`,
          bottom: "100%",
          transform: "translate(-50%, 30px)"
        },
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "mb-1 whitespace-nowrap text-[11px] font-bold text-[#FF6200]",
              style: { transform: `translateX(${labelTx})` },
              children: barLabel
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "w-[4px] h-[4px] rounded-full bg-black" }),
          /* @__PURE__ */ jsx("div", { className: "w-px h-3 bg-black" })
        ]
      }
    )
  ] });
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
function Money({ className, children }) {
  return /* @__PURE__ */ jsx("span", { className: `whitespace-nowrap tabular-nums tracking-tight ${className ?? ""}`, children });
}
const today = /* @__PURE__ */ new Date();
const ym = {
  y: today.getFullYear(),
  m: today.getMonth() + 1,
  d: today.getDate()
};
const monthStart = new Date(ym.y, ym.m - 1, 1);
const monthEnd = new Date(ym.y, ym.m, 0);
const dateK = (d) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
function inThisMonth(isoStr) {
  if (!isoStr) return false;
  const d = new Date(isoStr);
  const todayEnd = new Date(ym.y, ym.m - 1, ym.d, 23, 59, 59);
  return d >= monthStart && d <= todayEnd;
}
const fmt = (n) => `${Math.floor(n).toLocaleString()}원`;
function ReportSummary({
  monthlyGoal,
  isOver,
  total,
  monthOverCount,
  monthFixedCount,
  overSum,
  fixedSum,
  monthStart: monthStart2,
  monthEnd: monthEnd2,
  today: today2,
  progressEl,
  barPercent,
  showList = true
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Card, { className: "mx-4 rounded-2xl border border-[#EBEBEB] shadow-sm", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4 space-y-4", children: [
      monthlyGoal > 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-base md:text-lg font-semibold !text-[#002B5B]", children: isOver ? "예산을 초과했어요." : "예산을 초과하지 않았어요!" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs md:text-sm text-[#757575]", children: isOver ? /* @__PURE__ */ jsxs(Fragment, { children: [
          "이번 달에 목표보다",
          " ",
          /* @__PURE__ */ jsxs("span", { className: "text-[#FF6200] font-bold", children: [
            ((total / monthlyGoal - 1) * 100).toFixed(2),
            "%"
          ] }),
          " ",
          "더 쓰고 있어요."
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          "목표 대비",
          " ",
          /* @__PURE__ */ jsxs("span", { className: "text-[#FF6200] font-bold", children: [
            (100 - Math.min(100, Math.max(0, total / monthlyGoal * 100))).toFixed(2),
            "%"
          ] }),
          " ",
          "아끼고 있어요."
        ] }) })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "!text-lg !font-semibold !text-[#002B5B]", children: "목표 초과지출을 설정해 보세요." }),
        /* @__PURE__ */ jsxs("p", { className: "mt-1 !text-sm !text-[#757575]", children: [
          "이번 달에",
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-[#FF6200] font-light", children: "얼마까지" }),
          " ",
          "지출할 건가요?"
        ] })
      ] }),
      progressEl,
      /* @__PURE__ */ jsxs("div", { className: "mt-1 flex justify-between text-[11px] text-[#757575]", children: [
        /* @__PURE__ */ jsx("span", {}),
        /* @__PURE__ */ jsx(Money, { children: monthlyGoal > 0 ? `- ${fmt(monthlyGoal)}` : "0원" })
      ] })
    ] }) }),
    showList && /* @__PURE__ */ jsxs("div", { className: "mx-4 space-y-4 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "pb-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-[#002B5B]", children: "목표 초과지출" }),
          /* @__PURE__ */ jsx("div", { className: "text-[11px] text-[#757575]", children: `${dateK(monthStart2)} - ${dateK(monthEnd2)}` })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 text-base font-bold text-[#FF6200]", children: /* @__PURE__ */ jsx(Money, { children: monthlyGoal > 0 ? isOver ? `+ ${fmt(total - monthlyGoal)}` : `- 0원` : "- 0원" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pb-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-[#002B5B]", children: "초과지출" }),
          /* @__PURE__ */ jsx("div", { className: "text-[11px] text-[#757575]", children: `${dateK(monthStart2)} - ${dateK(today2)} · ${monthOverCount}번 지출` })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 text-base font-bold text-[#FF6200]", children: /* @__PURE__ */ jsx(Money, { children: `- ${fmt(overSum)}` }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-[#002B5B]", children: "고정지출" }),
          /* @__PURE__ */ jsx("div", { className: "text-[11px] text-[#757575]", children: `${dateK(monthStart2)} - ${dateK(monthEnd2)} · ${monthFixedCount}번 지출` })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 text-base font-bold text-[#757575]", children: /* @__PURE__ */ jsx(Money, { children: `- ${fmt(fixedSum)}` }) })
      ] })
    ] })
  ] });
}
async function fetchTxArray(params) {
  try {
    const res = await httpClient.get(
      API_ENDPOINTS.TRANSACTIONS,
      params
    );
    return Array.isArray(res == null ? void 0 : res.data) ? res.data : [];
  } catch {
    return [];
  }
}
async function fetchOverAndFixed(opts) {
  const userUid = opts == null ? void 0 : opts.userUid;
  let [over, fixed] = await Promise.all([
    fetchTxArray({ userUid, type: "OVER_EXPENSE" }),
    fetchTxArray({ userUid, type: "FIXED_EXPENSE" })
  ]);
  if (over.length === 0 || fixed.length === 0) {
    const all = await fetchTxArray({ userUid });
    if (over.length === 0) over = all.filter((t) => t.type === "OVER_EXPENSE");
    if (fixed.length === 0) fixed = all.filter((t) => t.type === "FIXED_EXPENSE");
  }
  return { over, fixed };
}
function getBudgetGoalById(id, params) {
  return httpClient.get(
    API_ENDPOINTS.BUDGET_GOAL_BY_ID(id),
    params
    // ✅ 전달
  );
}
const USER_UID = "a";
async function fetchMonthlyGoal() {
  var _a;
  try {
    const res = await getBudgetGoalById(1, { userUid: USER_UID });
    const price = (_a = res == null ? void 0 : res.data) == null ? void 0 : _a.price;
    return Number.isFinite(price) ? Math.max(0, price) : 0;
  } catch {
    return 0;
  }
}
function useReport() {
  const [overList, setOverList] = useState([]);
  const [fixedList, setFixedList] = useState([]);
  const [monthlyGoal, setMonthlyGoal] = useState(0);
  useEffect(() => {
    fetchMonthlyGoal().then(setMonthlyGoal).catch(() => setMonthlyGoal(0));
  }, []);
  useEffect(() => {
    (async () => {
      const { over, fixed } = await fetchOverAndFixed({ userUid: USER_UID });
      setOverList(over);
      setFixedList(fixed);
    })();
  }, []);
  const monthOver = overList.filter((t) => inThisMonth(t.createdAt || t.startAt));
  const monthFixed = fixedList.filter((t) => inThisMonth(t.createdAt || t.startAt));
  const overSum = monthOver.reduce((s, t) => s + (t.price || 0), 0);
  const fixedSum = monthFixed.reduce((s, t) => s + (t.price || 0), 0);
  const total = overSum + fixedSum;
  const rawPercent = monthlyGoal > 0 ? total / monthlyGoal * 100 : 100;
  const barPercent = Math.max(0, Math.min(100, rawPercent));
  const percentCenterLeft = Math.max(0, Math.min(100, barPercent / 2));
  const diff = monthlyGoal > 0 ? monthlyGoal - total : -overSum;
  const isOver = monthlyGoal > 0 && total > monthlyGoal;
  const barLabel = monthlyGoal > 0 ? isOver ? `+ ${fmt(Math.abs(diff))}` : `- ${fmt(Math.abs(diff))}` : `- ${fmt(overSum)}`;
  const labelTransform = barPercent <= 12 || barPercent >= 92 ? "translateX(calc(-100% - 6px))" : "translateX(-50%)";
  return {
    // 날짜 관련
    ym,
    today,
    monthStart,
    monthEnd,
    // 목록/합계
    monthOver,
    monthFixed,
    overSum,
    fixedSum,
    total,
    // 목표/바/라벨
    monthlyGoal,
    barPercent,
    percentCenterLeft,
    barLabel,
    labelTransform,
    isOver
  };
}
function ReportPage() {
  const navigate = useNavigate$1();
  const {
    ym: ym2,
    today: today2,
    monthStart: monthStart2,
    monthEnd: monthEnd2,
    monthOver,
    monthFixed,
    overSum,
    fixedSum,
    total,
    monthlyGoal,
    barPercent,
    percentCenterLeft,
    barLabel,
    isOver
  } = useReport();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[rgba(235,235,235,0.35)] relative max-w-md mx-auto pb-20", children: [
    /* @__PURE__ */ jsx(ExpenseHeader, {}),
    /* @__PURE__ */ jsxs("section", { className: "bg-[#F5F5F5] py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-4 pt-2 pb-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sm text-[#757575]", children: [
          /* @__PURE__ */ jsx("span", { children: `${ym2.m}월 ${ym2.d}일` }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              "aria-label": "날짜 선택",
              className: "p-1 -m-1 rounded outline-none hover:bg-black/5 active:bg-black/10",
              onClick: () => {
              },
              children: /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", children: /* @__PURE__ */ jsx("path", { d: "M6 9l6 6 6-6", stroke: "#757575", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-xl font-extrabold !text-[#002B5B]", children: "여울 님의 지출분석" })
      ] }),
      /* @__PURE__ */ jsx(
        ReportSummary,
        {
          monthlyGoal,
          isOver,
          total,
          monthOverCount: monthOver.length,
          monthFixedCount: monthFixed.length,
          overSum,
          fixedSum,
          monthStart: monthStart2,
          monthEnd: monthEnd2,
          today: today2,
          showList: false,
          barPercent,
          progressEl: /* @__PURE__ */ jsx(
            ProgressBar,
            {
              barPercent,
              percentCenterLeft,
              barLabel
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white px-4 pt-4 pb-24 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-semibold text-[#002B5B]", children: "목표 초과지출" }),
          /* @__PURE__ */ jsx("div", { className: "text-[11px] text-[#757575]", children: `${dateK(monthStart2)} - ${dateK(monthEnd2)}` })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 text-xl font-medium text-[#FF6200]", children: [
          "- ",
          fmt(monthlyGoal)
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-semibold text-[#002B5B]", children: "초과지출" }),
          /* @__PURE__ */ jsx("div", { className: "text-[11px] text-[#757575]", children: `${dateK(monthStart2)} - ${dateK(today2)} · ${monthOver.length}번 지출` })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 text-xl font-medium text-[#FF6200]", children: [
          "- ",
          fmt(overSum)
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-semibold text-[#002B5B]", children: "고정지출" }),
          /* @__PURE__ */ jsx("div", { className: "text-[11px] text-[#757575]", children: `${dateK(monthStart2)} - ${dateK(monthEnd2)} · ${monthFixed.length}번 지출` })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 text-xl font-medium text-[#757575]", children: [
          "- ",
          fmt(fixedSum)
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate("/"),
          className: "\r\n              mx-auto                 /* 가운데 정렬 */\r\n              !w-[364px] max-w-full   /* 고정폭(364px), 부모보다 크면 줄이기 */\r\n              !h-[45px]               /* 높이 고정 */\r\n              !rounded-[8px]          /* 모서리 8px */\r\n              !px-[10px] !py-[10px]    /* 패딩 10px */\r\n              !flex items-center !justify-center gap-[10px] /* 아이콘/텍스트 간격 10px */\r\n              !font-light !text-white text-center\r\n              shadow-md active:shadow-sm\r\n              appearance-none\r\n              !bg-[#FF6200] hover:opacity-90 disabled:opacity-100\r\n            ",
          children: monthlyGoal > 0 ? "목표 지출 설정하기" : "목표 지출 설정하기"
        }
      ) })
    ] })
  ] });
}
const report = UNSAFE_withComponentProps(ReportPage);
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: report
}, Symbol.toStringTag, { value: "Module" }));
function ProfileCard({ name, email, onEdit }) {
  return /* @__PURE__ */ jsxs("section", { className: "px-7 pt-4 pb-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxs("span", { className: "text-[18px] md:text-[20px] font-semibold text-[#002B5B]", children: [
        name,
        " 님"
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          "aria-label": "닉네임 수정",
          onClick: onEdit,
          className: "p-1 -mt-0.5 text-[#002B5B] hover:opacity-80",
          children: "✎"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-1 text-[11px] text-[#757575]", children: email })
  ] });
}
function MiniReport({
  title = "초과지출",
  barPercent,
  percentCenterLeft,
  barLabel,
  monthlyGoal,
  className,
  setGoalTo = "/report"
}) {
  return /* @__PURE__ */ jsx(Card, { className: `mx-4 mt-4 rounded-lg border-0 shadow-none ${className ?? ""}`, children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4 h-full", children: [
    /* @__PURE__ */ jsx("div", { className: "text-center text-[15px] font-semibold text-[#002B5B]", children: title }),
    /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(
      ProgressBar,
      {
        barPercent,
        percentCenterLeft,
        barLabel
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-between text-[11px] text-[#757575]", children: [
      /* @__PURE__ */ jsx(Link$1, { to: setGoalTo, className: "mx-auto text-[#BDBDBD] hover:underline underline-offset-2", children: "목표 초과지출 설정" }),
      /* @__PURE__ */ jsx(Money, { children: monthlyGoal > 0 ? `- ${monthlyGoal.toLocaleString()}원` : "0원" })
    ] })
  ] }) });
}
async function fetchCurrentUser() {
  try {
    const res = await httpClient.get(
      API_ENDPOINTS.USERS_ME
    );
    return res.data;
  } catch {
    return { name: "여울", email: "yunsooga@gmail.com", userUid: MOCK_USER_UID };
  }
}
async function logout() {
  await httpClient.post(API_ENDPOINTS.AUTH_LOGOUT);
}
const MorePage = UNSAFE_withComponentProps(function MorePage2() {
  const [user, setUser] = useState(null);
  const {
    monthlyGoal,
    barPercent,
    percentCenterLeft,
    barLabel
  } = useReport();
  useEffect(() => {
    (async () => {
      const me = await fetchCurrentUser();
      setUser(me);
    })();
  }, []);
  const menuItems = [{
    type: "link",
    label: "서비스 이용약관",
    to: "/terms"
  }, {
    type: "external",
    label: "개발자 링크",
    href: "https://example.com"
  }, {
    type: "link",
    label: "리뷰쓰기",
    to: "/reviews/new"
  }, {
    type: "action",
    label: "로그아웃",
    onClick: async () => {
      await logout();
    }
  }];
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-[rgba(235,235,235,0.35)] relative max-w-md mx-auto",
    children: [/* @__PURE__ */ jsx(ExpenseHeader, {}), /* @__PURE__ */ jsxs("div", {
      className: "flex flex-col",
      children: [/* @__PURE__ */ jsx(ProfileCard, {
        name: (user == null ? void 0 : user.name) ?? "사용자",
        email: (user == null ? void 0 : user.email) ?? "",
        onEdit: () => {
        }
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex-1 flex flex-col min-h-[80vh]",
        children: [/* @__PURE__ */ jsx("div", {
          className: "flex-[5]",
          children: /* @__PURE__ */ jsx(MiniReport, {
            className: "h-full",
            title: "초과지출",
            barPercent,
            percentCenterLeft,
            barLabel,
            monthlyGoal
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex-[3] bg-white ",
          children: [/* @__PURE__ */ jsxs("p", {
            children: [/* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx("br", {})]
          }), /* @__PURE__ */ jsx("nav", {
            className: "px-6 space-y-10 tracking-wide leading-5",
            children: menuItems.map((m) => "to" in m ? /* @__PURE__ */ jsx(Link$1, {
              to: m.to,
              className: "block text-[14px] text-[#8F8F8F] no-underline font-light",
              children: m.label
            }, m.label) : "href" in m ? /* @__PURE__ */ jsx("a", {
              href: m.href,
              target: "_blank",
              rel: "noreferrer",
              className: "block text-[14px] text-[#8F8F8F] no-underline font-light",
              children: m.label
            }, m.label) : /* @__PURE__ */ jsx("button", {
              onClick: m.onClick,
              className: "block w-full text-left text-[14px] text-[#8F8F8F] font-light",
              children: m.label
            }, m.label))
          })]
        })]
      })]
    })]
  });
});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MorePage
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DFMVeL8j.js", "imports": ["/assets/chunk-PVWAREVJ-B6zbi7fP.js", "/assets/index-C3C7g39L.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-BhJgDS2F.js", "imports": ["/assets/chunk-PVWAREVJ-B6zbi7fP.js", "/assets/index-C3C7g39L.js", "/assets/useExpenses-DaQT4tNd.js", "/assets/expenseApi-6HP_E5FY.js", "/assets/httpClient-CWcscfoA.js"], "css": ["/assets/root-DYEmgneT.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_index-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/expenses._index": { "id": "routes/expenses._index", "parentId": "root", "path": "expenses", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/expenses._index-CkEbfvZs.js", "imports": ["/assets/chunk-PVWAREVJ-B6zbi7fP.js", "/assets/httpClient-CWcscfoA.js", "/assets/useExpenses-DaQT4tNd.js", "/assets/validation-toliqgmx.js", "/assets/expenseApi-6HP_E5FY.js", "/assets/ExpenseHeader-DB5zjICS.js", "/assets/proxy-C3LYbkDo.js", "/assets/expense-CkU4x5BU.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/expenses.$expenseId": { "id": "routes/expenses.$expenseId", "parentId": "root", "path": "expenses/:expenseId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/expenses._expenseId-DmBTVYdf.js", "imports": ["/assets/chunk-PVWAREVJ-B6zbi7fP.js", "/assets/httpClient-CWcscfoA.js", "/assets/useExpenses-DaQT4tNd.js", "/assets/validation-toliqgmx.js", "/assets/button-vWu2_4Yx.js", "/assets/expense-CkU4x5BU.js", "/assets/expenseApi-6HP_E5FY.js", "/assets/utils-C0GuhilF.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/expenses.add": { "id": "routes/expenses.add", "parentId": "root", "path": "expenses/add", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/expenses.add-CNz9fSdL.js", "imports": ["/assets/chunk-PVWAREVJ-B6zbi7fP.js", "/assets/button-vWu2_4Yx.js", "/assets/utils-C0GuhilF.js", "/assets/index-CdkfFI4V.js", "/assets/index-C3C7g39L.js", "/assets/expenseApi-6HP_E5FY.js", "/assets/expense-CkU4x5BU.js", "/assets/httpClient-CWcscfoA.js", "/assets/proxy-C3LYbkDo.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/report": { "id": "routes/report", "parentId": "root", "path": "report", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/report-CnSdrdBq.js", "imports": ["/assets/chunk-PVWAREVJ-B6zbi7fP.js", "/assets/ExpenseHeader-DB5zjICS.js", "/assets/useReport-DyALt6uu.js", "/assets/index-CdkfFI4V.js", "/assets/index-C3C7g39L.js", "/assets/utils-C0GuhilF.js", "/assets/httpClient-CWcscfoA.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "features/more/pages/MorePage": { "id": "features/more/pages/MorePage", "parentId": "root", "path": "more", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/MorePage-CcQpDs-r.js", "imports": ["/assets/chunk-PVWAREVJ-B6zbi7fP.js", "/assets/useReport-DyALt6uu.js", "/assets/httpClient-CWcscfoA.js", "/assets/ExpenseHeader-DB5zjICS.js", "/assets/index-CdkfFI4V.js", "/assets/index-C3C7g39L.js", "/assets/utils-C0GuhilF.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-a0fadbf7.js", "version": "a0fadbf7", "sri": void 0 };
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
  },
  "routes/expenses.add": {
    id: "routes/expenses.add",
    parentId: "root",
    path: "expenses/add",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/report": {
    id: "routes/report",
    parentId: "root",
    path: "report",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "features/more/pages/MorePage": {
    id: "features/more/pages/MorePage",
    parentId: "root",
    path: "more",
    index: void 0,
    caseSensitive: void 0,
    module: route6
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
