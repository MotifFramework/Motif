/* LB Simple Modal Plugin, v. 0.2 (4/19/12) */
(function($) {
	var _v	=	{

			// System Variables
			"pluginName"	:	"lb_modal",

			// Plugin Variables
			"position"		:	"fixed",
			"topOffset"		:	100,
			"overlay"		:	0.75,
			"openOnLoad"	:	false,

			// On Plugin Initialization
			"onInit"		:	function () {},

			// On Modal Trigger
			"onOpen"		:	function () {},

			// When the Modal Actually Shows
			"onShow"		:	function () {},

			// When the Modal Actually Hides
			"onHide"		:	function () {},

			// Class Name
			"overlayClass"	:	"modal-overlay",
			"wrapperClass"	: 	"modal-wrapper" 
		},

		// Methods
		_m	= {
			"init"	:	function(o, callback) {

				return this.each(function() {
					var $this			=	$(this),
						_vCopy			=	$.extend(true, {}, _v),
						s				=	$.extend(true, _vCopy, o),

						// Modal Variables
						triggerElem		=	$this,
						allData			=	triggerElem.data(),
						modalTargetID	=	triggerElem.attr("data-modal"),
						modalTarget		=	$("#" + modalTargetID),
						modalClose		=	modalTarget.find("[data-modal-close]"),
						modalWrapper	=	$('<div class="' + s.wrapperClass + '"></div>'),
						backOverlay		=	$('<div id="modal-overlay" class="' + s.overlayClass + '" />').css({
												display		:	"none",
												opacity		:	0,
												position	:	"fixed",
												top			:	0,
												left		:	0,
												right		:	0,
												bottom		:	0,
												zIndex		:	10000
											}),
						marker			=	$('<b id="modal-marker" />').css({
												display	:	"none",
												opacity	:	0,
												width	:	"0",
												height	:	"0"
											});
						switch (modalTargetID){
						
							case "img":
								modalTarget = 	$('<img src="' + triggerElem.attr("href") + '" class="modal modal-img" />');
								break;
							case "ajax":
								modalTarget = triggerElem.attr("href");
								break;
						}

						var settings	=	{
												"origData"		:	allData,
												"position"		:	s.position,
												"topOffset"		:	s.topOffset,
												"onInit"		:	s.onInit,
												"onOpen"		:	s.onOpen,
												"onShow"		:	s.onShow,
												"onHide"		:	s.onHide,
												"marker"		:	marker,
												"modalTargetID"	:	modalTargetID,
												"modalTarget"	:	modalTarget,
												"modalClose"	:	modalClose,
												"overlay"		:	s.overlay,
												"backOverlay"	:	backOverlay,
												"modalWrapper"	:	modalWrapper
											};

					$this.data("modalSettings", settings);

					// Trigger onInit callback
					if(typeof settings.onInit === "function") {
						settings.onInit();
					}

					// Open On Load
					if (s.openOnLoad === true) {
						_m.openModal.call($this);
					}

					// Set On Click for Trigger Elements
					triggerElem.on("click", function () {
						_m.openModal.call($this);
						return false;
					});
				});
			},
			"openModal"		:	function () {
				var	$this		=	$(this),
					o			=	$this.data("modalSettings"),
					totalOffset	=	o.topOffset;

				switch (o.modalTargetID){
					case "img":
						o.modalTarget.appendTo("body");
						openHelper();
						break;
					case "ajax":
						//alert("get here");
						
						$('<div id="modalContentHolder" class="modalContentHolder"></div>').appendTo("body");
						$('#modalContentHolder').load($this.attr("href") + " #main-content");
						o.modalTarget = $('#modalContentHolder');
						openHelper();
						break;
					default:
						openHelper();
						break;
				} 
				function openHelper(){
				
					var	modalHeight	=	o.modalTarget.outerHeight(),
						modalWidth	=	o.modalTarget.outerWidth();
					
					// If position is absolute, offset modal with scrollTop
					if (o.position === "absolute") {
						totalOffset		=	$(document).scrollTop() + o.topOffset;
					}
					// Append the overlay
					o.modalWrapper.appendTo("body").append(o.backOverlay);
					
					// Place a marker where the modal currently resides
					o.marker.insertAfter(o.modalTarget);
					// Move the target to a more root level
					o.modalTarget.appendTo(o.modalWrapper);
	
					// Closing the modals
					o.backOverlay.on("click", function () {
						_m.closeModal.call($this, {
							"marker"		:	o.marker,
							"modal"			:	o.modalTarget,
							"overlay"		:	o.backOverlay,
							"modalWrapper"	: 	o.modalWrapper,
							"modalTargetID"	: 	o.modalTargetID,
							"onHide"		:	o.onHide
						});
	
						return false;
					});
	
					// Closing Modal with Internal Button
					o.modalClose.on("click", function () {
						_m.closeModal.call($this, {
							"marker"		:	o.marker,
							"modal"			:	o.modalTarget,
							"overlay"		:	o.backOverlay,
							"modalWrapper"	: 	o.modalWrapper,
							"modalTargetID"	: 	o.modalTargetID,
							"onHide"		:	o.onHide
						});
						$(this).off("click", function () {});
						return false;
					});
	
					// Trigger onOpen Callback
					if(typeof o.onOpen === "function") {
						o.onOpen($this);
					}
	
					// Activate Overlay
					o.backOverlay.css({
						display		:	"block",
						opacity		:	o.overlay
					});
					
					// Activate Modal
					o.modalTarget.css({
						display		:	"block",
						visibility	:	"visible",
						position	:	o.position,
						opacity		:	1,
						zIndex		:	11000,
						left		:	"50%",
						marginTop	:	0,
						marginLeft	:	-(modalWidth / 2) + "px",
						top			:	totalOffset + "px"
					}).addClass("modal-open");
	
					// Trigger onShow Callback
					o.modalWrapper.fadeTo(300, 1, function () {
						if(typeof o.onShow === "function") {
							o.onShow($this);
						}
					});
				}
			},
			"closeModal"	:	function (o) {

				var $this 	=	$(this);

				// Hide Modal
				o.modalWrapper.fadeOut(300, function () {
					$(this).css("display", "none");
					o.modal.insertAfter(o.marker).removeClass("modal-open");

					if (o.modalTargetID === "img" || o.modalTargetID === "ajax") {
						o.modal.remove();
					}
				});

				if(typeof o.onHide === "function") {
					o.onHide($this);
				}

				// Detach Marker for Reuse Later
				o.marker.detach();
			}
		};

	$.fn[_v.pluginName] = function(m) {
		if (_m[m]) {
            return _m[m].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (!m || typeof m === "object") {
            return _m.init.apply(this, arguments);
        } else {
            console.log(_v.pluginName + ": Invalid method passed");
        }
	};

})(jQuery);