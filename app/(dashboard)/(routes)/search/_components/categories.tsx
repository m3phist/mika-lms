'use client';

import { Category } from '@prisma/client';
import { MdOutlineCoffeeMaker, MdMicrowave } from 'react-icons/md';
import { BiSolidCoffeeBean } from 'react-icons/bi';
import {
  GiCoffeePot,
  GiTeapotLeaves,
  GiFizzingFlask,
  GiMokaPot,
  GiBottledBolt,
} from 'react-icons/gi';
import { IconType } from 'react-icons';
import { CategoryItem } from './category-item';

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category['name'], IconType> = {
  Espresso: BiSolidCoffeeBean,
  Drip: MdOutlineCoffeeMaker,
  Aeropress: GiCoffeePot,
  Matcha: GiTeapotLeaves,
  Kombucha: GiFizzingFlask,
  Roasting: MdMicrowave,
  'Moka Pot': GiMokaPot,
  'Cold Brew': GiBottledBolt,
};

const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};

export default Categories;
