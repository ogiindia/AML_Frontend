import { EnumType } from './EnumType';
import { VariableType } from './VariableType';

export const configFields = [
  '__args',
  '__alias',
  '__fields',
  '__aliasFor',
  '__variables',
  '__directives',
  '__on',
  '__all_on',
  '__typeName',
  '__name',
];

function stringify(obj_from_json) {
  if (obj_from_json instanceof EnumType) {
    return obj_from_json.value;
  }



  // variables should be prefixed with dollar sign and not quoted
  else if (obj_from_json instanceof VariableType) {
    return `$${obj_from_json.value}`;
  }
  // Cheers to Derek: https://stackoverflow.com/questions/11233498/json-stringify-without-quotes-on-properties
  else if (typeof obj_from_json === "string") return `"${obj_from_json}"`;
  else if (typeof obj_from_json !== 'object' || obj_from_json === null) {
    // not an object, stringify using native function
    return JSON.stringify(obj_from_json).replaceAll('"', '');
  } else if (Array.isArray(obj_from_json)) {
    return `[${obj_from_json.map((item) => stringify(item)).join(', ')}]`;
  }
  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.

  const props = Object.keys(obj_from_json)
    .map(
      (key) =>
        `${key}: ${stringify(obj_from_json[key] === true ? `$${key}` : obj_from_json[key])}`,
    )
    .join(', ');

  return `{${props}}`;
}

function buildArgsv2(argsObj) {
  if (Array.isArray(argsObj)) {
    const args = [];
    for (const argName in argsObj) {
      args.push(buildArgs(argsObj[argName]));
    }
    return args.join(', ');
  } else {
    return buildArgs(argsObj);
  }
}

function buildArgs(argsObj) {

  const args = [];
  for (const argName in argsObj) {
    args.push(`${argName}: ${stringify(argsObj[argName] === true ? `$${argName}` : argsObj[argName])}`);
  }
  return args.join(', ');
}

function buildVariables(varsObj) {
  const args = [];
  for (const varName in varsObj) {
    args.push(`$${varName}: ${varsObj[varName]}`);
  }
  return args.join(', ');
}

function buildVariablesFromArray(varsObj) {
  const args = [];
  if (Array.isArray(varsObj)) {
    for (const varObj in varsObj) {
      args.push(buildVariables(varsObj[varObj]));
    }
  }

  return args.join(', ');
}

