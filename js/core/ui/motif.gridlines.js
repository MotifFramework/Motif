/*!
 * Motif Gridlines
 * Optional gridlines to better visualize as you develop
 * http://getmotif.com
 * 
 * Just add the following to your foundation file to use: 
 * <button type="button" class="button__primary" id="js-gridlines-button">
 *      Grid
 *  </button>
 *
 *  <div class="gridlines" id="js-gridlines"></div>
 * 
 * @author Lindsay Forrister <lindsay@lifeblue.com>
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 */

import { uToggleClass } from '../utils/motif.utilities';

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
    gridContainer.innerHTML = '<div class="wrappers__wrapper"><div class="grid__lg-row gridlines__row gridlines__lg"><div class="grid__lg-1of12 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__lg-1of12 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__lg-1of12 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__lg-1of12 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__lg-1of12 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__lg-1of12 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__lg-1of12 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__lg-1of12 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__lg-1of12 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__lg-1of12 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__lg-1of12 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__lg-1of12 gridlines__col"><div class="gridlines__line"></div></div></div><div class="grid__med-row gridlines__row gridlines__med"><div class="grid__med-1of6 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__med-1of6 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__med-1of6 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__med-1of6 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__med-1of6 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__med-1of6 gridlines__col"><div class="gridlines__line"></div></div></div><div class="grid__sm-row gridlines__row gridlines__sm"><div class="grid__sm-1of6 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__sm-1of6 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__sm-1of6 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__sm-1of6 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__sm-1of6 gridlines__col"><div class="gridlines__line"></div></div><div class="grid__sm-1of6 gridlines__col"><div class="gridlines__line"></div></div></div></div>'
    uToggleClass(gridContainer, 'is-revealed')
}


