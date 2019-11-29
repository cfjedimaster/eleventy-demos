---
layout: post
title: "Real time textual analysis via OpenAmplify"
date: "2011-06-02T23:06:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2011/06/02/Real-time-textual-analysis-via-OpenAmplify
guid: 4255
---

I've blogged before (see related entries below) about the coolness that is <a href="http://www.openamplify.com/">OpenAmplify</a>. OpenAmplify provides an APi that does deep language parsing. It's not perfect of course - but in my testing it can be eerily spot on. In my previous blog entry on the topic I talked about how to use it via ColdFusion. You could imagine using OpenAmplify as a nightly task to scan the user generated content on your site and provide statistics on the general mood as well as topics covered in your discussions. For a site getting <i>lots</i> of dynamic content from their community, that could be vital. What I discovered this week though that is OpenAmplify also provides a JavaScript API. Here is a simple demo I created that uses their API, along with jQuery, to provide contextual analysis <i>while you type</i>. This could get annoying on a real forum perhaps, but it's kinda cool here. 

<p>
<!--more-->
<code>

&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;
&lt;head&gt;
&lt;meta http-equiv="Content-Type" content="text/html; charset=utf-8" /&gt;
&lt;title&gt;Untitled Document&lt;/title&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
var api = "http://portaltnx20.openamplify.com/AmplifyWeb_v20/AmplifyThis";
var apikey = "dhj34antjkh87bs6fmrrhymganaz78d5";
var apiURL = api + "?apiKey="+apikey+"&analysis=styles&outputFormat=json_js";

$(document).ready(function() {

	var debounce = function (func, threshold, execAsap) {
        var timeout;
     
        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null; 
            };
     
            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);
     
            timeout = setTimeout(delayed, threshold || 100); 
        };
     
    }

	$("#comments").keyup(debounce(function(e) {
		$("#commentText").html("");
		var text = $.trim($(this).val());
		if(text == '') return;
		if(text.length &lt; 5) return;

		$.getScript(apiURL + "&inputText="+escape(text),function(data,status) {
			var content = "";
			content += "Your comment is generally " + amplifyOutput.StylesResponse.StylesReturn.Styles.Polarity.Mean.Name + "&lt;br&gt;";
			content += "Is your comment offering guidance?  " + amplifyOutput.StylesResponse.StylesReturn.Styles.OfferingGuidance.Name + "&lt;br&gt;";
			content += "Is your comment requesting guidance?  " + amplifyOutput.StylesResponse.StylesReturn.Styles.RequestingGuidance.Name + "&lt;br&gt;";
			content += "How decisive is your comment?  " + amplifyOutput.StylesResponse.StylesReturn.Styles.Decisiveness.Name + "&lt;br&gt;";
			content += "Uses slang?  " + amplifyOutput.StylesResponse.StylesReturn.Styles.Slang.Name + "&lt;br&gt;";
			content += "How flamboyant?  " + amplifyOutput.StylesResponse.StylesReturn.Styles.Flamboyance.Name + "&lt;br&gt;";
			
			$("#commentText").html(content);
		});
	},500));
});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;form&gt;
&lt;textarea name="comments" id="comments" cols="30" rows="10"&gt;&lt;/textarea&gt;
&lt;div id="commentText"&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

The HTML view portion of this is just the form with the text area. Pretend it's the blog comment form. The div beneath is blank and will be used for feedback. Now scroll to the top. The debounce function is something I've mentioned before. It's just going to be used to slow things down a bit as we type. We use it within our keyup event handler for the textarea. I grab the current value, and if it's big enough, we do a getScript() call to load in the remote OpenAmplify service. I specifically focused on the style portion of their API. They provide a lot more. I take the result, a JSON object, and then just create a nice result string from it. So how does it work? Check out the video:

<p>

<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" width="331" height="459" id="mymoviename"> 
<param name="movie" value="http://www.raymondcamden.com/images/2011-06-02_2130.swf" />  
<param name="quality" value="high" /> 
<param name="bgcolor" value="#ffffff" /> 
<embed src="http://www.coldfusionjedi.com/images/2011-06-02_2130.swf" quality="high" bgcolor="#ffffff" width="331" height="459" name="mymoviename" align="" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"> 
</embed> 
</object>

<p>

I setup an online demo of this as well, but with my personal API key being used, it may start throwing errors under load. Be gentle. 

<p>


<a href="http://www.coldfusionjedi.com/demos/june12011/test3.html"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>