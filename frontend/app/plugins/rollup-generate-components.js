import fs from 'fs';
import path from 'path';
import { parse } from 'acorn';
import * as walk from 'acorn-walk';

function extractExportsFromIndex(indexFilePath) {
  const indexfileContent = fs.readFileSync(indexFilePath, 'utf-8');
  const ast = parse(indexfileContent, {
    sourceType: 'module',
    ecmaVersion: 'latest',
  });

  walk.simple(ast, {
    ExportNamedDeclaration(node) {
      console.log(node);
      if (node.declaration && node.declaration.declarations && node.source) {
        node.declaration.declarations.forEach((element) => {
          if (element.id && element.id.name) {
            exportNames.push({
              name: element.id.name,
              path: node.source.value,
            });
          }
        });
      } else if (node.specifiers) {
        node.specifiers.forEach((specifier) => {
          if (specifier.exported && specifier.exported.name) {
            console.log(specifier.exported);
            exportNames.push({
              name: specifier.exported.name,
              path: node.source ? node.source.value : null,
            });
          }
        });
      }
    },
  });

  return exportNames;
}

export function rollupGenerateIndividualPluginFiles() {
  return {
    name: 'rollup-plugin-generate-files',
    buildStart() {
      const indexFilePath = path.resolve(__dirname, 'index.js');
      if (!fs.existsSync(indexFilePath)) {
        this.error(
          `The index.js file should be present in the location ${__dirname}`,
        );
      }
      const exportNames = extractExportsFromIndex(indexFilePath);

      if (!exportNames.length) {
        this.error(`no Exports found in index.js`);
        return;
      }

      exportNames.forEach((exp) => {
        if (fs.existsSync(__dirname, exp.path)) {
          console.log(`compiling ${exp.path} as ${exp.name}`);
          this.emitFile({
            type: 'chunk',
            id: exp.path,
            name: exp.name,
          });
        } else {
          this.warn(
            `File for export ${exp.name} not found in the path : ${exp.path}`,
          );
        }
      });
    },
    outputOptions(outputOptions) {
      return {
        ...outputOptions,
        format: 'cjs',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
      };
    },
    onLog(level, log) {
      this.info(log);
    },
  };
}
