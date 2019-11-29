---
layout: post
title: "Dynamically Documenting OpenWhisk Packages"
date: "2017-08-25T15:30:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/08/25/dynamically-documenting-openwhisk-packages
---

Earlier this week I was doing some work with the Cloudant package under OpenWhisk when I noticed the [docs](https://console.bluemix.net/docs/openwhisk/openwhisk_cloudant.html#openwhisk_catalog_cloudant) didn't include all the actions available. What I mean is, the docs currently mention the read and write actions, the changes trigger, and nothing else. Compare this to what you get when you run `wsk package get /whisk.system/cloudant --summary`:

<pre><code class="language-javascript">package /whisk.system/cloudant: Cloudant database service
   (parameters: bluemixServiceName, dbname, host, overwrite, password, username)
 action /whisk.system/cloudant/delete-attachment: Delete document attachment from database
   (parameters: attachmentname, dbname, docid, docrev, params)
 action /whisk.system/cloudant/update-attachment: Update document attachment in database
   (parameters: attachment, attachmentname, contenttype, dbname, docid, docrev, params)
 action /whisk.system/cloudant/read-attachment: Read document attachment from database
   (parameters: attachmentname, dbname, docid, params)
 action /whisk.system/cloudant/create-attachment: Create document attachment in database
   (parameters: attachment, attachmentname, contenttype, dbname, docid, docrev, params)
 action /whisk.system/cloudant/read-changes-feed: Read Cloudant database changes feed (non-continuous)
   (parameters: dbname, params)
 action /whisk.system/cloudant/delete-query-index: Delete index from design document
   (parameters: dbname, docid, indexname, params)
 action /whisk.system/cloudant/delete-view: Delete view from design document
   (parameters: dbname, docid, params, viewname)
 action /whisk.system/cloudant/manage-bulk-documents: Create, Update, and Delete documents in bulk
   (parameters: dbname, docs, params)
 action /whisk.system/cloudant/exec-query-view: Call view in design document from database
   (parameters: dbname, docid, params, viewname)
 action /whisk.system/cloudant/exec-query-search: Execute query against Cloudant search
   (parameters: dbname, docid, indexname, search)
 action /whisk.system/cloudant/exec-query-find: Execute query against Cloudant Query index
   (parameters: dbname, query)
 action /whisk.system/cloudant/list-query-indexes: List Cloudant Query indexes from database
   (parameters: dbname)
 action /whisk.system/cloudant/create-query-index: Create a Cloudant Query index into database
   (parameters: dbname, index)
 action /whisk.system/cloudant/list-design-documents: List design documents from database
   (parameters: dbname, includedocs)
 action /whisk.system/cloudant/list-documents: List all docs from database
   (parameters: dbname, params)
 action /whisk.system/cloudant/delete-document: Delete document from database
   (parameters: dbname, docid, docrev)
 action /whisk.system/cloudant/update-document: Update document in database
   (parameters: dbname, doc, params)
 action /whisk.system/cloudant/write: Write document in database
   (parameters: dbname, doc)
 action /whisk.system/cloudant/read-document: Read document from database
   (parameters: dbname, docid, params)
 action /whisk.system/cloudant/read: Read document from database
   (parameters: dbname, id, params)
 action /whisk.system/cloudant/create-document: Create document in database
   (parameters: dbname, doc, params)
 action /whisk.system/cloudant/read-updates-feed: Read updates feed from Cloudant account (non-continuous)
   (parameters: dbname, params)
 action /whisk.system/cloudant/list-all-databases: List all Cloudant databases
 action /whisk.system/cloudant/delete-database: Delete Cloudant database
   (parameters: dbname)
 action /whisk.system/cloudant/read-database: Read Cloudant database
   (parameters: dbname)
 action /whisk.system/cloudant/create-database: Create Cloudant database
   (parameters: dbname)
 feed   /whisk.system/cloudant/changes: Database change feed
   (parameters: dbname, filter, query_params)
</code></pre>

Normally this is the type of thing I'd trim, but I wanted to keep it all there so you can see the large set of other actions supported by the package as well. (There's already an [open bug](https://github.com/apache/incubator-openwhisk-package-cloudant/issues/102) about this package.) 

One of the cool features of OpenWhisk is that it supports [annotations](https://console.bluemix.net/docs/openwhisk/openwhisk_annotations.html#annotations-on-openwhisk-assets). You can apply metadata to actions, triggers, rules, and packages. That means it's possible to get information about packages, if the creator set up that metadata of course. Even without additional metadata, you can get information about what's inside a package and at least use that as a base to create documentation from. When annotations exist, you can then add them to the result for better output.

With that in mind, I built a little command line utility called "packagedoc". Here is the script - it isn't necessarily a work of art:

<pre><code class="language-javascript">const openwhisk = require(&#x27;openwhisk&#x27;);
const handlebars = require(&#x27;handlebars&#x27;);
const fs = require(&#x27;fs&#x27;);

if(process.argv.length === 2) {
	console.log(&#x27;Usage: generate &lt;&lt;package&gt;&gt; &lt;&lt;outputfile&gt;&gt; (outputfile defaults to output.html&#x27;);
	process.exit(1);
}
let package = process.argv[2];

let output=&#x27;.&#x2F;output.html&#x27;;

if(process.argv.length === 4) output = process.argv[3];

console.log(&#x27;Attempt to generate docs for &#x27;+package);

const api_key = process.env[&#x27;__OW_API_KEY&#x27;];
let options = {% raw %}{apihost: &#x27;openwhisk.ng.bluemix.net&#x27;, api_key: api_key}{% endraw %};
let ow = openwhisk(options);

ow.packages.get(package).then(result =&gt; {
	let html = generateHTML(result, package);
	fs.writeFileSync(output, html);
	
	console.log(&#x27;Output written to &#x27;+output);
}).catch(err =&gt; {
	if(err.statusCode === 401) {
		console.error(&#x27;Invalid API Key used.&#x27;);
		process.exit(1);
	} else if(err.statusCode === 403) {
		console.error(&#x27;Invalid package, or one you do not have access to.&#x27;);
		process.exit();
	}
	console.log(&#x27;Unhandled Error:&#x27;, err);
});

function generateHTML(package, name) {
	let templateSource = fs.readFileSync(&#x27;.&#x2F;template.html&#x27;,&#x27;utf-8&#x27;);
	let template = handlebars.compile(templateSource);

	let s = &#x27;&#x27;;

	&#x2F;*
	Do a bit of normalization.
	*&#x2F;
	package.description = &#x27;&#x27;;
	package.annotations.forEach((anno) =&gt; {
		if(anno.key === &#x27;description&#x27;) {
			package.description = anno.value;
		}
		if(anno.key === &#x27;parameters&#x27;) {
			&#x2F;*
			So the main package ob&#x27;s parameters is names+values(defaults), this is possible more descriptive
			so we use this to enhance the main params.
			Note - there is also a case where a annotation parameter isn&#x27;t in the main list. I noticed
			wsk package get x --summary *would* include the annotation so we&#x27;ll copy it over.
			*&#x2F;
			anno.value.forEach((param) =&gt; {
				&#x2F;&#x2F;attempt to find existing
				let found = package.parameters.findIndex((origparam) =&gt; origparam.key === param.name);
				if(found === -1) {
					let newParam = {
						key:param.name,
						value:&#x27;&#x27;
					}
					package.parameters.push(newParam);
					found = package.parameters.length-1;
				}
				&#x2F;&#x2F;copy over description, required, type. Not bindtime
				if(param.description) package.parameters[found].description = param.description;
				if(param.type) package.parameters[found].type = param.type;
				if(param.required) package.parameters[found].required = param.required;
			});
		}
	});

	&#x2F;&#x2F;work on actions
	package.actions.sort((a, b) =&gt; {
		if(a.name &lt; b.name) return -1;
		if(a.name &gt; b.name) return 1;
		return 0;
	});
	package.actions.forEach((action) =&gt; {
		action.annotations.forEach((anno) =&gt; {
			if(anno.key === &#x27;description&#x27;) action.description = anno.value;
			if(anno.key === &#x27;parameters&#x27;) action.parameters = anno.value;
			if(anno.key === &#x27;sampleInput&#x27;) action.sampleInput = JSON.stringify(anno.value, null, &#x27;\t&#x27;);
			if(anno.key === &#x27;sampleOutput&#x27;) action.sampleOutput = JSON.stringify(anno.value, null, &#x27;\t&#x27;);
		});
	});

	&#x2F;&#x2F;feeds *seems* to be the exact same as actions, I&#x27;m copying and pasting for now, but may later make it one thing
	package.feeds.sort((a, b) =&gt; {
		if(a.name &lt; b.name) return -1;
		if(a.name &gt; b.name) return 1;
		return 0;
	});
	package.feeds.forEach((feed) =&gt; {
		feed.annotations.forEach((anno) =&gt; {
			if(anno.key === &#x27;description&#x27;) feed.description = anno.value;
			if(anno.key === &#x27;parameters&#x27;) feed.parameters = anno.value;
			if(anno.key === &#x27;sampleInput&#x27;) feed.sampleInput = JSON.stringify(anno.value, null, &#x27;\t&#x27;);
			if(anno.key === &#x27;sampleOutput&#x27;) feed.sampleOutput = JSON.stringify(anno.value, null, &#x27;\t&#x27;);
		});
	});

	return template({% raw %}{package:package, name:name}{% endraw %}); 
}
</code></pre>

The script makes use of the [OpenWhisk npm package](https://www.npmjs.com/package/openwhisk) to integrate with the OpenWhisk system and fetch details on a package. Note you'll need to store your API key in an environment variable called `__OW_API_KEY`. 

After fetching the information, which is a large JSON packet, I do a bit of normalization to the data and then pass it to a Handlebars template for rendering. Basic usage looks like this:

	node generate.js /whisk.system/cloudant output/cloudant.html

Here is an example of the output: https://cfjedimaster.github.io/Serverless-Examples/packagedoc/samples/cloudant.html

I used Bootstrap for the template and applied what I thought made sense in terms of display, ordering, etc. (For the life of me I'll never get why alpha sort seems to rarely be a default.) 

If you want to check it out, you can get the bits from here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/packagedoc

You'll also see a `samples` folder with a few outputs from some of the OpenWhisk packages. What do you think - useful?