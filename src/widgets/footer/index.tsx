import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-200 py-12">
      <div className="container">
        <div className="flex">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="flex gap-2 tracking-tight text-blue-600 text-2xl font-medium"
            >
              название
            </Link>
            <p className="text-gray-600 text-sm tracking-tight">
              © 2025 Рушан. All rights reserved.
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <ul className="flex flex-col text-lg tracking-tight text-end">
              <li>Аксессуары</li>
              <li>Контакты</li>
              <li>Сервис</li>
              <li className="text-sm pt-4">
                <a href="mailto:mail@mail.io">nazvanie @danya.com</a>
              </li>
              <li className="text-sm">
                <a href="mailto:mail@mail.io">+32 000 000 00</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
