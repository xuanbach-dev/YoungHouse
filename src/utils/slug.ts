export const toSlug = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const buildRoomSlug = (room: {
  BranchName?: string; branchName?: string;
  TypeName?: string; typeName?: string;
  RoomID?: number; roomId?: number; roomNumber?: string; RoomNumber?: string;
}): string => {
  const branch = toSlug(room.BranchName || room.branchName || 'young-house');
  const type = toSlug(room.TypeName || room.typeName || 'phong');
  // Prefer numeric stable id; fall back to digits in roomNumber; finally toSlug(roomNumber)
  const rawNum = (room.RoomID || room.roomId || '').toString();
  let numberPart = rawNum;
  if (!numberPart) {
    const rn = (room.RoomNumber || room.roomNumber || '').toString();
    const digits = rn.replace(/\D+/g, '');
    numberPart = digits || toSlug(rn);
  }
  return `${branch}-${type}-${numberPart}`;
};

export const parseRoomSlug = (slug: string): { branch: string; type: string; number: string } => {
  const parts = slug.split('-');
  if (parts.length < 3) return { branch: slug, type: '', number: '' };
  const number = parts.pop() as string;
  const type = parts.pop() as string;
  const branch = parts.join('-');
  return { branch, type, number };
};



