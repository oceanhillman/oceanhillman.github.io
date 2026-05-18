<template>
    <main>
        <div class="container">
            <div class="title">
                <NuxtLink class="back" to="/heroes">
                    <Tex
                        image="arrowLeft"
                        hover="color"
                        clickable

                        width="40px"
                        height="40px"
                        object-fit="contain"
                    />
                </NuxtLink>
                <h1>Proficiency Summary</h1>
            </div>

            <UiSeparator />

            <ClientOnly>
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
                                <th class="sortable num" @click="setSort('xp')">
                                    <span class="label-full">TOTAL </span>XP
                                    <span class="caret" v-if="sortKey === 'xp'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
                                </th>
                                <th>PROGRESS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="entry in sortedHeroData"
                                :key="entry.hero.id"
                                class="hero-row"
                                :style="{ '--rank-color': entry.rankData.color }"
                                @click="router.push(`/heroes/${entry.hero.id}`)"
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
                                <td class="num-cell xp">{{ entry.totalXp.toLocaleString() }}</td>
                                <td class="progress-cell">
                                    <div class="progress-bar">
                                        <div
                                            class="fill"
                                            :style="{ width: `${Math.round((entry.storedLevel.points / entry.rankData.xpPerLevel) * 100)}%` }"
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </ClientOnly>
        </div>
    </main>
</template>

<style lang="sass" scoped>
main
    width: 100%
    min-height: 100vh

    display: flex
    justify-content: center
    align-items: start

    background: var(--tex-darkBackground)
    background-size: 100% 100vh
    background-attachment: fixed

    padding: 20px

    +media-desktop
        padding: 50px

    +media-mobile
        background-size: cover

.container
    width: 100%
    max-width: 1400px
    display: flex
    flex-direction: column
    align-items: center
    gap: 20px

    .title
        position: relative
        width: 100%

        .back
            position: absolute
            left: 0
            top: 50%
            transform: translateY(-50%)

    h1
        font-size: 45px
        text-transform: uppercase
        text-align: center
        color: $light

        padding: 0 60px

        +media-desktop
            font-size: 55px

.table-wrapper
    width: 100%
    overflow-x: auto
    +scrollbar($background: transparent, $thumb: $light-blue, $active: $color)

    table
        border-collapse: collapse
        width: 100%

        thead
            border-collapse: collapse
            position: sticky
            top: 0
            z-index: 2

            th
                padding: 14px 20px
                text-align: left
                font-family: MarvelRivalsBold
                font-size: 18px
                text-transform: uppercase
                color: $color
                white-space: nowrap
                background: $blue-accent
                border-bottom: 2px solid $color

                &.num
                    text-align: right

                &.center
                    text-align: center

                &.sortable
                    cursor: pointer
                    user-select: none

                    &:hover
                        color: #fff

                .caret
                    font-size: 12px
                    margin-left: 6px

        .hero-row
            background-color: rgb(0 0 0 / 25%);
            border-left: 4px solid var(--rank-color)
            border-bottom: 1px solid rgba(255, 255, 255, 0.06)
            cursor: pointer
            transition: background 0.1s
            

            &:hover
                background: rgba(255, 255, 255, 0.06)

            td
                padding: 0 20px 0 0
                vertical-align: middle

            td.role-cell,
            td.rank-cell
                padding: 0 20px

        .name-cell
            display: flex
            align-items: center
            gap: 16px
            min-width: 220px

            .portrait
                height: 80px
                width: auto
                object-fit: contain
                flex-shrink: 0
                transform: scaleX(-1)
                mask-image: linear-gradient(to bottom left, black 20%, transparent 95%)

            a
                font-family: MarvelRivalsBold
                font-size: 22px
                color: $light
                text-decoration: none

                &:hover
                    color: $color
                    text-decoration: underline

        .role-cell
            div
                display: flex
                justify-content: center
                align-items: center
                height: 100%
                

            .role-icon
                width: 44px
                height: 44px
                object-fit: contain
                filter: brightness(0) invert(1)

        .rank-cell
            div
                display: flex
                align-items: center
                justify-content: center
                gap: 12px
                white-space: nowrap
                height: 100%

            .rank-icon
                width: 56px
                height: 56px
                object-fit: contain

            span
                font-family: MarvelRivalsBold
                font-size: 20px
                color: var(--rank-color)

        .num-cell
            font-family: MarvelRivalsBold
            font-size: 26px
            color: $light
            text-align: right
            white-space: nowrap

            &.xp
                font-family: MRBody
                font-size: 20px
                color: $light-blue-highlight

        .progress-cell
            width: 25%

            .progress-bar
                position: relative
                width: 100%
                height: 30px
                background: rgba(255, 255, 255, 0.1)

                .fill
                    position: absolute
                    top: 0
                    left: 0
                    height: 100%
                    background: var(--rank-color)

        +media-mobile
            .label-full
                display: none

            thead th
                padding: 10px 0
                font-size: 14px

            td
                padding: 0

            td.role-cell,
            td.rank-cell
                padding: 0

            .name-cell
                gap: 8px
                min-width: 140px

                .portrait
                    height: 52px
                    width: 60px
                    object-fit: cover
                    object-position: 75%
                    mask-image: none

                a
                    font-size: 16px

            .role-col,
            .role-cell
                padding: 0 !important

                .role-icon
                    width: 28px
                    height: 28px

            .rank-cell
                div
                    gap: 0

                .rank-icon
                    width: 36px
                    height: 36px

                span
                    display: none

            .num-cell
                font-size: 18px

                &:not(.xp)
                    text-align: center

                &.xp
                    font-size: 14px

            .progress-cell
                .progress-bar
                    height: 18px
</style>

<script setup lang="ts">
import { DEFAULT_HERO_STORE, PlayerHeroStoreSchema, PROFICIENCY_RANKS, ROLE_ICONS, type HeroData, type PlayerHeroStore } from '~/assets/data/common';
import { HERO_LIST, heroRolesAsArray } from '~/assets/data/heroes';

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

type SortKey = 'name' | 'role' | 'rank' | 'level' | 'xp';
const sortKey = ref<SortKey>('xp');
const sortDir = ref<'asc' | 'desc'>('desc');

const ROLE_ORDER = ['vanguard', 'duelist', 'strategist'];

const sortedHeroData = computed(() => {
    return [...heroData.value].sort((a, b) => {
        let cmp = 0;
        switch (sortKey.value) {
            case 'name':  cmp = a.hero.name.localeCompare(b.hero.name); break;
            case 'role':  cmp = ROLE_ORDER.indexOf(heroRolesAsArray(a.hero.roles)[0]!) - ROLE_ORDER.indexOf(heroRolesAsArray(b.hero.roles)[0]!); break;
            case 'rank':  cmp = RANK_ORDER.indexOf(a.rankData.id) - RANK_ORDER.indexOf(b.rankData.id); break;
            case 'level': cmp = a.storedLevel.level - b.storedLevel.level; break;
            case 'xp':    cmp = a.totalXp - b.totalXp; break;
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

useSeoMeta({
    title: 'Proficiency Summary | MR Proficiency Calculator',
    description: 'See all your Marvel Rivals heroes proficiency levels, ranks, and XP at a glance.',
});
</script>
