// QUnit.module( "Reveal Initialization", {
//   setup: function( assert ) {
// 	var targ = $("<div id='target'></div>"),
// 		trigger = $("<a data-reveal='target'></a>");
// 	$("body").append(targ).append(trigger);

// 	var reveal = new window.Motif.apps.Reveal();
//   }, teardown: function( assert ) {

//   }
// });
QUnit.test( "Build new reference for target", function( assert ) {
	var trigger = $("<a class='new-reveal' data-reveal='target'></a>"),
		reveal = new window.Motif.apps.Reveal( trigger );

	assert.deepEqual( reveal.newReferenceTarget( reveal.$elem ).targets.length, 0, "Fresh target reference is empty to begin with." );
	assert.deepEqual( reveal.newReferenceTarget( reveal.$elem ).current, false, "A new reference is not set as current." );
	assert.equal( reveal.$elem.is("a.new-reveal[data-reveal='target']"), true, "The reference 'elem' is the same as our trigger elem." );
});

// new reference group created correctly
// before reveal tests
// only 1 reference exists
// fors work
// hide works
// trigger on active radio item does not hide
// regular reveal tests
// radio works
// exclusive works
// queue works