
const faunadb = require('faunadb'),
  q = faunadb.query;

module.exports = async function() {
	const client = new faunadb.Client({ secret: process.env.FAUNADB })

	let productObs = await client.query(
		q.Map(
			q.Paginate(q.Documents(q.Collection('products'))),
			q.Lambda(x => q.Get(x))
		)
	);
	let data = productObs.data.map(po => {
		return po.data;
	});
	console.log(data.length + ' products loaded from Fauna');
	return data;

}