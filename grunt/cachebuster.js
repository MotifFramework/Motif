var paths = require('../grunt-vars')

module.exports = {
  dist: {
    options: {
      format: 'php',
      basedir: paths.distDir,
      formatter: function (hashes) {
        var output = ''
        function writeArray(object, depth) {
          if (depth === 0) {
            output += '<?php $resourcesVersions = '
          }
          output += 'array(\n'
          var indent = new Array(depth + 1).join('\t')
          for (var key in object) {
            output += indent + "\t'" + key + "' => "

            switch (typeof object[key]) {
              case 'object':
                writeArray(object[key], depth + 1)
                output += ',\n'
                break
              case 'number':
                output += object[key] + ',\n'
                break
              default:
                output += "'" + object[key] + "',\n"
            }
          }
          output += indent + ')'
        }
        writeArray(hashes, 0)
        output += ';\n'

        return output
      }
    },
    src: [
      paths.distDir + 'css/*.css',
      paths.distDir + 'js/*.js',
      paths.distDir + 'icons/*.svg'
    ],
    dest: paths.projectDir + 'resourcesVersion.php'
  }
}
