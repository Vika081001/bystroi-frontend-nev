"use client";

import { LockIcon, Loader2, Minus, Plus } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/shared/ui/kit/button";
import { Input } from "@/shared/ui/kit/input";
import { Label } from "@/shared/ui/kit/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/kit/dialog";
import { Textarea } from "@/shared/ui/kit/textarea";
import { Checkbox } from "@/shared/ui/kit/checkbox";
import { useDataUser } from "@/shared/hooks/useDataUser";

interface QuickBuyModalProps {
  productId: number;
  quantity: number;
  productName: string;
  productPrice: number;
  unitName?: string;
  isOpen: boolean;
  onClose: () => void;
}

const QuickBuyModal = ({
  productId,
  quantity,
  productName,
  productPrice,
  unitName = "шт.",
  isOpen,
  onClose,
}: QuickBuyModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    quantity: 1,
    address: "",
    note: "",
    isAnotherPerson: false,
    recipientName: "",
    recipientPhone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const userDataAuth = useDataUser();
  const searchParams = useSearchParams();

  const handleDecreaseQuantity = () => {
    setFormData(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity - 1)
    }));
  };

  const handleIncreaseQuantity = () => {
    setFormData(prev => ({
      ...prev,
      quantity: prev.quantity + 1
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    localStorage.setItem("user_delivery_data", JSON.stringify(formData));

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    }, 1500);
  };
  
  useEffect(() => {
    const addressFromUrl = searchParams.get("address");
    const locationRaw = localStorage.getItem("bystroi_location");
    const locationStored = locationRaw ? JSON.parse(locationRaw) as { address?: string } : {};

    if (userDataAuth) {
      setFormData(prev => ({
        ...prev,
        name: userDataAuth!.name,
        phone: userDataAuth!.contragent_phone,
        address: addressFromUrl || locationStored.address || userDataAuth!.address || "",
      }));
    } else {
      const savedData = localStorage.getItem("user_delivery_data");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData(prev => ({
            ...prev,
            name: parsedData!.name,
            phone: parsedData!.contragent_phone,
            address: addressFromUrl || locationStored.address || parsedData!.address || "",
          }));
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
        }
      } else {
        setFormData(prev => ({
          ...prev,
          address: addressFromUrl || locationStored.address || "",
        }));
      }
    }
  }, [searchParams, userDataAuth]);

  const totalPrice = productPrice * formData.quantity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-170 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Купить в 1 клик</DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="text-green-500 text-4xl mb-4">✓</div>
            <h3 className="text-xl font-semibold mb-2">Заявка принята!</h3>
          </div>
        ) : (
          <>
            <div className="border rounded-lg p-4 mb-4">
              <p className="font-medium truncate">{productName}</p>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="quantity">Количество:</Label>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleDecreaseQuantity}
                      className="h-8 w-8 cursor-pointer"
                      disabled={isLoading}
                    >
                      <Minus width={16} height={16} />
                    </Button>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      max="99"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-20 h-8 text-center "
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleIncreaseQuantity}
                      className="h-8 w-8 "
                      disabled={isLoading}
                    >
                      <Plus width={16} height={16} />
                    </Button>
                  </div>
                  <span className="text-sm text-gray-500">{unitName}</span>
                </div>
                <span className="text-lg font-normal">
                  {totalPrice.toLocaleString('ru-RU')}₽
                </span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="address">Адрес доставки *</Label>
                <Input
                  id="address"
                  type="text"
                  required
                  placeholder="ул. Пушкина, д. Колотушкина"
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
                  className="cursor-pointer"
                />
                <Label htmlFor="isAnotherPerson" className="cursor-pointer">
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
                      className="cursor-pointer"
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
                      className="cursor-pointer"
                    />
                  </div>
                </>
              )}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Оформление...
                  </>
                ) : (
                  `Купить за ${totalPrice.toLocaleString('ru-RU')}₽`
                )}
              </Button>

              <div className="flex-wrap text-center justify-center gap-2 text-sm text-gray-300">
                <p className="text-sm/tight text-gray-300 tracking-tight pt-2 mb-2">
                  Стоимость доставки и налоги рассчитываются<br />
                  при оформлении заказа.
                </p>

                <LockIcon className="h-3 w-3 inline" />
                <span className="cursor-default">Ваши данные защищены</span>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuickBuyModal;