require('dotenv').config();
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const IMG_DIR = './photos';

module.exports = async () => {

	let photos = [];

    const cloudinary_options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

	let files = fs.readdirSync(IMG_DIR);
	console.log(`Processing images, ${files.length} total`);
	for(let i=0; i<files.length; i++) {
		let file = IMG_DIR + '/' + files[i];

		// Should try/catch this.
		const result = await cloudinary.uploader.upload(file, cloudinary_options);
		//console.log(result);
		
		let newPhoto = {
			id: result.public_id,
			thumb:getThumb(result), 
			web:getWeb(result)
		}

		photos.push(newPhoto);

	};

	return photos;

}

const getThumb = (img) => {
	return cloudinary.image(img.public_id, { width: "200", height: "200", crop: "fit" });
};

const getWeb = (img) => {
	//return cloudinary.image(img.public_id, { width: "500" });
	return cloudinary.image(img.public_id, { 
		width: "500", 
		transformation: [
			{overlay: {font_family: "Arial", font_size: 80, text: "Copyright Raymond Camden" }},
			{flags: "layer_apply"} 
		]
	});
};