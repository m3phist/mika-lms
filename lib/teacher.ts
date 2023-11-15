export const isTeacher = (userId?: string | null) => {
  //Method 1
  // const allowedUserIds = [
  //   process.env.NEXT_PUBLIC_TEACHER_ID_1,
  //   process.env.NEXT_PUBLIC_TEACHER_ID_2,
  // ];
  // return allowedUserIds.includes(userId!);

  //Method 2
  const publicTeacherIdsString = process.env.NEXT_PUBLIC_TEACHER_IDS || '';
  const publicTeacherIdsArray = publicTeacherIdsString.split('|');
  const isUserAdmin = publicTeacherIdsArray.includes(userId || '');

  return isUserAdmin;
};
