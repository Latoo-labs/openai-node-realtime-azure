const pkgJson = require(process.env['PKG_JSON_PATH'] || '../../package.json');

function processExportMap(m) {
  for (const key in m) {
    const value = m[key];
    if (typeof value === 'string') m[key] = value.replace(/^\.\/dist\//, './');
    else processExportMap(value);
  }
}
processExportMap(pkgJson.exports);

// Process typesVersions field
if (pkgJson.typesVersions) {
  for (const version in pkgJson.typesVersions) {
    for (const key in pkgJson.typesVersions[version]) {
      const paths = pkgJson.typesVersions[version][key];
      if (Array.isArray(paths)) {
        pkgJson.typesVersions[version][key] = paths.map((path) => path.replace(/^dist\//, './'));
      }
    }
  }
}

for (const key of ['types', 'main', 'module']) {
  if (typeof pkgJson[key] === 'string') pkgJson[key] = pkgJson[key].replace(/^(\.\/)?dist\//, './');
}

delete pkgJson.devDependencies;
delete pkgJson.scripts.prepack;
delete pkgJson.scripts.prepublishOnly;
delete pkgJson.scripts.prepare;

console.log(JSON.stringify(pkgJson, null, 2));
