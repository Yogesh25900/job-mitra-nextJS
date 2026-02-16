import "@testing-library/jest-dom/jest-globals";
import { jest } from "@jest/globals";
import { TextEncoder, TextDecoder } from "util";
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder as typeof global.TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}

if (typeof global.Request === "undefined") {
  class MockHeaders {
    private store = new Map<string, string>();

    constructor(init?: Record<string, string> | [string, string][]) {
      if (Array.isArray(init)) {
        init.forEach(([key, value]) => this.set(key, value));
      } else if (init) {
        Object.entries(init).forEach(([key, value]) => this.set(key, value));
      }
    }

    set(key: string, value: string) {
      this.store.set(String(key).toLowerCase(), String(value));
    }

    get(key: string) {
      return this.store.get(String(key).toLowerCase()) ?? null;
    }
  }

  class MockRequest {
    url: string;
    method: string;
    headers: MockHeaders;
    body: unknown;

    constructor(input: string, init?: { method?: string; headers?: Record<string, string>; body?: unknown }) {
      this.url = String(input);
      this.method = init?.method ?? "GET";
      this.headers = new MockHeaders(init?.headers);
      this.body = init?.body;
    }
  }

  class MockResponse {
    status: number;
    ok: boolean;
    headers: MockHeaders;
    private payload: unknown;

    constructor(body?: unknown, init?: { status?: number; headers?: Record<string, string> }) {
      this.status = init?.status ?? 200;
      this.ok = this.status >= 200 && this.status < 300;
      this.headers = new MockHeaders(init?.headers);
      this.payload = body;
    }

    async json() {
      return this.payload;
    }

    async text() {
      if (typeof this.payload === "string") return this.payload;
      return JSON.stringify(this.payload ?? "");
    }
  }

  global.Headers = MockHeaders as unknown as typeof global.Headers;
  global.Request = MockRequest as unknown as typeof global.Request;
  global.Response = MockResponse as unknown as typeof global.Response;
  global.fetch = jest.fn(async () => new MockResponse(null, { status: 200 })) as unknown as typeof global.fetch;
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
