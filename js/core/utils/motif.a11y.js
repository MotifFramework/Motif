export const a11yFocusElements = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]'
export const a11yAriaAttributes = [
    "aria-hidden",
    "aria-expanded",
    "aria-selected",
    "aria-checked"
]

export function a11yTabindexToggle(el) {
    if (el.tabIndex === 0) {
        el.tabIndex = -1
    } else {
        el.tabIndex = 0
    }
}

export function a11yChildTabindexToggle(parent) {
    ;[].forEach.call(parent.querySelectorAll(a11yFocusElements), el => {
        a11yTabindexToggle(el)
    })
}

export function a11yToggleAria(el) {
    a11yAriaAttributes.forEach(attr => {
        if (el.hasAttribute(attr)) {
            el.setAttribute(attr, !(el.getAttribute(attr) === "true"));
        }
    });
}
