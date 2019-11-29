---
layout: post
title: "This works... and it freaks me out"
date: "2013-12-11T21:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/12/11/This-works-and-it-freaks-me-out
guid: 5098
---

<p>
I just ran across a template that had an interesting typo. Here is an example.
</p>
<!--more-->
<pre><code class="language-javascript">component {

	{
		public function hello() {
			return "Hello";
		}

	}
	
}</code></pre>

<p>
See it? The function is surrounded by an extra pair of brackets. ColdFusion just hoists it up just like JavaScript, so I shouldn't be surprised, but wow did that freak me out a bit.
</p>

<p>
Then for the hell of it I went crazy - and yes - it still works.
</p>

<pre><code class="language-javascript">component {

	{
		{
			{
				{
					{
						public function hello() {
							return "Hello";
						}
					}
				}
			}
		}
	}

}</code></pre>

<p>
Anyway... yeah... don't do this. ;)
</p>