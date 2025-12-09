import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContragentPhone } from "../hooks/useContragentPhone";

import * as orderApi from "../api/createOrder"
import { CreateOrderParams } from "../types/order";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const contragentPhone = useContragentPhone();

  return useMutation({
    mutationFn: async (orderData: Omit<CreateOrderParams, "contragent_phone">) => {
      return orderApi.createOrder({
        ...orderData,
        contragent_phone: contragentPhone,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};