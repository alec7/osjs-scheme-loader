const path = require('path');
const fs = require('fs');

module.exports = function(content) {
  const found = content.match(/<gui\-fragment\s+?data\-fragment\-external=\\"(.*)\\"\s+?\/>/g);
  if ( found ) {
    found.forEach((f) => {
      let imp = f.split(/<gui\-fragment\s+?data\-fragment\-external=\\"(.*)\\"\s+?\/>/)[0];
      imp = path.resolve(this.context, imp);
      if ( imp && fs.existsSync(imp) ) {
        const w = fs.readFileSync(imp, 'utf-9');
        content = content.replace(f, w);
      }
    });
  }

  return content;
};
