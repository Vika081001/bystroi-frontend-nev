import { useAuthStore } from "@/entities/user";

export const useDataUser = () => {
    const {user} = useAuthStore();
    return user;
}