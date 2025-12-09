"use client";
import { LockIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/entities/cart/model/hooks";
import { useCartItems } from "@/entities/cart/model/hooks";
import { useCreateOrder } from "@/shared/hooks/useOrders";
import { CartItem } from "@/entities/cart/ui/cart-item";
import { useContragentPhone } from "@/shared/hooks/useContragentPhone";
import { Button } from "@/shared/ui/kit/button";
import { Checkbox } from "@/shared/ui/kit/checkbox";
import { Input } from "@/shared/ui/kit/input";
import { Label } from "@/shared/ui/kit/label";
import { Separator } from "@/shared/ui/kit/separator";
import { Textarea } from "@/shared/ui/kit/textarea";
import { Skeleton } from "@/shared/ui/kit/skeleton";

interface UserData {
  name: string;
  phone: string;
  address?: string;
}

const PaymentPage = () => {
  const router = useRouter();
  const contragentPhone = useContragentPhone();
  const { data: cart, isLoading: isCartLoading, error: cartError } = useCart();
  const { 
    items, 
    isLoading: areItemsLoading, 
    hasError, 
    totalPrice 
  } = useCartItems(cart?.goods || []);
  const createOrderMutation = useCreateOrder();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    isAnotherPerson: false,
    recipientName: "",
    recipientPhone: "",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        let userData: UserData | null = null;
        let source: 'auth' | 'localStorage' | 'contragent' | null = null;

        if (!userData) {
          const savedData = localStorage.getItem('user_delivery_data');
          if (savedData) {
            try {
              const parsedData = JSON.parse(savedData);
              userData = {
                name: parsedData.name || "",
                phone: parsedData.phone || "",
                address: parsedData.address || "",
              };
              source = 'localStorage';
            } catch (error) {
              console.error('Error parsing localStorage data:', error);
            }
          }
        }

        if (!userData && contragentPhone) {
          userData = {
            name: "",
            phone: contragentPhone,
            address: "",
          };
          source = 'contragent';

        }

        if (!userData) {
          userData = {
            name: "",
            phone: "",
            address: "",
          };

        }
        setFormData(prev => ({
          ...prev,
          name: userData!.name,
          phone: userData!.phone,
          address: userData!.address || "",
        }));

        
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      loadUserData();
    }
  }, [contragentPhone, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      const isAuthenticated = async () => {
        try {
          const response = await fetch('/api/user/profile');
          return response.ok;
        } catch {
          return false;
        }
      };

      const saveToLocalStorage = async () => {
        const authenticated = await isAuthenticated();
        if (!authenticated && (formData.name || formData.phone || formData.address)) {
          const userData: UserData = {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
          };
          localStorage.setItem('user_delivery_data', JSON.stringify(userData));
        }
      };

      const timeoutId = setTimeout(saveToLocalStorage, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [formData.name, formData.phone, formData.address, isInitialized]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cart || items.length === 0) {
      alert("Корзина пуста");
      return;
    }

    if (!formData.name || !formData.phone) {
      alert("Заполните обязательные поля: имя и телефон");
      return;
    }

    const orderData = {
      goods: cart.goods.map(good => ({
        nomenclature_id: good.nomenclature_id,
        warehouse_id: good.warehouse_id,
        quantity: good.quantity || 1,
        is_from_cart: true,
      })),
      delivery: {
        address: formData.address || "Адрес не указан",
        delivery_date: Math.floor(Date.now() / 1000) + 86400,
        delivery_price: 0,
        recipient: {
          name: formData.isAnotherPerson ? formData.recipientName : formData.name,
          surname: "",
          phone: formData.isAnotherPerson ? formData.recipientPhone : formData.phone,
        },
        note: formData.note,
      }
    };

    try {
      await createOrderMutation.mutateAsync(orderData);
      setOrderPlaced(true);
      
      setTimeout(() => {
        router.push("/order-success");
      }, 2000);
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
      alert("Произошла ошибка при оформлении заказа. Попробуйте еще раз.");
    }
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Заказ успешно оформлен!</h1>
        <p>Спасибо за ваш заказ. Скоро с вами свяжется менеджер.</p>
      </div>
    );
  }

  const isLoading = isCartLoading || areItemsLoading || createOrderMutation.isPending;

  return (
    <div className="py-4 md:py-8 min-w-200">
      <div className="container">
        <div className="w-full max-w-5xl mx-auto">
          <h1 className="text-xl font-medium tracking-tight pb-4">Оформление заказа</h1>
          <div className="flex flex-col-reverse gap-8 lg:grid grid-cols-7">
            <form onSubmit={handleSubmit} className="col-span-3">
              <Button className="w-full">
                <svg
                  viewBox="0 0 50 20"
                  fill="currentColor"
                  className="!w-auto"
                >
                  <path d="M9.536 2.579c-.571.675-1.485 1.208-2.4 1.132-.113-.914.334-1.884.858-2.484C8.565.533 9.564.038 10.374 0c.095.951-.276 1.884-.838 2.579zm.829 1.313c-1.324-.077-2.457.751-3.085.751-.638 0-1.6-.713-2.647-.694-1.362.019-2.628.79-3.323 2.017-1.429 2.455-.372 6.09 1.009 8.087.676.99 1.485 2.075 2.552 2.036 1.009-.038 1.409-.656 2.628-.656 1.228 0 1.58.656 2.647.637 1.104-.019 1.8-.99 2.475-1.979.771-1.122 1.086-2.217 1.105-2.274-.02-.019-2.133-.828-2.152-3.263-.02-2.036 1.666-3.007 1.742-3.064-.952-1.408-2.437-1.56-2.951-1.598zm7.645-2.76v14.834h2.305v-5.072h3.19c2.913 0 4.96-1.998 4.96-4.89 0-2.893-2.01-4.872-4.885-4.872h-5.57zm2.305 1.941h2.656c2 0 3.142 1.066 3.142 2.94 0 1.875-1.142 2.95-3.151 2.95h-2.647v-5.89zM32.673 16.08c1.448 0 2.79-.733 3.4-1.893h.047v1.779h2.133V8.582c0-2.14-1.714-3.52-4.351-3.52-2.447 0-4.256 1.399-4.323 3.32h2.076c.171-.913 1.018-1.512 2.18-1.512 1.41 0 2.2.656 2.2 1.865v.818l-2.876.171c-2.675.162-4.123 1.256-4.123 3.159 0 1.922 1.495 3.197 3.637 3.197zm.62-1.76c-1.229 0-2.01-.59-2.01-1.494 0-.933.752-1.475 2.19-1.56l2.562-.162v.837c0 1.39-1.181 2.379-2.743 2.379zM41.1 20c2.247 0 3.304-.856 4.227-3.454l4.047-11.341h-2.342l-2.714 8.763h-.047l-2.714-8.763h-2.409l3.904 10.799-.21.656c-.352 1.114-.923 1.542-1.942 1.542-.18 0-.533-.02-.676-.038v1.779c.133.038.705.057.876.057z"></path>
                </svg>
              </Button>
              <div className="flex items-center gap-2 py-4">
                <Separator className="flex-1" />
                <span className="text-gray-500 text-sm">или</span>
                <Separator className="flex-1" />
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">Имя *</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    placeholder="Иван"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone">Номер телефона *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+7 999 123 45 67"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="address">Адрес доставки</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="ул. Пушкина, д. Колотушкина (не обязательно)"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="note">Примечание к заказу</Label>
                  <Textarea
                    id="note"
                    rows={4}
                    placeholder="Дополнительные пожелания"
                    value={formData.note}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isAnotherPerson"
                    checked={formData.isAnotherPerson}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({ ...prev, isAnotherPerson: !!checked }));
                    }}
                    disabled={isLoading}
                  />
                  <Label htmlFor="isAnotherPerson">
                    Заказ оформляется для другого человека
                  </Label>
                </div>
                {formData.isAnotherPerson && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="recipientName">Имя получателя *</Label>
                      <Input
                        id="recipientName"
                        type="text"
                        required
                        placeholder="Петр"
                        value={formData.recipientName}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="recipientPhone">Номер телефона получателя *</Label>
                      <Input
                        id="recipientPhone"
                        type="tel"
                        required
                        placeholder="+7 999 765 43 21"
                        value={formData.recipientPhone}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                  </>
                )}
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700" 
                  disabled={isLoading || items.length === 0}
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Оформление заказа...
                    </>
                  ) : (
                    `Оформить заказ за ${totalPrice.toLocaleString("ru-RU")}₽`
                  )}
                </Button>
                <div className="flex justify-center items-center text-gray-500 gap-1">
                  <LockIcon width={16} height={16} />
                  <span className="text-sm text-center">
                    Ваши данные защищены
                  </span>
                </div>
              </div>
            </form>
            <div className="col-span-4">
              <div className="flex flex-col gap-2">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex gap-2">
                        <div className="rounded-md border border-gray-100 w-24 h-24 p-2">
                          <Skeleton className="w-full h-full" />
                        </div>
                        <div className="py-1 flex-1">
                          <div className="flex justify-between items-center">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <Skeleton className="h-3 w-24 mt-1" />
                          <div className="flex justify-between items-center gap-2 pt-2">
                            <Skeleton className="h-8 w-32" />
                            <Skeleton className="h-8 w-16" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : cartError ? (
                  <div className="text-center py-4 text-red-500">
                    Ошибка загрузки корзины
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    Корзина пуста
                  </div>
                ) : (
                  <>
                    {items.map((item, index) => (
                      <React.Fragment key={`${item.nomenclature_id}-${item.warehouse_id || 'no-warehouse'}`}>
                        <CartItem item={item} />
                        {index < items.length - 1 && <Separator className="my-4" />}
                      </React.Fragment>
                    ))}
                    
                    <div className="mt-auto md:mt-0 pt-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="tracking-tight font-medium">Всего</p>
                          <span className="tracking-tight font-medium">{totalPrice.toLocaleString("ru-RU")}₽</span>
                        </div>
                        <p className="text-sm/tight text-gray-500 tracking-tight pt-2">
                          Стоимость доставки и налоги рассчитываются <br />
                          при оформлении заказа.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;