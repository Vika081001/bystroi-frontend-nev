"use client";
import { LockIcon, X, CheckCircle, AlertCircle, LocateIcon } from "lucide-react";
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
import { useDataUser } from "@/shared/hooks/useDataUser";
import { Suspense } from "react";

interface UserData {
  name: string;
  phone: string;
  address?: string;
}

const DEFAULT_COORDINATES = {
  lat: 55.7558,
  lon: 37.6173,
};

interface OrderModalData {
  isOpen: boolean;
  isSuccess: boolean;
  title: string;
  message: string;
  orderDetails?: {
    userData: {
      name: string;
      phone: string;
      address: string;
      coordinates?: string;
    };
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    totalPrice: number;
  };
  error?: string;
}

function PaymentContent() {
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

  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [orderModal, setOrderModal] = useState<OrderModalData>({
    isOpen: false,
    isSuccess: false,
    title: "",
    message: "",
  });
  const userDataAuth = useDataUser();

  

  const getAddressFromCoordinates = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'ru-RU',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Ошибка при получении адреса');
      }
      
      const data = await response.json();
      
      if (data.address) {
        const addressComponents = [];
        
        if (data.address.road) addressComponents.push(`ул. ${data.address.road}`);
        if (data.address.house_number) addressComponents.push(`д. ${data.address.house_number}`);
        if (data.address.city) addressComponents.push(data.address.city);
        if (data.address.country) addressComponents.push(data.address.country);
        
        return addressComponents.join(', ') || 'Адрес не найден';
      }
      
      return 'Адрес не найден';
    } catch (error) {
      console.error('Ошибка при получении адреса:', error);
      return 'Не удалось определить адрес';
    }
  };

  const handleGeolocationClick = async () => {

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        
        setCoordinates(coords);
        
        try {
          const address = await getAddressFromCoordinates(coords.lat, coords.lon);
          
          setFormData(prev => ({
            ...prev,
            address: address,
          }));
          if (userDataAuth) {
            userDataAuth.address = address;
          }
        } catch (error) {
          console.error("Ошибка при получении адреса:", error);
        }
      },
      (error) => {
        console.error("Ошибка геолокации:", error);
        setIsGeolocationLoading(false);
        
        let errorMessage = "Не удалось получить местоположение";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Доступ к геолокации запрещен. Разрешите доступ в настройках браузера";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Информация о местоположении недоступна";
            break;
          case error.TIMEOUT:
            errorMessage = "Время запроса геолокации истекло";
            break;
        }
        
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    let userData: UserData | null = null;

    if(userDataAuth) {
      setFormData(prev => ({
        ...prev,
        name: userDataAuth!.name,
        phone: userDataAuth!.contragent_phone,
        address: userDataAuth!.address || '',
      }));
      if(!userDataAuth.address) {
        userDataAuth.address = formData.address;
      }
      
    } else {
      const savedData = localStorage.getItem('user_delivery_data');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          userData = {
            name: parsedData.name || "",
            phone: parsedData.phone || "",
            address: parsedData.address || "",
          };
        } catch (error) {
          console.error('Error parsing localStorage data:', error);
        }
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
    }
  }, [contragentPhone, isInitialized]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const closeModal = () => {
    setOrderModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("user_delivery_data", JSON.stringify(formData));
    
    if (!cart || items.length === 0) {
      setOrderModal({
        isOpen: true,
        isSuccess: false,
        title: "Ошибка оформления",
        message: "Не удалось оформить заказ",
        error: "Корзина пуста",
      });
      return;
    }

    if (!formData.name || !formData.phone) {
      setOrderModal({
        isOpen: true,
        isSuccess: false,
        title: "Ошибка оформления",
        message: "Не удалось оформить заказ",
        error: "Заполните обязательные поля: имя и телефон",
      });
      return;
    }

    let finalLat: number | undefined;
    let finalLon: number | undefined;

    if (coordinates) {
      finalLat = coordinates.lat;
      finalLon = coordinates.lon;
    } else {
      finalLat = DEFAULT_COORDINATES.lat;
      finalLon = DEFAULT_COORDINATES.lon;
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
      },
      contragent_phone: contragentPhone || formData.phone,
      client_lat: finalLat,
      client_lon: finalLon,
      additional_data: [{
        geolocation_source: coordinates ? "browser" : "default",
        geolocation_timestamp: new Date().toISOString(),
      }],
    };

    try {
      await createOrderMutation.mutateAsync(orderData);
      
      let streetAddress = "Не удалось определить адрес";
      if (finalLat && finalLon) {
        try {
          streetAddress = await getAddressFromCoordinates(finalLat, finalLon);
        } catch (error) {
          console.error("Ошибка при получении адреса:", error);
          streetAddress = formData.address || "Адрес не указан";
        }
      } else {
        streetAddress = formData.address || "Адрес не указан";
      }

      setOrderModal({
        isOpen: true,
        isSuccess: true,
        title: "Заказ успешно оформлен!",
        message: "Спасибо за ваш заказ.",
        orderDetails: {
          userData: {
            name: formData.isAnotherPerson ? formData.recipientName : formData.name,
            phone: formData.isAnotherPerson ? formData.recipientPhone : formData.phone,
            address: streetAddress,
            coordinates: finalLat && finalLon 
              ? `Широта: ${finalLat.toFixed(6)}, Долгота: ${finalLon.toFixed(6)}` 
              : undefined,
          },
          items: items.map(item => ({
            name: item.product?.name || `Товар #${item.nomenclature_id}`,
            quantity: item.quantity || 1,
            price: item.product?.price || 0,
          })),
          totalPrice,
        },
      });
      
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
      setOrderModal({
        isOpen: true,
        isSuccess: false,
        title: "Ошибка оформления",
        message: "Произошла ошибка при оформлении заказа",
        error: error instanceof Error ? error.message : "Неизвестная ошибка",
      });
    }
  };

  const isLoading = isCartLoading || areItemsLoading || createOrderMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col">
      {orderModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-lg rounded-lg bg-white shadow-lg max-h-[90vh] overflow-y-auto">
            <div className={`p-4 md:p-6 ${orderModal.isSuccess ? 'bg-green-50' : 'bg-red-50'} rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  {orderModal.isSuccess ? (
                    <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
                  ) : (
                    <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
                  )}
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                    {orderModal.title}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <X className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                </button>
              </div>
              <p className="mt-2 text-sm md:text-base text-gray-600">
                {orderModal.message}
              </p>
            </div>
            <div className="p-4 md:p-6">
              {orderModal.isSuccess && orderModal.orderDetails ? (
                <>
                  <div className="mb-4 md:mb-6">
                    <h3 className="mb-2 md:mb-3 text-base md:text-lg font-medium text-gray-900">
                      Данные покупателя
                    </h3>
                    <div className="space-y-1 md:space-y-2 rounded-lg border border-gray-200 p-3 md:p-4">
                      <div className="flex flex-col md:flex-row md:justify-between gap-1">
                        <span className="text-sm md:text-base text-gray-600">Имя:</span>
                        <span className="font-medium text-sm md:text-base">{orderModal.orderDetails.userData.name}</span>
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between gap-1">
                        <span className="text-sm md:text-base text-gray-600">Телефон:</span>
                        <span className="font-medium text-sm md:text-base">{orderModal.orderDetails.userData.phone}</span>
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between gap-1">
                        <span className="text-sm md:text-base text-gray-600">Адрес доставки:</span>
                        <span className="font-medium text-sm md:text-base text-right">{orderModal.orderDetails.userData.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <h3 className="mb-2 md:mb-3 text-base md:text-lg font-medium text-gray-900">
                      Состав заказа
                    </h3>
                    <div className="space-y-2 md:space-y-3">
                      {orderModal.orderDetails.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col md:flex-row md:items-center justify-between rounded-lg border border-gray-200 p-2 md:p-3 gap-2"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-sm md:text-base">{item.name}</h4>
                          </div>
                          <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6">
                            <div className="text-right">
                              <div className="text-xs md:text-sm text-gray-600">Количество</div>
                              <div className="font-medium text-sm md:text-base">{item.quantity} шт.</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs md:text-sm text-gray-600">Стоимость</div>
                              <div className="font-medium text-sm md:text-base">{item.price.toLocaleString("ru-RU")} ₽</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-3 md:p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base md:text-lg font-medium text-gray-900">Итого:</span>
                      <span className="text-xl md:text-2xl font-bold text-blue-600">
                        {orderModal.orderDetails.totalPrice.toLocaleString("ru-RU")} ₽
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 md:py-8">
                  <AlertCircle className="mx-auto h-12 w-12 md:h-16 md:w-16 text-red-500 mb-3 md:mb-4" />
                  <h3 className="mb-2 text-base md:text-lg font-medium text-gray-900">
                    {orderModal.error || "Произошла ошибка"}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                    Пожалуйста, попробуйте еще раз или обратитесь в поддержку.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-4 md:p-6">
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                {orderModal.isSuccess ? (
                  <>
                    <Button
                      onClick={closeModal}
                      variant="outline"
                      className="flex-1 cursor-pointer text-sm md:text-base"
                    >
                      Закрыть
                    </Button>
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-sm md:text-base"
                    >
                      Перейти к заказам
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={closeModal}
                    className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-sm md:text-base"
                  >
                    Попробовать снова
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 container px-4">
        <div className="w-full max-w-5xl mx-auto">
          <h1 className="text-lg md:text-xl font-medium tracking-tight py-3 md:py-4">Оформление заказа</h1>
          <div className="flex flex-col lg:grid lg:grid-cols-7 gap-4 md:gap-8">
            <form onSubmit={handleSubmit} className="lg:col-span-3">
              <Button className="w-full h-10 md:h-11 text-sm md:text-base">
                <svg
                  viewBox="0 0 50 20"
                  fill="currentColor"
                  className="!w-auto h-4 md:h-5"
                >
                  <path d="M9.536 2.579c-.571.675-1.485 1.208-2.4 1.132-.113-.914.334-1.884.858-2.484C8.565.533 9.564.038 10.374 0c.095.951-.276 1.884-.838 2.579zm.829 1.313c-1.324-.077-2.457.751-3.085.751-.638 0-1.6-.713-2.647-.694-1.362.019-2.628.79-3.323 2.017-1.429 2.455-.372 6.09 1.009 8.087.676.99 1.485 2.075 2.552 2.036 1.009-.038 1.409-.656 2.628-.656 1.228 0 1.58.656 2.647.637 1.104-.019 1.8-.99 2.475-1.979.771-1.122 1.086-2.217 1.105-2.274-.02-.019-2.133-.828-2.152-3.263-.02-2.036 1.666-3.007 1.742-3.064-.952-1.408-2.437-1.56-2.951-1.598zm7.645-2.76v14.834h2.305v-5.072h3.19c2.913 0 4.96-1.998 4.96-4.89 0-2.893-2.01-4.872-4.885-4.872h-5.57zm2.305 1.941h2.656c2 0 3.142 1.066 3.142 2.94 0 1.875-1.142 2.95-3.151 2.95h-2.647v-5.89zM32.673 16.08c1.448 0 2.79-.733 3.4-1.893h.047v1.779h2.133V8.582c0-2.14-1.714-3.52-4.351-3.52-2.447 0-4.256 1.399-4.323 3.32h2.076c.171-.913 1.018-1.512 2.18-1.512 1.41 0 2.2.656 2.2 1.865v.818l-2.876.171c-2.675.162-4.123 1.256-4.123 3.159 0 1.922 1.495 3.197 3.637 3.197zm.62-1.76c-1.229 0-2.01-.59-2.01-1.494 0-.933.752-1.475 2.19-1.56l2.562-.162v.837c0 1.39-1.181 2.379-2.743 2.379zM41.1 20c2.247 0 3.304-.856 4.227-3.454l4.047-11.341h-2.342l-2.714 8.763h-.047l-2.714-8.763h-2.409l3.904 10.799-.21.656c-.352 1.114-.923 1.542-1.942 1.542-.18 0-.533-.02-.676-.038v1.779c.133.038.705.057.876.057z"></path>
                </svg>
              </Button>
              <div className="flex items-center gap-2 py-3 md:py-4">
                <Separator className="flex-1" />
                <span className="text-gray-500 text-xs md:text-sm">или</span>
                <Separator className="flex-1" />
              </div>
              <div className="flex flex-col gap-4 md:gap-6">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name" className="text-sm md:text-base">Имя *</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    placeholder="Иван"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="h-10 md:h-11 text-sm md:text-base"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone" className="text-sm md:text-base">Номер телефона *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+7 999 123 45 67"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="h-10 md:h-11 text-sm md:text-base"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="address" className="text-sm md:text-base">Адрес доставки</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleGeolocationClick}
                        disabled={isGeolocationLoading || isLoading}
                        className="h-8 w-8 p-0 relative top-11 z-10 cursor-pointer"
                        title="Определить мое местоположение"
                      >
                        <LocateIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <Input
                      id="address"
                      type="text"
                      placeholder="ул. Пушкина, д. Колотушкина (не обязательно)"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="pr-10 h-10 md:h-11 text-sm md:text-base"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Нажмите на иконку локации для автоматического определения адреса
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="note" className="text-sm md:text-base">Примечание к заказу</Label>
                  <Textarea
                    id="note"
                    rows={3}
                    placeholder="Дополнительные пожелания"
                    value={formData.note}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="text-sm md:text-base min-h-[80px]"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isAnotherPerson"
                    className="cursor-pointer h-4 w-4"
                    checked={formData.isAnotherPerson}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({ ...prev, isAnotherPerson: !!checked }));
                    }}
                    disabled={isLoading}
                  />
                  <Label htmlFor="isAnotherPerson" className="text-sm md:text-base cursor-pointer">
                    Заказ оформляется для другого человека
                  </Label>
                </div>
                {formData.isAnotherPerson && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="recipientName" className="text-sm md:text-base">Имя получателя *</Label>
                      <Input
                        id="recipientName"
                        type="text"
                        required
                        placeholder="Петр"
                        value={formData.recipientName}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="h-10 md:h-11 text-sm md:text-base"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="recipientPhone" className="text-sm md:text-base">Номер телефона получателя *</Label>
                      <Input
                        id="recipientPhone"
                        type="tel"
                        required
                        placeholder="+7 999 765 43 21"
                        value={formData.recipientPhone}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="h-10 md:h-11 text-sm md:text-base"
                      />
                    </div>
                  </>
                )}
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer h-11 md:h-12 text-sm md:text-base font-medium" 
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
                <div className="flex justify-center items-center text-gray-400 gap-1 pb-4 md:pb-0">
                  <LockIcon width={14} height={14} className="md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm text-center">
                    Ваши данные защищены
                  </span>
                </div>
              </div>
            </form>
            <div className="lg:col-span-4">
              <div className="flex flex-col gap-2">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex gap-2">
                        <div className="rounded-md border border-gray-100 w-20 h-20 md:w-24 md:h-24 p-2">
                          <Skeleton className="w-full h-full" />
                        </div>
                        <div className="py-1 flex-1">
                          <div className="flex justify-between items-center">
                            <Skeleton className="h-4 w-24 md:w-32" />
                            <Skeleton className="h-4 w-12 md:w-16" />
                          </div>
                          <Skeleton className="h-3 w-20 md:w-24 mt-1" />
                          <div className="flex justify-between items-center gap-2 pt-2">
                            <Skeleton className="h-8 w-24 md:w-32" />
                            <Skeleton className="h-8 w-12 md:w-16" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : cartError ? (
                  <div className="text-center py-4 text-red-500 text-sm md:text-base">
                    Ошибка загрузки корзины
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm md:text-base">
                    Корзина пуста
                  </div>
                ) : (
                  <>
                    {items.map((item, index) => (
                      <React.Fragment key={`${item.nomenclature_id}-${item.warehouse_id || 'no-warehouse'}`}>
                        <CartItem item={item} />
                        {index < items.length - 1 && <Separator className="my-3 md:my-4" />}
                      </React.Fragment>
                    ))}
                    
                    <div className="mt-4 md:mt-0 pt-4 mb-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="tracking-tight font-medium text-sm md:text-base">Всего</p>
                          <span className="tracking-tight font-medium text-sm md:text-base">{totalPrice.toLocaleString("ru-RU")}₽</span>
                        </div>
                        <p className="text-xs md:text-sm/tight text-gray-500 tracking-tight pt-2">
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

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
      <PaymentContent />
    </Suspense>
  );
}