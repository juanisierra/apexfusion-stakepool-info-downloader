import https from 'https';
import { mkConfig, generateCsv, asString } from "export-to-csv";
import { writeFile } from "node:fs";
import { Buffer } from "node:buffer";

const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: 'export.csv' });


const getSPOsfromAPI = () => {
    const options = {
        hostname: 'beta-explorer-api.prime.testnet.apexfusion.org',
        path: '/api/v1/delegations/pool-list?page=0&size=50&sort=&search=&isShowRetired=false',
        method: 'GET',
      };
    
    https.get( options, res => {
      let data = [];
      const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
      console.log('Status Code:', res.statusCode);
      console.log('Date in Response header:', headerDate);
    
      res.on('data', d => {
        data.push(d);
      });
      res.on('end', () => {
        console.log('Response ended: ');
    
        const responseData = JSON.parse(Buffer.concat(data).toString());
        // Converts your Array<Object> to a CsvOutput string based on the configs
        const csv = generateCsv(csvConfig)(responseData['data']);
        const filename = `${csvConfig.filename}.csv`;
        const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

        // Write the csv file to disk
        writeFile(filename, csvBuffer, (err) => {
        if (err) throw err;
        console.log("file saved: ", filename);
        });

        // for(spo of responseData['data']) {
        // //   console.log(`Got spo with id: ${spo.id}, poolId: ${spo.poolId}, name: ${spo.poolName}, tickerName: ${spo.tickerName}`);
        // }
      })
    }).on('error', err => {
      console.log('Error: ', err.message);
    });
}

getSPOsfromAPI();