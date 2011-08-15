var Calendar = {
	FIRST_DAY_OF_WEEK: 1,
	DAYS_IN_WEEK: 7,
	DAYS_SHORT_NAMES: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
	MIN_MONTH: 0,
	MAX_MONTH: 11,
	MIN_YEAR: 1900,
	MAX_YEAR: 2100,
	DAYS_IN_MONTH: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	MONTH_NAMES: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};

function limitValueToRange(value, min, max)
{
	var result = value;
	if (value < min)
	{
		result = min;
	}
	else if (value > max)
	{
		result = max;
	}
	return result;
}

function daysInWeekBeforeDay(weekDay)
{
	if (weekDay <= Calendar.FIRST_DAY_OF_WEEK)
	{
		weekDay += Calendar.DAYS_IN_WEEK;
	}
	return (weekDay - Calendar.FIRST_DAY_OF_WEEK);
}

var CalendarDate = Class.create({
	initialize: function(/*[month, year]*/)
	{
		var month = Calendar.MIN_MONTH;
		var year = Calendar.MIN_YEAR;
		if (arguments.length == 2)
		{
			month = arguments[0];
			year = arguments[1];
		}
		else
		{
			// obtain current month and year
			var currentDate = new Date();
			month = currentDate.getMonth();
			year = currentDate.getFullYear();
		}
		month = limitValueToRange(month, Calendar.MIN_MONTH, Calendar.MAX_MONTH);
		year = limitValueToRange(year, Calendar.MIN_YEAR, Calendar.MAX_YEAR);
		this.month = month;
		this.year = year;
	},
	
	previousMonth: function()
	{
		var month = this.month - 1;
		var year = this.year;
		if (month < Calendar.MIN_MONTH)
		{
			year--;
			month = Calendar.MAX_MONTH;
		}
		var result = null;
		if (year >= Calendar.MIN_YEAR)
		{
			result = new CalendarDate(month, year);
		}
		return result;
	},

	nextMonth: function()
	{
		var month = this.month + 1;
		var year = this.year;
		if (month > Calendar.MAX_MONTH)
		{
			year++;
			month = Calendar.MIN_MONTH;
		}
		var result = null;
		if (year <= Calendar.MAX_YEAR)
		{
			result = new CalendarDate(month, year);
		}
		return result;
	},

	daysInMonth: function()
	{
		var result = Calendar.DAYS_IN_MONTH[this.month];
		if (1 == this.month) // February
		{
			var divisibleBy4 = ((this.year % 4) == 0);
			var divisibleBy100 = ((this.year % 100) == 0);
			var divisibleBy400 = ((this.year % 400) == 0);
			var isLeapYear = (divisibleBy400 || (divisibleBy4 && !divisibleBy100));
			if (isLeapYear)
			{
				result = 29;
			}
		}
		return result;
	},

	dayOfWeekMonthStarts: function()
	{
		var monthStart = new Date(this.year, this.month, 1);
		return monthStart.getDay();
	},

	monthName: function()
	{
		return Calendar.MONTH_NAMES[this.month];
	}
});