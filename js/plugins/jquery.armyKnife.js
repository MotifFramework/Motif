////////////////////////////////////////////////////////////////////////////////////////////////
//
//			PLUGIN:		ARMY KNIFE
//			VERSION:	1.6b
//			AUTHOR:		ROMAN D. PACHECO
//			NOTES:
//				2012.02.07	:	1.6b	-	RECODED LARGE PORTIONS OF THE PLUGIN FOR EFFICIENCY AND FILE SIZE (27% smaller minified)
//				2011.12.07	:	1.5		-	ADDED NEW 'useContinue' FLAG; WITH THIS YOU CAN TELL THE PLUGIN WHEN TO MOVE PAST A CALLBACK FUNCTION
//												BY EXECUTING THE SUPPLIED 'o.cont()' FUNCTION
//										-	ADDED NEW 'navTrigger' option
//										-	CHANGED SECTION CHANGE CALLBACK FUNCTIONS TO ACCEPT AN OBJECT INSTEAD OF MULTIPLE ARGUMENTS
//				2011.11.29	:	1.4		-	ADDED SUPPORT MULTIPLE NAVS VIA 'itemsPerNav'
//										-	ADDED INITIAL TRIGGER OF sectionBeforeEnter AND sectionOnEnter FUNCTIONS
//				2011.11.21	:	1.3		-	ADDED SUPPORT FOR SECTION CHANGE CALLBACK FUNCTIONS
//				2011.11.17	:	1.2		-	ADDED SUPPORT FOR A CALLBACK FUNCTION
//				2011.10.06	:	1.1		-	NOW ABLE TO SWITCH SECTIONS WITH A TRANSITION OF 'none' (INSTANT)
//										-	ADDED ABILITY TO SET TEXT AND CUSTOM TAB TITLES
//										-	FIXED ANIMATION CLEARING BUG
//			SETTINGS:
//
//				// DEFAULT SETTINGS
//				$("#myElem").armyKnife({
//					speed					:	300,
//					sections				:	"> *",
//					startingSection			:	0,
//					easing					:	"swing",				//	[swing|linear]
//					transition				:	"none",					//	[none|slide|slideIn|slideOut|fade|fadeIn|fadeOut]
//					autoResize				: 	false,
//					resizeSpeed				: 	200,
//					autoRotate				:	false,
//					autoRotateDelay			:	5000,
//					generateNav				:	false,
//					navType					:	"empty",				//	[empty|numeric|text|custom]
//					navItemSource			:	function(section) {		//	REQUIRED WHEN navType = 'text' OR 'custom'; RESPECTIVE SECTION IS PASSED FOR EASY REFERENCE
//						return "&nbsp;";
//					},
//					navItemCode				:	function(source) {		//	REQUIRED WHEN navType = 'custom'; SECTION SOURCE IS PASSED FOR EASY REFERENCE
//						var btn	=	$("<a />",{
//							"href"	: 	"#"
//						});
//						btn.html(source);
//						return btn;
//					},
//					navID					:	false,
//					navClass				:	"armyKnife-Nav",
//					navTrigger				:	"click",
//					itemsPerNav				:	0,						//	0 = UNLIMITED ITEMS PER NAV; RESULTS IN ONLY 1 NAV
//					activeNavItemClass		:	"active",
//					showSectionButtons		: 	false,
//					sectionButtonClass		: 	"armyKnife-Btn",
//					sectionButtonCodeNext	: 	$("<a />",{
//						"href"	: 	"#"
//					}),
//					sectionButtonCodePrev	: 	$("<a />",{
//						"href"	: 	"#"
//					}),
//					sectionOnEnter			:	function(o) {		//	o.current = CURRENT SECTION'S INDEX; o.previous = PREVIOUS SECTION'S INDEX; o.sections = ARRAY OF ALL SECTIONS
//						var currentSection	=	$(this);
//					},
//					sectionOnExit			:	function(o) {		//	o.current = CURRENT SECTION'S INDEX; o.target = TARGET SECTION'S INDEX; o.sections = ARRAY OF ALL SECTIONS
//						var currentSection	=	$(this);
//					},
//					sectionBeforeEnter		:	function(o) {		//	o.current = CURRENT SECTION'S INDEX; o.previous = PREVIOUS SECTION'S INDEX; o.sections = ARRAY OF ALL SECTIONS
//						var currentSection	=	$(this);
//					},
//					sectionBeforeExit		:	function(o) {		//	o.current = CURRENT SECTION'S INDEX; o.target = TARGET SECTION'S INDEX; o.sections = ARRAY OF ALL SECTIONS
//						var currentSection	=	$(this);
//					},
//					useContinue				:	false
//				},callback);
//
//				// CHANGE SECTIONS
//				$("#myElem").armyKnife("next");
//				$("#myElem").armyKnife("prev");
//				$("#myElem").armyKnife("goto",5);	//	USE SECTION INDEX, NOT SECTION COUNT
//
//
////////////////////////////////////////////////////////////////////////////////////////////////
(function($){

////////////////////////// System Variables
	var 
		_v			=	{
			"pn"		:	"armyKnife",							//	Plugin Name
			"cp"	:	{											//	CSS Properties
				"a"	:	{												//	Active
					"marginLeft"	:	"0%"
				},
				"ab"	:	{											//	Above
					"zIndex"		: 	100
				},
				"b"	:	{												//	Below
					"zIndex"		: 	10
				},
				"hr"	:	{											//	Hidden Right
					"marginLeft"	:	"100%"
				},
				"hl"	:	{											//	Hidden Left
					"marginLeft"	:	"-100%"
				},
				"fo"	:	{											//	Fade Out
					"opacity"	:	0
				},
				"fi"	:	{											//	Fade In
					"opacity"	:	1
				}
			},
			"r"		: 	{											//	Regex
				"t"	: 	{												//	Transitions
					"fi"	:	new RegExp("fade(,|$|In)","i"),				//	Fade In
					"fo"	:	new RegExp("fade(,|$|Out)","i"),			//	Fade Out
					"si"	:	new RegExp("slide(,|$|In)","i"),			//	Slide In
					"so"	:	new RegExp("slide(,|$|Out)","i"),			//	Slide Out
					"n"		:	new RegExp("none(,|$)","i")					//	None
				}
			}
		},

////////////////////////// System Elements
		_e			=	{
			"b"	: 	$("<a />",{
				"href"	: 	"#"
			})
		},

////////////////////////// Default Settings
		_s			=	{
			"speed"					:	300,
			"sections"				:	"> *",
			"startingSection"		:	0,
			"easing"				:	"swing",				//	[swing|linear]
			"transition"			:	"none",					//	[none|slide|slideIn|slideOut|fade|fadeIn|fadeOut]
			"autoResize"			: 	false,
			"resizeSpeed"			: 	200,
			"autoRotate"			:	false,
			"autoRotateDelay"		:	5000,
			"generateNav"			:	false,
			"navType"				:	"empty",				//	[empty|numeric|text|custom]
			"navItemSource"			:	function(s) {			//	REQUIRED WHEN navType = 'text' OR 'custom'; RESPECTIVE SECTION IS PASSED FOR EASY REFERENCE
				return " ";
			},
			"navItemCode"			:	function(s) {			//	REQUIRED WHEN navType = 'custom'; SECTION SOURCE IS PASSED FOR EASY REFERENCE
				return _e.b.clone().html(s);
			},
			"navID"					:	false,
			"navClass"				:	_v.pn + "-Nav",
			"navTrigger"			:	"click",
			"itemsPerNav"			:	0,
			"activeNavItemClass"	:	"active",
			"showSectionButtons"	: 	false,
			"sectionButtonClass"	: 	_v.pn + "-Btn",
			"sectionButtonCodeNext"	: 	_e.b.clone(),
			"sectionButtonCodePrev"	: 	_e.b.clone(),
			"sectionOnEnter"		:	false,
			"sectionOnExit"			:	false,
			"sectionBeforeEnter"	:	false,
			"sectionBeforeExit"		:	false,
			"useContinue"			:	false
		},

////////////////////////// Methods
		_m			=	{
			
			// Initialize
			//////////////////////
			init	:	function(o,callback) {
				return this.each(function() {
					var $this	=	$(this),
						data	=	$this.data(_v.pn);
					if(!data) {
						var s =	$.extend(true,{},_s);
						s = $.extend(true,s,o || {});
						$.extend(true,s,{
							"sl"	:	[],						//	Section List
							"ni"	:	[],						//	Nav Items
							"cs"	:	s.startingSection,		//	Current Section
							"ts"	:	false,					//	Target Section
							
							//	Aliases; for shorter code footprint
							"tr"	:	s.transition,
							"ar"	:	s.autoRotate,
							"anic"	:	s.activeNavItemClass,
							"soe"	:	s.sectionOnEnter,
							"sox"	:	s.sectionOnExit,
							"sbe"	:	s.sectionBeforeEnter,
							"sbx"	:	s.sectionBeforeExit,
							"uc"	:	s.useContinue
						});
						$this.data(_v.pn,s);
						data = $this.data(_v.pn);
						var allSections	=	$this.find(data.sections);
						data.generateNav && _m.gn.call($this,allSections);
						$.each(allSections,function(i,e) {
							(i == data.startingSection && $(e).css(_v.cp.a))
								|| $(e).css(_v.cp.hr);
							if(data.showSectionButtons) {
								if(i) {
									var prevBtn	=	data.sectionButtonCodePrev.clone();
									prevBtn.html() == "" && prevBtn.html("Prev");
									prevBtn
										.addClass(data.sectionButtonClass)
										.bind("click",function() {
											_m.prev.call($this);
											return false;
										})
										.appendTo($(e));
								};
								if(i < allSections.length - 1) {
									var nextBtn	=	data.sectionButtonCodeNext.clone();
									nextBtn.html() == "" && nextBtn.html("Next");
									nextBtn
										.addClass(data.sectionButtonClass)
										.bind("click",function() {
											_m.next.call($this);
											return false;
										})
										.appendTo($(e));
								};
							};
							data.sl.push($(e));
						});
					};
					data.ar && _m.sar.call($this);
					if(data.autoResize) {
						data.ts = data.cs;
						_m.rv.call($this,callback);
					} else {
						callback && callback.call && callback();
					};
								
					//	BEFORE ENTER
					data.beforeEnterComplete = new $.Deferred();
					$.when(data.beforeEnterComplete)
						.then(function() {
							
							//	ON ENTER
							data.soe && data.soe.call
								&& data.soe.call(data.sl[data.cs],_m.gsco.call($this,"onenter"));
						});
					if(data.sbe && data.sbe.call) {
						var sbeObj	=	_m.gsco.call($this,"beforeenter");
						data.sbe.call(data.sl[data.cs],sbeObj);
					};
					(!data.uc || (data.sbe && data.sbe.call) && data.uc)
						&& _m.resolveContinue.call($this,"beforeenter");
				});
			},
			
			// Get Section Callback Object
			//////////////////////
			gsco	:	function(type) {
				var $this	=	this,
					data	=	$this.data(_v.pn);
				if(data) {
					var obj		=	{
							"sections"	:	data.sl,
							"cont"	:	function() {
								_m.resolveContinue.call($this,type);
							}
						},
						cases	= {
							"beforeenter"	:	function() {
								$.extend(true,obj,{
									"current"	:	data.ts,
									"previous"	:	data.cs
								});
							},
							"onenter"	:	function() {
								$.extend(true,obj,{
									"current"	:	data.ts,
									"previous"	:	data.cs
								});
							},
							"beforeexit"	:	function() {
								$.extend(true,obj,{
									"current"	:	data.cs,
									"target"	:	data.ts
								});
							},
							"onexit"	:	function() {
								$.extend(true,obj,{
									"current"	:	data.cs,
									"target"	:	data.ts
								});
							}
						};
					cases[type]() || $.extend(true,obj,{
						"current"	:	data.cs,
						"previous"	:	data.cs
					});
					return obj;
				};
			},
			
			// Trigger
			//////////////////////
			trigger			:	function(m) {
				var $this	=	this,
					data	=	$this.data(_v.pn);
				if(data) {
					var method	=	m.toString().toLowerCase().replace(/^section/,""),
						sbeObj	=	_m.gsco.call($this,method);
					data[m].call(data.sl[data.cs],sbeObj);
				};
			},
			
			// Resolve "Continue"
			//////////////////////
			resolveContinue	:	function(type) {
				var $this	=	this,
					data	=	$this.data(_v.pn);
				data && ({
					"beforeenter"	:	function() {
						typeof data.beforeEnterComplete == "object"
							&& data.beforeEnterComplete.resolve();
					},
					"onenter"		:	function() {
						typeof data.onEnterComplete == "object"
							&& data.onEnterComplete.resolve();
					},
					"beforeexit"	:	function() {
						typeof data.beforeExitComplete == "object"
							&& data.beforeExitComplete.resolve();
					},
					"onexit"		:	function() {
						typeof data.onExitComplete == "object"
							&& data.onExitComplete.resolve();
					}
				})[type]() || false;
			},
			
			// Generate Nav
			//////////////////////
			gn	:	function(s) {
				var $this	=	this,
					data	=	$this.data(_v.pn);
				if(data) {
					data.nav = $("<div />");
					var	actualItemsPerNav	=	data.itemsPerNav,
						ul 					=	$("<ul />",{
							"class"	:	data.navClass
						}),
						sections			=	s;
					data.itemsPerNav == 0 && (actualItemsPerNav = s.length);
					var globalI	=	0;
					while(sections.length) {
						var thisUL	=	ul.clone();
						s = sections;
						$.each(s,function(i,e) {
							if(i >= actualItemsPerNav)
								return false;
							var thisLI	=	$("<li />"),
								thisA	=	_e.b.clone(),
								e		=	s[i];
							
							switch(data.navType) {
								case "numeric":
									thisA.html(parseFloat(i + 1));
									break;
								case "text":
									var source	=	data.navItemSource($(e)) || data.navItemSource;
									thisA.html(source);
									break;
								case "custom":
									var source	=	data.navItemSource($(e)) || data.navItemSource,
										code	=	data.navItemCode(source) || data.navItemCode;
									thisA = typeof code == "object" ? code : $(code);
									break;
								default:
									thisA.html(" ");
							}
							thisUL.append(thisLI);
							thisLI.append(thisA);
							thisA.bind(data.navTrigger,{
								"i"	:	globalI
							},function(e) {
								_m["goto"].call($this,e.data.i);
								return false;
							});
							i == data.startingSection && thisLI.addClass(data.anic);
							data.ni.push(thisLI);
							sections = sections.filter(function(index) {
								return sections[index] != e;
							});
							globalI++;
						});
						data.nav.append(thisUL);
					}
					data.nav.children().length == 1
						&& (data.nav = $(data.nav.children()[0]));
					if(data.navID) {
						($("#" + data.navID).length && $("#" + data.navID).replaceWith(data.nav))
							|| $this.before(data.nav);
						data.nav.attr("id",data.navID);
					} else {
						$this.before(data.nav);
					};
				};
			},
			
			// Set Auto Rotate
			//////////////////////
			sar	:	function() {
				return this.each(function() {
					var $this	=	$(this),
						data	=	$this.data(_v.pn);
					if(data) {
						clearTimeout(data.autoRotateInterval);
						data.autoRotateInterval = setTimeout(function() {
							((typeof data.anim == "undefined" || data.anim.isResolved())
								&& _m.next.call($this))
								|| (!data.anim.isResolved() && $.when(data.anim).then(function() {
									_m.next.call($this);
								}));
						},data.autoRotateDelay);
					};
				});
			},
			
			// Resize View
			//////////////////////
			rv	:	function(callback) {
				return this.each(function() {
					var $this	=	$(this),
						data	=	$this.data(_v.pn);
					if(data) {
						var viewHeight	=	$this.height(),
							tsHeight	=	data.sl[data.ts].outerHeight();
						(viewHeight != tsHeight && $this.animate({
								"height"	: 	tsHeight
							},data.resizeSpeed,function() {
								!!callback && callback.call && callback();
							})) || (!!callback && callback.call && callback());
					};
				});
			},
			
			// Go To
			//////////////////////
			"goto"	:	function(target) {
				return this.each(function() {
					var $this	=	$(this),
						data	=	$this.data(_v.pn);
					if(data && target != data.cs && (typeof data.anim == "undefined" || data.anim.isResolved())) {
						data.anim	=	new $.Deferred();
						data.ar && _m.sar.call($this);
						data.ts = target;
						var direction = target < data.cs ? "right" : "left";
						(data.autoResize && _m.rv.call($this,function() {
							_m.a.call($this,direction);
						})) || _m.a.call($this,direction);
					};
				});
			},
			
			// Go To "Next"
			//////////////////////
			next	:	function() {
				return this.each(function() {
					var $this	=	$(this),
						data	=	$this.data(_v.pn);
					if(data && data.sl[data.cs] && (typeof data.anim == "undefined" || data.anim.isResolved())) {
						data.anim	=	new $.Deferred();
						data.ar && _m.sar.call($this);
						data.ts = data.sl[data.cs + 1] ? data.cs + 1 : 0;
						(data.autoResize && _m.rv.call($this,function() {
							_m.a.call($this);
						})) || _m.a.call($this);
					};
				});
			},
			
			// Go To "Previous"
			//////////////////////
			prev	:	function() {
				return this.each(function() {
					var $this	=	$(this),
						data	=	$this.data(_v.pn);
					if(data && data.sl[data.cs] && (typeof data.anim == "undefined" || data.anim.isResolved())) {
						data.anim	=	new $.Deferred();
						data.ar && _m.sar.call($this);
						data.ts = data.sl[data.cs - 1] ? data.cs - 1 : data.sl.length - 1;
						(data.autoResize && _m.rv.call($this,function() {
							_m.a.call($this,"right");
						})) || _m.a.call($this,"right");
					};
				});
			},
			
			// Animate
			//////////////////////
			a	:	function(dir,callback) {
				callback = callback || function() {};
				return this.each(function() {
					var $this	=	$(this),
						data	=	$this.data(_v.pn);
					dir = dir || "left";
					if(data && data.sl[data.cs] && data.sl[data.ts]) {
							
						//	BEFORE EXIT
						data.beforeExitComplete = new $.Deferred();
						$.when(data.beforeExitComplete)
							.then(function() {
								
								//	BEFORE ENTER
								data.beforeEnterComplete = new $.Deferred();
								$.when(data.beforeEnterComplete)
									.then(function() {
								
										data.sl[data.cs].css(_v.cp.b);
										var currentCSSProps	=	_v.cp.a;
										(data.tr.match(_v.r.t.so) || data.tr.match(_v.r.t.n))
											&& (currentCSSProps	=	dir == "left" ? _v.cp.hl : _v.cp.hr);
										var animObjCurrent	=	$.extend(true,{},currentCSSProps);
										!!data.tr.match(_v.r.t.fo) && $.extend(true,animObjCurrent,_v.cp.fo);
										
										//	ANIMATE CURRENT SECTION OUT
										if(data.tr.match(_v.r.t.n)) {
											data.sl[data.cs].css(animObjCurrent);
											callback();
										} else {
											data.sl[data.cs].animate(animObjCurrent,data.speed,data.easing,callback);
										};
										
										(data.tr.match(_v.r.t.fi)
											&& data.sl[data.ts].css(_v.cp.fo))
												|| data.sl[data.ts].css(_v.cp.fi);
										
										data.sl[data.ts].css(_v.cp.ab);
										var resetCSSProps	=	_v.cp.a;
										(data.tr.match(_v.r.t.si) || data.tr.match(_v.r.t.n))
											&& (resetCSSProps = dir == "left" ? _v.cp.hr : _v.cp.hl);
										data.sl[data.ts].css(resetCSSProps);
										var animObjTarget	=	$.extend(true,{},_v.cp.a);
										!!data.tr.match(_v.r.t.fi) && $.extend(true,animObjTarget,_v.cp.fi);
										
										//	ANIMATE TARGET SECTION IN
										if(data.tr.match(_v.r.t.n)) {
											data.sl[data.ts].css(animObjTarget);
											data.anim.resolve();
											callback();
											
											//	ON EXIT
											data.onExitComplete = new $.Deferred();
											$.when(data.onExitComplete)
												.then(function() {
											
													//	ON ENTER
													data.soe && data.soe.call
														&& data.soe.call(data.sl[data.ts],_m.gsco.call($this,"onenter"));
												});
											data.sox && data.sox.call
												&& data.sox.call(data.sl[data.cs],_m.gsco.call($this,"onexit"));
											(!data.uc || (data.sox && data.sox.call && data.uc))
												&& _m.resolveContinue.call($this,"onexit");
										} else {
											data.sl[data.ts].animate(animObjTarget,data.speed,data.easing,function() {
												data.anim.resolve();
												callback();
											
												//	ON EXIT
												data.onExitComplete = new $.Deferred();
												$.when(data.onExitComplete)
													.then(function() {
												
														//	ON ENTER
														data.soe && data.soe.call
															&& data.soe.call(data.sl[data.ts],_m.gsco.call($this,"onenter"));
													});
												data.sox && data.sox.call
													&& data.sox.call(data.sl[data.cs],_m.gsco.call($this,"onexit"));
												(!data.uc || (data.sox.call && data.uc))
													&& _m.resolveContinue.call($this,"onexit");
											});
										};
										if(data.nav) {
											data.nav
												.find("." + data.anic)
												.removeClass(data.activeClass);
											data.ni[data.ts].addClass(data.anic);
										};
										data.cs = data.ts;
									});
								data.sbe && data.sbe.call
									&& data.sbe.call(data.sl[data.ts],_m.gsco.call($this,"beforeenter"));
								(!data.uc || (data.sbe && data.sbe.call && data.uc))
									&& _m.resolveContinue.call($this,"beforeenter");
							});
						data.sbx && data.sbx.call
							&& data.sbx.call(data.sl[data.cs],_m.gsco.call($this,"beforeexit"));
						(!data.uc || (data.sbx && data.sbx.call && data.uc))
							&& _m.resolveContinue.call($this,"beforeexit");
					};
				});
			}
		};
	$.fn[_v.pn] = function(m) {
		
		// IF THE METHOD PASSED EXISTS...
		if(_m[m]) {
			
			// RETURN THE METHOD AND ANY ATTACHED ARGUMENTS
			return _m[m].apply(this,Array.prototype.slice.call(arguments,1));
		
		// IF NOTHING IS PASSED OR NO METHOD IS PASSED BUT AN OBJECT IS PASSED...
		} else if (!m || typeof m == "object") {
			
			// RUN THE init METHOD BY DEFAULT AND PASS ANY ATTACHED ARGUMENTS
			return _m.init.apply(this,arguments);
			
		// IF WHAT IS PASSED DOESNT APPLY...
		} else {
			
			// SHOW AN ERROR
			console.log(_v.pn + ": Invalid method passed");			
		};
	};
})(jQuery);