// shared/hooks/useOrders.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContragentPhone } from "./useContragentPhone";
import { createOrder } from "../api/createOrder";
import { CreateOrderParams } from "../types/order";
import { useUtmParams } from "./useUtmParams";

export const useCreateOrder = () => {

  const queryClient = useQueryClient();
  const contragentPhone = useContragentPhone();
  const { utmParams } = useUtmParams();

  return useMutation({
    mutationFn: async (orderData: Omit<CreateOrderParams, "contragent_phone">) => {
      return createOrder({
        ...orderData,
        contragent_phone: contragentPhone,
        ...utmParams,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Ошибка при создании заказа:", error);
    },
  });
};