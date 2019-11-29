---
layout: post
title: "Using Grunt to Automate MobileFirst/Hybrid Builds"
date: "2015-03-26T08:44:40+06:00"
categories: [development,mobile]
tags: [mobilefirst]
banner_image: 
permalink: /2015/03/26/using-grunt-to-automate-mobilefirsthybrid-builds
guid: 5891
---

When working with <a href="http://www.ibm.com/mobilefirst/us/en/">MobileFirst</a> and hybrid mobile applications, any changes to your web assets requires running both a build and deploy to see your changes. The command line makes this easy by letting you combine the calls into one (<code>mfp bd</code>), but while developing, it may be a pain to constantly run this. So for fun, I wrote the following <a href="http://gruntjs.com">Grunt</a> script.

<!--more-->

<pre><code class="language-javascript">module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON(&#x27;package.json&#x27;),
		watch:{
			scripts:{
				files:[&#x27;common&#x2F;**&#x27;],
				tasks:[&#x27;exec:build&#x27;,&#x27;exec:announce&#x27;],
				options:{
					interrupt:true
				}
			}
		},
		exec:{
			build:{
				cmd:&#x27;mfp bd&#x27;
			},
			announce: {
				cmd:&#x27;say &quot;All tasks complete&quot; --voice=Vicki&#x27;
			}
		}
	});

	grunt.loadNpmTasks(&#x27;grunt-contrib-watch&#x27;);
	grunt.loadNpmTasks(&#x27;grunt-exec&#x27;);
	
	grunt.registerTask(&#x27;default&#x27;, [&#x27;watch&#x27;]);

};</code></pre>

Basically it just watches for changes to the common folder and then executes the mfp command to run bd. When done, it uses the Mac "say" program to speak which is <strong>totally necessary for the proper execution of this program!</strong> (Ok, it is totally <i>not</i> necessary and those of yo u on PC should remove that part.)

Since build/deploy can take about 20 seconds, I use the interrupt option to kill an existing bd process. Let me know if this is helpful in the comments below!