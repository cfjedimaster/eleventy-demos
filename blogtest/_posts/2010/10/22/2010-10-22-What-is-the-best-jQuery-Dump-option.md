---
layout: post
title: "What is the best jQuery Dump option?"
date: "2010-10-22T13:10:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2010/10/22/What-is-the-best-jQuery-Dump-option
guid: 3981
---

While investigating an issue at work I came across a jQuery based dump utility. You can see an example of it <a href="http://mohammed.morsi.org/blog/node/268">here</a>. Unfortunately it completely failed to work for me in any tests of DOM objects. I could pass in simple arrays and strings just fine, but anything DOM related died. (Even though his screen shots clearly show DOM items.) That led me to do a more generic search for a jQuery-based dump plugin. Two results were found of which one had no download. The remaining one, <a href="http://plugins.jquery.com/project/Dump">Dump</a>, was last updated two years ago but worked fine no matter what I threw at it. It's not as pretty as the ColdFusion dump, but at least it works. I've found myself needing a tool like this recently so I'd like to know if anyone has a better jQuery dump solution? Here is a simple example showing the plugin from tdolsen:
<!--more-->
<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="jquery/jquery.dump2.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$("#testButton").click(function() {
		console.log('run!');
		res = $.dump($("#someForm")[0]);
		console.log(res);
	});
	
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;form id="someForm"&gt;
	&lt;table&gt;
		&lt;tr&gt;
			&lt;td&gt;name:&lt;/td&gt;
			&lt;td&gt;&lt;input type="text" name="name" id="name"&gt;&lt;/td&gt;
		&lt;/tr&gt;
		&lt;tr&gt;
			&lt;td&gt;email:&lt;/td&gt;
			&lt;td&gt;&lt;input type="text" name="email"&gt;&lt;/td&gt;
		&lt;/tr&gt;
		&lt;tr&gt;
			&lt;td&gt;fav movie:&lt;/td&gt;
			&lt;td&gt;
			&lt;input type="radio" name="movie" value="Star Wars"&gt;Star Wars&lt;br/&gt;
			&lt;input type="radio" name="movie" value="Empire Strikes Back" selected="true"&gt;Empire Strikes Back&lt;br/&gt;
			&lt;input type="radio" name="movie" value="Return of the Jedi"&gt;Return of the Jedi&lt;br/&gt;
			&lt;/td&gt;
		&lt;/tr&gt;
		&lt;tr&gt;
			&lt;td colspan="2"&gt;comments:&lt;br/&gt;
			&lt;textarea name="comments"&gt;&lt;/textarea&gt;
			&lt;/td&gt;
		&lt;/tr&gt;
		&lt;tr&gt;
			&lt;td&gt;Test:&lt;/td&gt;
			&lt;td&gt;&lt;input type="button" id="testButton" value="Test"&gt;&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/table&gt;
&lt;/form&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p/>

And if you are curious as to the result....

<p/>

<code>
run!
test3.cfm:12DOMElement [ 
	nodeName: FORM
	nodeValue: null
	innerHTML: [ 
		1 = DOMElement [ 
			nodeName: TABLE
			nodeValue: null
			innerHTML: [ 
				1 = DOMElement [ 
					nodeName: TBODY
					nodeValue: null
					innerHTML: [ 
						0 = DOMElement [ 
							nodeName: TR
							nodeValue: null
							innerHTML: [ 
								1 = DOMElement [ 
									nodeName: TD
									nodeValue: null
									innerHTML: [ 
										0 = String: name:
									]
								]
								3 = DOMElement [ 
									nodeName: TD
									nodeValue: null
									innerHTML: [ 
										0 = DOMElement [ 
											nodeName: INPUT
											nodeValue: null
											innerHTML: [ 
											]
										]
									]
								]
							]
						]
						2 = DOMElement [ 
							nodeName: TR
							nodeValue: null
							innerHTML: [ 
								1 = DOMElement [ 
									nodeName: TD
									nodeValue: null
									innerHTML: [ 
										0 = String: email:
									]
								]
								3 = DOMElement [ 
									nodeName: TD
									nodeValue: null
									innerHTML: [ 
										0 = DOMElement [ 
											nodeName: INPUT
											nodeValue: null
											innerHTML: [ 
											]
										]
									]
								]
							]
						]
						4 = DOMElement [ 
							nodeName: TR
							nodeValue: null
							innerHTML: [ 
								1 = DOMElement [ 
									nodeName: TD
									nodeValue: null
									innerHTML: [ 
										0 = String: fav movie:
									]
								]
								3 = DOMElement [ 
									nodeName: TD
									nodeValue: null
									innerHTML: [ 
										1 = DOMElement [ 
											nodeName: INPUT
											nodeValue: null
											innerHTML: [ 
											]
										]
										2 = String: Star Wars
										3 = DOMElement [ 
											nodeName: BR
											nodeValue: null
											innerHTML: [ 
											]
										]
										5 = DOMElement [ 
											nodeName: INPUT
											nodeValue: null
											innerHTML: [ 
											]
										]
										6 = String: Empire Strikes Back
										7 = DOMElement [ 
											nodeName: BR
											nodeValue: null
											innerHTML: [ 
											]
										]
										9 = DOMElement [ 
											nodeName: INPUT
											nodeValue: null
											innerHTML: [ 
											]
										]
										10 = String: Return of the Jedi
										11 = DOMElement [ 
											nodeName: BR
											nodeValue: null
											innerHTML: [ 
											]
										]
									]
								]
							]
						]
						6 = DOMElement [ 
							nodeName: TR
							nodeValue: null
							innerHTML: [ 
								1 = DOMElement [ 
									nodeName: TD
									nodeValue: null
									innerHTML: [ 
										0 = String: comments:
										1 = DOMElement [ 
											nodeName: BR
											nodeValue: null
											innerHTML: [ 
											]
										]
										3 = DOMElement [ 
											nodeName: TEXTAREA
											nodeValue: null
											innerHTML: [ 
											]
										]
									]
								]
							]
						]
						8 = DOMElement [ 
							nodeName: TR
							nodeValue: null
							innerHTML: [ 
								1 = DOMElement [ 
									nodeName: TD
									nodeValue: null
									innerHTML: [ 
										0 = String: Test:
									]
								]
								3 = DOMElement [ 
									nodeName: TD
									nodeValue: null
									innerHTML: [ 
										0 = DOMElement [ 
											nodeName: INPUT
											nodeValue: null
											innerHTML: [ 
											]
										]
									]
								]
							]
						]
					]
				]
			]
		]
	]
]
</code>

<p/>

As you can see - it is readable, but it would be nicer if it was a bit more compact. Color coding wouldn't work well in the console. Of course, if your only target is the console itself, it probably makes sense to just use console.dir:

<p/>

<code>
console.dir($("#someForm")[0]);
</code>

<p/>

This returns (and I cropped this screen shot a bit to make it fit):

<p/>

<img src="https://static.raymondcamden.com/images/screen22.png" />