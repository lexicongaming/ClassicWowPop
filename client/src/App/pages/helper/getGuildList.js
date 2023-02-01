const selectMapper = data => {
    return data.map(element => ({
      value: String(element)
        .toLowerCase()
        .replace(/\s/g, '_'),
      label: element,
      labelClean: element.match(/([a-zA-Z]+( [a-zA-Z]+)+)/)[1]
    }));
  };
  
  export default function getGuildList(cb) {
    window
      .fetch(`api/list/guilds`)
      .then(res => res.json())
      .then(realmList => {
        const realms = selectMapper(realmList.realms);
        const guilds = selectMapper(realmList.guilds);
        const factions = selectMapper(realmList.factions);
        cb(realms, guilds, factions);
      });
  }