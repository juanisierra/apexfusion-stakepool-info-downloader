#!/usr/bin/env node

const https = require('https');

https.get('https://beta-explorer-api.prime.testnet.apexfusion.org/api/v1/delegations/pool-list?page=0&size=50&sort=&search=&isShowRetired=false', res => {
  let data = [];
  const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
  console.log('Status Code:', res.statusCode);
  console.log('Date in Response header:', headerDate);

  res.on('data', d => {
    console.log(d);
    data.push(d);
  });
  res.on('end', () => {
    console.log('Response ended: ');

    const responseData = JSON.parse(Buffer.concat(data).toString());

    for(spo of responseData['data']) {
      console.log(`Got spo with id: ${spo.id}, poolId: ${spo.poolId}, name: ${spo.poolName}, tickerName: ${spo.tickerName}`);
    }
  });
}).on('error', err => {
  console.log('Error: ', err.message);
});
