/*!
 * Motif Slider
 * The basis of a slider, which adds a 'is-prev', is-next', and 'is-current'
 * class to a list of slides based on a button click, as well as a variety of 
 * modifications and additional options, as indicated by the defaults. 
 * Please note that this is a 'peeled back' version of the slider in order 
 * to allow for more custom styling and options. If you are looking for 
 * a slider that will automatically transform from one slide to the next,
 * please refer to the Motif Carousel, which is an extention of the Slider.
 * 
 * Example Syntax for a basic slider: 
 * 
 *          <div class="js-slider">
 *               <ul class="js-slides">
 *                   <li class="js-slide"> 
 *                       Slide One
 *                   </li>
 *                   <li class="js-slide">
 *                       Slide TWo
 *                   </li>
 *                   <li class="js-slide">
 *                       Slide Three
 *                   </li>
 *               </ul>
 *
 *               <button class="js-slider__direction-nav-prev">
 *                   Previous
 *               </button>
 *               <button class="js-slider__direction-nav-next">
 *                   Next
 *               </button>
 *           </div>
 * 
 * http://getmotif.com
 * 
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 * Additional modificatons by Lindsay Forrister <lindsay@lifeblue.com>
 */

 import { uCreateCustomEvent } from '../utils/motif.utilities'

 let counter = 0

 export default class Slider {
     constructor(elem, options = {}) {
       const defaults = {
         isDraggable: true,
         swipeThreshold: 80,
         start: 0,
         onSlide: null,
         beforeSlide: null,
         autoPlay: false,
         speed: 5000,
         loop: true,
         progressIndicators: false,
         progressIndicatorsNav: true,
         customProgressIndicatorsNav: false,
         progressIncrement: 1,
         visibleSlides: {
           0: 1
         },
         trigger: 'click',
         slideActiveClass: "is-current",
         slidePrevClass: "is-prev",
         slideNextClass: "is-next",
         progressListSelector: ".js-slides__progress-list",
         progressListItemSelector: ".js-slides__progress-list-item",
         slidesListSelector: ".js-slides",
         slideSelector: ".js-slide",
         prevButtonSelector: ".js-slider__direction-nav-prev",
         nextButtonSelector: ".js-slider__direction-nav-next",
         draggingClass: "is-dragging",
         playPauseButton: true,
         playPauseButtonClass: "js-slider__play-pause-button",
         syncSlider: false,
         identity: null
       };
       this._defaults = defaults;
       this.options = { ...defaults, ...options };
   
       // DOM
       this.slider = elem;
       this.slidesList = this.slider.querySelector(
         this.options.slidesListSelector
       );
       this.slides = this.getSlides();
       this.prevButtons = this.slider.querySelectorAll(
         this.options.prevButtonSelector
       );
       this.nextButtons = this.slider.querySelectorAll(
         this.options.nextButtonSelector
       );
       this.progressIndicators = this.getProgressIndicators();
       this.prepA11y();
   
       if (this.options.autoPlay) {
         this.isPlaying = true;
         if (this.options.playPauseButton) {
           this.playPauseButton = this.getPlayPauseButton();
         }
       }
       
       this.identity = this.slider.hasAttribute('id')
         ? this.slider.id
         : `carousel-${counter}`
 
       if(this.options.identity) {
         this.identity = this.options.identity
       }
   
       counter += 1
 
       // Events
       this.bindEvents();
   
       // State
       this.timer = null;
       this.horizontalCoords = null;
       this.currentOffset = 0;
       this.locked = false;
       this.start = Math.max(0, this.options.start - 1);
       this.state = this.getInitialState(this.start);
       this.setState();
     }
   
     prepA11y() {
       this.slider.tabIndex = 0;
       this.slider.setAttribute("role", "region");
       this.slider.setAttribute("aria-label", "gallery");
     }
     getPlayPauseButton() {
       const playPauseButton = this.slider.querySelector(
         `.${this.options.playPauseButtonClass}`
       );
   
       if (playPauseButton) {
         return playPauseButton;
       }
   
       return this.createPlayPauseButton();
     }
     createPlayPauseButton() {
       const button = document.createElement("button");
       button.classList.add(this.options.playPauseButtonClass);
       button.type = "button";
       button.innerHTML = `Pause`;
       this.slider.appendChild(button);
       return button;
     }
     onPlayPauseClick() {
       if (this.isPlaying) {
         this.pause();
       } else {
         this.play();
       }
     }
     pause() {
       if (this.playPauseButton) {
         this.playPauseButton.innerHTML = "Play";
       }
       this.timer = this.clearTimer();
       this.isPlaying = false;
     }
     play() {
       if (this.playPauseButton) {
         this.playPauseButton.innerHTML = "Pause";
       }
       this.timer = this.createTimer();
       this.isPlaying = true;
     }
     getInitialState(start = this.start) {
       return this.getNextState(start);
     }
     getProgressIndicators() {
       const lists = this.slider.querySelectorAll(
         this.options.progressListSelector
       );
   
       if (lists.length) {
         const indicators = [];
   
         [].forEach.call(lists, list => {
           const listArray = [].map.call(
             list.querySelectorAll(this.options.progressListItemSelector),
             (listItem, index) => {
               this.bindProgressIndicator(listItem, index);
               return listItem;
             }
           );
   
           if (listArray.length) {
             indicators.push(listArray);
           }
         });
   
         if (indicators.length) {
           return indicators;
         }
       }
       if (this.options.progressIndicators) {
         return this.createProgressIndicators();
       }
   
       return [];
     }
     createProgressIndicators() {
       const docFrag = new DocumentFragment();
       const list = document.createElement("ul");
       list.classList.add("slider__indicators-list");
   
       docFrag.appendChild(list);
   
       const indicators = this.slides.map((slide, index) => {
         const { indicator, button } = this.createProgressIndicator(index);
         list.appendChild(indicator);
         return button;
       });
   
       this.slider.appendChild(list);
       return [indicators];
     }
     createProgressIndicator(index) {
       const indicator = document.createElement("li");
       indicator.classList.add("slider__indicators-list-item");
       const button = document.createElement("button");
       button.classList.add("slider__indicators-button");
       button.type = "button";
       button.innerHTML = `Skip to Slide ${index + 1}`;
       button.tabIndex = -1;
       this.bindProgressIndicator(button, index);
       indicator.appendChild(button);
       return { indicator, button };
     }
     bindProgressIndicator(indicator, index) {
       if (this.options.progressIndicatorsNav) {
          indicator.addEventListener(this.options.trigger, () => {
            this.onIndicatorClick(index);
            if (this.options.syncSlider) {
             document.dispatchEvent(uCreateCustomEvent(`slider/${this.identity}/progressEvent`, { index: index, trigger: this.options.trigger }))
            }
         })
       }
     }
     getSlides() {
       return Array.from(this.slider.querySelectorAll(this.options.slideSelector));
     }
     onIndicatorClick(index) {
       return this.setStateByIndex(index);
     }
     lockSlider(e) {
       this.locked = true;
       if (this.options.autoPlay) {
         this.pause();
       }
       this.horizontalCoords = this.getHorizontalTouchCoord(e);
       this.slidesList.classList.add(this.options.draggingClass);
     }
     getHorizontalTouchCoord(e) {
       return this.getTouchChanges(e).clientX;
     }
     moveSlider(e) {
       if (this.locked) {
         if (this.options.autoPlay) {
           this.play();
         }
         this.slidesList.classList.remove(this.options.draggingClass);
         const horizontalDelta =
           this.getHorizontalTouchCoord(e) - this.horizontalCoords;
         const direction = Math.sign(horizontalDelta);
   
         if (horizontalDelta) {
           if (
             horizontalDelta > this.options.swipeThreshold ||
             horizontalDelta < -this.options.swipeThreshold
           ) {
             if (direction > 0) {
               this.prevSlide();
             } else if (direction < 0) {
               this.nextSlide();
             }
           } else {
             this.setStateByIndex(this.state.current);
           }
         }
   
         this.locked = false;
         this.horizontalCoords = null;
       }
     }
     getTouchChanges(e) {
       return e.changedTouches ? e.changedTouches[0] : e;
     }
     bindEvents() {
       [].forEach.call(this.prevButtons, button => {
         button.addEventListener("click", this.prevSlide.bind(this));
       });
       [].forEach.call(this.nextButtons, button => {
         button.addEventListener("click", this.nextSlide.bind(this));
       });
   
       if (this.options.isDraggable) {
         this.slider.addEventListener("mousedown", this.lockSlider.bind(this));
         this.slider.addEventListener("touchstart", this.lockSlider.bind(this));
   
         this.slider.addEventListener("mousemove", this.dragSlider.bind(this));
         this.slider.addEventListener("touchmove", this.dragSlider.bind(this));
   
         document.addEventListener("mouseout", this.moveSlider.bind(this));
         this.slider.addEventListener("mouseup", this.moveSlider.bind(this));
         this.slider.addEventListener("touchend", this.moveSlider.bind(this));
       }
   
       this.slider.addEventListener("focus", this.focusOnSlide.bind(this), true);
   
       document.addEventListener("keydown", ev => {
         if (document.activeElement === this.slider) {
           ev = ev || window.event;
           this.handleKeydown(ev);
         }
       });
   
       if (this.options.autoPlay) {
         if (this.playPauseButton) {
           this.playPauseButton.addEventListener(
             "click",
             this.onPlayPauseClick.bind(this)
           );
         }
         this.timer = this.createTimer();
       }
 
       if (this.options.syncSlider) {
         document.addEventListener(`slider/${this.identity}/prevSlide`, ev => {
           this.options.syncSlider.prevSlide()
         })
         document.addEventListener(`slider/${this.identity}/nextSlide`, ev => {
          this.options.syncSlider.nextSlide()
         })
        document.addEventListener(`slider/${this.identity}/progressEvent`, ev => {
          console.log(ev)
          this.options.syncSlider.onIndicatorClick(ev.detail.index)
        })
       }
     }
     focusOnSlide(e) {
       const closestSlide = document.activeElement.closest(
         this.options.slideSelector
       );
       if (document.activeElement.closest(this.options.slideSelector)) {
         this.slidesList.scrollTo(0, 0);
         this.setStateByIndex(this.slides.indexOf(closestSlide));
       }
     }
     dragSlider(e) {
       if (this.locked) {
         this.slidesList.style.setProperty(
           "--slidesOffset",
           `${Math.round(
             this.getHorizontalTouchCoord(e) -
               this.horizontalCoords +
               this.currentOffset
           )}px`
         );
       }
     }
     handleKeydown(ev) {
       const keyCode = ev.keyCode;
       if (keyCode == "38") {
         // up arrow
       } else if (keyCode == "40") {
         // down arrow
       } else if (keyCode == "37") {
         this.prevSlide();
         ev.preventDefault();
       } else if (keyCode == "39") {
         this.nextSlide();
         ev.preventDefault();
       }
     }
     createTimer() {
       return window.setTimeout(() => {
         this.nextSlide();
       }, this.options.speed);
     }
     getSlideIndex(index) {
       const last = this.slides.length - 1;
       if (index < 0) {
         return last;
       }
       if (index > last) {
         return 0;
       }
       return index;
     }
     getNextIndex(current = this.state.current) {
       if (current === this.slides.length - 1) {
         if (this.options.loop) {
           return 0;
         }
         return current;
       }
       return current + 1;
     }
   
     getPrevIndex(current = this.state.current) {
       if (current === 0) {
         if (this.options.loop) {
           return this.slides.length - 1;
         }
         return current;
       }
       return current - 1;
     }
     getNextState(nextCurrentIndex) {
       return {
         prev: this.getPrevIndex(nextCurrentIndex),
         current: nextCurrentIndex,
         next: this.getNextIndex(nextCurrentIndex)
       };
     }
     prevSlide() {
      if (this.options.syncSlider) {
        document.dispatchEvent(uCreateCustomEvent(`slider/${this.identity}/prevSlide`, { state: this.state }))
      }
      return this.setStateByIndex(this.getPrevIndex());
     }
     nextSlide() {
      if (this.options.syncSlider) {
        document.dispatchEvent(uCreateCustomEvent(`slider/${this.identity}/nextSlide`, { state: this.state }))
      }
        return this.setStateByIndex(this.getNextIndex());
     }
     clearTimer() {
       if (this.timer) {
         window.clearTimeout(this.timer);
       }
       return null;
     }
     setPrevClasses(slide) {
       slide.classList.remove(
         this.options.slideActiveClass,
         this.options.slideNextClass
       );
       slide.classList.add(this.options.slidePrevClass);
     }
     setCurrentClasses(slide) {
       slide.classList.remove(
         this.options.slidePrevClass,
         this.options.slideNextClass
       );
       slide.classList.add(this.options.slideActiveClass);
     }
     setNextClasses(slide) {
       slide.classList.remove(
         this.options.slideActiveClass,
         this.options.slidePrevClass
       );
       slide.classList.add(this.options.slideNextClass);
     }
     clearClasses(slide) {
       slide.classList.remove(
         this.options.slideActiveClass,
         this.options.slidePrevClass,
         this.options.slideNextClass
       );
     }
     setStateByIndex(index = 0) {
       if (this.options.autoPlay) {
         this.timer = this.clearTimer();
       }
       const nextCurrentIndex = this.getSlideIndex(index);
       const renderedState = this.setState(this.getNextState(nextCurrentIndex), {
         ...this.state
       });
       if (this.options.autoPlay && this.isPlaying) {
         this.timer = this.createTimer();
       }
       return renderedState;
     }
     setState(state, prevState) {
       return new Promise(resolve => {
         if (state) {
           this.state = { ...state };
         }
         this.renderState(this.state, prevState, resolve);
       });
     }
     renderState(state = this.state, prevState, resolve) {
       return window.requestAnimationFrame(() => {
         const beforeSlidePromise = new Promise(
           (beforeSlideResolve, beforeSlideReject) => {
             if (typeof this.options.beforeSlide === "function") {
               this.options.beforeSlide.call(
                 this,
                 {
                   elems: {
                     prev: this.slides[state.prev],
                     current: this.slides[state.current],
                     next: this.slides[state.next]
                   },
                   currentState: state,
                   prevState: prevState,
                   direction: prevState
                     ? state.current === prevState.current
                       ? "same"
                       : state.current > prevState.current
                       ? "next"
                       : "prev"
                     : "same"
                 },
                 beforeSlideResolve,
                 beforeSlideReject
               );
             } else {
               beforeSlideResolve();
             }
           }
         ).then(data => {
           this.renderSequence(state);
   
           window.requestAnimationFrame(() => {
             this.onRender();
           });
         });
   
         return resolve();
       });
     }
     renderSequence(state = this.state) {
       this.slides.map((slide, index) => {
         this.setStateClasses(slide, index, state);
   
         // Render Indicators
         if (this.progressIndicators.length) {
           this.progressIndicators.forEach(list => {
             this.setStateClasses(list[index], index, state);
           });
         }
       });
   
       if (!this.options.loop) {
         this.renderButtonState();
       }
     }
     renderButtonState() {
       if (this.canGoPrev()) {
         this.setButtonClassAndProps(this.prevButtons, false);
       } else {
         this.setButtonClassAndProps(this.prevButtons, true);
       }
   
       if (this.canGoNext()) {
         this.setButtonClassAndProps(this.nextButtons, false);
       } else {
         this.setButtonClassAndProps(this.nextButtons, true);
       }
     }
     setButtonClassAndProps(buttons, disabled = false) {
       [].forEach.call(buttons, button => {
         if (disabled && !button.disabled) {
           button.disabled = true;
           button.classList.add("is-disabled");
         }
   
         if (!disabled && button.disabled) {
           button.disabled = false;
           button.classList.remove("is-disabled");
         }
       });
     }
     canGoPrev(state = this.state) {
       return state.prev !== state.current;
     }
     canGoNext(state = this.state) {
       return state.next !== state.current;
     }
     setStateClasses(item, index, state = this.state) {
       if (index === this.state.current) {
         this.setCurrentClasses(item);
       } else if (index === state.next) {
         this.setNextClasses(item);
       } else if (index === state.prev) {
         this.setPrevClasses(item);
       } else {
         this.clearClasses(item);
       }
       return item;
     }
   
     onRender() {
       if (typeof this.options.onSlide === "function") {
         this.options.onSlide.call(this, this.slides[this.state.current]);
       }
     }
   }
   