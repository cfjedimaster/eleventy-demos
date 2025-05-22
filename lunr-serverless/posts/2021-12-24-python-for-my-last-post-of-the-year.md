---
layout: post
title: "Python for My Last Post of the Year..."
date: "2021-12-24T18:00:00"
categories: ["development"]
tags: "post"
description: A simple Python function I wrote for no good reason whatsoever...
---

For the last post of the year (probably, I'm off next week with very little on my calendar so I hope to spend a lot of time doing nothing, not blogging) I thought I'd share a quick Python function. This function is inspired by my favorite Christmas movie, ["A Christmas Story"](https://www.imdb.com/title/tt0085334/). In one of the more pivotal scenes, one character dares another to stick their tongue on a cold pole. You see, one of the characters said their dad stated that sticking their tongue on cold metal would result in the tongue sticking. The other character didn't believe it. As you can imagine, disaster unfolds.

<p>
<img src="https://static.raymondcamden.com/images/2021/12/pole_post.jpg" alt="Tongue stuck to cold post, shot from A Christmas Story" class="lazyload imgborder imgcenter">
</p>

In this scene, the character goading the other to stick his tongue on the pole uses progressively more serious "dares", so for example, first a dare, then a double dare, and so forth.

At one point the character goes from "double dog dare" to "triple dog dare", and the narrator mentions how it's a slight breach of etiquette. 

For some reason, I thought it would be fun to write a Python checker that lets you take two "dares" and determines if it's a valid "raise". So for example, "double dare" is a valid raise from "dare". As is "double dog dare", even though it skips a few levels. But "dare" would not be a valid raise from "triple dare" as that goes down in - well, "dare-osity"? 

Pointless, I know. But I wrote it:

```python
def validDareRaise(initialDare, newDare):
	# define valid date values
	validDares = ["dare", "double dare", "double dog dare", "triple dare", "triple dog dare"]
	
	# First, are the dares valid
	if validDares.count(initialDare) == 0 or validDares.count(newDare) == 0:
		return False

	return validDares.index(initialDare) < validDares.index(newDare)
```

First I validate both the initial and new dare. If either are invalid, I return false. Note that you can't use the Python `index` list method as it returns an error if an element doesn't exist. Then I can simply return a True/False bases on if the first dare's index value is less than the second (equality is not allowed).

Here's a few simple tests:

```python
print("valid dare raise: cat, double dare:", validDareRaise("cat", "double dare"))
print("valid dare raise: dare, dog:", validDareRaise("dare", "dog"))

print("valid dare raise: dare, double dare:", validDareRaise("dare", "double dare"))
print("valid dare raise: double dare, dare:", validDareRaise("double dare","dare"))
print("valid dare raise: double dog dare, triple dog dare:", validDareRaise("double dog dare", "triple dog dare"))
```

And the output:

```bash
valid dare raise: cat, double dare: False
valid dare raise: dare, dog: False
valid dare raise: dare, double dare: True
valid dare raise: double dare, dare: False
valid dare raise: double dog dare, triple dog dare: True
```

And that's it. By the way, I was searching my blog content for Python stuff and discovered that sometime back in 2007 I stated that Python just looked "wrong" to me. Wow. Oh, and a few years after that I casually mentioned trying to learn it. I guess that went nowhere. I've said it before and I'll say it again - Python is the first language I've truly been excited about in a very long time. I love it!

Photo by <a href="https://unsplash.com/@frostroomhead?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Rodion Kutsaev</a> on <a href="https://unsplash.com/s/photos/christmas?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  
