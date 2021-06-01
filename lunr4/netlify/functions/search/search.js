const lunrjs = require('lunr');

const handler = async (event) => {
  try {


    const search = event.queryStringParameters.term;
    if(!search) throw('Missing term query parameter');

    const data = require('./data.json');
    const index = createIndex(data);
    console.log('index made');

    let results = index.search(search);

    results.forEach(r => {
      r.title = data[r.ref].title;
      r.content = truncate(data[r.ref].content, 400);
      r.date = data[r.ref].date;
      delete r.matchData;
      delete r.ref;
    });

    return {
      statusCode: 200,
      body: JSON.stringify(results),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

function createIndex(posts) {
  return lunrjs(function() {
    this.ref('id');
    this.field('title');
    this.field('content');
    this.field('date');

    posts.forEach((p,idx) => {
      p.id = idx;
      this.add(p);
    });
  });
}

function truncate(str, size) {
  //first, remove HTML
  str = str.replace(/<.*?>/g, '');
  if(str.length < size) return str;
  return str.substring(0, size-3) + '...';
}

module.exports = { handler }
