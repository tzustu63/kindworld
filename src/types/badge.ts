export type BadgeCriteriaType = 'hours' | 'missions' | 'points' | 'streak';

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface BadgeCriteria {
  type: BadgeCriteriaType;
  threshold: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  criteria: BadgeCriteria;
  rarity: BadgeRarity;
}
