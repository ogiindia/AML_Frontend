export const convertToMultiLevelJson = (flattenArray) => {
  const result = {};

  flattenArray.forEach((item) => {
    const { module, grp, ...rest } = item;

    if (!result[module]) {
      result[module] = {};
    }

    if (!result[module][grp]) {
      result[module][grp] = [];
    }

    result[module][grp].push(rest);
  });
  return result;
};

export const convertMenuToMultiLevelJSON = (flattenArray) => {
  const result = {};

  flattenArray.forEach((item) => {
    const { module, menuparentMenuID } = item;

    if (!result[module]) {
      result[module] = {};
    }

    if (!result[module][menuparentMenuID]) {
      result[module][menuparentMenuID] = [];
    }

    result[module][menuparentMenuID].push(item);
  });
  return result;
};
