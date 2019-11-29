---
layout: post
title: "Using the Directory-serving middleware in Express"
date: "2013-08-11T14:08:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2013/08/11/Using-the-Directoryserving-middleware-in-Express
guid: 5005
---

If you peruse the docs for ExpressJS (as I do every Sunday), you might notice this little gem called <a href="http://expressjs.com/api.html#directory">Directory</a>:
<!--more-->
<blockquote>
Directory serving middleware, serves the given path. This middleware may be paired with static() to serve files, providing a full-featured file browser.
</blockquote>

I was curious how this worked as both Apache and IIS have this built in as well. I whipped up a quick Express application (remember you can create one with the express command line program) and tried the feature out.

First - note that the docs use this as an example:

app.use(express.directory('public'));

When I first tried this with an application it didn't work. I had forgotten to include a path with the app.use statement. This made it default to /, but I was always using that path with the out of the box code. I quickly changed it to this:

app.use('/dropbox',express.directory('/Users/ray/Dropbox'));

This let me map /dropbox in the browser path to my local Dropbox install. Here's how this is rendered by Express<sup>*</sup>.

<img src="https://static.raymondcamden.com/images/ss1.png" />

As you can see, it is nice, if somewhat minimal. You can click to browse into subfolders:

<img src="https://static.raymondcamden.com/images/ss2.png" />

The search field has a nice highlight effect, but is case-sensitive which seems like an odd choice:

<img src="https://static.raymondcamden.com/images/ss3.png" />

There are a few options you can use with the Directory middleware. One is icon support, but in my testing this was very poorly implemented. As far as I could tell it only supported PDFs. I appreciate the Adobe-love there, but it seems odd that other file types weren't recognized.

Here is an example of how you would enable it:

app.use('/dropbox',express.directory('/Users/ray/Dropbox',{% raw %}{icons:true}{% endraw %}));

And the result:

<img src="https://static.raymondcamden.com/images/ss4.png" />

Yet another option is the ability to filter the results. The docs don't tell you how to use this. I supplied a function to my options object and simply did a console.log(arguments) to see what was passed. 

From what I could see there were 3 arguments. The first is the name of the item. The second is the index (ie, the number representing which item in the list this is - 0 based). The third item is the entire list. Again - oddly - you aren't told if the item is a file or directory. Since you know what directory you're working with you could simply check this yourself but it would certainly be helpful if the middleware provided this. I wrote this function to show directories and PDF files. Note that my "directory logic" is a hack. I simply see if the name has a period in it. <strong>This is not a real test!</strong>

<script src="https://gist.github.com/cfjedimaster/6206239.js"></script>

Finally - don't forget that if you want to actually <i>serve</i> the files, you have to combine with it a static call as well:

app.use('/dropbox',express.static('/Users/ray/Dropbox'));

* As an FYI, the Directory middleware is actually provided by Connect, which Express builds upon. This tends to confuse me at times.