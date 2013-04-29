// watch-escape.js
// A utility to watch for changes in Escape code and compile as necessary
// by Adam Trimble

var template_src = "../templates/"; // directory of dust templates are stored with .dust file extension
var template_public = "../js/templates/"; // directory where the compiled .js files should be saved to

var fs = require('fs');
var dust = require('dust');
var watch = require('watch');

watch.watchTree(template_src, {'ignoreDotFiles': true}, function(f, curr, prev) {
	if (typeof f == "object" && prev === null && curr === null) {
		// Finished walking the tree
		console.log("===============================================");
		console.log("Started monitoring "+template_src+" for changes");
		console.log("===============================================");
		console.log(" ");
		console.log("Re-Rendering all templates");
		console.log(" ");
		for (var path in f) {
			if (f[path].blocks) {
				compileTemplate(path);
			}
		}
	} else if (prev === null) {
		// f is a new file
		if (f.split('/').reverse()[0].split('.').reverse()[0] !== "html") {
			return false;
		}
		console.log("New dust file: "+f);
		compileTemplate(f);
	} else {
		// f was changed
		if (f.split('/').reverse()[0].split('.').reverse()[0] !== "html") {
			return false;
		}
		console.log("Dust changed: "+f);
		compileTemplate(f);
	}
});

function compileTemplate(tempPath) {
  fs.readFile(tempPath, 'ascii', function(err, data) {
    if (err) throw err;
    var filename = tempPath.split("/").reverse()[0].split('.')[0];
    if (!filename) { return false; }
    var subPath = tempPath.split("/").slice(2);
    subPath.pop();
    if (subPath.length) {
	    var filepath = template_public + subPath.join("/") + "/";
	    var templateName = subPath.join('-') + "-" + filename;
	  } else {
	    var filepath = template_public;
	    var templateName = filename;
	  }
    var fullpath = filepath + filename + ".js";
    var compiled = dust.compile(data, templateName);

    if (subPath.length === 3) {
	    fs.mkdir(template_public + subPath[0], 0777, function() {
				fs.mkdir(template_public + subPath[0] + "/" + subPath[1], 0777, function() {
			    fs.mkdir(template_public + subPath[0] + "/" + subPath[1] + "/" + subPath[2], 0777, function() {
						fs.writeFile(fullpath, compiled, function (err) {
							if (err) throw err;
							console.log('Compiled dust template "' + templateName + '" to: ' + fullpath);
						});
			    });
		    });
	    });
    } else if (subPath.length === 2) {
	    fs.mkdir(template_public + subPath[0], 0777, function() {
		    fs.mkdir(template_public + subPath[0] + "/" + subPath[1], 0777, function() {
					fs.writeFile(fullpath, compiled, function (err) {
						if (err) throw err;
						console.log('Compiled dust template "' + templateName + '" to: ' + fullpath);
					});
		    });
	    });
    } else if (subPath.length === 1) {
	    fs.mkdir(template_public + subPath[0], 0777, function() {
				fs.writeFile(fullpath, compiled, function (err) {
					if (err) throw err;
					console.log('Compiled dust template "' + templateName + '" to: ' + fullpath);
				});
	    });
    } else {
			fs.writeFile(fullpath, compiled, function (err) {
				if (err) throw err;
				console.log('Compiled dust template "' + templateName + '" to: ' + fullpath);
			});
    }
  });
}
