dojo.provide("CalendarProject.tests.module");
//This file loads in all the test definitions.  

try
{
//	//Load in the demoFunctions module test.
	dojo.require("CalendarProject.tests.CalendarDateTest");
//	//Load in the widget tests.
//	dojo.require("demo.doh.tests.widgets.DemoWidget");
}
catch (e)
{
	doh.debug(e);
}
