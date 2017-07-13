const path = require('path');
const fs = require('fs');

module.exports = function(content) {
  const found = content.match(/<gui\-fragment\s+data\-fragment\-external=\\"([A-z0-9\.\-_]+)\\"\s+\/>/g);
  found.forEach((f) => {
    let current = f.split(/(<gui\-fragment\s+?data\-fragment\-external=\\"([A-z0-9\.\-_]+)\\"\s+?\/>)/);
    let filename = path.resolve(this.context, current[2]);
    if ( current[2] && fs.existsSync(filename) ) {
      const w = fs.readFileSync(filename, 'utf-8');
      content = content.replace(current[1], w.replace(/(\r|\n)+/g, '').replace(/[\\$'"]/g, '\\$&'));
    }
  });
  return content;
};
