import { beforeEach, describe, expect, it, jest, afterEach } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockCheckAuth = jest.fn<() => Promise<void>>(async () => {});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: mockRefresh,
    prefetch: jest.fn(),
  }),
}));

jest.mock("@/context/AuthContext");
jest.mock("@/lib/actions/auth-action");
jest.mock("react-hot-toast");
jest.mock("@react-oauth/google", () => ({
  GoogleLogin: () => <div data-testid="google-login">Google Login</div>,
}));

describe("Talent Login Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Test 1: Successfully logs in talent user and redirects to /talent", async () => {
    // Setup mocks
    const mod = await import("@/lib/actions/auth-action");
    const toast = await import("react-hot-toast");
    const { useAuth } = await import("@/context/AuthContext");

    jest.mocked(mod.handleTalentLogin).mockResolvedValueOnce({
      success: true,
      message: "Login successful",
      data: { data: { role: "candidate" } },
    });
    jest.mocked(useAuth).mockReturnValue({
      checkAuth: mockCheckAuth,
      isAuthenticated: false,
      setIsAuthenticated: jest.fn(),
      user: null,
      setUser: jest.fn(),
      token: null,
      setToken: jest.fn(),
      logout: jest.fn<() => Promise<void>>(async () => {}),
      loading: false,
      refetchAuth: jest.fn<() => Promise<void>>(async () => {}),
    });

    const LoginForm = (await import("@/app/(auth)/_components/LoginForm")).default;
    render(<LoginForm role="Talent" />);

    await userEvent.type(screen.getByPlaceholderText("Email"), "talent@example.com");
    await userEvent.type(screen.getByPlaceholderText("Password"), "Password@123");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mod.handleTalentLogin).toHaveBeenCalledWith({
        email: "talent@example.com",
        password: "Password@123",
      });
      expect(mockPush).toHaveBeenCalledWith("/talent");
    });
  });

  it("Test 2: Shows error message when login fails with invalid credentials", async () => {
    const mod = await import("@/lib/actions/auth-action");
    const toast = await import("react-hot-toast");
    const { useAuth } = await import("@/context/AuthContext");

    jest.mocked(mod.handleTalentLogin).mockResolvedValueOnce({
      success: false,
      message: "Invalid email or password",
    });
    jest.mocked(useAuth).mockReturnValue({
      checkAuth: mockCheckAuth,
      isAuthenticated: false,
      setIsAuthenticated: jest.fn(),
      user: null,
      setUser: jest.fn(),
      token: null,
      setToken: jest.fn(),
      logout: jest.fn<() => Promise<void>>(async () => {}),
      loading: false,
      refetchAuth: jest.fn<() => Promise<void>>(async () => {}),
    });

    const LoginForm = (await import("@/app/(auth)/_components/LoginForm")).default;
    render(<LoginForm role="Talent" />);

    await userEvent.type(screen.getByPlaceholderText("Email"), "talent@example.com");
    await userEvent.type(screen.getByPlaceholderText("Password"), "wrongpassword");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(jest.mocked(toast.default.error)).toHaveBeenCalledWith(
        "Invalid email or password"
      );
    });
  });

  it("Test 3: Displays validation errors when password field is empty", async () => {
    const { useAuth } = await import("@/context/AuthContext");
    jest.mocked(useAuth).mockReturnValue({
      checkAuth: mockCheckAuth,
      isAuthenticated: false,
      setIsAuthenticated: jest.fn(),
      user: null,
      setUser: jest.fn(),
      token: null,
      setToken: jest.fn(),
      logout: jest.fn<() => Promise<void>>(async () => {}),
      loading: false,
      refetchAuth: jest.fn<() => Promise<void>>(async () => {}),
    });

    const LoginForm = (await import("@/app/(auth)/_components/LoginForm")).default;
    render(<LoginForm role="Talent" />);

    await userEvent.type(screen.getByPlaceholderText("Email"), "talent@example.com");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it("Test 4: Redirects to home when user has unknown role after successful login", async () => {
    const mod = await import("@/lib/actions/auth-action");
    const { useAuth } = await import("@/context/AuthContext");

    jest.mocked(mod.handleTalentLogin).mockResolvedValueOnce({
      success: true,
      message: "Login successful",
      data: { data: { role: "admin" } },
    });
    jest.mocked(useAuth).mockReturnValue({
      checkAuth: mockCheckAuth,
      isAuthenticated: false,
      setIsAuthenticated: jest.fn(),
      user: null,
      setUser: jest.fn(),
      token: null,
      setToken: jest.fn(),
      logout: jest.fn<() => Promise<void>>(async () => {}),
      loading: false,
      refetchAuth: jest.fn<() => Promise<void>>(async () => {}),
    });

    const LoginForm = (await import("@/app/(auth)/_components/LoginForm")).default;
    render(<LoginForm role="Talent" />);

    await userEvent.type(screen.getByPlaceholderText("Email"), "talent@example.com");
    await userEvent.type(screen.getByPlaceholderText("Password"), "Password@123");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("Test 5: Renders correct navigation links for talent user", async () => {
    const { useAuth } = await import("@/context/AuthContext");
    jest.mocked(useAuth).mockReturnValue({
      checkAuth: mockCheckAuth,
      isAuthenticated: false,
      setIsAuthenticated: jest.fn(),
      user: null,
      setUser: jest.fn(),
      token: null,
      setToken: jest.fn(),
      logout: jest.fn<() => Promise<void>>(async () => {}),
      loading: false,
      refetchAuth: jest.fn<() => Promise<void>>(async () => {}),
    });

    const LoginForm = (await import("@/app/(auth)/_components/LoginForm")).default;
    render(<LoginForm role="Talent" />);

    const forgotLink = screen.getByRole("link", { name: /forgot password/i });
    const recruiterLink = screen.getByRole("link", { name: /recruiter/i });

    expect(forgotLink).toHaveAttribute("href", "/talent/forgot-password");
    expect(recruiterLink).toHaveAttribute("href", "/recruiter/login");
  });
});
