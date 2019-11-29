---
layout: post
title: "Working with Hugo on RaymondCamden.com"
date: "2016-01-16T11:02:31+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2016/01/16/working-with-hugo-on-raymondcamden-com
guid: 7389
---

I've mentioned before that I'm considering moving my blog from a Wordpress install to purely static. I've made some progress on this effort and while I'm not 100% sure I'm going to pull the plug, I'm <i>real</i> close to it. 
I thought I'd talk a bit about how this is going and share some of the things I've learned about <a href="https://gohugo.io/">Hugo</a>

<!--more-->

I had looked at Hugo a while ago and I <i>really</i> didn't like it. It's difficult to explain why, but it was just plain weird to me. A few weeks ago I decided to give it another look, and while I still found it weird, I kept at it and I'm kinda digging it now. In no particular order, here are some things I discovered/struggled with/built/etc:

<h2>Installation</h2>

So... this is the biggest issue. To install Hugo, you use brew. I only use brew when some random app asks me too. Most apps use npm. Ok, no big deal, they tell you exactly what command to do so you can cut and paste.

However...

When I installed, it gave me Hugo 0.13, an older version. This caused a number of problems while I was going through the docs. 

Turns out - Brew has some kind of internal registry and you have to update brew itself before you get an app.

Now - I'm sure there is a good reason for that. But on first blush, it seems really stupid. If you can never install an app (safely!) without updating brew first, then why isn't that baked in? Or at least have a warning of some sort? This one issue took me a good day to get past. I filed a bug report for it and now the Hugo docs include updating brew as part of the install process.

<h2>Content versus Themes</h2>

The biggest issue I had was understanding the relationship between the files of your project versus a theme. So for example, it took me a while to figure out where my home page was. Why? I had thought my "theme" was just layout junk and nothing more. But that's not the case. The theme actually includes your home page and other assets. 

Ok, so a theme then is kind of like a full application. That took me some time to wrap my head around, but I get it now. If you want to modify how your site behaves, like for example, how many entries to show on a blog's home page, then you either edit the theme or you can copy the file. If Hugo sees the same file name in your app directory versus the theme, it will run your file instead. I figured that early on and assumed it was best practice. 

<h2>Go Templates</h2>

So Hugo uses <a href="http://golang.org/pkg/html/template/">Go Templates</a> for its dynamic templates. Go is weird. I like it. But it is just plain weird. Here is an example:

<pre><code class="language-markup">
&lt;section id=&quot;main&quot;&gt;
    {% raw %}{{ range first 10 (where .Site.Pages &quot;Type&quot; &quot;post&quot;) }}{% endraw %}
    &lt;article class=&quot;article article-type-post&quot; itemscope=&quot;&quot; itemprop=&quot;blogPost&quot;&gt;
        &lt;div class=&quot;article-inner&quot;&gt;
            {% raw %}{{ if and (isset .Params &quot;banner&quot;) (not (eq .Params.banner &quot;&quot;)) }}{% endraw %}
            &lt;a href=&quot;{% raw %}{{ .Permalink }}{% endraw %}&quot; itemprop=&quot;url&quot;&gt;
            &lt;/a&gt;

            {% raw %}{{ partial &quot;article_header&quot; . }}{% endraw %}
            &lt;div class=&quot;article-entry&quot; itemprop=&quot;articleBody&quot;&gt;
                &lt;p&gt;
                    {% raw %}{{ printf &quot;%{% endraw %}s&quot; .Summary {% raw %}| markdownify }}{% endraw %}
                    &lt;br&gt;
                &lt;/p&gt;
                &lt;p class=&quot;article-more-link&quot;&gt;
                    &lt;a href=&quot;{% raw %}{{ .Permalink }}{% endraw %}&quot;&gt;
                        {% raw %}{{with .Site.Data.l10n.articles.read_more}}{% endraw %}{% raw %}{{.}}{% endraw %}{% raw %}{{end}}{% endraw %}
                    &lt;/a&gt;
                &lt;/p&gt;
            &lt;/div&gt;
            {% raw %}{{ partial &quot;article_footer&quot; . }}{% endraw %}
        &lt;/div&gt;
    &lt;/article&gt;
    {% raw %}{{ end }}{% endraw %}

    {% raw %}{{ partial &quot;pagination&quot; . }}{% endraw %}
&lt;/section&gt;
&lt;!-- // main section --&gt;
</code></pre>

It is readable - just... odd. Odd or not, I liked working with it although I had a hard time with the docs sometimes. For example, just figuring out how to limit a loop to N results took me a while. 

<h2>Content pages versus Layouts</h2>

This was the last issue I hit, and is probably the only thing that really bugs me. Your layout files can include Go in them to make them dynamic. Your content pages cannot. So I built a contact page and I couldn't include a simple Go variable for my site's URL. However - while you can't use logic/variables, you can use something called <a href="https://gohugo.io/extras/shortcodes/">shortcodes</a> instead. For my contact form, I had to build a shortcode that literally just output the site's URL. That seems stupid too, but I'm assuming there is a good reason for this. (And as it took me 2 minutes fix I got over it. ;)

<h2>Populating Hugo</h2>

To populate my Hugo site, I used WordPress's XML export feature. I then wrote a Node.js script that read it, parsed it, and output all 5000+ blog entries in the proper format. I can share this code if anyone wants to see it, but it isn't very pretty. 

