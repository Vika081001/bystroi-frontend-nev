"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

import { useAddToCart, useRemoveFromCart } from "@/entities/cart/model/hooks";
import { Product } from "@/entities/product/model/types";

import { Button } from "@/shared/ui/kit/button";
import { ButtonGroup } from "@/shared/ui/kit/button-group";
import { InputGroup, InputGroupInput } from "@/shared/ui/kit/input-group";
import { Skeleton } from "@/shared/ui/kit/skeleton";

import { transformImageUrl } from "@/shared/lib/image-utils";
import { getLocationParamsString } from "@/shared/lib/city-utils";

interface CartItemProps {
  item: {
    nomenclature_id: number;
    quantity: number;
    warehouse_id?: number;
    product?: {
      id: number;
      name: string;
      price: number;
      images: string[];
      manufacturer_name?: string;
      seller_name?: string;
      category_name?: string;
      unit_name?: string;
    };
    isLoading?: boolean;
    error?: Error | null;
  };
}

export const CartItem = ({ item }: CartItemProps) => {
  const [count, setCount] = useState(item.quantity);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const addToCartMutation = useAddToCart();
  const removeFromCartMutation = useRemoveFromCart();

  const transformedImageUrl = item.product?.images?.[0] ? transformImageUrl(item.product?.images[0]) : null;

  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCount(item.quantity);
  }, [item.quantity]);

  
  const sendQuantityUpdate = useCallback((newQuantity: number) => {
    if (newQuantity === item.quantity) return;
    
    const delta = newQuantity - item.quantity;
    
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    
    timeoutRef.current = setTimeout(() => {
      setIsDebouncing(true);
      addToCartMutation.mutate(
        {
          nomenclature_id: item.nomenclature_id,
          quantity: delta,
          warehouse_id: item.warehouse_id,
        },
        {
          onSettled: () => {
            setIsDebouncing(false);
          },
        }
      );
    }, 500);
  }, [item.nomenclature_id, item.quantity, item.warehouse_id, addToCartMutation]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    sendQuantityUpdate(newCount);
  };

  const handleDecrement = () => {
    if (count <= 1) return;
    const newCount = count - 1;
    setCount(newCount);
    sendQuantityUpdate(newCount);
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    setCount(value);
    sendQuantityUpdate(value);
  };

  const handleRemove = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    removeFromCartMutation.mutate({
      nomenclature_id: item.nomenclature_id,
      warehouse_id: item.warehouse_id,
    });
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (item.isLoading || item.error || !item.product) {
      e.preventDefault();
      return;
    }
  };

  const isPending = addToCartMutation.isPending || isDebouncing;

  if (item.isLoading) {
    return (
      <div className="flex gap-2">
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
            <ButtonGroup aria-label="count" className="h-fit">
              <Button variant="outline" size="icon-sm" disabled>
                <MinusIcon />
              </Button>
              <InputGroup className="w-10 h-8">
                <InputGroupInput
                  type="number"
                  value={count}
                  className="px-1 text-center"
                  disabled
                />
              </InputGroup>
              <Button variant="outline" size="icon-sm" disabled>
                <PlusIcon />
              </Button>
            </ButtonGroup>
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    );
  }

  if (item.error || !item.product) {
    return (
      <div className="flex gap-2">
        <div className="rounded-md border border-gray-100 w-24 h-24 p-2 flex items-center justify-center cursor-not-allowed">
          <span className="text-gray-400 text-sm">?</span>
        </div>
        <div className="py-1 flex-1">
          <div className="flex justify-between items-center">
            <p className="text-sm tracking-tight font-medium">Товар не найден</p>
            <span className="font-medium">$0.00</span>
          </div>
          <span className="text-sm text-gray-600">ID: {item.nomenclature_id}</span>
          <div className="flex justify-between items-center gap-2 pt-2">
            <ButtonGroup aria-label="count" className="h-fit">
              <Button
                variant="outline"
                size="icon-sm"
                disabled={count < 2 || isPending}
                onClick={handleDecrement}
              >
                <MinusIcon />
              </Button>
              <InputGroup className="w-10 h-8">
                {isPending ? (
                  <div className="w-full h-full flex items-center justify-center bg-white border border-gray-200">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
                  </div>
                ) : (
                  <InputGroupInput
                    type="number"
                    value={count}
                    onChange={(e) => handleQuantityChange(Number(e.target.value) || 1)}
                    className="px-1 text-center"
                    disabled={isPending}
                    min="1"
                  />
                )}
              </InputGroup>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={handleIncrement}
                disabled={isPending}
              >
                <PlusIcon />
              </Button>
            </ButtonGroup>
            <div className="flex justify-end">
              <Button 
                variant="link" 
                className="text-blue-600 px-0"
                onClick={handleRemove}
                disabled={removeFromCartMutation.isPending}
              >
                {removeFromCartMutation.isPending ? "Удаление..." : "Удалить"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { product } = item;

  return (
    <div className="flex gap-2">
      <Link 
        href={`/product/${product.id}`}
        className="rounded-md border border-gray-100 w-24 h-24 p-2 hover:border-blue-300 hover:shadow-sm transition-all duration-200 flex items-center justify-center"
        onClick={handleImageClick}
      >
        {transformedImageUrl ? (
          <img 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200" 
            src={transformedImageUrl} 
            alt={product.name} 
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
            <span className="text-gray-400 text-xs">Нет фото</span>
          </div>
        )}
      </Link>
      <div className="py-1 flex-1">
        
        <div className="flex justify-between items-center">
          <Link 
            href={`/product/${product.id}${getLocationParamsString()}`}
            className="text-sm tracking-tight font-medium hover:text-blue-600 transition-colors"
          >
            {product.name}
          </Link>
          <div className="text-right">
            <span className="font-medium">{product.price.toLocaleString('ru-RU')}₽</span>
            <div className="text-xs text-gray-500">
              {product.unit_name || "шт."}
            </div>
          </div>
        </div>
        <span className="text-sm text-gray-600">
          {product.category_name || "Категория не указана"}
        </span>
        <div className="flex justify-between items-center gap-2 pt-2">
          <ButtonGroup aria-label="count" className="h-fit">
            <Button
              variant="outline"
              size="icon-sm"
              className="cursor-pointer"
              disabled={count < 2 || isPending}
              onClick={handleDecrement}
            >
              <MinusIcon />
            </Button>
            <InputGroup className="w-10 h-8">
              {isPending ? (
                <div className="w-full h-full flex items-center justify-center bg-white border border-gray-200">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
                </div>
              ) : (
                <InputGroupInput
                  type="number"
                  value={count}
                  onChange={(e) => handleQuantityChange(Number(e.target.value) || 1)}
                  className="px-1 text-center"
                  disabled={isPending}
                  min="1"
                />
              )}
            </InputGroup>
            <Button
              variant="outline"
              size="icon-sm"
              className="cursor-pointer"
              onClick={handleIncrement}
              disabled={isPending}
            >
              <PlusIcon />
            </Button>
          </ButtonGroup>
          <div className="flex justify-end">
            <Button 
              variant="link" 
              className="text-blue-600 px-0 cursor-pointer"
              onClick={handleRemove}
              disabled={removeFromCartMutation.isPending}
            >
              {removeFromCartMutation.isPending ? "Удаление..." : "Удалить"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};