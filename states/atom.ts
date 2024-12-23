import { atom } from 'recoil';

export const isCommentPosted = atom<boolean>({
  key: 'commentAtom',
  default: false,
});

export const isSearching = atom<boolean>({
  key: 'searchingAtom',
  default: false,
});
