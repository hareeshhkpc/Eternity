function Statistics(renderingEngine) {

	this.eventHandler = eventHandler;
	this.className = "Statistics";

	this.loadUI = loadUI;

	var statistics = this;
	var appController = appController;

	var renderingEngine = renderingEngine;
	var curr = new Date();

	this.getProgram = getProgram;
	this.loadGraph = loadGraph;
	this.getDate = getDate;
	this.month = "";
	this.year = "";
	this.program = "";
	this.statisticKey = "";
	this.status = "";
	this.total = "";
	this.initialize = true;
	var facility = "";

	function loadUI() {
		renderingEngine.setLeftHeaderInfo("");
		renderingEngine.loadPage("pages/statistics/graph.html", "form",
				AppConstants.Event.STATISTICS_PAGE_BIND_EVENTS);
				
		
		/*	$('.left-side-content').css('height', '525px');
			$('.right-side-content').css('height', '525px');
		*/
		
	}
	;

	function eventHandler(event) {
		if (event.type == AppConstants.Event.APPLICATION_INITIALIZED) {

		} else if (event.type == AppConstants.Event.STATISTICS_PAGE_BIND_EVENTS) {
			$("#nextdate").live(
					"click",
					function() {
						var next = new Date(curr.getFullYear(),
								curr.getMonth() + 1);
						curr = next;
						$("#appendstatdate").html('');
						$("#appendstatdate").append(
								"<div id='datesel' >"
										+ curr.toLocaleFormat("%B %Y")
										+ "</div>");
						loadGraph(statisticKey, status);
					});
			$("#prevdate").click(
					function() {
						var prev = new Date(curr.getFullYear(),
								curr.getMonth() - 1);
						curr = prev;
						$("#appendstatdate").html('');
						$("#appendstatdate").append(
								"<div id='datesel' >"
										+ curr.toLocaleFormat("%B %Y")
										+ "</div>");
						loadGraph(statisticKey, status);
					});

			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.STATISTICS_FETCH_DATA, {},
					renderingEngine, statistics);
			$("#facilitySearchData").keyup( function() {
				fetchFacilityList();
			});
			fetchMessageTypes("Age Management program");
			fetchFacilityList();
		} else if (event.type == AppConstants.Event.STATISTICS_PROGRAM_AVAILABLE) {
			var dataLayer = renderingEngine.getComponent("DataLayer");

		} else if (event.type == AppConstants.Event.STATISTICS_FETCH_MONTH_DATA_RESPONSE) {
			loadStatistics(event.data.result);
		} else if (event.type == AppConstants.Event.STATISTICS_FILL_DATA) {
			loadPrograms(event.data.result);
		} else if (event.type == AppConstants.Event.STATISTICS_MESSAGE_FILL_DATA) {
			loadMessageTypes(event.data.result, event.data.program);
		} else if (event.type == AppConstants.Event.STATISTICS_MESSAGE_FILL_FACILITIES) {
			fillFacility(event.data.result);
		}
		renderingEngine.hidePageLoading();
	}
	;

	var chart;
	var options = {
		chart : {
			type : 'column',
			renderTo : 'statisticsContainer',
		},
		title : {
			text : '',
		},

		subtitle : {
			text : ''
		},

		xAxis : {
			lineColor : '#6E1766',
			categories : []
		},

		yAxis : {
			lineColor : '#6E1766',
			lineWidth : 1,
			min : 0,
			title : {
				text : ''
			}
		},
		legend : {
			enabled : true,
			labelFormatter : function() {
				return "Total: " + total;
			},
			itemStyle : {
				cursor : "arrow",
				color : "#FFFFFF"
			},
			itemHoverStyle : {
				cursor : "arrow",
				color : "#FFFFFF"
			},
			itemHiddenStyle : {
				color : "#FFFFFF"
			},
			backgroundColor : '#6E1766',
			borderRadius : 0,
			align : 'right',
			verticalAlign : 'top',
			y : 10,
			symbolWidth : 0
		},

		plotOptions : {
			series : {
				cursor : 'arrow',
				color : "#6E1766",
				events : {
					legendItemClick : function() {
						return false;
					}
				}
			}
		},
		series : []
	};

	function getProgram() {
		var program = $('#program').val();

		return program;
	}
	;

	function getDate(month, year) {
		var dateFeb = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
				'11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
				'21', '22', '23', '24', '25', '26', '27', '28' ];
		var dateFebLeap = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
				'11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
				'21', '22', '23', '24', '25', '26', '27', '28', '29' ];
		var date30 = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
				'12', '13', '14', '15', '16', '17', '18', '19', '20', '21',
				'22', '23', '24', '25', '26', '27', '28', '29', '30' ];
		var date31 = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
				'12', '13', '14', '15', '16', '17', '18', '19', '20', '21',
				'22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ];

		var leapYear = year % 4;
		if (month == "1" || month == "3" || month == "5" || month == "7"
				|| month == "8" || month == "10" || month == "12") {
			return date31;
		}
		if (month == "4" || month == "6" || month == "9" || month == "11") {
			return date30;
		}
		if (month == "2") {
			if (leapYear == 0) {
				return dateFebLeap;
			} else {
				return dateFeb;
			}

		}

	}
	;

	function loadStatistics(statisticsVO) {
		options.subtitle.text = "";
		options.series = [];
		total = statisticsVO.dayCount;
		var selectedmonth = '';
		var selectedYear = '';

		if (statisticsVO.month == '') {
			selectedmonth = curr.getMonth() + 1;
		} else {
			selectedmonth = statisticsVO.month;
		}

		if (statisticsVO.year == '') {
			selectedYear = curr.getFullYear();
		} else {
			selectedYear = statisticsVO.year;
		}

		var date = getDate(selectedmonth, selectedYear);
		options.xAxis.categories = date;

		var data = [ {
			data : statisticsVO.dayArray
		} ];

		jQuery.each(data, function(i, line) {
			options.series.push(line);
		});

		chart = new Highcharts.Chart(options);
	}
	;

	function getStatisticsData(month, year, type, status) {
		var statisticsVO = new HIN.StatisticsVO();
		statisticsVO.month = month;
		statisticsVO.year = year;
		statisticsVO.program = $('#service :selected').val();
		statisticsVO.type = type;
		statisticsVO.status = status;
		statisticsVO.facility = $('#facilitySelect :selected').val();
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.STATISTICS_FETCH_MONTH_DATA_REQUEST, {
					statisticsVO : statisticsVO
				}, renderingEngine, statistics);
	}
	;

	function loadGraph(messageType, status) {
		statistics.month = curr.getMonth() + 1;
		statistics.year = curr.getFullYear();
		getStatisticsData("0" + statistics.month, statistics.year,
				messageType, status);
	}
	;

	function loadPrograms(result) {
		$.each(result, function(index, value) {
			$('#program').append(
					"<option id=program" + index + " value=" + value.name + ">"
							+ value.name + "</option>");
			$('#service').append(
					"<option id=program" + index + " value=" + value.name + ">"
							+ value.name + "</option>");
			$("#program").bind ("change", function (event){
				program = value.name;
				});
			$("#service").bind ("change", function (event){
				program = value.name;
				});
			});
		$('#program').selectmenu('refresh');
		$('#program').trigger('create');
		$('#service').selectmenu('refresh');
		$('#service').trigger('create');
	}
	;

	function fetchMessageTypes(className) {
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.STATISTICS_MESSAGE_FETCH_DATA, {
					className : className
				}, renderingEngine, statistics);
	}

	function loadMessageTypes(result, programName) {
		var program = programName.replace(/\s/g, "-");
		var messageType = "messageType";
		$.each(result,function(index, value) {
							$('#messageTypeList')
									.append(
											'<div id="'
													+ value.conceptAttributes[0].value
													+ '" class="ui-corner-all statistics-message-list" messageStatus="'+value.conceptAttributes[1].value+'">'
													+ '' + value.name
													+ '</div> <br>');
						});

		curr = new Date();
		$("#appendstatdate").html('');
		$("#appendstatdate")
				.append(
						"<div id='datesel' >" + CommonUtil.dateFormat(curr,"mediumMonth")
								+ "</div>");
		$("#monthyear").css({
			"display" : "block"
		});

		$('.statistics-message-list').click(function() {
			$('.statistics-message-list').css('background', 'none');
			$('.statistics-message-list').css('color', '#6E1766');
			$(this).css('background', '#6E1766');
			$(this).css('color', '#FFFFFF');
			statisticKey = $(this).attr("id");
			status= $(this).attr("messageStatus");
			loadGraph(statisticKey, status);
		});
	}
	;
	
	function fetchFacilityList(){
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.STATISTICS_MESSAGE_FETCH_FACILITIES, {},
				renderingEngine, statistics);
	}
	;
	
	function fillFacility(facilities){
		$("#facilitysearchlist").html('');
		$.each(facilities,function(index,value){
			$('#facilitySelect').append("<option id=facilityselect" + index + " value="+value+">"+ value+ "</option>");
			$("#facilitySelect").bind ("change", function (event){
				facility = value;
			});
			$('#facilitysearchlist').append('<div id="facilitylist'+index+ '" class="ui-corner-all statistics-facility-list">'+value+'</div> <br>');
		});
		$('#facilitySelect').selectmenu('refresh');
		$('.statistics-facility-list').click(function() {
			$('.statistics-facility-list').css('background', 'none');
			$('.statistics-facility-list').css('color', '#6E1766');
			$(this).css('background', '#6E1766');
			$(this).css('color', '#FFFFFF');
			facility = $(this).text();
		});
	}
	;
}
