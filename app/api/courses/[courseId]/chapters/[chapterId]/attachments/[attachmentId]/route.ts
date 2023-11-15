import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

// export const utapi = new UTApi(); we cannot used export it cause type error; check if this still working after changed

export async function DELETE(
  req: Request,
  {
    params,
  }: { params: { courseId: string; chapterId: string; attachmentId: string } }
) {
  try {
    const utapi = new UTApi();
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // const attachment = await db.attachment.delete({
    //   where: {
    //     courseId: params.courseId,
    //     id: params.attachmentId,
    //   },
    // });

    // await utapi.deleteFiles('4bf95578-9bb4-4192-a0dd-c00dae2a2b82-o0pa3n.jpg');

    // Retrieve the attachment URL from the database based on the provided attachment ID
    const attachment = await db.attachment.findUnique({
      where: {
        chapterId: params.chapterId,
        id: params.attachmentId,
      },
    });

    if (!attachment) {
      return new NextResponse('Attachment not found', { status: 404 });
    }

    // Extract the attachment ID from the URL
    const urlParts = attachment.url.split('/');
    const attachmentId = urlParts[urlParts.length - 1];

    // Delete the attachment from the database
    await db.attachment.delete({
      where: {
        id: params.attachmentId,
      },
    });

    // Use the extracted attachment ID with utapi.deleteFiles
    await utapi.deleteFiles(attachmentId);

    return NextResponse.json(attachment);
  } catch (error) {
    console.log('ATTACHMENT_ID', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
