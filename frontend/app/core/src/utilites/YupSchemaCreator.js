import * as yup from 'yup';

export function createYupSchema(schema, config) {
  const { name, validationType, validations = [] } = config;
  if (!yup[validationType]) {
    return schema;
  }
  let validator = yup[validationType]();
  validations.forEach((validation) => {
    const { params, type } = validation;

    if (type === 'passwordMatch') {
      const [fieldToMatch, errorMessage] = params;
      validator = validator.test({
        name: 'passwordMatch',
        message: errorMessage,
        exclusive: false,
        test: function (value) {
          const otherFieldValue = this.resolve(yup.ref(fieldToMatch));

          const isMatch = !otherFieldValue || value === otherFieldValue;
          return isMatch;
        },
      });
    } else if (validator[type]) {
      validator = validator[type](...params);
    } else {
      //!validator[type]
      return;
    }
  });
  schema[name] = validator;
  return schema;
}
