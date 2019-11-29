---
layout: post
title: "Variable Type Gotchas - ColdFusion Arrays and Boolean Functions"
date: "2007-05-10T09:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/10/Variable-Type-Gotchas-ColdFusion-Arrays-and-Boolean-Functions
guid: 2022
---

Time for another gotcha. Imagine you are a new ColdFusion developer and you need to sort an array. If you are like me, you may not read the complete documentation for the function. (I know I'm not the only one who skims the docs.) You see that there is an arraySort function so you write code like so:

<code>
&lt;cfset myarray = arraySort(myarray, "numeric")&gt;
</code>

You then go to display the array by looping over it and get an error. Why? It turns out the arraySort function (and others that I'll list below) actually returns true or false and operates on the array you pass in. The docs say that arraySort will return false if the sort failed. I haven't found a case where that actually happens. If you try to sort an array of strings numerically, for example, it throws an error.

That aside - it is definitely something that can trip a user up. Most folks will use a temporary variable to handle the sort:

<code>
&lt;cfset result = arraySort(myarray, "numeric")&gt;
</code>

But you don't need to do that. You can write it a bit shorter:

<code>
&lt;cfset arraySort(myarray, "numeric")&gt;
</code>

This begs the question - what if you want to sort an array and keep the original as is? Use a copy created by duplicate:

<code>
&lt;cfset newArr = duplicate(arr)&gt;
&lt;cfset arraySort(newArr, "numeric")&gt;
</code>

So which array functions act like this? (Note - I'm only listing the ones that may trick you up. For example, arrayIsEmpty returns a boolean but I'm sure folks expect that.)

arrayAppend<br>
arrayClear<br>
arrayDeleteAt<br>
arrayInsertAt<br>
arrayPrepend<br>
arrayResize<br>
arraySet<br>
arraySort<br>
arraySwap<br>