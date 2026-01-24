// components/location/change-location-modal.tsx
"use client";

import { PopoverClose } from "@radix-ui/react-popover";
import { Check, ChevronsUpDown, MapPin, Navigation, Warehouse } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { isMobile } from "react-device-detect";
import { useSearchParams, useRouter } from "next/navigation";

import { cn } from "@/shared/lib/utils";
import { City } from "@/shared/types/city";
import { Button } from "@/shared/ui/kit/button";
import { Input } from "@/shared/ui/kit/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/kit/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/kit/popover";
import { MapPreview } from "@/shared/ui/map-preview";
import { useLocations } from "@/shared/hooks/useLocations";

interface WarehouseLocation {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  distance: number;
  avg_rating?: number;
  reviews_count?: number;
};

export const ChangeLocationModal = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [selected, setSelected] = useState<City | null>(null);
  const [open, setOpen] = useState(false);
  const [addressInput, setAddressInput] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Читаем адрес из URL при загрузке
  useEffect(() => {
    const addressFromUrl = searchParams.get('address');
    if (addressFromUrl) {
      setAddressInput(addressFromUrl);
    }
  }, [searchParams]);

  // Получаем реальные склады из API
  // Приоритет: если есть address - используем его, иначе city, иначе координаты
  const { data: locationsData, isLoading: isLoadingWarehouses } = useLocations({
    page: 1,
    size: 50,
    address: addressInput || undefined, // Приоритет у адреса
    city: (!addressInput && selected?.name) ? selected.name : undefined, // Если нет адреса, используем город
    lat: (!addressInput && !selected?.name && selected?.coords.lat) ? selected.coords.lat : undefined,
    lon: (!addressInput && !selected?.name && selected?.coords.lon) ? selected.coords.lon : undefined,
    radius: 20, // радиус 20 км
  }, {
    enabled: !!(addressInput || selected), // Запрос если есть адрес или выбран город
  });

  // Преобразуем данные из API в формат WarehouseLocation (только реальные данные)
  const warehouses = useMemo(() => {
    // API возвращает { locations: [...], count: ..., page: ..., size: ... }
    // Используем только реальные данные из API, без fallback на моки
    const locations = locationsData?.locations || [];
    
    if (locations.length > 0) {
      return locations
        .filter(location => location.latitude && location.longitude) // Фильтруем только с координатами
        .map((location, index) => ({
          id: location.id || index + 1,
          name: location.name || `Склад ${index + 1}`,
          address: location.address || "",
          latitude: location.latitude || 0,
          longitude: location.longitude || 0,
          description: location.description,
          distance: location.distance || 0,
          avg_rating: location.avg_rating || 4.5,
          reviews_count: location.reviews_count || 0,
        }));
    }
    
    // Если нет данных из API - возвращаем пустой массив (не показываем моки)
    return [];
  }, [locationsData]);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/arbaev/russia-cities/refs/heads/master/russia-cities.json",
          {
            method: "GET",
          },
        );
        const data: City[] = await res.json();
        setCities(data);
        
        // Читаем address или city из URL параметров
        const addressParam = searchParams.get('address');
        const cityParam = searchParams.get('city');
        let cityToSelect: City | null = null;
        
        // Если есть address, пытаемся извлечь название города из адреса
        if (addressParam) {
          // Пытаемся найти город в начале адреса (например, "Москва, ул. ..." или "Санкт-Петербург, ул. ...")
          const addressLower = addressParam.toLowerCase();
          cityToSelect = data.find(city => {
            const cityNameLower = city.name.toLowerCase();
            const cityNameAltLower = city.name_alt?.toLowerCase();
            const cityNameEnLower = city.name_en?.toLowerCase();
            
            return addressLower.startsWith(cityNameLower + ',') ||
                   addressLower.startsWith(cityNameAltLower + ',') ||
                   addressLower.startsWith(cityNameEnLower + ',') ||
                   addressLower.includes(cityNameLower) ||
                   addressLower.includes(cityNameAltLower || '') ||
                   addressLower.includes(cityNameEnLower || '');
          }) || null;
        }
        
        // Если не нашли по address, ищем по city
        if (!cityToSelect && cityParam) {
          // Пытаемся найти город по имени (с учетом разных вариантов написания)
          const normalizedParam = cityParam.toLowerCase().trim();
          cityToSelect = data.find(city => 
            city.name.toLowerCase() === normalizedParam ||
            city.name_alt?.toLowerCase() === normalizedParam ||
            city.name_en?.toLowerCase() === normalizedParam
          ) || null;
          
          // Если не нашли точное совпадение, пытаемся найти по частичному совпадению
          if (!cityToSelect) {
            cityToSelect = data.find(city => 
              city.name.toLowerCase().includes(normalizedParam) ||
              normalizedParam.includes(city.name.toLowerCase())
            ) || null;
          }
        }
        
        // Если город не найден в URL, используем Москву по умолчанию
        if (!cityToSelect) {
          cityToSelect = data.find(city => city.name === "Москва") || null;
        }
        
        if (cityToSelect) {
          setSelected(cityToSelect);
        }
      } catch (error) {
        console.error("Error loading cities:", error);
      }
    };

    loadCities();
  }, [searchParams]);

  return (
    <Popover modal={isMobile}>
      <PopoverTrigger asChild>
        <Button
          variant="link"
          className="text-sm font-medium !p-0 h-auto tracking-tight text-gray-700 hover:text-blue-600 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>{searchParams.get('address') || selected?.name || "Укажите адрес доставки"}</span>
            <ChevronsUpDown className="w-3 h-3 ml-1 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex flex-col h-[calc(100dvh_-_100px)] md:h-[700px] w-screen rounded-none md:w-[900px] md:rounded-xl overflow-hidden"
        sideOffset={8}
      >
        <div className="flex flex-col p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-gray-900">
                Указать адрес
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Укажите адрес доставки для точного расчета доступности товаров
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                {warehouses.length} пунктов выдачи
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 gap-4 p-4 pt-0 overflow-hidden min-h-0">
          <div className="lg:col-span-1 space-y-4 flex flex-col min-h-0">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Адрес доставки
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Санкт-Петербург, ул. Попова, д. 6"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => {
                  if (addressInput.trim()) {
                    const newParams = new URLSearchParams(searchParams.toString());
                    newParams.set('address', addressInput.trim());
                    // Удаляем city, если есть address
                    newParams.delete('city');
                    router.push(`/?${newParams.toString()}`, { scroll: false });
                    setOpen(false);
                  }
                }}
                className="w-full"
              >
                Сохранить
              </Button>
            </div>
            <div>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selected ? selected.name : "Выберите город..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Поиск городов..."
                      className="h-9"
                    />
                    <CommandList className="max-h-[300px]">
                      <CommandEmpty>Город не найден</CommandEmpty>
                      <CommandGroup>
                        {cities.map((city) => (
                          <CommandItem
                            key={city.id}
                            value={city.name}
                            onSelect={(currentValue) => {
                              const newCity = currentValue === selected?.name ? null : city;
                              setSelected(newCity);
                              setOpen(false);
                              
                              // Обновляем URL с параметром city (для обратной совместимости)
                              if (newCity) {
                                const newParams = new URLSearchParams(searchParams.toString());
                                // Используем name_en для URL (kazan, moscow и т.д.)
                                const citySlug = newCity.name_en?.toLowerCase() || newCity.name.toLowerCase();
                                newParams.set('city', citySlug);
                                // Если есть address, удаляем его при выборе города
                                newParams.delete('address');
                                
                                router.push(`/?${newParams.toString()}`, { scroll: false });
                              }
                            }}
                            className="cursor-pointer"
                          >
                            {city.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                selected?.id === city.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-3 flex-1 flex flex-col min-h-0">
              <h4 className="font-medium text-gray-900">
                Пункты выдачи в {selected?.name || "городе"}
              </h4>
              <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
                {isLoadingWarehouses ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-gray-500">Загрузка складов...</p>
                  </div>
                ) : warehouses.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-gray-500">Склады не найдены</p>
                  </div>
                ) : (
                  warehouses.map((warehouse) => (
                  <div
                    key={warehouse.id}
                    className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Warehouse className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{warehouse.name}</h5>
                        <p className="text-xs text-gray-600 mt-1">{warehouse.address}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500">
                            {warehouse.distance} км
                          </span>
                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < Math.floor(warehouse.avg_rating)
                                      ? "bg-yellow-400"
                                      : "bg-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              ({warehouse.reviews_count})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex-1 min-h-0">
            <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200 min-h-[400px]">
              <MapPreview
                lat={selected?.coords.lat || 55.7540471}
                lon={selected?.coords.lon || 37.620405}
                locations={warehouses.map(w => ({
                  id: w.id,
                  name: w.name,
                  lat: w.latitude,
                  lon: w.longitude,
                  address: w.address
                }))}
                zoom={selected ? 12 : 10}
              />
            </div>
          </div>
        </div>

        <div className="border-t p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              <p className="font-medium">Вы выбрали: {selected?.name || "Москва"}</p>
              <p className="text-xs mt-1">
                Доставка: 1-3 дня • Самовывоз: 1-2 часа
              </p>
            </div>
            <div className="flex gap-3">
              <PopoverClose asChild>
                <Button variant="outline">Отмена</Button>
              </PopoverClose>
              <PopoverClose asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Сохранить город
                </Button>
              </PopoverClose>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};