const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const luaToJson = require('lua-to-json');
const cachegoose = require('cachegoose');
const processor = require('./process');

module.exports = (uploadPath, cb) => {
  const currentAddonVersion = '0.9.11';
  const validVersions = [currentAddonVersion, '0.9.4', '0.9.5', '0.9.6', '0.9.7', '0.9.8', '0.9.9', '0.9.10'];
  let data;

  // read uploaded file
  try {
    data = fs.readFileSync(uploadPath, { encoding: 'UTF-8' });
  } catch (error) {
    return cb({ status: 500, message: 'Internal file system error', trace: error });
  }

  // write backup to fs
  const filename = +new Date();
  const storagePath = process.env.STORAGE_PATH || '/home/wowclas/storage/';
  const jsonPath = path.join(storagePath, `${filename}.zip`);
  const zip = new JSZip();
  try {
    zip.file(`${filename}.lua`, data);
    zip
      .generateNodeStream({
        type: 'nodebuffer',
        streamFiles: true,
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9
        }
      })
      .pipe(fs.createWriteStream(jsonPath));
  } catch (error) {
    return cb({ status: 400, message: 'Upload Error', trace: error });
  }
  // parse lua table to a json
  let censusDb;
  try {
    censusDb = luaToJson(data).CensusPlus_Database;
  } catch (error) {
    return cb({ status: 400, message: 'Parse error - Unknown file format', trace: error });
  }

  console.log(`Log uploaded: v${censusDb.Info.LogVer}`);

  if (!validVersions.includes(censusDb.Info.LogVer)) {
    const emptyStats = {
      charStats: {
        processed: 0,
        inserted: 0,
        updated: 0
      },
      timeStats: {
        inserted: 0
      },
      updateDialog: currentAddonVersion
    };

    return cb(null, emptyStats);
  }

  // process the uploaded data
  processor.censusData(censusDb, (error, stats) => {
    if (error) return cb(error);
    if (stats) {
      const retStats = { ...stats };
      retStats.updateDialog = false;
      if (
        stats.charStats.inserted !== 0 ||
        stats.charStats.inserted !== 0 ||
        stats.timeStats.inserted !== 0
      ) {
        cachegoose.clearCache(null);
      }
      return cb(null, retStats);
    }
    return undefined;
  });

  return undefined;
};
