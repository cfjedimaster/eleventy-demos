

module.exports = async function() {

	let url = 'http://localhost:8080';

	if(process.env.VERCEL_ENV && process.env.VERCEL_ENV === 'production') url = 'https://pdftest.vercel.app'
	//my localhost key
	let pdfkey = process.env.PDF_KEY?process.env.PDF_KEY:'9861538238544ff39d37c6841344b78d'

	return {
		url,
		pdfkey
	}
};