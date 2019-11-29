---
layout: post
title: "Spry 1.4 Released!"
date: "2006-12-14T17:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/12/14/Spry-14-Released
guid: 1713
---

The site still says 1.3, but you can now download <a href="http://www.macromedia.com/go/labs_spry_download">Spry 1.4</a>. I'll have some examples later on.

<b>Some folks are getting the wrong zip. If you do, just give it an hour.</b>

Straight from the changelist here are the updates:

<h4>Changes for Spry PreRelease 1.4 - 2006/12/14</h4>
		  <ul>
				<li>Data
					<ul>

						<li>Added function Spry.Utils.serializeObject() for serializing a JS Object into JSON format.</li>
						<li>Added Spry.XML.nodeToObject() and 
						Spry.XML.documentToObject() utility methods which allow developers to access XML data as JS properties on an object in a manner which is similar to E4X.</li>
						<li>Added Spry.Utils.updateContent() for dynamically loading an HTML fragment into an element. </li>
						<li>Added Spry.Utils.setInnerHTML() for setting the innerHTML of an element and executing any scripts within the content string. This method is now used by Spry regions when regenerating their content. </li>
						<li>Added support for mapping a region state name to another state name. This can be useful for overriding the built-in states, like &quot;ready&quot;, &quot;loading&quot;, and &quot;error&quot;, so that they use markup from a custom state when they fire. </li>

						<li>Added support for more attributes:
							<ul>
								<li>spry:even - Conditionally adds the user specified CSS class name to an element based on the current row number used at the time that element was re-generated.</li>
								<li>spry:odd - Conditionally adds the user specified CSS class name to an element based on the current row number used at the time that element was re-generated. </li>
								<li>spry:setrow - Attaches a non-destructive onclick handler that sets the current row by row ID. </li>
								<li>spry:setrownumber - Attaches a non-destructive onclick handler that sets the current row by row number. </li>
								<li>spry:sort - Attaches a non-destructive onclick handler that sorts a specific data set based on columns specified by the user.</li>

								<li>spry:readystate - Maps the &quot;ready&quot; state name to the name specified in its value. </li>
								<li>spry:errorstate - Maps the &quot;error&quot; state name to the name specified in its value.</li>
								<li>spry:loadingstate - Maps the &quot;loading&quot; state name to the name specified in its value.</li>

							</ul>
						</li>
						<li>Added code to report and error when nested regions and detail regions are detected. </li>
						<li>Added new methods to the DataSet API:
							<ul>
								<li>getRowCount()</li>
								<li>getRowByID()</li>
								<li>getRowByRowNumber()</li>

								<li> findRowsWithColumnValues()</li>
							</ul>
						</li>
					</ul>
				</li>
		  		<li>Effects
		  			<ul>
		  				<li>Minor updates of documentation (effects_api and effects_coding, especially of the allowed elements to which the effects can be applied to).</li>

	  				    <li>Fixed bugs:
	  				      <ul>
		  			        <li>GrowShrink effect: if border is set, width&amp;height style doesn't get reset to the original value after you toggled the target element</li>
		  			        <li>GrowShrink effect: text size inside the target element is alternated after the effect has been finished</li>
		  			        <li>Slide and Blind effect: Scrollbar disappears if overflow:scroll is set and you toggle the element</li>
		  			        <li>GrowShrink effect: nested image elements doesn't grow if you grow the target element</li>
		  			        <li>Slide effect: Text inside sliding element doesn't appear once you toggle the effect (IE 7 only)</li>

		  			        <li>Shake effect: doesn't work perperly in Opera 9.0</li>
		  			        <li>AppearFade effect: not working for content of a &lt;div&gt; inside a &lt;td&gt; (IE only)<br />
	  			            </li>
	  			          </ul>
	  				    </li>

		  			    <li>new feature:
		  			      <ul>
		  			        <li>GrowShrink effect: added options 'referHeight' and 'growCenter'<br />
	  			                </li>
	  			          </ul>
		  			    </li>
                        <li>IE 7 related fixes also take effect on Windows Vista (not only on XP)</li>
  			            <li>new feature:
  			              <ul>

  			                <li>Slide effect: added option 'horizontal' to allow horizontal sliding  </li>
	                      </ul>
		              </li>
	  			        <li>Slightly updated documentation to reflect new slide option</li>
	  			        <li> Simplified cluster  construction: cluster now is an effect, too, which accepts  setup and finish callbacks as option arguments of its constructor</li>
		  			    <li>Base effects (like Move, Size, etc.) can be called without from argument. Instead of passing element, fromPos, toPos, options as arguments, the effects can be called with element, toPos, options. The fromPos is calculated on the fly based on the current position. </li>

		  			    <li>AppearFade, Blind, GrowShrink, Slide and Squish effects now can be triggered for initially invisible elements ('display:none' or 'visibility:hidden')</li>
		  			</ul>
	  		</li>
		  		<li>Widgets
		  			<ul>
		  				<li>Added Menu Bar widget</li>
	  					<li>Added Tabbed Panels widget</li>

	  					<li>Added Collapsible Panel widget</li>
	  			        <li>Added Form Validation Widgets
	  			          <ul>
	  			            <li>Check Box</li>
  			                <li>Text Area</li>
	  			            <li>Text Field</li>
	  			            <li>Select</li>

	  			          	</ul>
	  			        </li>
	  			    	<li>Accordion:
	  			    		<ul>
	  			    			<li>Added support for variable height panels.</li>
  			    				<li>Added some new constructor options:
  			    					<ul>
  			    						<li>useFixedHeightPanels - This value is true by default. If false allows for variable height panels. </li>
  			    						<li>fixedPanelHeight - Number of pixels to use as the height of each panel when animating. By default this is the same as the first open panel. </li>

  			    						<li>duration - Number of milliseconds it takes to open/close a panel. Default is 500 msecs. </li>
		    						</ul>
  			    				</li>
  			    				<li>Fixed bug that prevented panels from animating properly when the accordion started out with a display:none style.</li>
	  			    			<li>Removed addNewPanel(), getNewPanelSnippet(), getNewAccordionSnippet(), and getNewAccordionConstructorSnippet() methods. They don't work cross-browser, and should've never seen the light of day. </li>
	  			    		</ul>
	  			    	</li>

	  				</ul>
  		   </li>
		  		<li>Docs
		  		  <ul>
		  		    <li>Added overview for Tabbed Panels widget.</li>
	  		        <li>Added overview for Collapsible Panel widget. </li>
		  		    <li>Added overview docs for each Form widget. </li>
	  		      </ul>

	  		</li>
		  		<li>Demos 
		  			<ul>
		  				<li>Gallery
		  					<ul>
		  						<li>Switch from using an interval timer to manually firing off the slide show timer after each image loads. This will allow images loading over slow connections to completely load. </li>
				        	</ul>
	  				  </li>
				        <li>Products
				        	<ul>

				        		<li>index.html to use spry:sort and spry:setrow. </li>
		        				<li>Use a spry:choose attribute to show/preserve the currently selected product on initial load and after a sort.</li>
				        	</ul>
				        </li>
				        <li>RSS Reader
				        	<ul>
				        		<li>Modified index.{% raw %}{html,cfm,php}{% endraw %} to use spry:setrow. </li>
			        		</ul>

				        </li>
				        <li>Added Form Validation demo. </li>
		  			</ul>
		  		</li>
	  		    <li>Samples
	  		      <ul>
	  		        
		  		    <li>Added sample for Tabbed Panels widget.</li>

		  		    <li>Added sample for Collapsible Panel widget.</li>
	  		        <li>Added samples for 4 Form widgets.  </li>
	  		        <li>Moved data set and region examples to the samples/data_region folder.</li>
	  		        <li>Changed Effects sample files to use standard samples.css file. </li>
	  		        <li>Added a samples/utils folder with samples of Spry utility functions.</li>
	  		        <li>Released a query-to-XML sample page that shows how to convert dynamic data into XML. </li>

	  		        <li>Added to EvenOddRowSample.html to include spry:even and spry:odd. </li>
	  		      	<li>Added SprySetRowSample.html. </li>
	  		      	<li>Modified the AccordionSample:
	  		      		<ul>
	  		      			<li>Added sample for changing the duration of animations.</li>

  		      				<li>Modified variable height accordion sample to use animation.</li>
	  		      			<li>Added a style for spans used as content panels so that they animate properly. </li>
	  		      			</ul>
	  		      	</li>
	  		      	<li>Added SetCurrentRowByValueSample.html to show how to select a row based on some column values. </li>
	  		      	<li>Added StateMappingSample.html to show how to map the built-in region states to your own custom states. </li>

	  		      </ul>
  		    </li>
          </ul>