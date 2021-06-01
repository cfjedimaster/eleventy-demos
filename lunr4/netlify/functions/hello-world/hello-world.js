const fs = require('fs');

const handler = async (event) => {
  try {

    let test = '';
    if(fs.existsSync('./data.json')) {
      test = true;
    } else {
      test = false;
    }

    console.log('testing', fs.existsSync('./data.json'));

    let test2 = require('./data.json');
    console.log('test2', test2);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello test: ${test2.name}` }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
