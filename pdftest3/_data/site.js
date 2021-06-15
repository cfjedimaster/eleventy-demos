

module.exports = async function() {

	let url = 'http://localhost:3000';

	if(process.env.VERCEL_ENV && process.env.VERCEL_ENV === 'production') url = 'https://pdftest3.vercel.app'
	//my localhost key
	let pdfkey = process.env.PDF_KEY?process.env.PDF_KEY:'ec60043db7874f40a39da3770b189eab'

	return {
		url,
		pdfkey
	}
};