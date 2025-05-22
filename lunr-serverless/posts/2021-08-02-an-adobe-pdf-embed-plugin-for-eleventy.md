---
layout: post
title: "An Adobe PDF Embed Plugin for Eleventy"
date: "2021-08-02T18:00:00"
categories: ["javascript","static sites"]
tags: "post"
description: Eleventy users can now add a PDF Embed plugin to their sites
---

I've covered in the past how to use the [Adobe PDF Embed API](https://www.adobe.io/apis/documentcloud/dcsdk/pdf-embed.html) with Eleventy (["Using PDFs with the Jamstack"](https://www.raymondcamden.com/2021/02/25/using-pdfs-with-the-jamstack)). While the Embed API is relatively simple to add to a page, I thought it would be kind of fun to build an Eleventy plugin to make it simpler. Last week, I released it: <https://www.npmjs.com/package/eleventy-plugin-pdfembed>.

To use it, first add the plugin via npm to your Eleventy project:

```
npm i eleventy-plugin-pdfembed
```

Then, in your `.eleventy.js` file, require it and add it:

```js
const pluginPDFEmbed = require('eleventy-plugin-pdfembed');

module.exports = (eleventyConfig) => {

	// more stuff here

	eleventyConfig.addPlugin(pluginPDFEmbed, {
		key: '<YOUR CREDENTIAL KEY>'
	});

}
```

To use it you'll need to get your [credentials](https://www.adobe.com/go/dcsdks_credentials) first, which are free. Also keep in mind that your credentials are host based, so most likely you'll want to use an environment variable for it.

Once done, you can then use the shortcode. It takes an argument for the URL at minimum, but you can also specify the viewing mode. Here's a simple example:

```
{% raw %}{% pdfembed 'https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf' %}{% endraw %}
```

The plugin takes a second argument for viewing mode which is best demonstrated at our [online demo](https://www.adobe.com/go/pdfEmbedAPI_demo). Finally, a third argument lets you rename the default ID value used for the div that renders the PDF. This defaults to `adobe-pdf-view` if you want to tweak the size via CSS.

Anyway, let me know if this helps!