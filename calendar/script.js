$( document ).ready(function() {

		var disabledDays = [
			// 'Fri Nov 19 2021 00:00:00 GMT+0300 (East Africa Time)',
			'Mon Nov 22 2021 00:00:00 GMT+0300 (East Africa Time)',
			'Thu Nov 25 2021 00:00:00 GMT+0300 (East Africa Time)',
			// 'Sun Dec 12 2021 00:00:00 GMT+0300 (East Africa Time)',
			// 'Tue Jan 04 2022 00:00:00 GMT+0300 (East Africa Time)',
			// 'Wed Jan 05 2022 00:00:00 GMT+0300 (East Africa Time)',
			// 'Tue Jan 25 2022 00:00:00 GMT+0300 (East Africa Time)'
		];

		var iter_date = new Date(2021,10,22); 
		console.log(iter_date);


		$('#disable-date').datepicker({
			autoclose: true,
			format: 'M dd, yyyy',
			startDate: new Date()
			// endDate: new Date()
		});
		//Adding the dates to be disabled
		
		$('#disable-date').change(function(){
			var disableDate = $('#disable-date').datepicker("getDate").toString();
			// console.log(disableDate);

			disabledDays.push(disableDate);

			b();
			c(month, year, 0);
			c(nextMonth, nextYear, 1);
			// console.log(disabledDays);
		});
	
		
		function c(passed_month, passed_year, calNum) {
			var calendar = calNum == 0 ? calendars.cal1 : calendars.cal2;
			makeWeek(calendar.weekline);
			calendar.datesBody.empty();
			var calMonthArray = makeMonthArray(passed_month, passed_year);
			// console.log(calMonthArray);
			var r = 0;
			var u = false;

			while(!u) {
				if(daysArray[r] == calMonthArray[0].weekday) { u = true } 
				else { 
					calendar.datesBody.append('<div class="blank"></div>');
					r++;
				}
			} 

			//List of all disabled days
			for(var cell=0;cell<42-r;cell++) { // 42 date-cells in calendar
				if(cell >= calMonthArray.length) {
					calendar.datesBody.append('<div class="blank"></div>');
				} else {
					var shownDate = calMonthArray[cell].day;
					// console.log(shownDate);
					// Later refactiroing -- iter_date not needed after "today" is found
					var iter_date = new Date(passed_year,passed_month,shownDate); 
					// console.log(iter_date);
					if ( 
						(
							( shownDate != today.getDate() && passed_month == today.getMonth() ) 
							|| passed_month != today.getMonth()
						) 
							&& iter_date < today) {						
						var m = '<div class="past-date">';
						// var m2 = '<div class="full">';
					} else {
						var m;
						//Check if its today
						if(disableTheseDates(iter_date, disabledDays)){
							m = '<div class="full" > * ';
						}
						 else if(checkToday(iter_date)){
							m = '<div class="today">';
						//Check if the date should be disables
						}else{
							m = '<div>';
						}
					}
					calendar.datesBody.append(m + shownDate + "</div>");
				}
			}

			// var color = o[passed_month];
			calendar.calHeader.find("h2").text(i[passed_month]+" "+passed_year);
						//.css("background-color",color)
						//.find("h2").text(i[passed_month]+" "+year);

			// find elements (dates) to be clicked on each time
			// the calendar is generated
			
			//clickedElement = bothCals.find(".calendar_content").find("div");
			var clicked = false;
			selectDates(selected);

			clickedElement = calendar.datesBody.find('div');
			clickedElement.on("click", function(){
				clicked = $(this);
				if (clicked.hasClass('past-date')) { return; }
				if (clicked.hasClass('full')){alert("This date is fully booked"); return; }
				var whichCalendar = calendar.name;
				console.log(whichCalendar);
				// Understading which element was clicked;
				// var parentClass = $(this).parent().parent().attr('class');
				if (firstClick && secondClick) {
					thirdClicked = getClickedInfo(clicked, calendar);
					var firstClickDateObj = new Date(firstClicked.year, 
												firstClicked.month, 
												firstClicked.date);
					var secondClickDateObj = new Date(secondClicked.year, 
												secondClicked.month, 
												secondClicked.date);
					var thirdClickDateObj = new Date(thirdClicked.year, 
												thirdClicked.month, 
												thirdClicked.date);
					if (secondClickDateObj > thirdClickDateObj
						&& thirdClickDateObj > firstClickDateObj) {
						secondClicked = thirdClicked;
						// then choose dates again from the start :)
						bothCals.find(".calendar_content").find("div").each(function(){
							$(this).removeClass("selected");
						});
						bothCals.find(".calendar_content").find("div").find("p").each(function(){
							$(this).remove();
						})
						selected = {};
						selected[firstClicked.year] = {};
						selected[firstClicked.year][firstClicked.month] = [firstClicked.date];
						// selected = addChosenDates(firstClicked, secondClicked, selected);
					} else { // reset clicks
						selected = {};
						firstClicked = [];
						secondClicked = [];
						firstClick = false;
						secondClick = false;
						bothCals.find(".calendar_content").find("div").each(function(){
							$(this).removeClass("selected");
							
						});
						// reset the amounts
						bothCals.find(".calendar_content").find("div").find("p").each(function(){
							$(this).remove();
						})
					}
				}
				if (!firstClick) {
					firstClick = true;
					firstClicked = getClickedInfo(clicked, calendar);
					selected[firstClicked.year] = {};
					selected[firstClicked.year][firstClicked.month] = [firstClicked.date];
				} else {
					console.log('second click');
					secondClick = true;
					secondClicked = getClickedInfo(clicked, calendar);
					// console.log(secondClicked);

					// what if second clicked date is before the first clicked?
					var firstClickDateObj = new Date(firstClicked.year, 
												firstClicked.month, 
												firstClicked.date);
					var secondClickDateObj = new Date(secondClicked.year, 
												secondClicked.month, 
												secondClicked.date);

					if (firstClickDateObj > secondClickDateObj) {

						var cachedClickedInfo = secondClicked;
						secondClicked = firstClicked;
						firstClicked = cachedClickedInfo;
						selected = {};
						selected[firstClicked.year] = {};
						selected[firstClicked.year][firstClicked.month] = [firstClicked.date];

					} else if (firstClickDateObj.getTime() ==
								secondClickDateObj.getTime()) {
						selected = {};
						firstClicked = [];
						secondClicked = [];
						firstClick = false;
						secondClick = false;
						$(this).removeClass("selected");
						bothCals.find(".calendar_content").find("div").find("p").each(function(){
							$(this).remove();
						})
					}

					// add between dates to [selected]
					selected = addChosenDates(firstClicked, secondClicked, selected);
					
					
				}
				
				//Calculating the amount
				selectDates(selected);

				var amountPerNight = 1800;
				var number = document.getElementById("numberOfPeople").value;

				if(number){
					$(".calendar_content .selected").each(function() {
						$(this).html($(this).html() + "<p>KES "+amountPerNight*number+"</p>");
					});
				}else{
					alert("Please enter the number of people first!");
					window.location.reload();
				};
				
			});			

		}

		function selectDates(selected) {
			if (!$.isEmptyObject(selected)) {
				var dateElements1 = datesBody1.find('div');
				var dateElements2 = datesBody2.find('div');

				function highlightDates(passed_year, passed_month, dateElements){
					if (passed_year in selected && passed_month in selected[passed_year]) {
						var daysToCompare = selected[passed_year][passed_month];
						// console.log(daysToCompare);
						for (var d in daysToCompare) {
							dateElements.each(function(index) {
								if ((parseInt($(this).text()) == daysToCompare[d]) && !$(this).hasClass("full")) {
									$(this).addClass('selected');
								}
							});	
						}
					}
				}

				highlightDates(year, month, dateElements1);
				highlightDates(nextYear, nextMonth, dateElements2);				
			}
		}

		function makeMonthArray(passed_month, passed_year) { // creates Array specifying dates and weekdays
			var e=[];
			for(var r=1;r<getDaysInMonth(passed_year, passed_month)+1;r++) {
				e.push({day: r,
						// Later refactor -- weekday needed only for first week
						weekday: daysArray[getWeekdayNum(passed_year,passed_month,r)]
					});
			}
			return e;
		}

		function makeWeek(week) {
			week.empty();
			for(var e=0;e<7;e++) { 
				week.append("<div>"+daysArray[e].substring(0,3)+"</div>") 
			}
		}

		function getDaysInMonth(currentYear,currentMon) {
			return(new Date(currentYear,currentMon+1,0)).getDate();
		}

		function getWeekdayNum(e,t,n) {
			return(new Date(e,t,n)).getDay();
		}

		function checkToday(e) {
			var todayDate = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
			var checkingDate = e.getFullYear()+'/'+(e.getMonth()+1)+'/'+e.getDate();
			return todayDate==checkingDate;

		}

		function disableTheseDates(i, e){
			for (var k=0; k<e.length; k++){
					if(i == e[k]){
						return true;
					}
				}
		}
			
		function getAdjacentMonth(curr_month, curr_year, direction) {
			var theNextMonth;
			var theNextYear;
			if (direction == "next") {
				theNextMonth = (curr_month + 1) % 12;
				theNextYear = (curr_month == 11) ? curr_year + 1 : curr_year;
			} else {
				theNextMonth = (curr_month == 0) ? 11 : curr_month - 1;
				theNextYear = (curr_month == 0) ? curr_year - 1 : curr_year;
			}
			return [theNextMonth, theNextYear];
		}

		function b() {
			today = new Date;
			year = today.getFullYear();
			month = today.getMonth();
			var nextDates = getAdjacentMonth(month, year, "next");
			nextMonth = nextDates[0];
			nextYear = nextDates[1];
		}

		var e=480;

		var today;
		var year,
			month,
			nextMonth,
			nextYear;

		//var t=2013;
		//var n=9;
		var r = [];
		var i = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY",
				"JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER",
				"NOVEMBER","DECEMBER"];
		var daysArray = ["Sunday","Monday","Tuesday",
						"Wednesday","Thursday","Friday","Saturday"];
		var o = ["#16a085","#1abc9c","#c0392b","#27ae60",
				"#FF6860","#f39c12","#f1c40f","#e67e22",
				"#2ecc71","#e74c3c","#d35400","#2c3e50"];
		
		var cal1=$("#calendar_first");
		var calHeader1=cal1.find(".calendar_header");
		var weekline1=cal1.find(".calendar_weekdays");
		var datesBody1=cal1.find(".calendar_content");

		var cal2=$("#calendar_second");
		var calHeader2=cal2.find(".calendar_header");
		var weekline2=cal2.find(".calendar_weekdays");
		var datesBody2=cal2.find(".calendar_content");

		var bothCals = $(".calendar");

		var switchButton = bothCals.find(".calendar_header").find('.switch-month');

		var calendars = { 
						"cal1": { 	"name": "first",
									"calHeader": calHeader1,
									"weekline": weekline1,
									"datesBody": datesBody1 },
						"cal2": { 	"name": "second",
									"calHeader": calHeader2,
									"weekline": weekline2,
									"datesBody": datesBody2	}
						}
		
		var clickedElement;
		var firstClicked,
			secondClicked,
			thirdClicked;
		var firstClick = false;
		var secondClick = false;	
		var selected = {};

		b();
		c(month, year, 0);
		c(nextMonth, nextYear, 1);

		switchButton.on("click",function() {
			var clicked=$(this);
			var generateCalendars = function(e) {
				var nextDatesFirst = getAdjacentMonth(month, year, e);
				var nextDatesSecond = getAdjacentMonth(nextMonth, nextYear, e);
				month = nextDatesFirst[0];
				year = nextDatesFirst[1];
				nextMonth = nextDatesSecond[0];
				nextYear = nextDatesSecond[1];

				c(month, year, 0);
				c(nextMonth, nextYear, 1);
			};
			if(clicked.attr("class").indexOf("left")!=-1) { 
				generateCalendars("previous");
			} else { generateCalendars("next"); }
			clickedElement = bothCals.find(".calendar_content").find("div");
			console.log("checking");
		});


		//  Click picking stuff
		function getClickedInfo(element, calendar) {
			var clickedInfo = {};
			var clickedCalendar,
				clickedMonth,
				clickedYear;
			clickedCalendar = calendar.name;
			// console.log(element.parent().parent().attr('class'));
			clickedMonth = clickedCalendar == "first" ? month : nextMonth;
			clickedYear = clickedCalendar == "first" ? year : nextYear;
			clickedInfo = {"calNum": clickedCalendar,
							"date": parseInt(element.text()),
							"month": clickedMonth,
							"year": clickedYear}
			// console.log(clickedInfo);
			return clickedInfo;
		}


		// Finding between dates. Needs refactoring and smartening up :)
		function addChosenDates(firstClicked, secondClicked, selected) {
			if (secondClicked.date > firstClicked.date || 
				secondClicked.month > firstClicked.month ||
				secondClicked.year > firstClicked.year) {

				var added_year = secondClicked.year;
				var added_month = secondClicked.month;
				var added_date = secondClicked.date;
				// console.log(selected);
					// console.log(added_year);

				var removedDays = [];

				for(var j = 0; j<disabledDays.length; j++){
					var removed = disabledDays[j].split(" ");

					var date = parseInt(removed[2]);
					var year = removed[3];
					var month;

					switch(removed[1]){
						case 'Jan':
							month = 0;
							break;
						case 'Feb' :
							month = 1;
							break;
						case 'Mar':
							month = 2;
							break;
						case 'Apr':
							month =  3;
							break;
						case 'May':
							month = 4;
							break;
						case 'Jun':
							month = 5;
							break;
						case 'Jul':
							month = 6;
							break;
						case 'Aug':
							month = 7;
							break;
						case 'Sep':
							month = 8;
							break;
						case 'Oct':
							month = 9;
							break;
						case 'Nov':
							month = 10;
							break;
						case 'Dec':
							month = 11;
							break;
						default:
							break;
						};
					

					removedDays.push(date+"/" + month + "/" + year);
				}
				
				
				// console.log(removedDays);
				
				if (added_year > firstClicked.year) {	
					// first add all dates from all months of Second-Clicked-Year
					selected[added_year] = {};
					selected[added_year][added_month] = [];
					for (var i = 1; 
						i <= secondClicked.date;
						i++) {
							if(removedDays.indexOf((i+"/"+added_month + "/" + added_year).toString()) == -1){
								selected[added_year][added_month].push(i);
							}
					}
			
					added_month = added_month - 1;
					// console.log(added_month);
					while (added_month >= 0) {
						selected[added_year][added_month] = [];
						for (var i = 1; 
							i <= getDaysInMonth(added_year, added_month);
							i++) {
								if(removedDays.indexOf((i+"/"+added_month + "/" + added_year).toString()) == -1){
									selected[added_year][added_month].push(i);
								}
						}
						added_month = added_month - 1;
					}

					added_year = added_year - 1;
					added_month = 11; // reset month to Dec because we decreased year
					added_date = getDaysInMonth(added_year, added_month); // reset date as well

					// Now add all dates from all months of inbetween years
					while (added_year > firstClicked.year) {
						selected[added_year] = {};
						for (var i=0; i < 12; i++) {
							selected[added_year][i] = [];
							for (var d = 1; d <= getDaysInMonth(added_year, i); d++) {
								selected[added_year][i].push(d);
							}
						}
						added_year = added_year - 1;
					}
				}


				
				
				if (added_month > firstClicked.month) {
					if (firstClicked.year == secondClicked.year) {
						console.log("here is the month:",added_month);
						selected[added_year][added_month] = [];
						for (var i = 1; 
							i <= secondClicked.date;
							i++) {

							if(removedDays.indexOf((i+"/"+added_month + "/" + added_year).toString()) == -1){
								selected[added_year][added_month].push(i);
							}
						}
						added_month = added_month - 1;
						// console.log(selected[added_year][added_month].length);
					}
					
					while (added_month > firstClicked.month) {
						selected[added_year][added_month] = [];
						for (var i = 1; 
							i <= getDaysInMonth(added_year, added_month);
							i++) {
							if(removedDays.indexOf((i+"/"+added_month + "/" + added_year).toString()) == -1){
								selected[added_year][added_month].push(i);
							}
						}
						added_month = added_month - 1;
						// console.log(selected[added_year][added_month].length);
					}
					added_date = getDaysInMonth(added_year, added_month);
					
					
				}



				for (var i = firstClicked.date + 1 ; 
					i <= added_date;
					i++) {

					if(removedDays.indexOf((i+"/"+added_month + "/" + added_year).toString()) == -1){
						selected[added_year][added_month].push(i);
					}
				}

			}
			console.log(selected);
			return selected;
		}

});