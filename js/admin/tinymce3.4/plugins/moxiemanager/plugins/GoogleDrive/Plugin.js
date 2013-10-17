/**
 * Plugin.js
 *
 * Copyright 2003-2013, Moxiecode Systems AB, All rights reserved.
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, camelcase:false, loopfunc:true */
/*global moxman:true, google:true, gapi:true */

moxman.require([
	"moxman/PluginManager",
	"moxman/util/Path",
	"moxman/util/Loader",
	"moxman/util/JsonRpc"
], function(PluginManager, Path, Loader, JsonRpc) {
	PluginManager.add("googledrive", function(manager) {
		function uploadFile() {
			JsonRpc.exec("googledrive.getClientId", {}, function(clientId) {
				Loader.load({
					js: [
						"//www.google.com/jsapi",
						"//apis.google.com/js/client.js"
					]
				}, function() {
					google.load("picker", "1", {
						callback: function() {
							gapi.client.load('drive', 'v2');

							gapi.auth.authorize({
								'client_id': clientId,
								'scope': 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file'
							}, function() {
								new google.picker.PickerBuilder().
									setAppId(clientId).
									setOAuthToken(gapi.auth.getToken().access_token).
									addView(google.picker.ViewId.DOCS).
									setCallback(function(data) {
										var file, request;

										if (data.docs) {
											for (var i = 0; i < data.docs.length; i++) {
												file = data.docs[i];

												request = gapi.client.drive.files.get({
													'fileId': file.id
												});

												request.execute(function(fileData) {
													var toPath = Path.join(manager.currentDir.path, fileData.title);

													// Export as PDF by default, should ask client, next version.
													if (fileData.exportLinks) {
														fileData.downloadUrl = fileData.exportLinks['application/pdf'];
														fileData.title = fileData.title + '.pdf';
													}

													manager.showThrobber();

													JsonRpc.exec("importFromUrl", {
														url: fileData.downloadUrl + '&access_token=' + gapi.auth.getToken().access_token,
														path: toPath
													}, function() {
														manager.refresh(function() {
															manager.selectByPath(toPath);
															manager.hideThrobber();
														});
													});
												});
											}
										}
									}).
									build().setVisible(true);

									var divs = document.getElementsByTagName('div');
									for (var i = 0; i < divs.length; i++) {
										if (/modal\-dialog\-bg|picker\-dialog/.test(divs[i].className)) {
											divs[i].style.zIndex = 100000;
										}
									}
							});
						}
					});
				});
			});
		}

		manager.addMenuItem({
			text: 'Google Drive',
			icon: 'cloud-download',
			onclick: uploadFile,
			contexts: ['upload']
		});
	});
});
