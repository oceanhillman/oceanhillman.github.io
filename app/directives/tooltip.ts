import type { Directive } from 'vue'
import type { TextureKey } from '~/assets/data/textures';
import type Tex from '~/components/Tex.vue';

export type TexProps = InstanceType<typeof Tex>['$props'];
export interface TooltipBinding {
    _mobileOpen?: boolean,
    _events?: UseEventProperties<any>[],

    text: string
    icon?: TextureKey|TexProps,
    bindToRect?: boolean,
    touchEnabled?: boolean
}

const stateMap = new WeakMap<HTMLElement, TooltipBinding>();

function registerToolTipDesktop(el: HTMLElement, binding: DirectiveBinding<TooltipBinding, string, any>) {
    if (!binding.value._events)
        binding.value._events = [];

    stateMap.set(el, binding.value);
    const stateBinding = stateMap.get(el) || binding.value;

    const { tooltip, show, hide } = useTooltip();

    let scrollEventRemove: (() => void) | null = null;
    
    const mouseEnter = useEvent('mouseenter', _ => {
        const stateBinding = stateMap.get(el) || binding.value;

        if (stateBinding.bindToRect) {
            scrollEventRemove = useEvent('scroll', () => {
                if (!tooltip.value)
                    return;

                const rect = el.getBoundingClientRect();
                tooltip.value.x = rect.left + rect.width / 2;
                tooltip.value.y = rect.top;
            }).remove;

            const rect = el.getBoundingClientRect();
            show(stateBinding.text, el, stateBinding.icon, rect.left + rect.width / 2, rect.top);
        }
        else
            show(stateBinding.text, el, stateBinding.icon);
    }, el);
    stateBinding._events?.push(mouseEnter);

    const mouseLeave = useEvent('mouseleave', () => {
        scrollEventRemove?.();
        hide(el);
    }, el);
    stateBinding._events?.push(mouseLeave);
}

function registerToolTipTouch(el: HTMLElement, binding: DirectiveBinding<TooltipBinding, string, any>) {
    if (!binding.value._events)
        binding.value._events = [];
    stateMap.set(el, binding.value);
    const stateBinding = stateMap.get(el) || binding.value;

    const { tooltip, show, hide } = useTooltip();

    let scrollEventRemove: (() => void) | null = null;
    const clickEvent = useEvent('click', () => {
        const stateBinding = stateMap.get(el) || binding.value;

        if (!stateBinding._mobileOpen) {
            scrollEventRemove = useEvent('scroll', () => {
                if (!tooltip.value)
                    return;

                const rect = el.getBoundingClientRect();
                tooltip.value.x = rect.left + rect.width;
                tooltip.value.y = rect.top;
            }).remove;

            const rect = el.getBoundingClientRect();
            show(stateBinding.text, el, stateBinding.icon, rect.left + rect.width, rect.top);
            stateBinding._mobileOpen = true;
        }
        else {
            stateBinding._mobileOpen = false;
            scrollEventRemove?.();
            hide(el);
        }
    }, el);
    stateBinding._events?.push(clickEvent);

    const clickOutsideEvent = useEvent('click', (e: MouseEvent) => {
        const stateBinding = stateMap.get(el) || binding.value;

        if (!stateBinding._mobileOpen)
            return;
        
        function checkParents(element: HTMLElement) {
            if (element.parentElement == el)
                return true;

            if (!element.parentElement)
                return false;

            return checkParents(element.parentElement);
        }

        if (e.target == el || checkParents(e.target as HTMLElement))
            return;

        stateBinding._mobileOpen = false;
        scrollEventRemove?.();
        hide(el);
    });

    stateBinding._events?.push(clickOutsideEvent);
}

export const vTooltip: Directive<HTMLElement, TooltipBinding> = {
    mounted(el, binding) {
        if (!binding.value)
            return;

        const touchDevice = isTouchDevice().value;
        if (touchDevice && binding.value.touchEnabled)
            registerToolTipTouch(el, binding);
        else if (!touchDevice)
            registerToolTipDesktop(el, binding)
        
    },
    updated(el, binding) {
        const { tooltip, hide, tooltipHistory } = useTooltip();

        if (!binding.value) {
            stateMap.delete(el);
            hide(el);

            return;
        }

        const currentBindingOpenMobile = stateMap.get(el)?._mobileOpen;
        stateMap.set(el, { ...binding.value, _mobileOpen: currentBindingOpenMobile });

        let toSet = tooltip.value;
        // reset tooltip only if this is hovered
        if (tooltip.value?.element != el) {
            const foundInHistory = tooltipHistory.value.find(th => th.element == el);
            if (!foundInHistory)
                return;
            
            toSet = foundInHistory;
        }

        if (!toSet || !tooltip.value)
            return;

        const touchDevice = isTouchDevice().value;
        if (binding.value.bindToRect || isTouchDevice().value) {
            const rect = el.getBoundingClientRect();
            toSet.x = rect.left + rect.width / (touchDevice ? 1 : 2);
            toSet.y = rect.top;
        }

        toSet.text = binding.value.text;
        toSet.icon = binding.value.icon;
    },
    unmounted(el, binding) {
        const stateBinding = stateMap.get(el) || binding.value;
        stateBinding?._events?.forEach(e => e.remove());

        stateMap.delete(el);

        const { hide } = useTooltip();
        hide(el);
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        vTooltip: Directive<HTMLElement, TooltipBinding>
    }
}