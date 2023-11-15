'use client';

import * as z from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { File, Loader2, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/file-upload';
import { Attachment, Chapter } from '@prisma/client';
import { ConfirmModal } from '@/components/confirm-modal';

interface AttachmentFormProps {
  initialData: Chapter & { attachments: Attachment[] };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
  name: z.string().min(1),
});

const AttachmentForm = ({
  initialData,
  courseId,
  chapterId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('ON_SUBMIT', values);
      await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/attachments`,
        values
      );
      toast.success('Chapter resource is saved');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const onDelete = async (id: string) => {
    try {
      setIsLoading(true);
      setDeletingId(id);
      await axios.delete(
        `/api/courses/${courseId}/chapters/${chapterId}/attachments/${id}`
      );
      toast.success('Chapter resource deleted');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setDeletingId(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100/50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter attachments
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">No attachments</p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-slate-200 border-slate-200 border text-slate-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p>{attachment.name}</p>
                  {/* {deletingId === attachment.id && (
                    <div className="ml-auto">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )} */}

                  {/* {deletingId !== attachment.id && (
                    <ConfirmModal
                      onConfirm={() => onDelete(attachment.id)}
                      title={attachment.name}
                    >
                      <button className="ml-auto hover:bg-red-500 hover:text-white rounded-full transition">
                        <X className="h-4 w-4" />
                      </button>
                    </ConfirmModal>
                  )} */}

                  {deletingId === attachment.id ? (
                    <div className="ml-auto">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <ConfirmModal
                      onConfirm={() => onDelete(attachment.id)}
                      title={attachment.name}
                    >
                      <button className="ml-auto hover:bg-red-500 hover:text-white rounded-full transition">
                        <X className="h-4 w-4" />
                      </button>
                    </ConfirmModal>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url, name) => {
              console.log('FILEUPLOAD_URL', url);
              console.log('FILEUPLOAD_NAME', name);
              if (url) {
                onSubmit({ url, name: name || '' });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add more resources that related to the chapter
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
