import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Page } from '../../types';

interface BreadcrumbItem {
  label: string;
  page?: Page;
}

export const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  const { navigateTo } = useShop();

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brand-gray mb-6">
      <button
        onClick={() => navigateTo('home', undefined, 'back')}
        className="hover:text-brand-plum transition-colors cursor-pointer"
      >
        Home
      </button>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="opacity-40" aria-hidden="true">
            /
          </span>
          {item.page ? (
            <button
              onClick={() => navigateTo(item.page!, undefined, 'back')}
              className="hover:text-brand-plum transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-brand-plum font-semibold line-clamp-1">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
