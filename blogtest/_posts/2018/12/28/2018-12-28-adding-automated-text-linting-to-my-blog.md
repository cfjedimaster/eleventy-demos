---
layout: post
title: "Adding Automated Text Linting to My Blog"
date: "2018-12-28"
categories: ["development"]
tags: []
banner_image: /images/banners/newspaper.jpg
permalink: /2018/12/28/adding-automated-text-linting-to-my-blog
---

I've been doing technical writing for nearly twenty years now, and if there's one thing I've grown to appreciate it is the power of a good editor. I've had editors at various parts of my career and frankly there's no doubt my writing was far improved with their help. While I believe that a real person looking over my work would be best, I was curious about whether I could add a bit of automation for this using a tool I ran across last week, [textlint](https://textlint.github.io/). 

textlint is a linting service built on various rules that look for different issues in your text. The [list of rules](https://github.com/textlint/textlint/wiki/Collection-of-textlint-rule) is rather long, and frankly, a bit overwhelming. As an example, the second documented rule has this functionality: "This rule check no start with duplicated conjunction." Raise your hand if you know what a "duplicated conjunction" is. 

I went through the list and added what I thought would make sense. Each rule also has configuration options but for the most part I kept things at their default. I used the following rules:

* no-start-duplicated-conjunction: I'm still confused by what this actually does, but it seems to prevent multiple sentences starting with words like "But", "So", etc. 
* no-dead-link: This one is very cool - it checks your links to ensure they actually resolve.
* terminology: Looks for things like "Javascript" instead of "JavaScript" and "NPM" instead of "npm"
* no-unmatched-pair: Basically using a ( and forgetting the ).
* alex: This one is really fascinating - it looks for text that can be offensive or not inclusive. So as a simple example, using "mailman" instead of "mailperson" or "postal worker". Obviously this is the kind of thing you may not care about, but it definitely appealed to me.
* spellchecker: I use a spellchecker in Visual Studio Code, but sometimes I just miss the warnings. Unfortunately this rule is broken for me now and not flagging any issues, but I've got an issue open on their repository.

With these rules in place, I can run a manual check on an article like so:

	./node_modules/.bin/textlint ./_posts/2018/12/13/2018-12-13-using-alexa-to-mess-with-your-kids-because-why-not.md

And here is the output:

```text
   11:1    error  [postman-postwoman] `mailman` may be insensitive, use `mail carrier`, `letter carrier`, `postal worker` instead  alex
   11:630  error  [kids] Be careful with “kids”, it’s profane in some cases                                                        alex
   13:180  error  [kid] Be careful with “kid”, it’s profane in some cases                                                          alex
   22:194  error  [crap] Don’t use “crap”, it’s profane                                                                            alex
  129:330  error  [screw] Reconsider using “screw”, it may be profane                                                              alex

✖ 5 problems (5 errors, 0 warnings)
```

Pretty cool! Now came the fun part - integrating this into an automated process. Elijah Manor had a great article on this (["Run npm scripts in a git pre-commit Hook"](https://elijahmanor.com/npm-precommit-scripts/)). In this article, he talks about how to automate the running of linters when doing commits via Git. While the article is good, he now recommends another tool for this called [husky](https://github.com/typicode/husky). Finally, I had to also add [lint-staged](https://github.com/okonet/lint-staged), a tool to handle recognizing what's about to be committed and only running your linter on that. 

After adding both tools to my repo, I then modified my package.json to add the following:

```js
"husky": {
	"hooks": {
		"pre-commit": "lint-staged"
	}
},
"lint-staged":{
	"*.md":"textlint"
}
```

And then did a test:

```text
✖ textlint found some errors. Please fix them and try committing again.

/mnt/c/projects/raymondcamden2018/_posts/2018/12/28/2018-12-28-adding-automated-text-linting-to-my-blog.md
22:210  ✓ error  Incorrect usage of the term: “repo”, use “repository” instead  terminology
40:236  error    [he-she] `he` may be insensitive, use `they`, `it` instead     alex
40:345  error    [he-she] `he` may be insensitive, use `they`, `it` instead     alex

✖ 3 problems (3 errors, 0 warnings)
```

Nice. I totally agree with the repo/repository comment, but the second two don't apply as I'm talking about a man in the singular. (And if I'm wrong, leave me a comment below!) I can now get feedback before I release an article and if I don't agree, I simply: `get commit -m "something" --no-verify` to bypass the check. 

What do you think? Drop me a comment below and let me know if you think this process makes sense or if you would do things differently.

<i>Header photo by <a href="https://unsplash.com/photos/ihiEd-_4TNY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Hayden Walker</a> on Unsplash</i>