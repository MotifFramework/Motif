import { uToggleClass } from '../../utils/motif.utilities';

export default function () {
    const gridButton = document.getElementById('js-gridlines-button')

    if (gridButton) {
        gridButton.addEventListener('click', gridDoClick)
    } else {
        return
    }
}

function gridDoClick() {
    const gridContainer = document.getElementById('js-gridlines')
    uToggleClass(gridContainer, 'is-revealed')
}

console.log('gridlines')
