// components/location/change-location-modal.tsx
"use client";

import { PopoverClose } from "@radix-ui/react-popover";
import { Check, ChevronsUpDown, MapPin, Navigation, Warehouse } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { isMobile } from "react-device-detect";

import { cn } from "@/shared/lib/utils";
import { City } from "@/shared/types/city";
import { Button } from "@/shared/ui/kit/button";
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

interface WarehouseLocation {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  distance: number;
  avg_rating: number;
  reviews_count: number;
}


const MOSCOW_DISTRICTS = [
  { name: "Центр", lat: 55.7558, lon: 37.6176 },
  { name: "Арбат", lat: 55.7490, lon: 37.5922 },
  { name: "Тверская", lat: 55.7649, lon: 37.6067 },
  { name: "Китай-город", lat: 55.7554, lon: 37.6255 },
  { name: "Хамовники", lat: 55.7322, lon: 37.5871 },
  { name: "Таганский", lat: 55.7386, lon: 37.6534 },
  { name: "Басманный", lat: 55.7651, lon: 37.6574 },
  { name: "Замоскворечье", lat: 55.7370, lon: 37.6267 },
  { name: "Пресненский", lat: 55.7603, lon: 37.5700 },
  { name: "Якиманка", lat: 55.7379, lon: 37.6072 },
  { name: "Мещанский", lat: 55.7779, lon: 37.6297 },
  { name: "Красносельский", lat: 55.7826, lon: 37.6591 },
  { name: "Сокольники", lat: 55.7906, lon: 37.6726 },
  { name: "Лефортово", lat: 55.7574, lon: 37.7013 },
  { name: "Сокол", lat: 55.8059, lon: 37.5157 },
  { name: "Аэропорт", lat: 55.8017, lon: 37.5329 },
  { name: "Динамо", lat: 55.7898, lon: 37.5570 },
  { name: "Беговой", lat: 55.7780, lon: 37.5607 },
  { name: "Хорошёвский", lat: 55.7767, lon: 37.5266 },
  { name: "Щукино", lat: 55.8087, lon: 37.4577 },
  { name: "Тушино", lat: 55.8279, lon: 37.4373 },
  { name: "Покровское-Стрешнево", lat: 55.8138, lon: 37.4755 },
  { name: "Куркино", lat: 55.8745, lon: 37.3835 },
  { name: "Митино", lat: 55.8465, lon: 37.3623 },
  { name: "Строгино", lat: 55.8039, lon: 37.4035 },
  { name: "Крылатское", lat: 55.7564, lon: 37.4077 },
  { name: "Кунцево", lat: 55.7317, lon: 37.4467 },
  { name: "Можайский", lat: 55.7186, lon: 37.4054 },
  { name: "Очаково-Матвеевское", lat: 55.6838, lon: 37.4623 },
  { name: "Проспект Вернадского", lat: 55.6762, lon: 37.5047 },
  { name: "Тропарёво-Никулино", lat: 55.6498, lon: 37.4833 },
  { name: "Раменки", lat: 55.7002, lon: 37.4996 },
  { name: "Ломоносовский", lat: 55.6993, lon: 37.5547 },
  { name: "Обручевский", lat: 55.6748, lon: 37.5446 },
  { name: "Коньково", lat: 55.6330, lon: 37.5358 },
  { name: "Тёплый Стан", lat: 55.6196, lon: 37.5074 },
  { name: "Ясенево", lat: 55.6063, lon: 37.5365 },
  { name: "Черёмушки", lat: 55.6700, lon: 37.5730 },
  { name: "Академический", lat: 55.6869, lon: 37.5848 },
  { name: "Гагаринский", lat: 55.7041, lon: 37.5580 },
  { name: "Зюзино", lat: 55.6563, lon: 37.5777 },
  { name: "Котловка", lat: 55.6703, lon: 37.6043 },
  { name: "Нагорный", lat: 55.6724, lon: 37.6196 },
  { name: "Нагатино-Садовники", lat: 55.6659, lon: 37.6353 },
  { name: "Даниловский", lat: 55.6991, lon: 37.6258 },
  { name: "Донской", lat: 55.7084, lon: 37.6130 },
  { name: "Москворечье-Сабурово", lat: 55.6545, lon: 37.6698 },
  { name: "Царицыно", lat: 55.6205, lon: 37.6709 },
  { name: "Орехово-Борисово", lat: 55.6138, lon: 37.7167 },
  { name: "Братеево", lat: 55.6378, lon: 37.7557 },
  { name: "Капотня", lat: 55.6388, lon: 37.7970 },
  { name: "Люблино", lat: 55.6775, lon: 37.7601 },
  { name: "Марьино", lat: 55.6500, lon: 37.7446 },
  { name: "Печатники", lat: 55.6903, lon: 37.7260 },
  { name: "Текстильщики", lat: 55.7079, lon: 37.7347 },
  { name: "Кузьминки", lat: 55.7055, lon: 37.7798 },
  { name: "Выхино-Жулебино", lat: 55.7155, lon: 37.8241 },
  { name: "Рязанский", lat: 55.7161, lon: 37.7926 },
  { name: "Нижегородский", lat: 55.7329, lon: 37.7261 },
  { name: "Лефортово", lat: 55.7574, lon: 37.7013 },
  { name: "Соколиная гора", lat: 55.7739, lon: 37.7476 },
  { name: "Измайлово", lat: 55.7878, lon: 37.7822 },
  { name: "Перово", lat: 55.7502, lon: 37.7905 },
  { name: "Новогиреево", lat: 55.7528, lon: 37.8189 },
  { name: "Вешняки", lat: 55.7159, lon: 37.8194 },
  { name: "Войковский", lat: 55.8195, lon: 37.5004 },
  { name: "Головинский", lat: 55.8396, lon: 37.5065 },
  { name: "Коптево", lat: 55.8398, lon: 37.5240 },
  { name: "Тимирязевский", lat: 55.8189, lon: 37.5614 },
  { name: "Марфино", lat: 55.8373, lon: 37.5789 },
  { name: "Останкинский", lat: 55.8213, lon: 37.6116 },
  { name: "Алексеевский", lat: 55.8096, lon: 37.6381 },
  { name: "Ростокино", lat: 55.8374, lon: 37.6614 },
  { name: "Ярославский", lat: 55.8616, lon: 37.6823 },
  { name: "Бабушкинский", lat: 55.8721, lon: 37.6674 },
  { name: "Лосиноостровский", lat: 55.8613, lon: 37.7097 },
  { name: "Северное Медведково", lat: 55.8781, lon: 37.6534 },
  { name: "Южное Медведково", lat: 55.8663, lon: 37.6432 },
  { name: "Бибирево", lat: 55.8838, lon: 37.6048 },
  { name: "Алтуфьевский", lat: 55.8988, lon: 37.5878 },
  { name: "Лианозово", lat: 55.8973, lon: 37.5563 },
  { name: "Отрадное", lat: 55.8629, lon: 37.6044 },
  { name: "Марьина Роща", lat: 55.7930, lon: 37.6161 },
  { name: "Бутырский", lat: 55.8135, lon: 37.6028 },
  { name: "Савёловский", lat: 55.7964, lon: 37.5917 },
];


