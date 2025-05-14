import React from "react";
import { Link } from "react-router-dom"; // Remove this if not using React Router
import { BreadcrumbProps } from "./BreadCrumb.types";
import { InfoIcon} from 'lucide-react'


export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, separator = "/" }) => {
  return (
    <nav aria-label='breadcrumb'>
      <ol className='breadcrumb'>
        {items.map((item, index) => (
          <li key={index} className='breadcrumb-item'>
            {item.href ? (
              <Link to={item.href} className='breadcrumb-link'>
                {item.label}
              </Link>
            ) : (
              <span className='breadcrumb-current'>{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span className='breadcrumb-separator'>{separator}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};


interface HeaderProps {
  pageName: string;
  label?: string;
}

export const Header: React.FC<HeaderProps> = ({ pageName, label }) => {
  return (
    <header className={"page__header__wrapper"}>
      <h1 className={"page__header__title"}>{pageName}</h1>
      {label && <p className={"page__header__subtitle"}><InfoIcon size={14}/>{label}</p>}
    </header>
  );
};

export default Header;

