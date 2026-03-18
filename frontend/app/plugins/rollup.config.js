import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import * as acron from 'acorn';
import jsx from 'acorn-jsx';
import { builtinModules } from 'module';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const fs = require('fs');
const path = require('path');

const pkg = JSON.parse(
  require('fs').readFileSync(
    require('path').resolve('./package.json'),
    'utf-8',
  ),
);

const external = Object.keys(pkg.dependencies || {});

const pluginDir = path.join(__dirname, 'plugins');

const allComponents = fs.readdirSync(pluginDir, { withFileTypes: true });

const removeExtension = (filename) => {
  var lastDotPosition = filename.lastIndexOf('.');
  if (lastDotPosition === -1) return filename;
  else return filename.substr(0, lastDotPosition);
};

const hasDefaultExports = (filePath) => {
  const code = fs.readFileSync(filePath, 'utf-8');
  try {
    const ast = acron.Parser.extend(jsx()).parse(code, {
      sourceType: 'module',
      ecmaVersion: 'latest',
    });
    let defaultExports = false;
    let hasNamedExports = false;

    ast.body.forEach((node) => {
      if (node.type === 'ExportDefaultDeclaration') {
        defaultExports = true;
      } else if (
        node.type === 'ExportNamedDeclaration' ||
        node.type === 'ExportAllDeclaration'
      ) {
        hasNamedExports = true;
      }
    });

    return defaultExports && !hasNamedExports;
  } catch (err) {
    console.error(`Error Parsing the file ${filePath}`, err);
    return false;
  }
};

const getFileNameFromPath = (fp) => {
  let relativePath = removeExtension(fp).replace(`${pluginDir}`, '');

  //  relativePath = relativePath.charAt(0) == "/" && relativePath.substring(1);

  return relativePath.split(/[\\/]/).join('-').replace(/^-/, '').toLowerCase();
};

// const allFiles = allComponents
//   .filter((a) => `./plugins/${a}`)
//   .map((a) => {
//     //supports only one sublevel and the entry file in the subfolder should be index.js
//     // convert the dest file to smallcase to make it url-sensitive
//     if (a.isDirectory()) {
//       console.log(a);
//       return {
//         name: a.name.toLowerCase(),
//         file: `${a.path}/${a.name}/index.js`,
//       };
//     } else if (a.name.endsWith(".js")) {
//       return {
//         name: removeExtension(a.name.toLowerCase()),
//         file: `${a.path}/${a.name}`,
//       };
//     } else {
//       return null;
//     }
//   });

const readDirectory = (dirPath) => {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  items.forEach((item) => {
    const fullPath = path.join(dirPath, item.name);
    if (item.isDirectory()) {
      files.push(...readDirectory(fullPath));
    } else if (item.isFile() && item.name.endsWith('.js')) {
      if (hasDefaultExports(fullPath)) {
        files.push({
          name: getFileNameFromPath(fullPath),
          file: fullPath,
        });
      }
    }
  });
  return files;
};

const allFiles = readDirectory(pluginDir);

const externalDeps = [
  ...Object.keys(pkg.dependencies || {}),
  //  ...Object.keys(pkg.peerDependencies || {}),
  ...builtinModules,
];

const getConfig = ({ name, file }) => {
  return {
    input: file,
    output: [
      {
        format: 'cjs',
        exports: 'auto',
        file: `dist/${name}.js`,
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        sourcemap: false,
      },
    ],
    plugins: [
      resolve(),
      babel(),
      commonjs(),
      postcss({ extensions: ['.css'] }),
      terser(),
      json({
        compact: true,
      }),
    ],
    external: (id) => {
      if (id.startsWith('.') || path.isAbsolute(id)) {
        return false;
      }

      //      return externalDeps.some((dep) => id === dep ||id.startsWith(`${dep}/`))
      return !externalDeps.includes(id) && !id.startsWith('.');
    },
  };
};

export default allFiles.map(getConfig);
