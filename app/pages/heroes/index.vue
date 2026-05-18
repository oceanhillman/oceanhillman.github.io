<template>
    <main>
        <div class="container">
            <div class="title">
                <NuxtLink class="back" to="/">
                    <Tex
                        image="arrowLeft"
                        hover="color"
                        clickable

                        width="40px"
                        height="40px"
                        object-fit="contain"
                    />
                </NuxtLink>
                <h1>
                    Select your hero
                </h1>
            </div>
            <UiSeparator />
            <ClientOnly>
                <PanelHeroList
                    ref="heroList"
                    back-button="/"
                    v-model:view="view"
                >
                    <template #list-view>
                        <div class="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th class="sortable" @click="setSort('name')">
                                            HERO
                                            <span class="caret" v-if="sortKey === 'name'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
                                        </th>
                                        <th class="sortable center role-col" @click="setSort('role')">
                                            ROLE
                                            <span class="caret" v-if="sortKey === 'role'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
                                        </th>
                                        <th class="sortable center" @click="setSort('rank')">
                                            RANK
                                            <span class="caret" v-if="sortKey === 'rank'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
                                        </th>
                                        <th class="sortable center" @click="setSort('level')">
                                            LEVEL
                                            <span class="caret" v-if="sortKey === 'level'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
                                        </th>
                                        <th class="no-left-pad sortable center" @click="setSort('current-xp')">
                                            CURRENT XP
                                            <span class="caret" v-if="sortKey === 'current-xp'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
                                        </th>
                                        <th class="sortable num" @click="setSort('xp')">
                                            <span class="label-full">TOTAL </span>XP
                                            <span class="caret" v-if="sortKey === 'xp'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="entry in sortedHeroData"
                                        :key="entry.hero.id"
                                        class="hero-row"
                                        :class="{ favourite: favourites.includes(entry.hero.id) }"
                                        :style="{ '--rank-color': entry.rankData.color }"
                                        @click="router.push(`/heroes/${entry.hero.id}`)"
                                        @contextmenu.prevent="favouriteHero(entry.hero.id)"
                                        v-tooltip="({
                                            text: favourites.includes(entry.hero.id)
                                                ? '<b>Remove</b> from favorites'
                                                : '<b>Add</b> to favorites',
                                            icon: 'mouseRight'
                                        } satisfies TooltipBinding)"
                                    >
                                        <td class="name-cell">
                                            <img :src="storyImageSrc(entry.hero.name)" class="portrait" />
                                            <NuxtLink :to="`/heroes/${entry.hero.id}`" @click.stop>{{ entry.hero.name }}</NuxtLink>
                                        </td>
                                        <td class="role-cell">
                                            <div>
                                                <img
                                                    v-for="role in heroRolesAsArray(entry.hero.roles)"
                                                    :key="role"
                                                    :src="ROLE_ICONS[role]"
                                                    class="role-icon"
                                                />
                                            </div>
                                        </td>
                                        <td class="rank-cell">
                                            <div>
                                                <img :src="entry.rankData.icon" class="rank-icon" />
                                                <span>{{ entry.rankData.name }}</span>
                                            </div>
                                        </td>
                                        <td class="num-cell">{{ entry.storedLevel.level }}</td>
                                        <td class="progress-cell">
                                            <div class="progress-bar">
                                                <div
                                                    class="fill"
                                                    :style="{ width: `${Math.round((entry.storedLevel.points / entry.rankData.xpPerLevel) * 100)}%` }"
                                                />
                                                <span class="xp-label">{{ entry.storedLevel.points.toLocaleString() }} / {{ entry.rankData.xpPerLevel.toLocaleString() }}</span>
                                            </div>
                                        </td>
                                        <td class="num-cell xp">{{ entry.totalXp.toLocaleString() }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="hero-cards">
                            <div class="cards-controls">
                                <span class="sort-label">Sort by:</span>
                                <div class="sort-row">
                                    <FormDropdown :options="cardSortOptions" v-model="sortKey" />
                                    <button class="dir-toggle" @click="sortDir = sortDir === 'asc' ? 'desc' : 'asc'">
                                        {{ sortDir === 'asc' ? 'ASC ▲' : 'DESC ▼' }}
                                    </button>
                                </div>
                            </div>
                            <div
                                v-for="entry in sortedHeroData"
                                :key="entry.hero.id"
                                class="hero-card"
                                :class="{ favourite: favourites.includes(entry.hero.id) }"
                                :style="{ '--rank-color': entry.rankData.color }"
                                @click="router.push(`/heroes/${entry.hero.id}`)"
                                @contextmenu.prevent="favouriteHero(entry.hero.id)"
                                v-tooltip="({
                                    text: favourites.includes(entry.hero.id)
                                        ? '<b>Remove</b> from favorites'
                                        : '<b>Add</b> to favorites',
                                    icon: 'mouseRight'
                                } satisfies TooltipBinding)"
                            >
                                <div class="card-top">
                                    <img :src="storyImageSrc(entry.hero.name)" class="portrait" />
                                    <div class="card-identity">
                                        <NuxtLink :to="`/heroes/${entry.hero.id}`" @click.stop>{{ entry.hero.name }}</NuxtLink>
                                        <div class="card-role">
                                            <img
                                                v-for="role in heroRolesAsArray(entry.hero.roles)"
                                                :key="role"
                                                :src="ROLE_ICONS[role]"
                                                class="role-icon"
                                            />
                                        </div>
                                    </div>
                                    <div class="card-rank">
                                        <img :src="entry.rankData.icon" class="rank-icon" />
                                        <span>{{ entry.rankData.name }}</span>
                                    </div>
                                </div>
                                <div class="progress-bar">
                                    <div
                                        class="fill"
                                        :style="{ width: `${Math.round((entry.storedLevel.points / entry.rankData.xpPerLevel) * 100)}%` }"
                                    />
                                    <span class="xp-label">Current XP: {{ entry.storedLevel.points.toLocaleString() }} / {{ entry.rankData.xpPerLevel.toLocaleString() }}</span>
                                </div>
                                <div class="card-stats">
                                    <span class="level">Level: {{ entry.storedLevel.level }}</span>
                                    <span class="xp">Total XP: {{ entry.totalXp.toLocaleString() }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </PanelHeroList>
            </ClientOnly>
        </div>
    </main>
</template>

<style src="@/assets/style/pages/heroes/index.sass" scoped></style>

<script setup lang="ts">
import { DEFAULT_HERO_STORE, PlayerHeroStoreSchema, PROFICIENCY_RANKS, ROLE_ICONS, type HeroData, type HeroRole, type PlayerHeroStore } from '~/assets/data/common';
import { HERO_LIST, heroRolesAsArray } from '~/assets/data/heroes';
import { useAbsoluteUrl } from '~/composables/config';
import type { TooltipBinding } from '~/directives/tooltip';

useSeoMeta({
    title: 'Heroes | MR Proficiency Calculator',
    description: 'Browse all Marvel Rivals heroes and calculate proficiency rewards.',

    ogTitle: 'Heroes | MR Proficiency Calculator',
    ogUrl: useCanonicalUrl('heroes'),
    ogImage: useAbsoluteUrl('/img/seo/og-image-heroes.webp'),
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: 'Heroes | Marvel Rivals Proficiency Calculator - Calculate how long it takes to unlock every proficiency reward for any hero',

    twitterTitle: 'Heroes | MR Proficiency Calculator',
    twitterDescription: 'Browse all Marvel Rivals heroes and calculate proficiency rewards.',
    twitterImage: useAbsoluteUrl('/img/seo/og-image-heroes.webp'),
    twitterImageAlt: 'Heroes | Marvel Rivals Proficiency Calculator - Calculate how long it takes to unlock every proficiency reward for any hero',
})

useHead({
    link: [
        {
            rel: "canonical",
            href: useCanonicalUrl('heroes')
        }
    ]
})

const { save, restore } = useScrollPosition();
onMounted(restore);
onBeforeUnmount(save);

// View toggle
const view = useLocalStorage<'gallery' | 'list'>('heroes_view', 'gallery');

// Filter state — read from PanelHeroList via expose
interface HeroListFilters { searchText: string, filterByRole: string, filterFavourites: boolean }
const heroList = useTemplateRef<HeroListFilters>('heroList');
const favourites = useLocalStorage<string[]>('favourite_heroes', []);

function favouriteHero(heroId: string) {
    const idx = favourites.value.indexOf(heroId);
    if (idx !== -1)
        favourites.value.splice(idx, 1);
    else
        favourites.value.push(heroId);
}

// List view — summary table logic
const router = useRouter();
const unknownHeroes = useLocalStorage<HeroData[]>('unknown_heroes', []);

const STORY_PNG_HEROES = new Set(['Iron Fist', 'Loki', 'Venom']);
const KNOWN_HERO_NAMES = new Set(HERO_LIST.map(h => h.name));
function storyImageSrc(name: string): string {
    if (!KNOWN_HERO_NAMES.has(name)) return '/img/heroes/story/Unknown Hero Story.webp';
    const ext = STORY_PNG_HEROES.has(name) ? 'png' : 'webp';
    return `/img/heroes/story/${name.replace(/&/g, '%26')} Story.${ext}`;
}

const RANK_ORDER = Object.keys(PROFICIENCY_RANKS);

function calcTotalXp(level: number, points: number): number {
    let total = points;
    for (const rank of Object.values(PROFICIENCY_RANKS)) {
        const lastCompleted = Math.min(rank.levelEnd, level - 1);
        if (lastCompleted >= rank.levelStart)
            total += (lastCompleted - rank.levelStart + 1) * rank.xpPerLevel;
        if (rank.levelEnd >= level) break;
    }
    return total;
}

const heroData = computed(() => {
    return [...HERO_LIST, ...unknownHeroes.value].map(hero => {
        const stored = useLocalStorage<PlayerHeroStore>(`hero_${hero.id}`, DEFAULT_HERO_STORE(), PlayerHeroStoreSchema);
        const rankData = PROFICIENCY_RANKS[stored.value.rank] ?? PROFICIENCY_RANKS.agent!;
        const totalXp = calcTotalXp(stored.value.level, stored.value.points);
        return { hero, storedLevel: stored.value, rankData, totalXp };
    });
});

type SortKey = 'name' | 'role' | 'rank' | 'level' | 'xp' | 'current-xp';
const sortKey = useLocalStorage<SortKey>('heroes_list_sort_key', 'xp');
const sortDir = useLocalStorage<'asc' | 'desc'>('heroes_list_sort_dir', 'desc');

const cardSortOptions = [
    { label: 'NAME',        value: 'name' },
    { label: 'ROLE',        value: 'role' },
    { label: 'RANK',        value: 'rank' },
    { label: 'LEVEL',       value: 'level' },
    { label: 'CURRENT XP',  value: 'current-xp' },
    { label: 'TOTAL XP',    value: 'xp' },
];

const ROLE_ORDER = ['vanguard', 'duelist', 'strategist'];

const sortedHeroData = computed(() => {
    const search = heroList.value?.searchText ?? '';
    const role = heroList.value?.filterByRole ?? 'all-roles';
    const favOnly = heroList.value?.filterFavourites ?? false;
    const favs = favourites.value;

    let data = [...heroData.value];

    if (role !== 'all-roles' && role !== 'favourite')
        data = data.filter(e =>
            e.hero.roles === role ||
            (Array.isArray(e.hero.roles) && e.hero.roles.includes(role as HeroRole))
        );

    if (role === 'favourite' || favOnly)
        data = data.filter(e => favs.includes(e.hero.id));

    if (search)
        data = data.filter(e =>
            e.hero.name.toLowerCase().includes(search.toLowerCase()) ||
            e.hero.aliases?.find(a => a.toLowerCase().includes(search.toLowerCase()))
        );

    return data.sort((a, b) => {
        let cmp = 0;
        switch (sortKey.value) {
            case 'name':  cmp = a.hero.name.localeCompare(b.hero.name); break;
            case 'role':  cmp = ROLE_ORDER.indexOf(heroRolesAsArray(a.hero.roles)[0]!) - ROLE_ORDER.indexOf(heroRolesAsArray(b.hero.roles)[0]!); break;
            case 'rank':  cmp = RANK_ORDER.indexOf(a.rankData.id) - RANK_ORDER.indexOf(b.rankData.id); break;
            case 'level':      cmp = a.storedLevel.level - b.storedLevel.level; break;
            case 'xp':         cmp = a.totalXp - b.totalXp; break;
            case 'current-xp': cmp = (a.storedLevel.points / a.rankData.xpPerLevel) - (b.storedLevel.points / b.rankData.xpPerLevel); break;
        }
        return sortDir.value === 'asc' ? cmp : -cmp;
    });
});

function setSort(key: SortKey) {
    if (sortKey.value === key) {
        sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortDir.value = key === 'name' || key === 'role' ? 'asc' : 'desc';
    }
}
</script>
