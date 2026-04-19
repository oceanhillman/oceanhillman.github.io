export const isTouchDevice = () => {
    const touch = ref(hasTouch());

    const instance = getCurrentInstance();
    if (instance) {
        if (instance.isMounted && !instance.isUnmounted)
            touch.value = hasTouch();
        else
            onMounted(() => {
                touch.value = hasTouch();
            });
    }
    else
        touch.value = hasTouch();

    useEvent('resize', () => touch.value = hasTouch());

    return touch;
}