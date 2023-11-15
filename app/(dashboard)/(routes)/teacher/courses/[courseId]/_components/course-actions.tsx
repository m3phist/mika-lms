'use client';

import { ConfirmModal } from '@/components/confirm-modal';
import { Button } from '@/components/ui/button';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import { Course } from '@prisma/client';
import axios from 'axios';
import { Loader2, Trash } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  initialData: Course;
}

export const CourseActions = ({
  disabled,
  courseId,
  initialData,
}: CourseActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}`);
      toast.success('Chapter deleted');
      router.refresh();
      router.push(`/teacher/courses`);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const onClick = async () => {
    try {
      setIsLoading(true);
      if (initialData.isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success('Chapter unpublished');
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success('Chapter published');
        confetti.onOpen();
      }
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      {isLoading && (
        <Loader2 className="ml-1 animate-spin h-4 w-4 text-red-700" />
      )}
      <Link href="/teacher/courses">
        <Button variant="secondary" size="sm">
          Back
        </Button>
      </Link>
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="mikaOutline"
        size="sm"
      >
        {initialData.isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={onDelete} title={initialData.title}>
        <Button size="sm" variant="destructive" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
