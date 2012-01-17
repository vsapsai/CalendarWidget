// DOM helpers
function addRowToTable(tableSection, rowElements)
{
	var row = new Element('tr');
	$A(rowElements).inject(row, function(container, element)
		{
			container.appendChild(element);
			return container;
		});
	tableSection.appendChild(row);
}

function tableCells(from, to, attributes)
{
	attributes = attributes || {};
	return $A($R(from, to)).map(function(cell)
	{
		return new Element('td', attributes).update(cell);
	});
}

var CalendarWidget = Class.create({
	initialize: function(widgetContainer)
	{
		this._currentMonth = new CalendarDate();
		this._buildCalendarForMonth(this._currentMonth, $(widgetContainer));
		this._isRunningAnimation = false;
		this._movementDirectionAfterAnimation = 0;
	},
	
	_buildCalendarForMonth: function(month, destinationContainer)
	{
		var container = new Element('div', {'class': 'calendar'});
		destinationContainer.appendChild(container);

		var previousMonth = month.previousMonth();
		var nextMonth = month.nextMonth();
		this._buildTitleAndNavigation(container, (null != previousMonth), (null != nextMonth));
		
		var gridsContainer = new Element('div', {'class': 'horizontalAnimatedContainer'});
		container.appendChild(gridsContainer);
		this._setCalendarGridWidth(gridsContainer.getWidth());
		this._previousMonthGrid = ((null != previousMonth) ?
							this._buildCalendarGridForMonth(previousMonth, gridsContainer, -this._calendarGridWidth())
							: null);
		this._currentMonthGrid = this._buildCalendarGridForMonth(month, gridsContainer, 0);
		this._nextMonthGrid = ((null != nextMonth) ?
							this._buildCalendarGridForMonth(nextMonth, gridsContainer, this._calendarGridWidth())
							: null);
	},
	
	_buildTitleAndNavigation: function(container, hasPreviousMonth, hasNextMonth)
	{
		var title = new Element('div', {'id': 'calendarTitle', 'class': 'caption'});
		title.observe('click', this.goToHigherLevel.bindAsEventListener(this));
		if (hasPreviousMonth)
		{
			var backButton = new Element('a', {'id': 'backButton', 'href': '#'});
			var backButtonImage = new Element('img', {'src': 'leftArrow.svg'});
			backButton.appendChild(backButtonImage);
			backButton.observe('click', this.goPrevious.bindAsEventListener(this));
			title.appendChild(backButton);
		}
		var monthNameLabel = new Element('span');
		title.appendChild(monthNameLabel);
		this._monthNameLabel = monthNameLabel;
		this._updateMonthNameLabel();
		if (hasNextMonth)
		{
			var forwardButton = new Element('a', {'id': 'forwardButton', 'href': '#'});
			var forwardButtonImage = new Element('img', {'src': 'rightArrow.svg'});
			forwardButton.appendChild(forwardButtonImage);
			forwardButton.observe('click', this.goNext.bindAsEventListener(this));
			title.appendChild(forwardButton);
		}
		container.appendChild(title);
	},

	_calendarGridWidth: function()
	{
		return this.__calendarGridWidth;
	},
	_setCalendarGridWidth: function(width)
	{
		this.__calendarGridWidth = width;
	},

	_buildCalendarGridForMonth: function(month, container, xOffset)
	{
		var calendar = new Element('table', {'class': 'grid', 'style': 'top: 0; left:' + xOffset + 'px;'});
		// build head
		var head = new Element('thead');
		var dayNames = rotateArray(Calendar.DAYS_SHORT_NAMES, Calendar.FIRST_DAY_OF_WEEK);
		addRowToTable(head, $A(dayNames).map(function(dayName)
		{
			return new Element('th').update(dayName);
		}));
		calendar.appendChild(head);

		// build calendar grid
		var grid = new Element('tbody', {'id': 'calendarGrid'});
		grid.observe('click', this.selectDay.bindAsEventListener(this));
		// --build mixed first week
		var daysFromPreviousMonth = daysInWeekBeforeDay(month.dayOfWeekMonthStarts());
		var previousMonth = month.previousMonth();
		var previousMonthCells = tableCells(
			previousMonth.daysInMonth() - daysFromPreviousMonth + 1,
			previousMonth.daysInMonth(),
			{'class': 'disabled'});
		var firstWeekDaysCount = Calendar.DAYS_IN_WEEK - daysFromPreviousMonth;
		previousMonthCells = previousMonthCells.concat(tableCells(1, firstWeekDaysCount));
		addRowToTable(grid, previousMonthCells);
		// --build full weeks
		var currentMonthDaysLeft = month.daysInMonth() - firstWeekDaysCount;
		var fullWeeksCount = Math.floor(currentMonthDaysLeft / Calendar.DAYS_IN_WEEK);
		for (var i = 0; i < fullWeeksCount; i++)
		{
			addRowToTable(grid, tableCells(
				firstWeekDaysCount + i * Calendar.DAYS_IN_WEEK + 1,
				firstWeekDaysCount + (i + 1) * Calendar.DAYS_IN_WEEK));
		}
		// --build mixed last week
		var lastWeekDaysCount = (month.daysInMonth() - firstWeekDaysCount) % Calendar.DAYS_IN_WEEK;
		var lastWeekCells = tableCells(
			month.daysInMonth() - lastWeekDaysCount + 1,
			month.daysInMonth());
		var nextMonthDays = Calendar.DAYS_IN_WEEK - lastWeekDaysCount;
		lastWeekCells = lastWeekCells.concat(tableCells(1, nextMonthDays, {'class': 'disabled'}));
		addRowToTable(grid, lastWeekCells);
		// --build additional week if necessary
		if (fullWeeksCount + 2 < 6) // require calendar to have 6 weeks
		{
			addRowToTable(grid, tableCells(
				nextMonthDays + 1,
				nextMonthDays + Calendar.DAYS_IN_WEEK,
				{'class': 'disabled'}));
		}
		calendar.appendChild(grid);
		container.appendChild(calendar);
		return calendar;
	},
	
	_updateMonthNameLabel: function()
	{
		this._monthNameLabel.update(this._currentMonth.monthName() + ', ' + this._currentMonth.year());
	},
	
	// event handlers
	//TODO: disable actions during animation
	goToHigherLevel: function(event)
	{
		console.log("goToHigherLevel");
		event.stop();
	},

	goNext: function(event)
	{
		if (event)
		{
			event.stop();
		}
		if (this._isRunningAnimation)
		{
			this._movementDirectionAfterAnimation = 1;
			return;
		}
		this._isRunningAnimation = true;
		var disappearingTable = this._currentMonthGrid;
		var appearingTable = this._nextMonthGrid;
		var animationOffset = this._calendarGridWidth();
		var moveAnimationOptions = {'x': -animationOffset, 'y': 0, sync: true};
		new Effect.Parallel([
			new Effect.Move(disappearingTable, moveAnimationOptions),
			new Effect.Move(appearingTable, moveAnimationOptions)
		], {afterFinish: this._goNextAnimationDidEnd.bind(this)});
	},
	
	_goNextAnimationDidEnd: function(effect)
	{
		this._currentMonth = this._currentMonth.nextMonth();
		this._updateMonthNameLabel();
		if (this._previousMonthGrid)
		{
			this._previousMonthGrid.remove();
		}
		this._previousMonthGrid = this._currentMonthGrid;
		this._currentMonthGrid = this._nextMonthGrid;
		var nextMonth = this._currentMonth.nextMonth();
		var gridsContainer = this._currentMonthGrid.up();
		this._nextMonthGrid = ((null != nextMonth) ?
							this._buildCalendarGridForMonth(nextMonth, gridsContainer, this._calendarGridWidth())
							: null);
		this._isRunningAnimation = false;
		this._moveAfterAnimationDidEnd();
	},

	goPrevious: function(event)
	{
		if (event)
		{
			event.stop();
		}
		if (this._isRunningAnimation)
		{
			this._movementDirectionAfterAnimation = -1;
			return;
		}
		this._isRunningAnimation = true;
		var disappearingTable = this._currentMonthGrid;
		var appearingTable = this._previousMonthGrid;
		var animationOffset = this._calendarGridWidth();
		var moveAnimationOptions = {'x': animationOffset, 'y': 0, sync: true};
		new Effect.Parallel([
			new Effect.Move(disappearingTable, moveAnimationOptions),
			new Effect.Move(appearingTable, moveAnimationOptions)
		], {afterFinish: this._goPreviousAnimationDidEnd.bind(this)});
	},
	
	_goPreviousAnimationDidEnd: function(effect)
	{
		this._currentMonth = this._currentMonth.previousMonth();
		this._updateMonthNameLabel();
		if (this._nextMonthGrid)
		{
			this._nextMonthGrid.remove();
		}
		this._nextMonthGrid = this._currentMonthGrid;
		this._currentMonthGrid = this._previousMonthGrid;
		var previousMonth = this._currentMonth.previousMonth();
		var gridsContainer = this._currentMonthGrid.up();
		this._previousMonthGrid = ((null != previousMonth) ?
							this._buildCalendarGridForMonth(previousMonth, gridsContainer, -this._calendarGridWidth())
							: null);
		this._isRunningAnimation = false;
		this._moveAfterAnimationDidEnd();
	},
	
	_moveAfterAnimationDidEnd: function()
	{
		var movementDirection = this._movementDirectionAfterAnimation;
		this._movementDirectionAfterAnimation = 0;
		if (movementDirection > 0)
		{
			this.goNext();
		}
		else if (movementDirection < 0)
		{
			this.goPrevious();
		}
	},

	selectDay: function(event)
	{
		console.log("selectDay");
		event.stop();
	},
});
