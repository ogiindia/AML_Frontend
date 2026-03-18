import axios from 'axios';
import { API_URL } from '../config';
import packages from '../utilites/packages';

function getParsedModule(code, moduleName, packages) {
  const _this = Object.create(packages);
  function require(name) {
    if (!(name in _this) && moduleName === name) {
      let module = { exports: {} };
      _this[name] = () => module;
      console.log(`Loading Module: ${name}`);
      // eslint-disable-next-line no-new-func
      let wrapper = Function('require, exports, module', code);

      try {
        wrapper(require, module.exports, module);
      } catch (error) {
        console.error(`Error intializing module ${name} : `, error);
        throw new Error(`Failed to load module ${name} : ${error.message}`);
      }
    } else if (!(name in _this)) {
      // eslint-disable-next-line no-throw-literal
      throw `Module '${name}' not found`;
    }
    return _this[name]().exports;
  }

  return require(moduleName);
}

export async function fetchComponent(id) {
  console.log(id);
  try {
    const text = await axios({
      method: 'GET',
      url: `${API_URL}/${id}.js?time=${Date.now()}`,
    }).then((a) => {
      if (!a.status === 200) {
        throw new Error('Network response was not ok');
      }

      const code = a.data;
      return code;
    });
    return { default: getParsedModule(text, id, packages) };
  } catch (error) {
    console.warn(error);
    return {
      default() {
        return <div>Failed to Render</div>;
      },
    };
  }
}

export async function fetchJson(id) {
  try {
    axios({
      method: 'GET',
      url: `${API_URL}/${id}.json?time=${Date.now()}`,
    }).then((a) => {
      if (!a.status === 200) {
        throw new Error('Network response was not ok');
      }
      return a;
    });
  } catch (error) {
    console.warn(error);
    return {
      default() {
        return <div>Failed to download json</div>;
      },
    };
  }
}
