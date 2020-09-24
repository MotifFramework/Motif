/*!
 * Motif Carousel
 * This is an extention of the Motif Slider. With Motif Carousel,
 * the width of each slide is calculated and added as an offset style
 * when the buttons are clicked in order to transform the slide from 
 * one to another. This uses the same classes and options as described
 * in the Motif Slider. In order to invoke Motif Carousel, please also
 * add the 'js-carousel' class along with the 'js-slider' class on your
 * slider container. 
 * 
 * Boilerplate styles can be found in less/core/mixins/m-slider.less,
 * which are used in less/ui/slider.less.
 * 
 * Example Syntax for a basic slider: 
 * 
 * <div class="carousel js-slider js-carousel">
 *    <ul class="carousel__slides js-slides">
 *       <li class="carousel__slide js-slide"> 
 *          Slide One
 *       </li>
 *       <li class="carousel__slide js-slide">
 *          Slide Two
 *       </li>
 *       <li class="carousel__slide js-slide">
 *          Slide Three
 *       </li>
 *    </ul>
 *
 *    <button class="carousel__button js-slider__direction-nav-prev" data-direction="prev">
 *       Previous
 *    </button>
 *    <button class="carousel__button js-slider__direction-nav-next" data-direction="next">
 *       Next
 *    </button>
 * </div>
 * 
 * http://getmotif.com
 * 
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 * @author Lindsay Forrister <lindsay@lifeblue.com>
 * 
 */

import Slider from '../ui/motif.slider'

export default class Carousel extends Slider {
    constructor(elem, options) {
      super(elem, options)
      this.updateCarousel()
    }
    adjustSlidesWidth() {
      const width = this.calculateSlideWidth()
  
      window.requestAnimationFrame(() => {
        this.slides.map(slide => {
          slide.style.width = width
        })
      })
    }
  
    calculateSlideWidth() {
      return `${100 / this.visibleSlides}%`
    }
  
    getVisibleSlides() {
      if (typeof this.options.visibleSlides === 'number') {
        return this.options.visibleSlides
      }
  
      return this.getVisibleSlidesByBreakpoint()
    }
  
    getVisibleSlidesByBreakpoint() {
      const visibleSlidesArray = this.convertVisibleSlidesObjectToArray()
  
      const slides = visibleSlidesArray.find(arr => {
        return window.matchMedia(`(min-width: ${arr[0]}px)`).matches
      })
  
      return slides[1]
    }
  
    convertVisibleSlidesObjectToArray() {
      let visibleSlidesArray = Object.entries(this.options.visibleSlides)
  
      visibleSlidesArray = visibleSlidesArray.map(slideArray => {
        if (typeof slideArray[0] === 'string') {
          return [parseInt(slideArray[0], 10), slideArray[1]]
        }
        return slideArray
      })
  
      visibleSlidesArray.sort((a, b) => a[0] - b[0]).reverse()
  
      return visibleSlidesArray
    }
  
    bindEvents() {
      super.bindEvents()
  
      window.addEventListener('resize', this.updateCarousel.bind(this))
    }
  
    calculateSlideOffset(slide) {
      const offset = slide.offsetLeft
      return `${offset > 0 ? '-' : ''}${offset}px`
    }
  
    updateCarousel() {
      this.setStateByIndex(this.state.current)
      this.visibleSlides = this.getVisibleSlides()
      this.adjustSlidesWidth()
      this.renderSequence()
    }
  
    getNextIndex(current = this.state.current) {
      const increment = this.getProgressIncrement()
      const total = this.slides.length
  
      if (
        current + this.visibleSlides === total ||
        current === this.slides.length - increment
      ) {
        if (this.options.loop) {
          return 0
        }
        return current
      }
  
      if (total - (current + increment) < this.visibleSlides) {
        return total - this.visibleSlides
      }
  
      return current + increment
    }
  
    getPrevIndex(current = this.state.current) {
      const increment = this.getProgressIncrement()
      const total = this.slides.length
      if (current !== 0 && current - increment < 0) {
        return 0
      }
      if (current === 0) {
        if (this.options.loop) {
          return this.slides.length - Math.max(increment, this.visibleSlides)
        }
        return current
      }
      return current - increment
    }
  
    getProgressIncrement() {
      return Math.min(this.options.progressIncrement, this.visibleSlides)
    }
  
    renderSequence(state = this.state) {
      super.renderSequence(state)
      this.slidesList.style.setProperty(
        '--slidesOffset',
        this.calculateSlideOffset(this.slides[state.current])
      )
  
      // Want to check if, based on visible slides,
      // the user can move forward or back
      this.renderButtonState()
    }
    getInitialState() {
      if (!this.visibleSlides) {
        this.visibleSlides = this.getVisibleSlides()
      }
      return super.getInitialState()
    }
    lockSlider(e) {
      super.lockSlider(e)
  
      this.currentOffset = parseInt(
        window
          .getComputedStyle(this.slidesList)
          .getPropertyValue('--slidesOffset'),
        10
      )
    }
  }
  