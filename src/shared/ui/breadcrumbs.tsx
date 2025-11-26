import Link from "next/link";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./kit/breadcrumb";

export const BreadcrumbsDemo: React.FC<{ isProduct?: boolean }> = ({
  isProduct = true,
}) => {
  return (
    <Breadcrumb className="py-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Главная</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {isProduct ? (
          <React.Fragment>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/docs/components">Наушники</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Apple AirPods 3 Pro</BreadcrumbPage>
            </BreadcrumbItem>
          </React.Fragment>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage>Наушники</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
