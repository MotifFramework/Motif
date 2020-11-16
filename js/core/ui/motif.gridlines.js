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
 * @author Travis Self <travis@lifeblue.com>
 */

import { uToggleClass } from '../utils/motif.utilities';

export default function () {
    let button = document.querySelector('#js-gridlines-button')

    if (button) {
        new Gridlines(button)
    } else {
        return
    }
}

export class Gridlines {
    constructor(button) {
        
        // Column values must align with those defined in config.less
        this.columns = {
            lg: 12,
            med: 9,
            sm: 4
        }

        this.button = button
        this.container = document.querySelector('#js-gridlines')
        this.containerHTML = ''
        
        this.init()
    }

    init() {
        this.generateGrid()
        this.button.addEventListener('click', this.toggleGrid.bind(this))
    }

    generateGrid() {
        let containerCheck = new Promise(resolve => {
            if (!this.container) {
                this.container = document.createElement('div')
        
                this.container.classList.add('gridlines')
                this.button.insertAdjacentElement('afterend', this.container)
                resolve(true)
            } else {
                resolve(true)
            }
        })
    
        containerCheck
            .then(() => {
                this.containerHTML = '<div class="wrappers__wrapper">'
                    this.containerHTML += '<div class="grid__lg-row gridlines__row gridlines__lg">'

                    for(let i = 1; i <= this.columns.lg; i++) {
                        this.containerHTML += '<div class="grid__lg-1of' + this.columns.lg + ' gridlines__col"><div class="gridlines__line" data-count="' + i + '"></div></div>'
                    }
                    this.containerHTML += '</div><div class="grid__med-row gridlines__row gridlines__med">'
                    
                    for(let i = 1; i <= this.columns.med; i++) {
                        this.containerHTML += '<div class="grid__med-1of' + this.columns.med + ' gridlines__col"><div class="gridlines__line" data-count="' + i + '"></div></div>'
                    }
                    this.containerHTML += '</div><div class="grid__sm-row gridlines__row gridlines__sm">'
                    for(let i = 1; i <= this.columns.sm; i++) {
                        if (this.columns.sm === 4) {
                            this.containerHTML += '<div class="grid__sm-quarter gridlines__col"><div class="gridlines__line" data-count="' + i + '"></div></div>'
                        } else if (this.columns.sm === 3) {
                            this.containerHTML += '<div class="grid__sm-third gridlines__col"><div class="gridlines__line" data-count="' + i + '"></div></div>'
                        } else {
                            this.containerHTML += '<div class="grid__sm-1of' + this.columns.sm + ' gridlines__col"><div class="gridlines__line" data-count="' + i + '"></div></div>'
                        }
                    }
                    this.containerHTML += '</div>'
                this.containerHTML += '</div>'
            })
            .then(() => {
                this.container.insertAdjacentHTML('afterbegin', this.containerHTML)
            })
    }

    toggleGrid() {
        uToggleClass(this.container, 'is-revealed')
    }
}
