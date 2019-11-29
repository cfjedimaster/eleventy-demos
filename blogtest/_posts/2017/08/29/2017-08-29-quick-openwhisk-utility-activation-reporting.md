---
layout: post
title: "Quick OpenWhisk Utility - Activation Reporting"
date: "2017-08-29T10:23:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/08/29/quick-openwhisk-utility-activation-reporting
---

I've already written a few things to help me get access to my reporting data (for example, see [My Own OpenWhisk Stat Tool](https://www.raymondcamden.com/2017/05/15/my-own-openwhisk-stat-tool/)) and while debugging something today I ran into an issue with how the `wsk` CLI reports activations. Currently it just shows a name and ID. Consider this input: `wsk activation list dotweet`. 

![Activation list](https://static.raymondcamden.com/images/2017/8/activations8291.jpg)

To get details about the activation, you then need to copy the ID and get details for just that particular activation. There is already an open enhancement request for making this report a bit deeper, but in the meantime, I've wrote a quick utility I could run to get more information. Here is an example of the output:

![Activation list enterprise style](https://static.raymondcamden.com/images/2017/8/activations8292.jpg)

All I did was use the OpenWhisk npm package to fetch details and then add them to the result. I didn't build this as a "real" CLI, but I can run `./utils/activations.js` for a default dump matching the `wsk` command line or supply a name and limit (currently you can't do a limit without a name) like so: `./utils/activation.js dotweet 50`. 

The code is rather simple:

<pre><code class="language-javascript">#!&#x2F;usr&#x2F;bin&#x2F;env node

&#x2F;&#x2F; 2 args supported, either pass &lt;&lt;name&gt;&gt; or &lt;&lt;name&gt; &lt;&lt;limit&gt;&gt;. Limit defaults to 30.

const openwhisk = require(&#x27;openwhisk&#x27;);
const chalk = require(&#x27;chalk&#x27;);

const api_key = process.env[&#x27;__OW_API_KEY&#x27;];
if(!api_key) {
	console.error(&#x27;Environment variable __OW_API_KEY not present.&#x27;);
	process.exit();
}

let options = {% raw %}{apihost: &#x27;openwhisk.ng.bluemix.net&#x27;, api_key: api_key}{% endraw %};
let ow = openwhisk(options);

let activationOptions = {
	docs:true,
	limit:30
}

if(process.argv.length &gt;= 3) activationOptions.name = process.argv[2];
if(process.argv.length &gt;= 4) activationOptions.limit = process.argv[3];

console.log(&#x27;ID&#x27;.padEnd(32)+&#x27; &#x27;+&#x27;Name&#x27;.padEnd(32)+&#x27; &#x27;+&#x27;Date&#x27;.padEnd(15)+&#x27; Result&#x27;);

ow.activations.list(activationOptions).then(result =&gt; {
	result.forEach(act =&gt; {
		let id = act.activationId;
		let name = act.name;
		let start = dtFormat(new Date(act.start));
		let result = act.response.success;
		let resultStr = chalk.green(&#x27;true&#x27;);
		if(!result) {
			resultStr = chalk.red(&#x27;false&#x27;);
		}
		console.log(`${% raw %}{id}{% endraw %} ${% raw %}{name.padEnd(32)}{% endraw %} ${% raw %}{start.padEnd(15)}{% endraw %} ${% raw %}{resultStr}{% endraw %}`);
	});
});

function dtFormat(d) {
	let result = &#x27;&#x27;;
	result += d.getMonth()+1;
	result += &#x27;&#x2F;&#x27;;
	result += d.getDate();
	result += &#x27;&#x2F;&#x27;;
	result += d.getFullYear().toString().substr(2,2);
	result += &#x27; &#x27;;
	result += zpad(d.getHours()) + &#x27;:&#x27; + zpad(d.getMinutes());
	return result;
}

function zpad(s) {
	if(s.toString().length === 1) return &#x27;0&#x27;+s;
	return s;
}
</code></pre>

And if you want to use this yourself, you can grab the bits here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/util. I'm going to try to add more utilities under this folder as they come to mind. There are similar tools as well, like [WITT](https://github.com/kerryspchang/WITT), but unfortunately that isn't working for me right now. (And yep, I filed a bug report.) 

And as one more aside, I'm really tempted to build my own web UI like WITT just so I can play with Vue!