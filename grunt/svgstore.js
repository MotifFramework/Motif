var paths = require('../grunt-vars')
var buildFiles = {}
var distFiles = {}

buildFiles[paths.distIcons + 'icons-sprite.svg'] = paths.sourceIcons + '*.svg'
distFiles[paths.distIcons + 'icons-sprite.svg'] = paths.buildIcons + '*.svg'

module.exports = {
  'options': {
    'includedemo': true,
    'svg': {
      'style': 'width:0;height:0;visibility:hidden;position:absolute;'
    }
  },
  'build': {
    'files': buildFiles
  },
  'dist': {
    'files': distFiles
  }
}
