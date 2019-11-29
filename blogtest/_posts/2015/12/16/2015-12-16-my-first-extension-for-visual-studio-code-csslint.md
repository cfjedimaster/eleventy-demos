---
layout: post
title: "My first extension for Visual Studio Code - CSSLint"
date: "2015-12-16T14:49:58+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2015/12/16/my-first-extension-for-visual-studio-code-csslint
guid: 7260
---

Well, it took a while, but I finally got around to writing my first extension for <a href="http://code.visualstudio.com">Visual Studio Code</a>. As I've said a few times recently, VS Code is my new favorite editor now that Brackets seems to be on the back burner at Adobe. (And ok, maybe it isn't. But VSC is faster, updated more often, and seems to have a lot more energy behind it.) I will say that the process for writing extensions for VS Code (<a href="https://code.visualstudio.com/docs/extensions/overview">documentation</a>) is somewhat... complicated. To be fair, extensions for Brackets at first were a bit difficult at first too. But right now I'd say I understood about 1/2 of what I was doing when building this. It is fragile as heck so use with extreme caution. So how does it look?

<!--more-->

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot1-2.png" alt="shot1" width="750" height="524" class="aligncenter size-full wp-image-7261" />

In the screen shot above, you can see the green squiggles from the linting reporting on the issues. If you click the little warning icon at the bottom, you get a formal list.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot2-3.png" alt="shot2" width="750" height="524" class="aligncenter size-full wp-image-7263" />

As just an FYI, VS Code has internal <a href="https://code.visualstudio.com/docs/languages/css#_syntax-verification-linting">CSS linting</a> and they do not document how to turn this off. You can disable their linting by adding this to your preferences:

<pre><code class="language-javascript">"css.validate": false</code></pre>

So - the code itself is a bit... intense. For linting specifically, VS Code requires you to set up a Node.js process to handle the process asynchronously. You then have to get this code into your extension code and handle keeping them in sync. The sample GitHub repo does all of this out of the box, and everything is documented, but it is <i>really</i> a lot to do at one time. I can say that every time I screwed up, it was because I didn't see the "Common Questions" part at the end of doc. My strongest recommendation is that you go to the bottom of the page before you do anything and quickly check what issues they call out there. You <strong>will</strong> run into them probably. 

I get why this process is complex, but it is so complex that there is no way I'd work on one while on my laptop screen. You need three instances of the VS Code open (yes, three, but again, this is for a linter, not all extensions) and managing that on a small screen would be pretty difficult. And again, to be fair, the experience of debugging a Bracket's extension was pretty similar. 

The biggest tip I can give involves logging. While you can debug the server portion of your extension, I'm a big fan of just using a crap ton of console messages. Your client code can just use console.log, but your server code can't. However - your server code has access to a <code>connection</code> object that links back to the client code. That means you can do:

<cpre><code class="language-javascript">connection.console.log('Work or I send you to the salt mines with Notepad.exe')</code></pre>

This will then show up in your debug console. And I kind of like that both parts of my extension can share one log.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot3-1.png" alt="shot3" width="750" height="499" class="aligncenter size-full wp-image-7264" />

So - I did publish it to the <a href="https://marketplace.visualstudio.com/#VSCode">Marketplace</a>, and that too was a bit complex, but I think - eventually - it will show up and be available. You can find the detail page here: <a href="https://marketplace.visualstudio.com/items/raymondcamden.CSSLint">https://marketplace.visualstudio.com/items/raymondcamden.CSSLint</a>. It is pretty bare bones though. You can find the Git repo here: <a href="https://github.com/cfjedimaster/vscode-csslint">https://github.com/cfjedimaster/vscode-csslint</a>.

Let me know what you think!