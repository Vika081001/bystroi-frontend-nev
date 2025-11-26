import { Clock8, Flame } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Badge } from "@/shared/ui/kit/badge";
import { Separator } from "@/shared/ui/kit/separator";

export const SearchSuggestions = () => {
  return (
    <div className="bg-white rounded-md w-2xl shadow-lg ring ring-gray-100">
      <div className="p-4">
        <div className="flex items-center gap-1">
          <p className="font-medium tracking-tight">Популярные продукты</p>
          <Flame width={16} height={16} className="text-amber-400" />
        </div>
        <div className="flex gap-1 pt-2 flex-wrap">
          <Badge variant="outline">Iphone 14</Badge>
          <Badge variant="outline">Apple MacBook 14 Pro</Badge>
          <Badge variant="outline">козинаки</Badge>
          <Badge variant="outline">козинаки</Badge>
          <Badge variant="outline">козинаки</Badge>
          <Badge variant="outline">козинаки</Badge>
          <Badge variant="outline">козинаки</Badge>
          <Badge variant="outline">козинаки</Badge>
          <Badge variant="outline">козинаки123</Badge>
        </div>
      </div>
      <Separator />
      <div className="pt-4">
        <div className="px-4">
          <p className="font-medium tracking-tight">Недавные поиски</p>
        </div>
        <ul className="pt-2 flex flex-col">
          <li className="flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-100 py-2">
            <Clock8 className="text-gray-400" width={16} height={16} />
            <p className="tracking-tight text-sm">AirPods 11 Pro</p>
          </li>
          <li className="flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-100 py-2">
            <Clock8 className="text-gray-400" width={16} height={16} />
            <p className="tracking-tight text-sm">AirPods 11 Pro</p>
          </li>
          <li className="flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-100 py-2">
            <Clock8 className="text-gray-400" width={16} height={16} />
            <p className="tracking-tight text-sm">AirPods 11 Pro</p>
          </li>
          <li className="flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-100 py-2">
            <Clock8 className="text-gray-400" width={16} height={16} />
            <p className="tracking-tight text-sm">AirPods 11 Pro</p>
          </li>
          <li className="flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-100 py-2">
            <Clock8 className="text-gray-400" width={16} height={16} />
            <p className="tracking-tight text-sm">AirPods 11 Pro</p>
          </li>
          <li className="flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-100 py-2">
            <Clock8 className="text-gray-400" width={16} height={16} />
            <p className="tracking-tight text-sm">AirPods 11 Pro</p>
          </li>
          <li className="flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-100 py-2">
            <Clock8 className="text-gray-400" width={16} height={16} />
            <p className="tracking-tight text-sm">AirPods 11 Pro</p>
          </li>
        </ul>
      </div>
      <Separator />
      <div className="p-4">
        <p className="font-medium tracking-tight">Недавно рассмотренные</p>
        <div className="grid grid-cols-6 gap-2 pt-4">
          <Link
            href="/"
            className="rounded-md hover:bg-gray-100 p-2 hover:ring-1 hover:ring-gray-100"
          >
            <img src="/airpods.png" />
          </Link>
          <Link
            href="/"
            className="rounded-md hover:bg-gray-100 p-2 hover:ring-1 hover:ring-gray-100"
          >
            <img src="/airpods.png" />
          </Link>
          <Link
            href="/"
            className="rounded-md hover:bg-gray-100 p-2 hover:ring-1 hover:ring-gray-100"
          >
            <img src="/airpods.png" />
          </Link>
          <Link
            href="/"
            className="rounded-md hover:bg-gray-100 p-2 hover:ring-1 hover:ring-gray-100"
          >
            <img src="/airpods.png" />
          </Link>
          <Link
            href="/"
            className="rounded-md hover:bg-gray-100 p-2 hover:ring-1 hover:ring-gray-100"
          >
            <img src="/airpods.png" />
          </Link>
          <Link
            href="/"
            className="rounded-md hover:bg-gray-100 p-2 hover:ring-1 hover:ring-gray-100"
          >
            <img src="/airpods.png" />
          </Link>
        </div>
      </div>
    </div>
  );
};
