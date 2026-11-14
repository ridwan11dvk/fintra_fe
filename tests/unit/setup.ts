import { AppConfigProvider, type AppConfig } from "@railfinance/core";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import React from "react";
import { createRoot } from "react-dom/client";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./mocks/server";

// ---------------------------------------------------------------------------
// Initialize global AppConfig so apiClient/service calls work in tests that
// call services directly (without the React provider wrapper).
// apiUrl matches the MSW handlers (BASE).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Initialize global AppConfig so apiClient/service calls work in tests that
// call services directly (without the React provider wrapper).
// apiUrl matches the MSW handlers (BASE).
// ---------------------------------------------------------------------------
const testAppConfig: AppConfig = {
  appName: "RailFinance",
  apiUrl: "http://localhost:3000",
  esaUrl: "https://esa-beta.kai.id",
  vapidKey: "",
  defaultPageType: "base",
};

const configContainer = document.createElement("div");
createRoot(configContainer).render(
  React.createElement(AppConfigProvider, { config: testAppConfig, children: null }, null),
);

// Start MSW server before all tests — warn on unhandled requests
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

// Reset handlers + cleanup React trees between tests
afterEach(() => {
  server.resetHandlers();
  cleanup();
});

// Close MSW server after the test suite
afterAll(() => server.close());

// ---------------------------------------------------------------------------
// Polyfill localStorage / sessionStorage (vitest 4 + jsdom 29 compatibility)
// ---------------------------------------------------------------------------
if (typeof globalThis.localStorage === "undefined" || typeof globalThis.localStorage?.getItem !== "function") {
  const storageMap = new Map<string, string>();

  function createStorage(): Storage {
    return {
      get length() {
        return storageMap.size;
      },
      clear: () => storageMap.clear(),
      getItem: (key: string) => storageMap.get(key) ?? null,
      key: (index: number) => [...storageMap.keys()][index] ?? null,
      removeItem: (key: string) => storageMap.delete(key),
      setItem: (key: string, value: string) =>
        storageMap.set(key, String(value)),
    };
  }

  Object.defineProperty(globalThis, "localStorage", {
    writable: true,
    value: createStorage(),
  });

  Object.defineProperty(globalThis, "sessionStorage", {
    writable: true,
    value: createStorage(),
  });
}

// ---------------------------------------------------------------------------
// Browser API stubs required by jsdom + component library
// ---------------------------------------------------------------------------

Object.defineProperty(globalThis, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => { },
    removeListener: () => { },
    addEventListener: () => { },
    removeEventListener: () => { },
    dispatchEvent: () => false,
  }),
});

Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  value: class ResizeObserver {
    observe() {
      return null;
    }
    unobserve() {
      return null;
    }
    disconnect() {
      return null;
    }
  },
});

// Polyfill HTMLFormElement.requestSubmit for jsdom
if (typeof HTMLFormElement.prototype.requestSubmit !== "function") {
  HTMLFormElement.prototype.requestSubmit = function () {
    this.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true }),
    );
  };
}

Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: class IntersectionObserver {
    observe() {
      return null;
    }
    unobserve() {
      return null;
    }
    disconnect() {
      return null;
    }
  },
});

// Polyfill Blob.prototype.stream for jsdom + undici / MSW compatibility
if (typeof Blob !== "undefined" && !Blob.prototype.stream) {
  Blob.prototype.stream = function () {
    return new ReadableStream({
      start: async (controller) => {
        const buffer = await this.arrayBuffer();
        controller.enqueue(new Uint8Array(buffer));
        controller.close();
      },
    });
  };
}

// Polyfill pointer capture methods for Radix UI in jsdom
if (typeof Element.prototype.hasPointerCapture !== "function") {
  Element.prototype.hasPointerCapture = () => false;
}
if (typeof Element.prototype.setPointerCapture !== "function") {
  Element.prototype.setPointerCapture = () => { };
}
if (typeof Element.prototype.releasePointerCapture !== "function") {
  Element.prototype.releasePointerCapture = () => { };
}
if (typeof Element.prototype.scrollIntoView !== "function") {
  Element.prototype.scrollIntoView = () => { };
}
