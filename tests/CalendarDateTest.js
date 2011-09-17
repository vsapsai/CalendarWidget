dojo.provide("CalendarProject.tests.CalendarDateTest");

// Import in the code being tested
dojo.require("dojo.io.script");
// Relative to util/doh/runner.html
dojo.io.script.get({
       url:"../../../../calendarDate.js"
});
dojo.io.script.get({
       url:"../../../prototype/prototype.js"
});

doh.register("CalendarProject.tests.CalendarDateTest", [

	function test_limitValueToRange()
	{
		doh.assertEqual(7, limitValueToRange(7, 1, 10));
		doh.assertEqual(1, limitValueToRange(-7, 1, 10));
		doh.assertEqual(10, limitValueToRange(23, 1, 10));
	},
	function test_daysInWeekBeforeDay()
	{
		doh.assertEqual(Calendar.DAYS_IN_WEEK, daysInWeekBeforeDay(Calendar.FIRST_DAY_OF_WEEK)); // Monday
		for (var day = 1; day <= 6; day++) // Tuesday - Sunday
		{
			doh.assertEqual(day, daysInWeekBeforeDay(Calendar.FIRST_DAY_OF_WEEK + day));
		}
	},
	function test_rotateArray()
	{
		var original = [0, 1, 2];
		doh.assertEqual([0, 1, 2], rotateArray(original, 0));
		doh.assertEqual([1, 2, 0], rotateArray(original, 1));
		doh.assertEqual([0, 1, 2], original); // make sure passed into function array is unchanged
		doh.assertEqual([2, 0, 1], rotateArray(original, 2));
		doh.assertEqual([0, 1, 2], rotateArray(original, 3));
		// out of range behavior is undefined, exception most likely
	}
]);
