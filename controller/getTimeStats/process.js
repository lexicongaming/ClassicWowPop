const { mergeDatasets, groupBy } = require('./helper');

const makeFactionStats = processData => {
  let data = processData.sort((a, b) => new Date(a.date) - new Date(b.date));
  data = groupBy(data, 'realm');

  let hordeData = [];
  let allianceData = [];

  if (data.length === 1) {
    hordeData = data[0].filter(o => o.faction === 'Horde');
    allianceData = data[0].filter(o => o.faction === 'Alliance');
  } else if (data.length > 1) {
    hordeData = mergeDatasets(
      'date',
      'onlineTotal',
      false,
      ...data.map(arr => arr.filter(o => o.faction === 'Horde'))
    );
    allianceData = mergeDatasets(
      'date',
      'onlineTotal',
      false,
      ...data.map(arr => arr.filter(o => o.faction === 'Alliance'))
    );
  }

  let overallData = mergeDatasets('date', 'onlineTotal', true, hordeData, allianceData);

  const propFilter = (el, label) => ({
    date: el.date,
    onlineTotal: el.onlineTotal,
    label,
    name: label.toLowerCase()
  });
  hordeData = hordeData.map(el => propFilter(el, 'Horde'));
  allianceData = allianceData.map(el => propFilter(el, 'Alliance'));
  overallData = overallData.map(el => propFilter(el, 'Total'));

  return [hordeData, allianceData, overallData].filter(el => el.length > 0);
};

module.exports = {
  makeFactionStats
};
