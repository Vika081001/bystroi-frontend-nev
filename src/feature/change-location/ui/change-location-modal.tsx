import { PopoverClose } from "@radix-ui/react-popover";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import React from "react";
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

export const ChangeLocationModal = () => {
  const [cities, setCities] = React.useState<City[]>([]);

  const [selected, setSelected] = React.useState<City | null>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const initial = async () => {
      const res = await fetch(
        "https://raw.githubusercontent.com/arbaev/russia-cities/refs/heads/master/russia-cities.json",
        {
          method: "GET",
        },
      );

      const data: City[] = await res.json();

      setCities(data);
    };

    initial();
  }, []);

  return (
    <Popover modal={isMobile}>
      <PopoverTrigger asChild>
        <Button
          variant="link"
          className="text-sm font-normal !p-0 h-auto tracking-tight text-gray-600"
        >
          <MapPin
            width={8}
            height={8}
            className={selected ? "text-blue-600" : undefined}
          />
          {selected?.name || "Москва"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex flex-col h-[calc(100dvh_-_85px)] md:h-auto w-screen rounded-none md:w-xs md:rounded-md"
        sideOffset={8}
      >
        <div className="flex flex-col">
          <p className="tracking-tight font-medium">Изменить регион доставки</p>
          <span className="text-sm text-gray-500">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Blanditiis, nostrum iure?
          </span>
        </div>
        <div className="flex flex-col gap-2 pt-4 flex-1">
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
                  <CommandList>
                    <CommandEmpty>Не найдено.</CommandEmpty>
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
          <MapPreview
            lat={selected?.coords.lat || 55.7540471}
            lon={selected?.coords.lon || 37.620405}
          />
          <PopoverClose asChild>
            <Button className="bg-blue-600">Сохранить</Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};
