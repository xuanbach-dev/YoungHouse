export const toSlug = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
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
  const number = room.RoomNumber || room.roomNumber || String(room.RoomID || room.roomId || '');
  return `${branch}-${type}-${number}`;
};

export const parseRoomSlug = (slug: string): { branch: string; type: string; number: string } => {
  const parts = slug.split('-');
  if (parts.length < 3) return { branch: slug, type: '', number: '' };
  const number = parts.pop() as string;
  const type = parts.pop() as string;
  const branch = parts.join('-');
  return { branch, type, number };
};


