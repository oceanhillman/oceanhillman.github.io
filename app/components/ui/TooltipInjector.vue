<template>
    <Teleport to="body">
        <div
            v-if="tooltip"
            ref="tooltipEl"

            class="tooltip"
            :style="{
                transform: `translate3d(${position!.x}px, ${position!.y}px, 0)`
            }"
        >
            <Tex
                v-if="tooltip.icon"
                v-bind="texProps"
            />
            <span v-html="tooltip.text" />
        </div>
    </Teleport>
</template>

<style lang="sass" scoped>
.tooltip
    position: fixed
    top: 0
    left: 0

    max-width: 300px

    background: #28282c
    padding: 3px 12px
    border: 2px solid #fff

    display: flex
    align-items: center
    gap: 5px

    will-change: transform
    z-index: 1000
    user-select: none
    pointer-events: none
    -webkit-user-drag: none

    span
        color: $light

        ::v-deep(b)
            font-weight: normal
            color: $color-accent
</style>

<script setup lang="ts">
const { tooltip } = useTooltip();

const tooltipEl = useTemplateRef('tooltipEl');

const mousePos = ref<{x: number, y: number}>({x: 0, y: 0});
useEvent('mousemove', (e: MouseEvent) => {
    mousePos.value.x = e.clientX;
    mousePos.value.y = e.clientY;
})

const position = computed(() => {
    if (!tooltip.value)
        return null;

    let x, y;
    if (typeof tooltip.value.x !== 'undefined' && typeof tooltip.value.y !== 'undefined') {
        x = tooltip.value.x;
        y = tooltip.value.y;
    }
    else {
        x = mousePos.value.x + 15;
        y = mousePos.value.y + 15;
    }

    // clamp to viewport if we have dimensions
    if (tooltipEl.value) {
        const { offsetWidth: w, offsetHeight: h } = tooltipEl.value;
        x = Math.min(x, window.innerWidth - w - 4);
        y = Math.min(y, window.innerHeight - h - 4);
    }

    return { x, y }
});

const texProps = computed(() => {
    if (!tooltip.value)
        return {};

    if (typeof tooltip.value.icon === 'object')
        return tooltip.value.icon;

    return {
        image: tooltip.value.icon,
        width: "30px",
        height: "30px",
    }
})
</script>