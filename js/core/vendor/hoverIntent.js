import hoverintent from 'hoverintent'

export default function () {
    ;[].forEach.call(document.querySelectorAll('.js-hoverintent'), el => {
        hoverintent(el,
            function () {
                el.classList.add('is-hovering')
            },
            function () {
                el.classList.remove('is-hovering')
            }
        ).options({ timeout: 200 })
    })
}
