dojo.provide("CalendarProject.tests.CalendarDateTest");

// Import in the code being tested
dojo.require("dojo.io.script");
// Relative to util/doh/runner.html
dojo.io.script.get({
       url:"../../../prototype/prototype.js"
});
dojo.io.script.get({
       url:"../../../../CalendarDate.js"
});

doh.register("CalendarProject.tests.CalendarDateTest.functions", [

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

doh.register("CalendarProject.tests.CalendarDateTest.CalendarDate", [
	// test initialize
	function test_defaultInit()
	{
		var calendarDate = new CalendarDate();
		var date = new Date();
		// actually, this test can fail when month changed between obtaining two dates. Run tests again in this case
		doh.assertEqual(date.getMonth(), calendarDate.month());
		doh.assertEqual(date.getFullYear(), calendarDate.year());
	},
	function test_initWithMonthAndYear()
	{
		var date = new CalendarDate(8, 2011);
		doh.assertEqual([8, 2011], [date.month(), date.year()]);
	},
	function test_initWithMonthOutOfRange()
	{
		var date1 = new CalendarDate(Calendar.MIN_MONTH - 3, 2011);
		doh.assertEqual([Calendar.MIN_MONTH, 2011], [date1.month(), date1.year()])
		var date2 = new CalendarDate(Calendar.MAX_MONTH + 7, 1973);
		doh.assertEqual([Calendar.MAX_MONTH, 1973], [date2.month(), date2.year()]);
	},
	function test_initWithYearOutOfRange()
	{
		var date1 = new CalendarDate(8, Calendar.MIN_YEAR - 2);
		doh.assertEqual([8, Calendar.MIN_YEAR], [date1.month(), date1.year()]);
		var date2 = new CalendarDate(5, Calendar.MAX_YEAR + 5);
		doh.assertEqual([5, Calendar.MAX_YEAR], [date2.month(), date2.year()]);
	},
	// test previous/next month
	function test_prevNextMonthSimple()
	{
		var date = new CalendarDate(7, 2011);
		var previousDate = date.previousMonth();
		doh.assertEqual([6, 2011], [previousDate.month(), previousDate.year()]);
		var nextDate = date.nextMonth();
		doh.assertEqual([8, 2011], [nextDate.month(), nextDate.year()]);
	},
	function test_prevNextMonthWrappingAroundYear()
	{
		var startOfYear = new CalendarDate(Calendar.MIN_MONTH, 2011);
		var previousDate = startOfYear.previousMonth();
		doh.assertEqual([Calendar.MAX_MONTH, 2010], [previousDate.month(), previousDate.year()]);
		var endOfYear = new CalendarDate(Calendar.MAX_MONTH, 2011);
		var nextDate = endOfYear.nextMonth();
		doh.assertEqual([Calendar.MIN_MONTH, 2012], [nextDate.month(), nextDate.year()]);
	},
	function test_prevNextMonthNearBounds()
	{
		var minDate = new CalendarDate(Calendar.MIN_MONTH, Calendar.MIN_YEAR);
		var previousDate = minDate.previousMonth();
		doh.assertEqual(null, previousDate);
		var maxDate = new CalendarDate(Calendar.MAX_MONTH, Calendar.MAX_YEAR);
		var nextDate = maxDate.nextMonth();
		doh.assertEqual(null, nextDate);
	},
	// test daysInMonth
	function test_daysInMonthSimple()
	{
		var september = new CalendarDate(8, 2011);
		doh.assertEqual(30, september.daysInMonth());
		var may = new CalendarDate(4, 2011);
		doh.assertEqual(31, may.daysInMonth());
	},
	function test_daysInMonthFebruary()
	{
		var february2011 = new CalendarDate(1, 2011);
		doh.assertEqual(28, february2011.daysInMonth());
		var february2012 = new CalendarDate(1, 2012);
		doh.assertEqual(29, february2012.daysInMonth());
		var february2000 = new CalendarDate(1, 2000);
		doh.assertEqual(29, february2000.daysInMonth());
		var february1900 = new CalendarDate(1, 1900);
		doh.assertEqual(28, february1900.daysInMonth());
	},
	// test dayOfWeekMonthStarts
	function test_dayOfWeekMonthStarts()
	{
		var september2011 = new CalendarDate(8, 2011);
		doh.assertEqual(4, september2011.dayOfWeekMonthStarts()); //Thursday
		var april1986 = new CalendarDate(3, 1986);
		doh.assertEqual(2, april1986.dayOfWeekMonthStarts()); //Tuesday
	},
	// test month name
	function test_monthName()
	{
		var september2011 = new CalendarDate(8, 2011);
		doh.assertEqual("September", september2011.monthName());
		var april1986 = new CalendarDate(3, 1986);
		doh.assertEqual("April", april1986.monthName());
	}
]);