<h2>Hugo Performance</h2>

Hugo is really fast. But even with it being fast, at 5K+ blog entries, every modification to source files took about 30 seconds for Hugo to handle. That was too long. So while I was working, I cut out about 4k of my blog entries. At that point, Hugo was taking about a second or so to update which was fine. Hugo will also auto reload in server mode which was pretty cool. I just had to open my browser and wait for it to reload when I saved. 

<h2>Theming</h2>

Hugo has a bunch of themes you can browse at <a href="http://themes.gohugo.io/">http://themes.gohugo.io/</a>. I went with Icarus. Here is a screen shot of blog so far.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/Screen-Shot-2016-01-16-at-10.40.14.png" alt="Screen Shot 2016-01-16 at 10.40.14" width="750" height="577" class="aligncenter size-full wp-image-7391 imgborder" />

And here is a random blog entry. 

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/Screen-Shot-2016-01-16-at-10.42.52-1.png" alt="Screen Shot 2016-01-16 at 10.42.52" width="516" height="750" class="aligncenter size-full wp-image-7393 imgborder" />

I dig it. I'm not 100% sold on the look, but I like it. 

<h2>Forms and Search</h2>

For my contact form, I use <a href="http://formspree.io/">Formspree</a>. They let you POST to them and send an email for free. It is super easy to use. 

For search, I'm using a <a href="https://cse.google.com/cse/">Google Custom Search</a> instance. I've used this in the past (see the search at <a href="http://www.cflib.org">CFLib</a>) and it works fine. I kinda think Google knows a thing or two about search.

<h2>Hosting</h2>

Hosting will be via <a href="http://surge.sh">Surge</a>. With me no longer using Google Cloud Compute Engine (which, btw, works darn well and is recommended), I'll put my money into Surge instead for their professional plan. Deploying the full site of 5000+ files takes about a minute. 

<h2>Writing</h2>

And this is the sore point for me. I really, <i>really</i> like the WordPress creation process. I can easily drag and drop images. I can easily assign categories and tags. I can save a work in progress for later. It is perfect. Now I'm going to a much a simpler system.

First I'll make a file. That's not hard of course. On top I'll need to add my own metadata. Hugo lets you use a variety of formats for that including JSON. Here is an example.

<pre><code class="language-markup">
{
	"title": "Hello World! I love yo!",
	"categories": [
		"ColdFusion"
	],
	"tags": [],
	"date": "2016-01-15T06:01:00+06:00",
	"url": "/2016/01/15/hello-world"
}

Yesterday on Facebook! I saw one of those "PLEASE SHARE WITH EVERYONE". This is
just me *testing* crap.

&lt;!--more--&gt;

I thought this would be rather simple, but from what I can see, it is impossible. What **the** heck. 
</code></pre>

I've got to write that all up myself (Hugo supports creating a new content file via the CLI, but I don't think it will work for me - need to investigate that) and then work on my article. My editor of choice, Visual Studio Code, has a built in Markdown preview:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/shot.png" alt="shot" width="750" height="441" class="aligncenter size-full wp-image-7394" />

As you can see the data on top is rendered too but that's easily ignorable. The real issue I've got now is images. I'll need to copy those myself to the right folder and then insert the Markdown code to include the image. I'm almost tempted to build my own editor in Electron as a desktop app - but that would be silly... right?

In the end - this is the main thing holding me back. I want to be sure that when I have a quick blog post (like when I write an article and just want to share it with others) that I don't feel like my "process" dissuades me from writing. 

I have to say though - the thought of going static and removing any concern over security, web servers, MySQL, etc, is <strong>extremely</strong> compelling. I want this site to be a resource that helps others and doesn't need to be constantly monitored. To be fair, Surge had downtime recently. (See the <a href="https://medium.com/surge-sh/january-7-2016-downtime-79d9440177b4#.dvtw5uwx8">explanation</a> for why.) But frankly - I'd rather have someone else worry about getting stuff back up then me. 

<h2>Everything Else</h2>

So I've already released this blog entry but I wanted to add a few more notes. I feel like I focused more on the issues I had with Hugo and not quite enough about what I liked. I mean, I said I liked it, but didn't really point out <i>why</i> I liked it. So here are more points - again - not in any particular order.

* One <i>very</i> cool feature of Hugo is that you have 100% control over the URLs via front matter. In the other static site generators I worked with, the URL was based on the physical file path. But by using front-matter on your content page, you can explicitly specify what the URL is and it need not have any relation to the physical path. I really dug that. 

* I mentioned this quickly above, but by default, the server uses autoreload. My primary experience with autoreload in the browser is with Ionic, but it works darn well with Hugo too. As I said, sometimes it took a second or two for Hugo to catch up with my changes, but having it autoreload when ready meant I didn't have to reload myself. 

* While this is a feature I removed (I'll explain why in a second), the built in Pagination was <i>really</i> well done. The code to support it was simple - and frankly - it is rare for pagination to ever be simple. I decided against pagination for my blog as I've got so many darn entries, but I was incredibly impressed by the support for this in Hugo.

* And more! Ok, that's a bit lame, but I'm still reading the docs and finding gems, so I'm going to keep learning.