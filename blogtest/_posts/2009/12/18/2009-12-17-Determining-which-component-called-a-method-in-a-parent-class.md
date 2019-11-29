---
layout: post
title: "Determining which component called a method in a parent class"
date: "2009-12-18T07:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/18/Determining-which-component-called-a-method-in-a-parent-class
guid: 3654
---

Here's a question where I had a couple of answers, but I'm willing to bet we can have a good debate as to what would be preferred. I'll post the question, my answers, and then I'd love to see what other people think as well. First, the question from Don:

<blockquote>
In one method of a cfc I need to know the name of the cfc. I know this seems strange but the cfc extends a superclass and I need to know which subclass I am in.

Maybe an example will make this less muddy.

voAccount  and voCustomer both extend voSuperclass

There is a method in the superclass in which I would like to know which subclass is executing the method.

I could create an instance variable when I run the init method and set this.componentName=foo but that would mean adding a parameter to the init method
and while that is no big deal I was hoping to determine the name programatically without this step.

Any Suggestions?
</blockquote>

So to start off, let's design a super simple model we can use for testing. Imagine a child component. This child component has one method, getGift(). Santa Claus uses it to determine what gift should be given to the child. Two child classes (of child - heh - sorry if that's confusing) extend this base: badchild and goodchild. Bad children will get coal. Good children will get a Red Ryder BB Gun. So given that getGift() is defined in child.cfc, how can we handle handing out the right gift? Here are some ideas!
<!--more-->
In my first version, I suggested simply checking the metadata for the current component. As an example: 

<b>child.cfc</b><br/>

<code>
component {

    public string function getGift() {
	
	   var md = getMetadata(this);
	   var myname = listLast(md.name, ".");
	   if(myname == "goodchild") return "Red Ryder BB Gun";
	   if(myname == "badchild") return "coal";
	   throw "Invalid child!";
	
	}

}
</code>

As you can see, I examine the metadata for This, the current component, and simply look at the name component. This will contain, possibly, dot paths, so I just grab the end. I'm not going to show you goodchild and badchild since they both contain just 2 lines of code, with the critical line being: component extends="child" {

To test this, I wrote:

<code>
&lt;cfset ray = new v1.goodchild()&gt;
&lt;cfset scott = new v1.badchild()&gt;

&lt;cfset raygift = ray.getGift()&gt;
&lt;cfset scottgift = scott.getGift()&gt;

&lt;cfoutput&gt;
Ray gets: #raygift#.&lt;br/&gt;
Scott gets: #scottgift#.
&lt;/cfoutput&gt;
</code>

The output is as you expect:

Ray gets: Red Ryder BB Gun.<br/>
Scott gets: coal.

Ok, so how about another way? In my second method, I tried using isInstanceOf. This is a function I've rarely used, but it works well here. Once again, here is child.cfc:

<code>
component {

    public string function getGift() {

       if(isInstanceOf(this, "goodchild")) return "Red Ryder BB Gun";
       if(isInstanceOf(this, "badchild")) return "coal";
	   throw "Invalid child!";
	
	}

}
</code>

As you can see - it checks the current component against a string type and if true, returns the right gift. To test this I wrote:

<code>
&lt;cfset ray = new v2.goodchild()&gt;
&lt;cfset todd = new v2.badchild()&gt;

&lt;cfset raygift = ray.getGift()&gt;
&lt;cfset toddgift = todd.getGift()&gt;

&lt;cfoutput&gt;
Ray gets: #raygift#.&lt;br/&gt;
Todd gets: #toddgift#.
&lt;/cfoutput&gt;
</code>

And got...

Ray gets: Red Ryder BB Gun.<br/>
Todd gets: coal.

So far so good. How about a third way? I know that Don said he wanted to do things programatically and he specifically said he didn't want to use a hard coded value in the init method. However - what about writing a getGift method in the children that than tie to the paren'ts getGift? So for example, consider this version of goodchild.cfc:

<code>
component extends="child" {

    public string function getGift() {
       return super.getGift("good");
    }

}
</code>

Notice how it still makes use of the getGift from the base class, but it handles passing along a type of child. The badchild has this code:

<code>
component extends="child" {

    public string function getGift() {
	   return super.getGift("bad");
	}

}
</code>

And finally, child.cfc is:

<code>
component {

    public string function getGift(string type) {

        if(arguments.type=="good") return "Red Ryder BB Gun";
	if(arguments.type=="bad") return "coal";
        throw "Invalid child!";
	
	}

}
</code>

Ok, so which is "right"? Honestly, I can't say. To me, the third method feels closest to proper, if its even fair to say proper. The base class no longer cares about the type - instead of the CFCs who extend it worry about it. The base class method focuses on returning the right gift based on the type of child. With the third method I also feel like I have more control. So imagine a naughtychild.cfc - a child who isn't bad, just naughty. I could possibly write code to say, based on the economy, gift the naughty child a good gift anyway. Yeah I'm kinda pulling that example out of my rear, but you get the idea. 

So thoughts? I'll remind Don, and others, to keep in mind that there is no One True Way, and I know my commenters won't suggest that (since we've got a smart bunch here).

I've included my test code as an attachment to this entry.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fbadandgoodkids%{% endraw %}2Ezip'>Download attached file.</a></p>