function buildDirectives(dirsObj) {
  const directiveName = Object.keys(dirsObj)[0];
  const directiveValue = dirsObj[directiveName];
  if (
    typeof directiveValue === 'boolean' ||
    (typeof directiveValue === 'object' &&
      Object.keys(directiveValue).length === 0)
  ) {
    return directiveName;
  } else if (typeof directiveValue === 'object') {
    const args = [];
    for (const argName in directiveValue) {
      const argVal = stringify(directiveValue[argName]).replace(/"/g, '');
      args.push(`${argName}: ${argVal}`);
    }
    return `${directiveName}(${args.join(', ')})`;
  } else {
    throw new Error(
      `Unsupported type for directive: ${typeof directiveValue}. Types allowed: object, boolean.\n` +
      `Offending object: ${JSON.stringify(dirsObj)}`,
    );
  }
}

function getIndent(level) {
  return Array(level * 4 + 1).join(' ');
}

function filterNonConfigFields(fieldName, ignoreFields) {
  // Returns true if fieldName is not a 'configField'.
  return (
    configFields.indexOf(fieldName) == -1 &&
    ignoreFields.indexOf(fieldName) == -1
  );
}

function convertQuery(node, level, output, options) {
  Object.keys(node)
    .filter((key) => filterNonConfigFields(key, options.ignoreFields))
    .forEach((key) => {

      let value = node[key];
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          let tvalue = value.find((item) => item && typeof item === 'object');
          if (!tvalue) {
            if (value) {
              value = value.reduce((v, i) => {
                v[i] = true;
                return v;
              }, {});
            }
          } else {
            value = tvalue;
          }
          if (!value) {
            output.push([`${key}`, level]);
            return;
          }
        }

        // Check if the object would be empty
        if (
          value &&
          Object.keys(value).filter(
            (k) => value[k] !== false || options.includeFalsyKeys,
          ).length === 0
        ) {
          // If so, we don't include it into the query
          return;
        }

        const fieldCount = Object.keys(value).filter((keyCount) =>
          filterNonConfigFields(keyCount, options.ignoreFields),
        ).length;
        const subFields = fieldCount > 0;
        const fieldsExist =
          typeof value.__fields === 'object' && value.__fields.length > 0;
        const argsExist =
          typeof value.__args === 'object' &&
          Object.keys(value.__args).length > 0;
        const directivesExist = typeof value.__directives === 'object';
        const fullFragmentsExist = value.__all_on instanceof Array;
        const partialFragmentsExist = typeof value.__on === 'object';

        let token = `${key}`;
        if (typeof value.__name === 'string') {
          token = `${token} ${value.__name}`;
        }

        if (typeof value.__aliasFor === 'string') {
          token = `${token}: ${value.__aliasFor}`;
        }

        if (
          typeof value.__variables === 'object' &&
          !Array.isArray(value.__variables) &&
          Object.keys(value.__variables).length > 0
        ) {
          token = `${token} (${buildVariables(value.__variables)})`;
        } else if (
          Array.isArray(value.__variables) &&
          value.__variables.length > 0
        ) {
          token = `${token} (${buildVariablesFromArray(value.__variables)})`;
        } else if (argsExist || directivesExist) {
          let argsStr = '';
          let dirsStr = '';
          if (directivesExist) {
            dirsStr = Object.entries(value.__directives)
              .map((item) => `@${buildDirectives({ [item[0]]: item[1] })}`)
              .join(' ');
          }
          if (argsExist) {
            argsStr = `(${buildArgsv2(value.__args)})`;
          }
          const spacer = directivesExist && argsExist ? ' ' : '';
          token = `${token} ${argsStr}${spacer}${dirsStr}`;
        }

        output.push([
          token +
          (subFields || partialFragmentsExist || fullFragmentsExist
            ? ' {'
            : ''),
          level,
        ]);

        convertQuery(value, level + 1, output, options);

        if (fieldsExist) {
          value.__fields.forEach((field) => {
            output.push([`${field}`, level + 1]);
          });
        }

        if (fullFragmentsExist) {
          value.__all_on.forEach((fullFragment) => {
            output.push([`...${fullFragment}`, level + 1]);
          });
        }
        if (partialFragmentsExist) {
          const inlineFragments =
            value.__on instanceof Array ? value.__on : [value.__on];
          inlineFragments.forEach((inlineFragment) => {
            const name = inlineFragment.__typeName;
            output.push([`... on ${name} {`, level + 1]);
            convertQuery(inlineFragment, level + 2, output, options);
            output.push(['}', level + 1]);
          });
        }

        if (subFields || partialFragmentsExist || fullFragmentsExist) {
          output.push(['}', level]);
        }
      } else if (options.includeFalsyKeys === true || value) {
        if (typeof value === 'string') {
          output.push([`${key} : ${value}`, level]);
        } else {
          output.push([`${key}`, level]);
        }
      }
    });
}

export function jsonToGraphQLQuery(query, options = {}) {
  if (!query || typeof query != 'object') {
    throw new Error('query object not specified');
  }
  if (Object.keys(query).length == 0) {
    throw new Error('query object has no data');
  }
  if (!(options.ignoreFields instanceof Array)) {
    options.ignoreFields = [];
  }

  let queryLines = [];
  convertQuery(query, 0, queryLines, options);

  queryLines = dropEmptyObjects(queryLines);

  let output = '';
  queryLines.forEach(([line, level]) => {
    if (options.pretty) {
      if (output) {
        output += '\n';
      }
      output += getIndent(level) + line;
    } else {
      if (output) {
        output += ' ';
      }
      output += line;
    }
  });
  return output;
}

function dropEmptyObjects(inputList) {
  const rootContext = {
    indent: -1,
    text: null,
    isEmpty: true,
    contents: [],
  };

  const stack = [rootContext];

  for (let [text, indent] of inputList) {
    text = text.trim();
    if (text.endsWith('{')) {
      const context = {
        indent: indent,
        text: text,
        isEmpty: true,
        contents: [],
      };
      stack[stack.length - 1].contents.push(context);
      stack.push(context);
    } else if (text === '}') {
      const context = stack.pop();
      if (context.isEmpty) {
        // Remove the context from its parent's contents
        stack[stack.length - 1].contents.pop();
      } else {
        // Mark the parent as not empty
        stack[stack.length - 1].isEmpty = false;
      }
    } else {
      // It's a field, add it to the current context
      stack[stack.length - 1].contents.push(text);
      stack[stack.length - 1].isEmpty = false;
    }
  }

  const output = [];

  function traverse(context) {
    for (const item of context.contents) {
      if (typeof item === 'object') {
        // It's a context
        output.push([item.text, item.indent]);
        traverse(item);
        output.push(['}', item.indent]);
      } else {
        // It's a field (string)
        output.push([item, context.indent + 1]);
      }
    }
  }

  traverse(rootContext);
  return output;
}
