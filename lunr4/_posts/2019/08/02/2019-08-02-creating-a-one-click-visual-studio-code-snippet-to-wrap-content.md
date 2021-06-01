---
layout: post
title: "Creating a One Click Visual Studio Code Snippet to Wrap Content"
date: "2019-08-02"
categories: ["development"]
tags: ["visual studio code"]
banner_image: /images/banners/shortcut.jpg
permalink: /2019/08/02/creating-a-one-click-visual-studio-code-snippet-to-wrap-content
description: 
---

Here's a quick tip for you regarding Visual Studio Code [snippets](https://code.visualstudio.com/docs/editor/userdefinedsnippets). If you aren't aware, snippets let you define keyword shortcuts for quickly entering content into your code. I've got a bunch tailored for my blogging. For example:

```js
"uns":{
	"scope":"markdown",
	"prefix":"uns",
	"body":[
		"<i>Header photo by <a href=\"$1\">$2</a> on Unsplash</i>"
	],
	"description": "Unsplash credit"
}
```

This is the snippet I use for my [Unsplash](https://unsplash.com/) credit text on most of my blog entries. Unsplash has *amazing* art you can use for free. They ask that you credit them and I figure it's the least I can do, however their "Copy" button only copies the text of the credit, not the link:

<img src="https://static.raymondcamden.com/images/2019/08/vs1.png" alt="Screen shot of Unsplash credit notice" class="imgborder imgcenter">

I built a snippet so I could quickly insert proper text and then copy in the URL manually. I then type in the image author's name.

Another one I use is for my images. I keep all of my images on Amazon S3. This snippet not only outputs the right base URL, but also outputs a dynamic year and month, matching the organization rules I use.

```js
"img": {
	"prefix": "img",
	"body": [
		"<img src=\"https://static.raymondcamden.com/images/$CURRENT_YEAR/$CURRENT_MONTH/$1\" alt=\"\" class=\"imgborder imgcenter\">"
	],
	"description": "Used for images"
}
```

Ok, so with that in mind, I realized yesterday I needed a new snippet for a very specific use case. I use Jekyll for my static site generator. I also write about Vue.js a lot. It just so happens that both Jekyll and Vue use the same tokens to reference variables - double brackets. So for example: `{% raw %}{{ name }}{% endraw %}`. When I write a blog post with Vue code in it, Jekyll picks up on the variables and tries to render the values, which typically just results in white space.

Luckily there is an easy fix, wrap the content with `{{ "{% raw " }}%}` and `{{ "{% endraw " }}%}`. (And to get *that* text to render was messy!) I wanted to see if I could build a Visual Studio Code snippet that would let me select some text, hit a key, and then wrap it with the code above. Turns out it took a few steps.

First, I defined my snippet:

```js
"raw": {
	"scope": "markdown",
	"prefix": "raw",
	"body": [
		"{{ "{% raw " }}%}$TM_SELECTED_TEXT{{ "{% endraw " }}%}"
	],
	"description": "Escape Vue"
}
```

I use the special variable `$TM_SELECTED_TEXT` to represent the currently selected text. This works well, but I usually activated snippets by typing their prefix and hitting the space bar. That won't work with selected text.

Luckily there's a F1 command you can run that lets you select a snippet and execute it:

<img src="https://static.raymondcamden.com/images/2019/08/vs2.png" alt="Using the Insert Snippet command." class="imgborder imgcenter">

That works, but requires about 3 clicks. What I wanted to do was simply have a keyboard shortcut that would do the same. Luckily that's [supported](https://code.visualstudio.com/docs/getstarted/keybindings) as well. I opened my `keybindings.json` and added:

```js
{
  "key": "ctrl+r",
  "command": "editor.action.insertSnippet",
  "when": "editorHasSelection",
  "args": {
    "langId": "markdown",
    "name": "raw"
  }
}
```

I specified the language and name of my snippet and also set that it only works when I've got an active selection. Now I just select some Vue code, hit `ctrl+r`, and I'm good to go.

<i>Header photo by <a href="https://unsplash.com/@andrewtneel?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Andrew Neel</a> on Unsplash</i>