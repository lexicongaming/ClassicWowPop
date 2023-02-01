const d3 = require('d3');

const isValidDate = d => {
  return d instanceof Date && !Number.isNaN(d.getTime());
};

const groupBy = (collection, property) => {
  let val;
  let index;
  const values = [];
  const result = [];
  for (let i = 0; i < collection.length; i += 1) {
    val = collection[i][property];
    index = values.indexOf(val);
    if (index > -1) result[index].push(collection[i]);
    else {
      values.push(val);
      result.push([collection[i]]);
    }
  }
  return result;
};

const mergeDatasets = (xPropName, yPropName, filterDuplicates, ...datasetsParam) => {
  const datasets = datasetsParam.filter(dataset => dataset.length > 0);
  const makeScale = dataset => {
    let domain = dataset.map(obj => new Date(obj[xPropName]));
    /* we meed to add some overhead at the beginning and end to zero
    /* out values that have no real representation in the other datasets */
    const first = [new Date(0), new Date(+domain[0] - 1)];
    let last = new Date(+domain[+domain.length - 1] + 1);
    last = [last, new Date(+last + 1000 * 60 * 60 * 24 * 30)];
    domain = [...first, ...domain, ...last];
    return d3
      .scaleLinear()
      .domain(domain)
      .range([0, 0, ...dataset.map(obj => obj[yPropName]), 0, 0]);
  };
  const sumOtherDataSets = (scales, object, curDataSetIndex) => {
    let sum = object[yPropName];
    scales.forEach((_scale, scaleIndex) => {
      if (curDataSetIndex !== scaleIndex) {
        sum += scales[scaleIndex](new Date(object[xPropName]));
      }
    });
    return sum;
  };

  // make a scale for each dataset
  const scales = datasets.map(dataset => makeScale(dataset));

  /* make an new array where each datapoint is summed with the interpolated 
	/* counterparts from all other datasets */
  let merged = [];
  datasets.forEach((dataset, curDataSetIndex) => {
    const summedDataset = dataset.map(object => {
      const objCopy = { ...object };
      const newVal = sumOtherDataSets(scales, object, curDataSetIndex);
      if (newVal !== objCopy[yPropName]) {
        objCopy.changed = true;
      } else {
        objCopy.changed = false;
      }
      objCopy[yPropName] = newVal;
      return objCopy;
    });
    merged = [].concat(merged, summedDataset);
  });

  // restore the correct order by date
  merged = merged.sort((a, b) => new Date(a[xPropName]) - new Date(b[xPropName]));

  // merge out duplicates that exsist due to the overhead in domain/range
  if (filterDuplicates) {
    merged = merged.filter(merge => merge.changed);
  }

  return merged;
};
module.exports = { groupBy, mergeDatasets, isValidDate };
