---
layout: post
title: "ColdFusion UI The Right Way - HTML version"
date: "2014-06-19T10:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/06/19/ColdFusion-UI-The-Right-Way-HTML-version
guid: 5248
---

<p>
Back when <a href="http://cfmlblog.adamcameron.me/">Adam Cameron</a> and I launched the <a href="https://github.com/cfjedimaster/ColdFusion-UI-the-Right-Way">ColdFusion UI - The Right Way</a> project, I mentioned that initially we would accept submissions from the community to build out the content before releasing an actual readable version. Turns out I kind of forgot to get around to doing that. The content in the GitHub repo is in Markdown, which is pretty readable, but it isn't exactly in a nice form to hand out to a junior developer.
</p>
<!--more-->
<p>
Earlier this week I got off my rear and actually built a process to make this happen. I decided to give <a href="http://gruntjs.com/">Grunt</a> a try for the process and it worked out rather well. I did run into a few stumbling blocks but I was able to get past them all and I'm very happy with the result. My Grunt script now does all the following with one simple command:
</p>

<ul>
<li>Clean out an output directory (to remove earlier versions)
<li>Convert the Markdown files to HTML using a template
<li>Find the demo folders and zip them
<li>Attach a bit of HTML to the files so that folks have a link for the download
</ul>

<p>
I decided to put the output up on a S3 bucket. You can now read the docs here: <a href="https://static.raymondcamden.com/cfuitherightway/">https://static.raymondcamden.com/cfuitherightway/</a>. I'll update the GitHub readme in a few moments to add this link as well. I'm tempted to extend my Grunt script to also push updates to S3. Heck, I could also have it do the git pull action as well. Anyway, for folks who may be curious, here is the script I'm using.
</p>

<pre><code class="language-javascript">module.exports = function(grunt) {

	&#x2F;&#x2F; Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON(&#x27;package.json&#x27;),

		clean: [&#x27;.&#x2F;output&#x2F;&#x27;],

		copy: {

			main: {

				files: [

					{% raw %}{expand:true, src:[&#x27;.&#x2F;chapters&#x2F;**&#x27;,&#x27;!.&#x2F;chapters&#x2F;**&#x2F;*.md&#x27;], dest: &#x27;output&#x2F;&#x27;}{% endraw %} 

				]
			}

		},
		
		markdown:{
			all: {
				files: [
					{
						expand: true,
						src:&#x27;.&#x2F;chapters&#x2F;**&#x2F;*.md&#x27;,
						dest:&#x27;output&#x2F;&#x27;,
						ext:&#x27;.html&#x27;
					}
				],
				options: {
					template:&#x27;template.html&#x27;,
					preCompile:function(src, context) {
					},
					postCompile:function(src, context) {
						&#x2F;*
						Unfortunately we don&#x27;t have access to the current path, 
						so no easy way to skip index.html and introduction.html
						*&#x2F;
						&#x2F;&#x2F;set title back to blank
						context.title = &quot;&quot;;
						if(src.indexOf(&#x27;&lt;h1 id=&quot;introduction&quot;&gt;Introduction&lt;&#x2F;h1&gt;&#x27;) &gt;= 0) {
							context.title = &quot;Introduction&quot;;
							return src;
						}
						if(src.indexOf(&#x27;&lt;h1 id=&quot;coldfusion-ui-the-right-way&quot;&gt;ColdFusion UI - The Right Way&lt;&#x2F;h1&gt;&#x27;) &gt;= 0) {
							context.title = &quot;ColdFusion UI - The Right Way&quot;;
							return src;
						}

						var dl = &#x27;&lt;p style=&quot;text-align:right&quot;&gt;&lt;a class=&quot;btn btn-info&quot; href=&quot;demos.zip&quot;&gt;Download Demo&lt;&#x2F;a&gt;&lt;&#x2F;p&gt;&#x27;;
						src = dl + src;

						var titleArr = src.match(&#x2F;&lt;h1.*?&gt;(.*?)&lt;\&#x2F;h1&gt;&#x2F;);
						if(titleArr &amp;&amp; titleArr.length &gt;= 2) context.title=titleArr[1];


						return src;
					},
					markdownOptions: {
						highlight:&#x27;auto&#x27;
					}
				}
			}
		}
	});

	grunt.registerTask(&#x27;zipDemos&#x27;, &quot;Zips demos appropriately.&quot;, function() {
		var sourceDirs = grunt.file.expand([&#x27;.&#x2F;chapters&#x2F;**&#x2F;demos&#x27;,&#x27;.&#x2F;chapters&#x2F;**&#x2F;demo&#x27;]);
		var zipConfig = {};
		sourceDirs.forEach(function(dir) {
			var outputZip = dir.replace(&quot;chapters&quot;, &quot;output&#x2F;chapters&quot;);
			&#x2F;&#x2F;use a uniform demos.zip, not demo
			if(outputZip.charAt(outputZip.length-1) === &quot;o&quot;) outputZip += &quot;s&quot;;
			outputZip += &quot;.zip&quot;;
			dir += &quot;&#x2F;*&quot;;
			zipConfig[dir] = {
				cwd:dir,
				src:dir, 
				dest:outputZip
			};
			grunt.config.set(&#x27;zip&#x27;, zipConfig);

		});
	});

	grunt.registerTask(&#x27;zipCode&#x27;, [&#x27;zipDemos&#x27;,&#x27;zip&#x27;]);

	grunt.loadNpmTasks(&#x27;grunt-markdown&#x27;);
	grunt.loadNpmTasks(&#x27;grunt-contrib-copy&#x27;);
	grunt.loadNpmTasks(&#x27;grunt-contrib-clean&#x27;);
	grunt.loadNpmTasks(&#x27;grunt-zip&#x27;);
	
	&#x2F;&#x2F; Default task(s).
	grunt.registerTask(&#x27;default&#x27;, [&#x27;clean&#x27;,&#x27;markdown&#x27;, &#x27;copy&#x27;, &#x27;zipCode&#x27;]);

};</code></pre>

<p>
As always, any comments are welcome.
</p>