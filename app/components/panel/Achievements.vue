<template>
    <div class="achievements-panel">
        <div class="header">
            <div class="title">
                <h3>ACHIEVEMENTS POINTS</h3>
                <div class="counter">
                    <Tex
                        image="achievementPoint"

                        width="25px"
                        height="25px"

                        color="#b3b4bc"

                        inline
                    />
                    <div class="text">
                        {{ achievementPointsObtained }} <span>/ {{ achievementPointsToGain }}</span>
                    </div>
                </div>
            </div>
            <div class="rewards" @click="openRewardsList">
                <Tex 
                    image="achievementGift"

                    width="50px"
                    height="50px"
                />
            </div>
        </div>

        <ul class="achievements">
            <li
                v-for="achievement in achievementsWithState"
                :key="achievement.id"

                :class="{ completed: achievement.completed }"

                v-tooltip="({
                    text: achievement.completed ?
                        'Reset'
                        :
                        'Mark as <b>completed</b>',
                    icon: 'mouseLeft'
                } satisfies TooltipBinding)"

                @click="completeOrResetAchievement(achievement)"
            >
                <Tex
                    class="icon"
                    :image="ACHIEVEMENT_ICONS[achievement.category][achievement.rarity]"

                    width="100px"
                    height="100px"
                />

                <div class="details">
                    <div class="info">
                        <div class="title">
                            <h3>{{ achievement.title }}</h3>
                            <p v-if="achievement.completed" class="completed">
                                COMPLETED
                            </p>
                        </div>
                        <p>{{ achievement.description }}</p>
                    </div>

                    <div
                        class="progress"
                        v-tooltip="({
                            text: ''
                        } satisfies TooltipBinding)"
                        @click.stop
                    >
                        <FormAdvancedInput
                            v-if="!achievement.completed"
                            :number-input="{
                                min: 0,
                                max: achievement.requirement,
                                step: 1,
                                hideLargeStepButtons: true
                            }"

                            :model-value="(achievement.current ?? 0) + ''"
                            @update:model-value="setAchievement(achievement.id, parseInt($event) || 0)"
                        />
                        <p>
                            <span
                                v-if="achievement.completed"
                            >{{ achievement.current }}</span>/{{ achievement.requirement }}
                        </p>
                    </div>
                </div>

                <div class="points">
                    <Tex
                        image="achievementPoint"

                        width="60px"
                        height="60px"

                        color="#757782"
                    />
                    <p>{{ achievement.reward }}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<style src="@/assets/style/components/achievements.sass" scoped></style>

<script setup lang="ts">
import { ACHIEVEMENT_ICONS, type Achievement, type AchievementType, type AchievementTypeCategory } from '~/assets/data/achievements';
import type { TooltipBinding } from '~/directives/tooltip';
import AchievementCategoryRewards from '../modals/AchievementCategoryRewards.vue';

const { openModal } = useModalManager();

const props = defineProps<{
    category: AchievementTypeCategory,
    achievements: AchievementType[]
}>();

const achievementsStore = useLocalStorage<Achievement[]>('achievements', []);

const achievementPointsToGain = computed(() => props.achievements.map(a => a.reward).reduce((s, c) => s + c, 0));
const achievementPointsObtained = computed(() => 
    achievementsWithState.value.filter(as => as.completed)
                               .map(as => as.reward)
                               .reduce((s, c) => s + c, 0)
);

const achievementsWithState = computed(() => {
    const mapped = props.achievements.map(a => ({
        ...a,
        ...(achievementsStore.value.find(state => state.id == a.id) ?? {})
    }));

    return mapped.map(a => ({ ...a, completed: a.current == a.requirement }));
});

function getAchievement(achievementId: string) {
    const achievementExisting = achievementsStore.value.find(a => a.id == achievementId);

    return achievementExisting ?? null;
}

function setAchievement(achievementId: string, current: number) {
    const achievementExisting = getAchievement(achievementId);

    if (achievementExisting)
        achievementExisting.current = current;
    else
        achievementsStore.value.push({
            id: achievementId,
            current: current
        });
}

function completeOrResetAchievement(achievement: AchievementType) {
    const achievementExisting = getAchievement(achievement.id);
    if (achievementExisting?.current == achievement.requirement)
        setAchievement(achievement.id, 0);
    else
        setAchievement(achievement.id, achievement.requirement);
}

function openRewardsList() {
    openModal(AchievementCategoryRewards, {
        category: props.category,
    })
    .promise
    .catch(() => null);
}
</script>