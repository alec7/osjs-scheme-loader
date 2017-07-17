const path = require('path');
const fs = require('fs');
const tmp = require('tmp');

function replaceStockIcons(html) {
  const re = /(data\-icon="stock\:\/+([^"]+)")/g;
  const matches = html.match(re) || [];

  matches.forEach(function(iter) {
    const spl = html.split(re);
    const newIcon = spl[2].replace(/^stock\:\/+/, '');
    html = html.replace(spl[1], 'data-stock-icon="' + newIcon + '"');
  });

  return html;
}

module.exports = function(content) {
  const callback = this.async();
  const loadModule = this.loadModule;
  const context = this.context;

  let html = fs.readFileSync(this.resourcePath, 'utf-8');
  html = replaceStockIcons(html);

  const attrs = 'attrs[]=img:src&attrs[]=:data-icon';
  const re = /(<gui\-fragment\s+data\-fragment\-external=\"([A-z0-9\.\-_]+)\"\s+\/>)/g;
  const found = html.match(re) || [];

  found.forEach(function(f) {
    const curr = f.split(re);
    const filename = path.resolve(context, curr[2]);
    const replace = curr[1];
    html = html.replace(replace, fs.readFileSync(filename, 'utf-8'));
  });

  html = replaceStockIcons(html);
  html = html.replace(/\r?\n|\r/g, '').replace(/\s+/g, ' ');

  tmp.file({template: path.join(context, '/tmp-XXXXXXXX.tmp')}, function(err, path, fd, cleanup) {
    if ( err ) {
      callback(err);
    } else {

      fs.write(fd, html, function(err) {
        if ( err ) {
          callback(err);
          cleanup();
          return;
        }

        loadModule('html-loader?' + attrs + '!' + path, function(err, data) {
          cleanup();

          if ( err ) {
            callback(err);
          } else {
            callback(null, data);
          }
        });
      });

    }
  });
};
