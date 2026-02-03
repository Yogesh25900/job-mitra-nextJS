"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleCheckAuth, handleClientLogout } from "@/lib/actions/auth-action";

interface AuthContextProps {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    user: any;
    setUser: (user: any) => void;
    logout: () => Promise<void>;
    loading: boolean;
    checkAuth: () => Promise<void>;
    refetchAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [hydrated, setHydrated] = useState(false);
    const router = useRouter();

    const checkAuth = async () => {
        try {
            const result = await handleCheckAuth();

            if (result?.authenticated) {
                setUser(result.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (err) {
            console.error('Auth check error:', err);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth().then(() => {
            setHydrated(true);
        });
    }, []);

    // Don't render children until auth check is complete AND hydration is done
    if (!hydrated || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    const logout = async () => {
        try {
            await handleClientLogout();
            setIsAuthenticated(false);
            setUser(null);
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    const contextValue: AuthContextProps = {
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        logout,
        loading,
        checkAuth,
        refetchAuth: checkAuth,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