const getRandomMoscowCoordinates = () => {
  
  const moscowBounds = {
    latMin: 55.5733,
    latMax: 55.9111,
    lonMin: 37.3700,
    lonMax: 37.8674,
  };
  
  const lat = moscowBounds.latMin + Math.random() * (moscowBounds.latMax - moscowBounds.latMin);
  const lon = moscowBounds.lonMin + Math.random() * (moscowBounds.lonMax - moscowBounds.lonMin);
  
  return { lat, lon };
};


const getRandomMoscowDistrict = () => {
  return MOSCOW_DISTRICTS[Math.floor(Math.random() * MOSCOW_DISTRICTS.length)];
};

const generateMockWarehouses = (count: number, centerLat: number, centerLon: number): WarehouseLocation[] => {
  const names = [
    "Склад на Тверской",
    "Логистический центр ВДНХ",
    "Склад в Бутово",
    "Распределительный центр МКАД",
    "Терминал в Чертаново",
    "Склад в Сокольниках",
    "Логистический парк Химки",
    "Склад на Ленинградском",
    "Центр выдачи в Отрадном",
    "Склад в Новогиреево",
    "Пункт выдачи в Люблино",
    "Склад на Профсоюзной",
    "Логистический центр в Митино",
    "Склад на Каширском шоссе",
    "Терминал в Марьино",
    "Склад в Измайлово",
    "Пункт выдачи в Коньково",
    "Логистический парк в Солнцево",
    "Склад на Щёлковском шоссе",
    "Центр выдачи в Бирюлёво"
  ];
  
  const addresses = [
    "Москва, ул. Тверская, 1",
    "Москва, пр-т Мира, 119",
    "Москва, ул. Адмирала Лазарева, 24",
    "Москва, МКАД, 41-й км",
    "Москва, ул. Чертановская, 25",
    "Москва, Сокольническая площадь, 4",
    "Московская обл., г. Химки, ул. Ленинградская, 1",
    "Москва, Ленинградский пр-т, 80",
    "Москва, ул. Декабристов, 22",
    "Москва, ул. Перовская, 39",
    "Москва, ул. Краснодонская, 42",
    "Москва, ул. Профсоюзная, 102",
    "Москва, ул. Митинская, 55",
    "Москва, Каширское шоссе, 31",
    "Москва, ул. Люблинская, 72",
    "Москва, Измайловский пр-т, 71",
    "Москва, ул. Профсоюзная, 118",
    "Москва, пос. Солнцево, ул. Богданова, 50",
    "Москва, Щёлковское шоссе, 88",
    "Москва, ул. Медынская, 12"
  ];
  
  const descriptions = [
    "Современный склад с системой климат-контроля",
    "Круглосуточный пункт выдачи товаров",
    "Склад с собственной логистической службой",
    "Распределительный центр с большой площадью хранения",
    "Терминал с экспресс-выдачей заказов",
    "Склад премиум-класса в центре города",
    "Логистический парк с автоматизированными системами",
    "Склад с возможностью хранения крупногабаритных товаров",
    "Центр выдачи с зоной примерки",
    "Склад с системой безопасности 24/7",
    "Пункт выдачи с бесплатной парковкой",
    "Склад с возможностью самовывоза в день заказа",
    "Логистический центр с онлайн-отслеживанием",
    "Склад с температурным режимом для разных категорий товаров",
    "Терминал с курьерской службой",
    "Склад с возможностью хранения документов",
    "Пункт выдачи с зоной отдыха для клиентов",
    "Логистический парк с таможенным складом",
    "Склад с системой сортировки и упаковки",
    "Центр выдачи с камерами хранения"
  ];
  
  return Array.from({ length: count }, (_, i) => {
    
    let warehouseLat, warehouseLon;
    
    if (centerLat === 55.7540471 && centerLon === 37.620405) {
      
      const district = getRandomMoscowDistrict();
      warehouseLat = district.lat + (Math.random() - 0.5) * 0.02;
      warehouseLon = district.lon + (Math.random() - 0.5) * 0.02;
    } else {
      
      const radius = 20;
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * radius;
      
      const latOffset = (distance / 111) * Math.cos(angle);
      const lonOffset = (distance / (111 * Math.cos(centerLat * Math.PI / 180))) * Math.sin(angle);
      
      warehouseLat = centerLat + latOffset;
      warehouseLon = centerLon + lonOffset;
    }
    
    
    const R = 6371; 
    const dLat = (warehouseLat - centerLat) * Math.PI / 180;
    const dLon = (warehouseLon - centerLon) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(centerLat * Math.PI / 180) * Math.cos(warehouseLat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return {
      id: i + 1,
      name: names[i % names.length],
      address: addresses[i % addresses.length],
      latitude: warehouseLat,
      longitude: warehouseLon,
      description: descriptions[i % descriptions.length],
      distance: Math.round(distance * 10) / 10,
      avg_rating: Math.random() * 2 + 3,
      reviews_count: Math.floor(Math.random() * 100) + 10
    };
  });
};

export const ChangeLocationModal = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [selected, setSelected] = useState<City | null>(null);
  const [open, setOpen] = useState(false);

  // Используем useMemo для вычисления warehouses на основе выбранного города
  const warehouses = useMemo(() => {
    if (!selected) {
      return [];
    }
    return generateMockWarehouses(20, selected.coords.lat, selected.coords.lon);
  }, [selected]);

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
        
        const moscow = data.find(city => city.name === "Москва");
        if (moscow) {
          setSelected(moscow);
        }
      } catch (error) {
        console.error("Error loading cities:", error);
      }
    };

    loadCities();
  }, []);

  return (
    <Popover modal={isMobile}>
      <PopoverTrigger asChild>
        <Button
          variant="link"
          className="text-sm font-medium !p-0 h-auto tracking-tight text-gray-700 hover:text-blue-600 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>{selected?.name || "Выберите город"}</span>
            <ChevronsUpDown className="w-3 h-3 ml-1 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex flex-col h-[calc(100dvh_-_85px)] md:h-[600px] w-screen rounded-none md:w-[800px] md:rounded-xl"
        sideOffset={8}
      >
        <div className="flex flex-col p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-gray-900">
                Выберите город доставки
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                От выбранного города зависит доступность товаров и стоимость доставки
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

        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 gap-4 p-4 pt-0">
          <div className="lg:col-span-1 space-y-4">
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
                              setSelected(
                                currentValue === selected?.name ? null : city,
                              );
                              setOpen(false);
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

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">
                Пункты выдачи в {selected?.name || "городе"}
              </h4>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {warehouses.map((warehouse) => (
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
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="h-full rounded-lg overflow-hidden border border-gray-200">
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