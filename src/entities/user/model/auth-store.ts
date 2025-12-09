// entities/user/model/auth-store.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface User {
  id: number;
  name: string;
  email?: string;
  contragent_phone: string;
  type: 'buyer' | 'seller';
  avatar?: string;
  company_name?: string;
  address?: string;
  registration_date?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, type: string) => void;
  logout: () => void;
}

const generateMockUser = (type: string, phone: string): User => {
  const isSeller = type === 'seller';
  const id = Math.floor(Math.random() * 10000);
  
  const buyerData = {
    id,
    name: `Иван Иванов`,
    email: `buyer${id}@example.com`,
    contragent_phone: phone,
    type: 'buyer' as const,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
    registration_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  const sellerData = {
    id,
    name: `Александр Предприниматель`,
    email: `seller${id}@company.com`,
    contragent_phone: phone,
    type: 'seller' as const,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id + 1000}`,
    company_name: `ООО "Быстрые решения"`,
    address: `Москва, ул. Ленина, 1`,
    registration_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
  };

  return isSeller ? sellerData : buyerData;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (phone: string, type: string) => {
        const mockUser = generateMockUser(type, phone);
        set({ user: mockUser, isAuthenticated: true });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);