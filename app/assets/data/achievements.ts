import type { TEX } from "./textures";

export type AchievementTypeCategory = 'galacta-guide'|'rivalry-rising'|'heroic-journey'|'chronoverse-saga';
export type AchievementTypeRarity = 'copper'|'silver'|'gold';
export interface AchievementType {
    /**
     * For now, it stands for a Hero's Id
     */
    owner?: string,

    id: string,
    title: string,
    description: string,
    category: AchievementTypeCategory,
    rarity: AchievementTypeRarity,

    requirement: number,
    reward: number
}

export interface Achievement {
    id: string,
    current: number
}

export const ACHIEVEMENT_ICONS: Record<
    AchievementTypeCategory, Record<'normal'|AchievementTypeRarity, keyof typeof TEX>
> = {
    'galacta-guide': {
        normal: 'achievementGalactaGuide',
        copper: 'achievementGalactaGuideCopper',
        silver: 'achievementGalactaGuideSilver',
        gold: 'achievementGalactaGuideGold',
    },
    'rivalry-rising': {
        normal: 'achievementRivalryRising',
        copper: 'achievementRivalryRisingCopper',
        silver: 'achievementRivalryRisingSilver',
        gold: 'achievementRivalryRisingGold',
    },
    'heroic-journey': {
        normal: 'achievementHeroicJourney',
        copper: 'achievementHeroicJourneyCopper',
        silver: 'achievementHeroicJourneySilver',
        gold: 'achievementHeroicJourneyGold',
    },
    'chronoverse-saga': {
        normal: 'achievementChronoverseSaga',
        copper: 'achievementChronoverseSagaCopper',
        silver: 'achievementChronoverseSagaSilver',
        gold: 'achievementChronoverseSagaGold',
    },
}

export const ACHIEVEMENT_CATEGORIES: {
    id: AchievementTypeCategory,
    name: string,
    icon(): keyof typeof TEX,
}[] = [
    {
        id: 'galacta-guide',
        name: 'Galacta\'s Guide',
        icon() {
            return ACHIEVEMENT_ICONS[this.id].normal;
        }
    },
    {
        id: 'rivalry-rising',
        name: 'Rivalry Rising',
        icon() {
            return ACHIEVEMENT_ICONS[this.id].normal;
        }
    },
    {
        id: 'heroic-journey',
        name: 'Heroic Journey',
        icon() {
            return ACHIEVEMENT_ICONS[this.id].normal;
        }
    },
    {
        id: 'chronoverse-saga',
        name: 'Chronoverse Saga',
        icon() {
            return ACHIEVEMENT_ICONS[this.id].normal;
        }
    }
] as const;

export const ACHIEVEMENTS: AchievementType[] = [
    {
        owner: 'black-cat',

        id: 'cats-meow',
        title: 'Cat\'s Meow',
        description: 'As Black Cat, trigger 3 instant dashes during a single Calling Card.',
        category: 'heroic-journey',
        rarity: 'silver',

        requirement: 1,
        reward: 10,
    },
    {
        owner: 'black-cat',

        id: 'sorry-sweetie',
        title: 'Sorry, Sweetie!',
        description: 'As Black Cat, take down an enemy Spider-Man.',
        category: 'heroic-journey',
        rarity: 'copper',

        requirement: 1,
        reward: 5,
    }
];

export function getAchievements(category?: AchievementTypeCategory, heroId?: string) {
    return ACHIEVEMENTS.filter(a => {
        if (category && a.category != category)
            return false;

        if (heroId && a.owner != heroId)
            return false;

        return true;
    });
}