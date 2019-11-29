---
layout: post
title: "Spry built-in variables for Datasets"
date: "2006-11-01T11:11:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/11/01/Spry-builtin-variables-for-Datasets
guid: 1628
---

This is mainly for my own reference - but as I always have trouble finding it - I thought I'd share. When working with Spry datasets, you have access to both the data in the set (obviously) as well as a set of built-in variables prefixed by ds_. The variables you can use:


<ul>
<li>ds_RowID - This is the id of a row in the data set. This id can be used to refer to a specific record in the data set. It does not change even when the data is sorted.
<li>ds_RowNumber - This is the row number of the "current row" of the data set. Within a loop construct, this number reflects the position of the row currently being evaluated.
<li>ds_RowNumberPlus1 - This is the same as ds_RowNumber except that the first row starts at index 1 instead of index 0.
<li>ds_RowCount - This is the number of rows in the data set. If there is a non-destructive filter set on the data set, this is the total number of rows after the filter is applied.
<li>ds_UnfilteredRowCount - This is the number of rows in the data set before any non-destructive filter is applied.
<li>ds_CurrentRowID - This is the id of the "current row" of the data set. This value will not change, even when used within a looping construct construct.
<li>ds_CurrentRowNumber - This is the row number of the "current row" of the data set. This value will not change, even when used within a looping construct.
<li>ds_SortColumn - This is the name of the column last used for sorting. If the data in the data set has never been sorted, this will output nothing (an empty string).
<li>ds_SortOrder - This is the current sort order of the data in the data set. This data reference will output the words "ascending", "descending", or nothing (an empty string).
<li>ds_EvenOddRow - This looks at the current value of ds_RowNumber and returns the string "even" or "odd". This is useful for rendering alternate row colors.
</ul>

The text above was ripped from: <a href="http://labs.adobe.com/technologies/spry/articles/data_set_overview/">http://labs.adobe.com/technologies/spry/articles/data_set_overview/</a>

I'm thinking of creating a Spry cheat sheet to contain stuff like this and other tips that may be useful for development. If folks have some ideas for what to include, let me know by posting here.