---
layout: post
title: "CFLib converted to Harp and on Surge"
date: "2015-11-19T08:00:50+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2015/11/19/cflib-converted-to-harp-and-on-surge
guid: 7109
---

Every now and then I code something that seems like a really bad idea, but I just do it and don't tell anyone and I'm <i>totally</i> fine with that. I've decided to push my luck and actually blog about what I coded even though I think it is - probably - a pretty bad idea. 

<!--more-->

<a href="http://www.cflib.org">CFLib</a> was first released back in the Jurassic period and was running ColdFusion 5. After the initial release I updated it a few times over the years. Early this year I went ahead and converted it to Node.js (<a href="http://www.raymondcamden.com/2015/01/05/cflib-moves-to-node-js">CFLib moves to Node.js</a>). This was a pretty simple conversion with the only real complex part being the editor. (In fact, for a while, I had no admin and I edited/added UDFs via a Mongo client. Yes, seriously.)

Recently I found that my Node service was migrating to a new system that would no longer support Mongo. With submissions to CFLib dried up, I figured it was time to go ahead and make it static. (Although I've already added one UDF since this conversion and will be adding another next week.) Back in August, I wrote a blog post about how I used a Node.js script to act like a "generator" for Harp.js: <a href="http://www.raymondcamden.com/2015/08/25/using-generators-with-harp">Using Generators with Harp</a>. The purpose of this script was to read in raw data from a Mongo export and give me the files Harp.js would need to generate a static version. For the most part, this is just simple grunt work - reading and writing JSON and plain text files, but here is the current version:

<pre><code class="language-javascript">var fs = require(&quot;fs&quot;);

console.log('Ray you have custom data now');process.exit(1);

console.log(&quot;Generating libraries&quot;);
var libs = require(&quot;../public/library/_data.json&quot;);

var libLookup = {
		&quot;5492b805bee821b746e43431&quot;:&quot;CFMLLib&quot;,
		&quot;5492b802bee821b746e430e7&quot;:&quot;DataManipulationLib&quot;,
		&quot;5492b805bee821b746e43467&quot;:&quot;DatabaseLib&quot;,
		&quot;5492b804bee821b746e4334d&quot;:&quot;DateLib&quot;,
		&quot;5492b804bee821b746e43244&quot;:&quot;FileSysLib&quot;,
		&quot;5492b804bee821b746e43284&quot;:&quot;FinancialLib&quot;,
		&quot;5492b803bee821b746e43197&quot;:&quot;MathLib&quot;,
		&quot;5492b805bee821b746e43419&quot;:&quot;NetLib&quot;,
		&quot;5492b805bee821b746e43403&quot;:&quot;ScienceLib&quot;,
		&quot;5492b803bee821b746e4322a&quot;:&quot;SecurityLib&quot;,
		&quot;5492b800bee821b746e42f5c&quot;:&quot;StrLib&quot;,
		&quot;5492b804bee821b746e43291&quot;:&quot;UtilityLib&quot;
};

		
var libraryTemplate = fs.readFileSync(__dirname+&quot;/templates/library.html&quot;, &quot;utf8&quot;);
var udfTemplate = fs.readFileSync(__dirname+&quot;/templates/udf.html&quot;, &quot;utf8&quot;);

for(var key in libs) {
	var newFile = __dirname+&quot;/../public/library/&quot;+key+&quot;.ejs&quot;;
	var data = libraryTemplate;
	console.log(&quot;Creating &quot;+newFile);
	fs.writeFileSync(newFile, libraryTemplate);
}

console.log(&quot;Generating UDF data from dump.json&quot;);
var udfRaw = require(&quot;./dump.json&quot;);
console.log(udfRaw.length + &quot; UDFs released.&quot;);
var udfs = [];
for(var i=0;i&lt;udfRaw.length;i++) {
	var thisUDF = udfRaw[i];
	var newUDF = {
		returnValue:thisUDF.returnValue,
		author:thisUDF.author,
		tagBased:thisUDF.tagBased,
		name:thisUDF.name,
		cfVersion:thisUDF.cfVersion,
		description:thisUDF.description,
		warnings:thisUDF.warnings,
		library:libLookup[thisUDF.library_id],
		headerComments:thisUDF.headerComments,
		shortDescription:thisUDF.shortDescription,
		lastUpdated:thisUDF.lastUpdated,
		version:thisUDF.version,
		example:thisUDF.example,
		code:thisUDF.code,
		javaDoc:thisUDF.javaDoc,
		args:thisUDF.args,
		oldId:thisUDF.oldId
	};
	if(thisUDF.authorEmail) {
		newUDF.authorEmail = thisUDF.authorEmail;
	}
	udfs.push(newUDF);
}

var newFile = __dirname+&quot;/../public/udf/_data.json&quot;;
var udfData = {% raw %}{&quot;udfs&quot;:udfs}{% endraw %};
console.log(&quot;Creating &quot;+newFile);
fs.writeFileSync(newFile, JSON.stringify(udfData,null,'\t'));

udfs.forEach(function(udf) {
	var newFile = __dirname+&quot;/../public/udf/&quot;+udf.name+&quot;.ejs&quot;;
	console.log(&quot;Creating &quot;+newFile);
	fs.writeFileSync(newFile, udfTemplate);

	newFile = __dirname+&quot;/../public/udfdownload/&quot;+udf.name+&quot;.html&quot;;
	console.log(&quot;Creating &quot;+newFile);
	var code = udf.javaDoc + '\n' + udf.code;
	fs.writeFileSync(newFile, code);

});</code></pre>

Out of all these lines, the only one I really want to call out is this:

<pre><code class="language-javascript"> 
fs.writeFileSync(newFile, JSON.stringify(udfData,null,'\t'));
</code></pre>

Notice that third argument to the stringify call. This is the "spacer" argument and allows you to format the resulting JSON. Normally you don't really care what the JSON looks like, but in my case, the file represents all the UDFs for CFLib and I need to edit it add/edit/delete data. Having line breaks in the file makes it a heck of a lot easier to work with. You can find out more abut this feature from MDN: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_space_argument">The space argument</a>.

Ok, so now for the part that I really think is a bit freaky. My data exists are two core JSON files - one for libraries and one ginormous one for UDFs. This isn't a database - remember - we're static now - so simple things like, "Tell me the number of UDFs in library X" aren't really simple anymore. To make it a bit simpler, I built a file that acted like a function library for my Harp.js templates. I called it _udf.js. (Try not to get confused by the fact that the site itself hosts content called UDFs too.;) Here is an example of how the home page template looks:

<pre><code class="language-markup">&lt;h2&gt;Libraries&lt;/h2&gt;

&lt;{% raw %}%- include('_udf.ejs') %{% endraw %}&gt;
&lt;% 
	title = 'Welcome to CFLib';
	
	for(var key in public.library._data) { 
		var library = public.library._data[key];
		lastUpdated = public.udfs.dateFormat(public.udfs.getLibLastUpdated(key));
		udfCount = public.udfs.getCount(key);
%&gt;
	&lt;div class=&quot;lib&quot;&gt;
		&lt;a href=&quot;/library/&lt;{% raw %}%= key %{% endraw %}&gt;&quot;&gt;&lt;{% raw %}%= key %{% endraw %}&gt;&lt;/a&gt; &lt;br/&gt;
		&lt;span class=&quot;date&quot;&gt;Last Updated &lt;{% raw %}%= lastUpdated %{% endraw %}&gt;&lt;/span&gt; &lt;br/&gt;
		Number of UDFs: &lt;{% raw %}%- udfCount %{% endraw %}&gt; &lt;br/&gt;
		&lt;{% raw %}%- library.desc %{% endraw %}&gt;
		&lt;/p&gt;
	&lt;/div&gt;
&lt;{% raw %}% }{% endraw %} %&gt;
</code></pre>

First - note the include. That's where my utility library is loaded into the template. After it is loaded, I have access to a library of functions in the name space, public.udfs. You can see a few calls - one that gets the last updated value for the library and one that gets the count. Let's look at the library.

<pre><code class="language-javascript">&lt;%

public.udfs = {};

//big deleted part

var monthNames = [&quot;January&quot;, &quot;February&quot;, &quot;March&quot;, &quot;April&quot;, &quot;May&quot;, &quot;June&quot;,
  &quot;July&quot;, &quot;August&quot;, &quot;September&quot;, &quot;October&quot;, &quot;November&quot;, &quot;December&quot;
];

public.udfs.getArgString = function(args) {

	if(args.length === 0) return '()';
	var argstr = '(';
	for(var i=0, len=args.length; i&lt;len; i++) {
		var arg = args[i];
		if(arg[&quot;REQ&quot;]) {
			if(i != 0) argstr += ', ';
			argstr += arg[&quot;NAME&quot;];
		} else {
			if(i != 0) {
				argstr += '[, ';
			} else {
				argstr += '[';
			}
			argstr += arg[&quot;NAME&quot;] + ']';
		}
	}
	argstr += ')';
	return argstr;

}

//hard coded to Month X, Year
public.udfs.dateFormat = function(d) {
	return monthNames[d.getMonth()] + ' ' + d.getDate() + ', '+d.getFullYear();	
};

public.udfs.getUDFByName = function(name) {
	var udfs = [];	
	for(var i=0;i&lt;public.udf._data.udfs.length;i++) {
		if(public.udf._data.udfs[i].name === name) return public.udf._data.udfs[i];
	}	
}

public.udfs.getUDFsForLib = function(lib) {
	var udfs = [];	
	for(var i=0;i&lt;public.udf._data.udfs.length;i++) {
		if(public.udf._data.udfs[i].library === lib) {
			udfs.push(public.udf._data.udfs[i]);
		}
	}
	
	udfs.sort(function(a,b) {
		if(a.name.toLowerCase() &lt; b.name.toLowerCase()) {
			//console.log(a.name +' less then '+b.name);
			return -1;
		}
		if(a.name.toLowerCase() &gt; b.name.toLowerCase()) {
			//console.log(a.name +' more then '+b.name);
			return 1;
		}
		return 0;
	});

	return udfs;
}

public.udfs.getLibLastUpdated = function(lib) {
	var lastUpdated = new Date(1800,0,1);
	var udfs = public.udfs.getUDFsForLib(lib);
	for(var i=0;i&lt;udfs.length;i++) {
		var thisDate = new Date(udfs[i].lastUpdated);
		if(thisDate.getTime() &gt; lastUpdated.getTime()) lastUpdated = thisDate;
		//console.log(thisDate);
	}
	return lastUpdated;
};

public.udfs.getCount = function(lib) {
	return public.udfs.getUDFsForLib(lib).length;
};

public.udfs.getLatest = function(top) {
	if(!top) top=5;
	var udfs = public.udf._data.udfs;
	udfs.sort(function(a,b) {
		return (new Date(b.lastUpdated).getTime()) - (new Date(a.lastUpdated).getTime());
	});
	return udfs.slice(0,top);
};

public.udfs.gravatar = function(e) {

	if(!e) e = &quot;&quot;;
	//http://nodeexamples.com/2013/09/04/creating-an-md5-hash-to-get-profile-images-from-gravatar/
	var s = &quot;http://www.gravatar.com/avatar/&quot;;
	e = e.toLowerCase().trim();
	/*
	var hash = crypto.createHash(&quot;md5&quot;);
	hash.update(e);
	s += hash.digest(&quot;hex&quot;);
	*/
	s += public.udfs.md5(e);
	s += &quot;?s=43&quot;;
	return s;
		
};

public.udfs.truncate = function(s) {
	if(s.length &lt; 17) return s;
	else return s.substring(0,16) + '...';
};

%&gt;</code></pre>

So what am I doing here? Harp.js has a Public scope. This scope contains data about the file system of my Harp app as well as any metadata. I'm abusing this scope by writing directly to it. This lets me define functions I can reuse in my template via the <code>public.udfs</code> namespace.

<strong>This is the part I think is a bad idea!</strong> But it works - and it made the rest of the site a heck of a lot easier to build. 

The final part was deploying via <a href="https://surge.sh/">Surge</a>, which I've praised numerous times here on this blog. My site was live in approximately 120 seconds after I was done. All I had to do was update my DNS for the site and wait for it to propagate. 

As a quick aside - I also needed access to a MD5 library in JavaScript. I used this one, <a href="https://github.com/blueimp/JavaScript-MD5">https://github.com/blueimp/JavaScript-MD5</a>, by simply cutting and pasting the code into my UDF file. I removed it from the code above as it was rather large. That's how I built in support for generating the Gravatar links.

That's it - let me know if you have any questions about the site. I don't really have any plans on putting the Harp.js code up on GitHub, but if folks want to see more of the CFLib site, I'll share it.