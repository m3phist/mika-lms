'use client';

import { Button } from '@/components/ui/button';
import { Course } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { CellAction } from './cell-action';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price') || '0');
      const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'MYR',
      }).format(price);

      return <div>{formattedPrice}</div>;
    },
  },
  {
    accessorKey: 'isPublished',
    header: 'Published',
    cell: ({ row }) => {
      const isPublished = row.getValue('isPublished') || false;
      return (
        <Badge
          className={cn(
            'bg-slate-500',
            isPublished ? 'bg-sky-700' : 'bg-slate-500'
          )}
        >
          {isPublished ? 'Published' : 'Draft'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
