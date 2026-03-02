import { beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";

const redirectMock = jest.fn();
const nextMock = jest.fn();

jest.mock("@/lib/cookie", () => ({
  getAuthToken: jest.fn(),
  getUserData: jest.fn(),
}));

const cookieMock = jest.requireMock("@/lib/cookie") as {
  getAuthToken: jest.Mock;
  getUserData: jest.Mock;
};

let proxy: (request: any) => Promise<any>;
let config: { matcher: string[] };

jest.mock("next/server", () => ({
  NextResponse: {
    redirect: (...args: unknown[]) => redirectMock(...args),
    next: (...args: unknown[]) => nextMock(...args),
  },
}));

const createRequest = (pathname: string, baseUrl = "http://localhost:3000") =>
  ({
    nextUrl: { pathname },
    url: `${baseUrl}${pathname}`,
  } as any);

describe("proxy unit tests", () => {
  beforeAll(async () => {
    const proxyModule = await import("@/proxy");
    proxy = proxyModule.proxy;
    config = proxyModule.config;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    redirectMock.mockReturnValue({ type: "redirect" });
    nextMock.mockReturnValue({ type: "next" });
  });

  it("redirects unauthenticated users from protected route to /login", async () => {
    cookieMock.getAuthToken.mockImplementation(async () => null);

    const request = createRequest("/admin/settings");
    await proxy(request);

    expect(redirectMock).toHaveBeenCalledTimes(1);
    const redirectUrl = redirectMock.mock.calls[0][0] as URL;
    expect(redirectUrl.pathname).toBe("/login");
    expect(nextMock).not.toHaveBeenCalled();
  });

  it("allows unauthenticated users to access public routes", async () => {
    cookieMock.getAuthToken.mockImplementation(async () => null);

    const request = createRequest("/talent/login");
    const result = await proxy(request);

    expect(redirectMock).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ type: "next" });
  });

  it("redirects authenticated non-admin user away from admin route", async () => {
    cookieMock.getAuthToken.mockImplementation(async () => "token");
    cookieMock.getUserData.mockImplementation(async () => ({ role: "candidate" } as any));

    const request = createRequest("/admin/users");
    await proxy(request);

    expect(redirectMock).toHaveBeenCalledTimes(1);
    const redirectUrl = redirectMock.mock.calls[0][0] as URL;
    expect(redirectUrl.pathname).toBe("/");
  });

  it("redirects authenticated user from public route to /", async () => {
    cookieMock.getAuthToken.mockImplementation(async () => "token");
    cookieMock.getUserData.mockImplementation(async () => ({ role: "candidate" } as any));

    const request = createRequest("/register");
    await proxy(request);

    expect(redirectMock).toHaveBeenCalledTimes(1);
    const redirectUrl = redirectMock.mock.calls[0][0] as URL;
    expect(redirectUrl.pathname).toBe("/");
  });

  it("allows admin to access admin route", async () => {
    cookieMock.getAuthToken.mockImplementation(async () => "token");
    cookieMock.getUserData.mockImplementation(async () => ({ role: "admin" } as any));

    const request = createRequest("/admin/profile");
    const result = await proxy(request);

    expect(redirectMock).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ type: "next" });
  });

  it("contains expected matcher entries in config", () => {
    expect(config.matcher).toContain("/admin/:path*");
    expect(config.matcher).toContain("/user/:path*");
    expect(config.matcher).toContain("/talent/login");
    expect(config.matcher).toContain("/register");
  });
});
