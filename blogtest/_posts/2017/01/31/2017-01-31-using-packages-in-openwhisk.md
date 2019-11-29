---
layout: post
title: "Using Packages in OpenWhisk"
date: "2017-01-31T11:00:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/01/31/using-packages-in-openwhisk
---

As I continue my exploration of serverless with [OpenWhisk](https://developer.ibm.com/openwhisk/), today I'm going to look at
the [packages](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_packages.html) feature. While not terribly complex, I thought writing up my take on it and 
sharing some screen shots might help folks better understand the basics.

As you play with OpenWhisk, you may be wondering where exactly your actions "live". Obviously the whole point of serverless is to not
worry about - you know - the server - but there *is* a directory of sort for your actions. You can see this yourself 
by simply listing your actions:

![My Actions](https://static.raymondcamden.com/images/2017/1/owp1.png)

What you're seeing here is a list of every action I've created. You can see that each one begins with:

	/rcamden@us.ibm.com_My Space/

This is documented in [Namespaces and packages](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_reference.html#openwhisk_entities):

<blockquote>
In Bluemix, an organization+space pair corresponds to a OpenWhisk namespace. For example, 
the organization BobsOrg and space dev would correspond to the OpenWhisk namespace /BobsOrg_dev
</blockquote>

Simple enough - but you can guess that organization is going to become an issue. While you can try to name your actions with good, descriptive names, 
at some point you will have to start giving weird names to actions just to avoid conlicts. 

This is where packages come in. Essentially, you can think of them as a subdirectory for your actions. (They do more than that, and we'll cover them in a second.) 

To create a new package, you issue this command:

<pre><code class="language-javascript">wsk package create NAME
</code></pre>

Here's an example of me creating one called <code>utils</code>:

![My package](https://static.raymondcamden.com/images/2017/1/owp2.png)

You can see your packages with:

<pre><code class="language-javascript">wsk package list
</code></pre>

![Package list](https://static.raymondcamden.com/images/2017/1/owp3.png)

That second package you see there was created when I was working with Cloudant back on my [first post](https://www.raymondcamden.com/2016/12/23/going-serverless-with-openwhisk) on OpenWhisk. 

To see what's in a package, you simply do either:

<pre><code class="language-javascript">wsk package get utils
</code></pre>

Or:

<pre><code class="language-javascript">wsk package get --summary utils
</code></pre>

The first command returns a JSON object for your package and the second returns a more readable version. I'll show you both of these later, but first let's add an action to the package so there's 
actually something in it. I've got a simple action I created earlier that just echoes a name:

<pre><code class="language-javascript">
function main(params) {

	return {
		result: "Meow, "+params.name
	};

}
</code></pre>

To add this to my new package, I simply do:

<pre><code class="language-javascript">wsk action create utils/action1 action1.js
</code></pre>

Again, pretty simple. Now let's look at what <code>wsk package get</code> returns, both the 'raw' and summary version:

![Package contents](https://static.raymondcamden.com/images/2017/1/owp4.png)

As you can see, the summary version is what you'll probably always want to use at the CLI. If your curious, the
generic <code>wsk action list</code> returns all your actions, even those within packages:

![Action list with new packages action](https://static.raymondcamden.com/images/2017/1/owp5.png)

Invoking the action is the same as any other action, you simply prefix the package:

<pre><code class="language-javascript">wsk action invoke utils/action1 -b -r -p name Ray
</code></pre>

![My packaged action](https://static.raymondcamden.com/images/2017/1/owp6.png)

Whew. So I said this was simple, right? It is - but I like to be complete and show these things actually running. So that's the basics, but what else is there?

* Packages, like actions, can have default parameters. This allows you to specify a default for every action 
in the package. In case you're curious, an action's default parameter takes precedence over a package's 
default parameter. (Thank you to Stephen Fink@IBM for clarifying that for me.)
* The other big change is that packages can be shared with the wider world. You can specify a "shared" 
setting (true or false) when creating or updating a package. By making it shared, anyone can use it. 
To me, this is the biggest use case for packages - providing a way for you to collect related actions and 
then share them with others.
* And then finally, OpenWhisk has a large set of shared packages called <code>whisk.system</code>. They 
provide various utilities as well as access to common Watson APIs and other useful tools. You can 
browse the [docs](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_catalog.html) for them or use 
the CLI, but I'd check the docs as they are much easier to read.
* Ok, so *really* finally - I'll point out you can also put [feeds](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_packages.html#openwhisk_package_trigger) in packages. I haven't yet blogged about triggers, feeds, and rules, because
it's a bit complex and I'm still wrapping my head around it. They will be the subject of my next OpenWhisk article.