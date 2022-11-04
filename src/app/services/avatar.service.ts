import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  avatarTypes = [
    'male',
    'female',
    'human',
    'identicon',
    'initials',
    'bottts',
    'avataaars',
    'jdenticon',
    'gridy',
    'micah',
  ];

  constructor() {}

  getAvatarUrl(displayName: string): string {
    const avatarType =
      this.avatarTypes[Math.floor(Math.random() * this.avatarTypes.length)];
    return `https://avatars.dicebear.com/api/${avatarType}/${displayName}.svg`;
  }
}
