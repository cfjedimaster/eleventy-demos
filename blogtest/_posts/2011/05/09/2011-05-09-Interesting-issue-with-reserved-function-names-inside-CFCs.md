---
layout: post
title: "Interesting issue with reserved function names inside CFCs"
date: "2011-05-09T19:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/05/09/Interesting-issue-with-reserved-function-names-inside-CFCs
guid: 4226
---

Earlier today <a href="http://bears-eat-beets.blogspot.com/">Tony Nelson</a> pinged me about an odd ColdFusion issue he ran into. It turned out to be an issue I've seen before outside of CFCs that - for whatever reason - acted somewhat different <i>inside</i> of a CFC. Let me explain a bit. First, let's look at his CFC.
<!--more-->
<p>

<code>
component {

	function init(string foo, string bar, string baz) {
		_set(foo, bar, baz);

	}

	function _set(string foo, string bar, string baz) {

	}

}
</code>

<p>

Nothing crazy here, just an init method that automatically calls a method called _set that takes three arguments. Each argument is optional (don't <a href="http://www.raymondcamden.com/index.cfm/2010/12/2/Quick-Test--Script-Based-UDFs">forget about that chnage</a>) so any amount of strings sent in should be fine. Now let's look at calling code:

<p>

<code>
&lt;cfset z = new test("foo", "bar", "baz")&gt;
</code>

<p>

When executed, you get:

<p>

<blockquote>
<b>Parameter validation error for the _SET function.</b>
<br/><br/>
The function accepts 2 to 2 parameters.
</blockquote>

<p>

Eh? I decided to simplify things a bit to see if it would help. I changed it to one CFM that looked like so:

<p>

<code>
&lt;cffunction name="_set"&gt;
	&lt;cfreturn 1&gt;
&lt;/cffunction&gt;

&lt;cfoutput&gt;#_set()#&lt;/cfoutput&gt;
</code>

<p>

Whenever I debug I try to simplify as much as possible. When run, I got:

<p>

<blockquote>
<b>The names of user-defined functions cannot be the same as built-in ColdFusion functions.</b>
<br/><br/>
The name _set is the name of a built-in ColdFusion function.
</blockquote>

<p>

Ahah! So I've seen this before in terms of UDFs with the same name as BIFs, but _set isn't a ColdFusion function, is it? Turns out it is - just behind the scenes. Turns out if you look at the Java object coldfusion.runtime.CfJspPage, you see this method defined:

<p>

<code>
&lt;cfset foo = createObject("java","coldfusion.runtime.CfJspPage")&gt;
&lt;cfdump var="#foo#"&gt;
</code>

<p>

I tried making UDFs with names from a few of the methods defined here and they all threw errors. For the most part I avoid weird names like _set so this wouldn't trip me up, but some of the methods did look like something I'd consider using like release(). It appears as if when executing as a CFM only, ColdFusion was better able to handle the error. But when executed via a CFC method the error is more ambiguous. In case you want to see a full list of the methods and don't want to run the code above, I whipped up this little script:

<p>

<code>
&lt;cfset foo = createObject("java","coldfusion.runtime.CfJspPage")&gt;
&lt;cfset methods = foo.getClass().getDeclaredMethods()&gt;
&lt;cfset allMethods = []&gt;
&lt;cfloop index="m" array="#methods#"&gt;
	&lt;cfif not arrayFind(allMethods, m.getName())&gt;
		&lt;cfset arrayAppend(allMethods, m.getName())&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
&lt;cfset arraySort(allMethods, "textnocase")&gt;
&lt;cfloop index="m" array="#allMethods#"&gt;
	&lt;cfoutput&gt;#m#&lt;br/&gt;&lt;br/&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

<p>

And here's the output: 

<p>

__caseValue<br/>
_addBD<br/>
_arrayAssign<br/>
_arrayGetAt<br/>
_arrayset<br/>
_arraySetAt<br/>
_autoscalarize<br/>
_autoscalarizeWithoutLocalScope<br/>
_Binary<br/>
_checkCFImport<br/>
_checkCondition<br/>
_checkParam<br/>
_clone<br/>
_compare<br/>
_contains<br/>
_div<br/>
_divideBD<br/>
_echoExpr<br/>
_emptyTag<br/>
_emptyTcfTag<br/>
_escapeSingleQuotes<br/>
_get<br/>
_getImplicitMethod<br/>
_getImplicitMethods<br/>
_idiv<br/>
_initTag<br/>
_invoke<br/>
_invokeUDF<br/>
_isDefined<br/>
_isNull<br/>
_isTopPage<br/>
_iteratorCollection<br/>
_LhsResolve<br/>
_mergeToLocal<br/>
_mod<br/>
_multiplyBD<br/>
_negateBD<br/>
_popBody<br/>
_powBD<br/>
_pushBody<br/>
_resolve<br/>
_resolveAndAutoscalarize<br/>
_set<br/>
_setCurrentLineNo<br/>
_setImplicitMethods<br/>
_setNonLocalScope<br/>
_structSetAt<br/>
_subtractBD<br/>
_templateName<br/>
_validateTagAttrConfiguration<br/>
_validateTagAttrValue<br/>
_validatingMap<br/>
_whitespace<br/>
ArrayGetAt<br/>
bindImportPath<br/>
bindPageVariable<br/>
bindPageVariables<br/>
checkRequestTimeout<br/>
checkSimpleParameter<br/>
createInitialValue<br/>
GetComponentMetaData<br/>
getExtends<br/>
getImplements<br/>
GetMetaData<br/>
getOutput<br/>
getPagePath<br/>
getQueryParamCount<br/>
getResolvedComponentPath<br/>
initialize<br/>
internalIsBoolean<br/>
internalIsNumeric<br/>
internalIsNumericDate<br/>
invoke<br/>
isNotMap<br/>
registerUDF<br/>
registerUDFs<br/>
release<br/>
resolveCanonicalName<br/>
runPage<br/>
setResolvedComponentPath<br/>
StringCouldBeODBCDateTime<br/>
StructStemGet<br/>
URLSessionFormat<br/>
urlSessionFormat<br/>

<p>

Finally, it does not as if this is documented. The Live Docs page for <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec173d0-7ff8.html">reserved words</a> has this to say:

<p>

<blockquote>
Built-in function names, such as Now or Hash
</blockquote>

<p>

But there is no warning about possible conflicts with these "hidden" methods. Has anyone else run into this?