import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { Link, pagesToLinks } from './common';

export function MenuPage({
  keys,
  menuClick,
}: {
  keys: string[];
  menuClick: (link: Link) => void;
}) {
  const { t } = useTranslation();

  const links = pagesToLinks(keys);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {links.map((link) => (
        <div
          key={link.key}
          className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-primary/30"
          onClick={() => {
            menuClick(link);
          }}
        >
          {/* Gradient Background on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Icon Container with Gradient Background */}
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className={clsx('text-primary', link.className)}>
                  {link.icon}
                </div>
              </div>
              
              {/* Label */}
              <div>
                <h3 className={clsx(
                  'text-base font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300',
                  link.className,
                )}>
                  {t(link.label)}
                </h3>
              </div>
            </div>
            
            {/* Arrow Icon */}
            <ChevronRightIcon className="h-6 w-6 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" aria-hidden="true" />
          </div>
        </div>
      ))}
    </div>
  );
}
