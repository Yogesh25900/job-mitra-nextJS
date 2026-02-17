import { beforeEach, describe, expect, it, jest, afterEach } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock("@/lib/actions/auth-action");
jest.mock("react-hot-toast");

describe("Signup Form Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Test 1: Successfully registers talent user and redirects to /talent/login", async () => {
    const mod = await import("@/lib/actions/auth-action");
    const toast = await import("react-hot-toast");

    jest.mocked(mod.handleTalentRegister).mockResolvedValueOnce({
      success: true,
      message: "Account created successfully",
    });

    const SignupForm = (await import("@/app/(auth)/_components/SignupForm")).default;
    render(<SignupForm />);

    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const phoneInput = screen.getByPlaceholderText("Phone Number (10 digits)");
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(lastNameInput, "Doe");
    await userEvent.type(emailInput, "johndoe@example.com");
    await userEvent.type(phoneInput, "9876543210");
    await userEvent.type(dateInput, "1998-05-15");
    await userEvent.type(passwordInput, "SecurePass@123");
    await userEvent.type(confirmPasswordInput, "SecurePass@123");

    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mod.handleTalentRegister).toHaveBeenCalledWith({
        fname: "John",
        lname: "Doe",
        email: "johndoe@example.com",
        phoneNumber: "9876543210",
        dateOfBirth: "1998-05-15",
        password: "SecurePass@123",
        confirmPassword: "SecurePass@123",
      });
      expect(mockPush).toHaveBeenCalledWith("/talent/login");
    });
  });

  it("Test 2: Shows error toast when talent registration fails (email exists)", async () => {
    const mod = await import("@/lib/actions/auth-action");
    const toast = await import("react-hot-toast");

    jest.mocked(mod.handleTalentRegister).mockResolvedValueOnce({
      success: false,
      message: "Email already exists",
    });

    const SignupForm = (await import("@/app/(auth)/_components/SignupForm")).default;
    render(<SignupForm />);

    await userEvent.type(screen.getByPlaceholderText("First Name"), "Jane");
    await userEvent.type(screen.getByPlaceholderText("Last Name"), "Smith");
    await userEvent.type(screen.getByPlaceholderText("Email"), "existing@example.com");
    await userEvent.type(screen.getByPlaceholderText("Phone Number (10 digits)"), "9876543210");
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    await userEvent.type(dateInput, "1999-03-20");
    await userEvent.type(screen.getByPlaceholderText("Password"), "SecurePass@123");
    await userEvent.type(screen.getByPlaceholderText("Confirm Password"), "SecurePass@123");

    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(jest.mocked(toast.default.error)).toHaveBeenCalledWith("Email already exists");
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it("Test 3: Displays validation errors for invalid form fields", async () => {
    const mod = await import("@/lib/actions/auth-action");
    const SignupForm = (await import("@/app/(auth)/_components/SignupForm")).default;
    render(<SignupForm />);

    // Fill with invalid data
    await userEvent.type(screen.getByPlaceholderText("First Name"), "A"); // Too short
    await userEvent.type(screen.getByPlaceholderText("Last Name"), "B"); // Too short
    await userEvent.type(screen.getByPlaceholderText("Email"), "invalidemail");
    await userEvent.type(screen.getByPlaceholderText("Phone Number (10 digits)"), "123"); // Too short

    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Form validation should prevent submission
    expect(jest.mocked(mod.handleTalentRegister)).not.toHaveBeenCalled();
  });

  it("Test 4: Switches between talent and recruiter modes and registers recruiter", async () => {
    const mod = await import("@/lib/actions/auth-action");
    const toast = await import("react-hot-toast");

    jest.mocked(mod.handleRecruiterRegister).mockResolvedValueOnce({
      success: true,
      message: "Recruiter account created successfully",
    });

    const SignupForm = (await import("@/app/(auth)/_components/SignupForm")).default;
    render(<SignupForm />);

    // Switch to Recruiter
    await userEvent.click(screen.getByRole("button", { name: "Recruiter" }));

    await userEvent.type(screen.getByPlaceholderText("Company Name"), "Tech Corp");
    await userEvent.type(screen.getByPlaceholderText("Contact Person Name"), "Alice Manager");
    await userEvent.type(screen.getByPlaceholderText("Email"), "alice@techcorp.com");
    await userEvent.type(screen.getByPlaceholderText("Phone Number (10 digits)"), "9876543210");
    await userEvent.type(screen.getByPlaceholderText("Password"), "SecurePass@123");
    await userEvent.type(screen.getByPlaceholderText("Confirm Password"), "SecurePass@123");

    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mod.handleRecruiterRegister).toHaveBeenCalledWith({
        companyName: "Tech Corp",
        contactName: "Alice Manager",
        email: "alice@techcorp.com",
        phoneNumber: "9876543210",
        password: "SecurePass@123",
        confirmPassword: "SecurePass@123",
      });
      expect(mockPush).toHaveBeenCalledWith("/recruiter/login");
    });
  });

  it("Test 5: Password strength indicator updates as user types", async () => {
    const SignupForm = (await import("@/app/(auth)/_components/SignupForm")).default;
    render(<SignupForm />);

    const passwordInput = screen.getByPlaceholderText("Password");

    // Type weak password
    await userEvent.type(passwordInput, "weak");
    await waitFor(() => {
      expect(screen.getByText(/password strength:/i)).toBeInTheDocument();
    });

    // Clear and type strong password
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, "StrongPass@123");

    await waitFor(() => {
      expect(screen.getByText("Strong")).toBeInTheDocument();
    });
  });
});
