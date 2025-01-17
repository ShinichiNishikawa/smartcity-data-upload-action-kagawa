const Papa = require('papaparse');

const csvToGeoJSON = async (csvString) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const latHeaders = ['緯度', 'lat', 'latitude', 'Lat', 'Latitude', 'LAT', 'LATITUDE'];
        const lonHeaders = ['経度', 'lon', 'lng', 'longitude', 'Lon', 'Lng', 'Longitude', 'LON', 'LNG', 'LONGITUDE'];

        let latField, lonField;

        const headers = results.meta.fields;

        // 緯度・経度のヘッダー名を判定
        for (const field of headers) {

          if (typeof latField === 'undefined' && latHeaders.includes(field)) {
            latField = field;
          }
          if (typeof lonField === 'undefined' && lonHeaders.includes(field)) {
            lonField = field;
          }
        }

        if (!latField || !lonField) {
          console.log("緯度または経度の列が見つかりません。");
          resolve(false);
        }

        // GeoJSONオブジェクトを作成
        const geoJson = {
          type: "FeatureCollection",
          features: results.data.map(record => {
            const latValue = parseFloat(record[latField]);
            const lonValue = parseFloat(record[lonField]);

            if (isNaN(latValue) || isNaN(lonValue)) {
              return null;
            }

            // recordから緯度・経度のフィールドを削除
            delete record[latField];
            delete record[lonField];

            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [lonValue, latValue]
              },
              properties: record
            };
          }).filter(feature => feature !== null)
        };

        //geojson の features が空の場合はエラー
        if (geoJson.features.length === 0) {
          console.log("緯度・経度の列に数値以外の値が含まれているか、データが空です。");
          resolve(false);
        }

        resolve(geoJson);
      },
      error: (err) => {
        reject(err);
      }
    });
  });
}

module.exports = csvToGeoJSON;
