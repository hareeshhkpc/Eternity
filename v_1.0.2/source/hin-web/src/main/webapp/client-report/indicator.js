function ReportRenderer() {

	var svgns = 'http://www.w3.org/2000/svg';
	var svg12ns = 'http://www.w3.org/2007/svg12';
	var thisObject = this;
	// this.targetContainer = targetContainer;
	// this.parentDocument = parentDocument;

	var innerCircleColor;
	var lightcolor;
	var darkColor;
	var value;
	var ideal_score;

	var x_rect;
	var y_rect;
	var y_circle;
	var y_text;
	var x1_line;
	var x2_line;
	var y1_line;
	var y2_line;
	var x_circle_small;
	var y_circle_small;
	var y_standard;
	var x_standard;
	var array_increment;
	var y_standard_increment;
	var x_circle;
	var x_text;

	this.svgDoc = null;
	this.textEls = [];

	this.setSVGDoc = function(doc) {
		thisObject.svgDoc = doc;
	}

	/* globally defined variables */

	this.createIndicator = function(score) {

		for (i in score) {

			var overallValue = score[i].overall;
			var scoreArray = score[i].array;
			var coordinates = score[i].coordinates;
			var page = score[i].page;
			for (index in coordinates) {
				y_rect = coordinates[index].y_rect;
				y_circle = coordinates[index].y_circle;
				y_text = coordinates[index].y_text;
				x1_line = coordinates[index].x1_line;
				x2_line = coordinates[index].x2_line;
				y1_line = coordinates[index].y1_line;
				y2_line = coordinates[index].y2_line;
				x_circle_small = coordinates[index].x_circle_small;
				y_circle_small = coordinates[index].y_circle_small;
				y_standard = coordinates[index].y_standard;
				array_increment = coordinates[index].array_increment;
				y_standard_increment = coordinates[index].y_standard_increment;
			}

			if (page == "OverviewResult") {
				thisObject.createIndicatorOverviewResult(overallValue,
						scoreArray, y_rect, y_circle, y_text, x1_line, x2_line,
						y1_line, y2_line, x_circle_small, y_circle_small,
						y_standard, array_increment, y_standard_increment);

			} else if (page == "Results") {
				thisObject.createIndicatorResults(scoreArray, y_rect, y_circle,
						y_text, x1_line, x2_line, y1_line, y2_line,
						x_circle_small, y_circle_small, y_standard,
						array_increment, y_standard_increment);
			} else if (page == "Consultation") {
				thisObject.createIndicatorConsultationPage(scoreArray,
						coordinates);
			}

		}
		return thisObject.svgDoc;
	}

	this.createIndicatorOverviewResult = function(overallValue, scoreArray,
			y_rect, y_circle, y_text, x1_line, x2_line, y1_line, y2_line,
			x_circle_small, y_circle_small, y_standard, array_increment,
			y_standard_increment) {

		thisObject.generateImage(650, 52, 620, 68, 34, 2, innerCircleColor,
				x_circle_small, y_circle_small, 605, 74, overallValue, 16,
				x1_line, x2_line, y1_line, y2_line);

		for (j in scoreArray) {
			var value = scoreArray[j];
			thisObject.generateImage(650, y_rect, 620, y_circle, 34, 2,
					innerCircleColor, x_circle_small, y_circle_small + 187,
					605, y_text, value, 16, x1_line, x2_line, y1_line + 187,
					y2_line + 187);

			/* increment y coordinate by 90 for value iteration in an array */
			y_rect = y_rect + 90;
			y_circle = y_circle + 90;
			y_text = y_text + 90;
			x1_line = 640;
			x2_line = 658;
			y1_line = y_standard + ((parseInt(j) + 1) * 90);
			y2_line = y_standard + ((parseInt(j) + 1) * 90);
			y_circle_small = y_standard + ((parseInt(j) + 1) * 90);
			x_circle_small = 660;
		}

	}

	this.createIndicatorResults = function(scoreArray, y_rect, y_circle,
			y_text, x1_line, x2_line, y1_line, y2_line, x_circle_small,
			y_circle_small, y_standard, array_increment, y_standard_increment) {

		for (j in scoreArray) {
			var array = scoreArray[j];
			for (k in array) {
				value = array[k];

				thisObject.generateImage(650, y_rect, 620, y_circle, 34, 2,
						innerCircleColor, x_circle_small, y_circle_small, 605,
						y_text, value, 16, x1_line, x2_line, y1_line, y2_line);

				/*
				 * increment y coordinate by 73 for value iteration in an array
				 */
				y_rect = y_rect + 73;
				y_circle = y_circle + 73;
				y_text = y_text + 73;
				x1_line = 640;
				x2_line = 658;
				y1_line = y_standard + ((parseInt(k) + 1) * 73);
				y2_line = y_standard + ((parseInt(k) + 1) * 73);
				y_circle_small = y_standard + ((parseInt(k) + 1) * 73);
				x_circle_small = 660;
			}

			/*
			 * increment y coordinate by common factor for array iteration in
			 * the main array
			 */
			y_rect = y_rect + array_increment;
			y_circle = y_circle + array_increment;
			y_text = y_text + array_increment;
			x1_line = 640;
			x2_line = 658;
			x_circle_small = 660;
			y_standard = y_standard
					+ ((parseInt(k) + 1) * y_standard_increment);
			y1_line = y_standard;
			y2_line = y_standard;
			y_circle_small = y_standard;
		}
	}

	// client report
	this.createIndicatorConsultationPage = function(scoreArray, coordinates) {
		var y_rect = 155;
		var y_circle = 170;
		var y_text = 175;
		var y_circle_small = 170;
		var y1_line = 170;
		var y2_line = 170;
		var y_standard = 170;

		for (index in coordinates) {
			x_rect = coordinates[index].x_rect;
			x_circle_small = coordinates[index].x_circle_small;
			x_circle = coordinates[index].x_circle;
			x_text = coordinates[index].x_text;
			x1_line = coordinates[index].x1_line;
			x2_line = coordinates[index].x2_line;
			x_standard = coordinates[index].x_standard;
		}
		for (j in scoreArray) {
			var array = scoreArray[j];
			for (k in array) {
				var object = array[k];

				thisObject.generateImage(x_rect, y_rect, x_circle, y_circle,
						34, 2, innerCircleColor, x_circle_small,
						y_circle_small, x_text, y_text, object, 16, x1_line,
						x2_line, y1_line, y2_line);

				if (object) {
					var testName = object.testName;
					var length = String(testName).length;
					var x_coordinate = thisObject.allignText(testName, x_text,
							length);
					thisObject.writeText(x_coordinate, y_text + 50, testName,
							"18", "#000000");
				}

				/* increment x coordinate by 200 for creating adjacent indicator */
				x_standard = x_standard + 200;
				x_rect = x_rect + 200;
				x_circle_small = x_standard + 2;
				y_circle_small = y_standard;
				x1_line = x_standard - 20;
				x2_line = x_standard;
				y1_line = y_standard;
				y2_line = y_standard;
				x_circle = x_circle + 200;
				x_text = x_text + 200;
			}

			for (index in coordinates) {
				x_rect = coordinates[index].x_rect;
				x_circle_small = coordinates[index].x_circle_small;
				x_circle = coordinates[index].x_circle;
				x_text = coordinates[index].x_text;
				x1_line = coordinates[index].x1_line;
				x2_line = coordinates[index].x2_line;
				x_standard = coordinates[index].x_standard;
			}
			y_rect = y_rect + 510;
			y_circle = y_circle + 510;
			y_text = y_text + 510;
			y_circle_small = y_circle_small + 510;
			y1_line = y1_line + 510;
			y2_line = y2_line + 510;
			y_standard = y_standard + 510;
		}
	}

	this.createIndicatorConsultationPageEditable = function(scoreArray,
			coordinates) {
		var y_rect = 25;
		var y_circle = 40;
		var y_text = 45;
		var y_circle_small = 40;
		var y1_line = 40;
		var y2_line = 40;
		var y_standard = 40;

		for (index in coordinates) {
			x_rect = coordinates[index].x_rect;
			x_circle_small = coordinates[index].x_circle_small;
			x_circle = coordinates[index].x_circle;
			x_text = coordinates[index].x_text;
			x1_line = coordinates[index].x1_line;
			x2_line = coordinates[index].x2_line;
			x_standard = coordinates[index].x_standard;
		}
		for (j in scoreArray) {
			var value = scoreArray[j];
			if (value == null) {
				value = new Object();
			}
			var testName = value.testName;

			thisObject.generateImageConsultationPageEditable(x_rect, y_rect,
					x_circle, y_circle, 34, 2, innerCircleColor,
					x_circle_small, y_circle_small, x_text, y_text, value, 16,
					x1_line, x2_line, y1_line, y2_line);

			if (value && testName) {
				var length = String(testName).length;
				var x_coordinate = thisObject.allignText(testName, x_text,
						length);
				thisObject.writeText(x_coordinate, y_text + 50, testName, "18",
						"#000000");
			}

			/* increment x coordinate by 200 for creating adjacent indicator */
			x_standard = x_standard + 200;
			x_rect = x_rect + 200;
			x_circle_small = x_standard;
			y_circle_small = y_standard;
			x1_line = x_standard - 20;
			x2_line = x_standard;
			y1_line = y_standard;
			y2_line = y_standard;
			x_circle = x_circle + 200;
			x_text = x_text + 200;
		}
		return thisObject.svgDoc;
	}

	this.generateImage = function(x_rect, y_rect, x_circle, y_circle,
			radiusOuter, point_circle_radius, smallInnerCircleColor,
			x_circle_small, y_circle_small, x_text, y_text, value, font_text,
			x1_line, x2_line, y1_line, y2_line) {

		var indicatorValue = null;
		var object = value;
		var x_coordinate = x_text
		if (object && object.value) {
			lightcolor = object.color;
			// lightcolor = $.xcolor.lighten(object.color);
			darkColor = $.xcolor.darken(object.color);
			indicatorValue = object.value;
			ideal_score = object.idealScore;
			smallInnerCircleColor = '#54184f';
			var length = String(indicatorValue).length;
			// alert("x_text: "+x_text);

			x_coordinate = thisObject
					.allignText(indicatorValue, x_text, length);
			// alert(x_coordinate);

		} else {
			lightcolor = "#a7a9ac";
			darkColor = $.xcolor.darken(lightcolor);
			indicatorValue = "";
			ideal_score = "";
			smallInnerCircleColor = "#a7a9ac";
		}

		if (lightcolor == "#9B1F21") {
			x1_line = x1_line - 30;
			x2_line = x2_line - 58;
			y1_line = y1_line - 20;
			y2_line = y2_line - 33;
			x_circle_small = x_circle_small - 61;
			y_circle_small = y_circle_small - 34;
		} else if (lightcolor == "#e8c237") {
			x1_line = x1_line - 30;
			x2_line = x2_line - 58;
			y1_line = y1_line + 16;
			y2_line = y2_line + 32;
			x_circle_small = x_circle_small - 61;
			y_circle_small = y_circle_small + 33;
		}

		var color = "#FFF"
		thisObject.createRectangle(darkColor, x_rect, y_rect);
		thisObject.createCircle(x_circle, y_circle, radiusOuter, lightcolor,
				lightcolor, 0); /* creates the outer circle */
		thisObject.createCircle(x_circle, y_circle, 23, smallInnerCircleColor,
				darkColor, 6); /*
								 * creates the inner circle
								 */
		// thisObject.createLine(x1_line, x2_line, y1_line, y2_line,
		// lightcolor);
		/*
		 * creates the pointer line
		 */
		thisObject.writeText(x_coordinate, y_text, indicatorValue, font_text,
				color); /*
						 * insert text inside the circle
						 */
		// thisObject.createCircle(x_circle_small,
		// y_circle_small,point_circle_radius, lightcolor, "", 0);
		/*
		 * creates the pointer head
		 */
		thisObject.writeText(x_text + 60, y_text - 1, ideal_score, "12", color); /*
																					 * insert
																					 * the
																					 * ideal
																					 * score
																					 * text
																					 */
	}

	// consultationPage Editable
	this.generateImageConsultationPageEditable = function(x_rect, y_rect,
			x_circle, y_circle, radiusOuter, point_circle_radius,
			smallInnerCircleColor, x_circle_small, y_circle_small, x_text,
			y_text, value, font_text, x1_line, x2_line, y1_line, y2_line) {

		var indicatorValue = null;
		var object = value;
		var x_coordinate = x_text
		if (object && object.value) {
			// alert(object.color);
			lightcolor = object.color;
			// lightcolor = $.xcolor.lighten(object.color);
			darkColor = $.xcolor.darken(object.color);
			indicatorValue = object.value;
			ideal_score = object.idealScore;
			smallInnerCircleColor = '#54184f';

			var length = String(indicatorValue).length;

			x_coordinate = thisObject
					.allignText(indicatorValue, x_text, length);
		} else {
			lightcolor = "#a7a9ac";
			darkColor = $.xcolor.darken(lightcolor);
			indicatorValue = "";
			ideal_score = "";
			smallInnerCircleColor = "#a7a9ac";
		}

		// alert(lightcolor + "," + darkColor + "," + smallInnerCircleColor);

		if (lightcolor == "#9B1F21") {
			x1_line = x1_line - 30;
			x2_line = x2_line - 58;
			y1_line = y1_line - 20;
			y2_line = y2_line - 33;
			x_circle_small = x_circle_small - 61;
			y_circle_small = y_circle_small - 34;
		} else if (lightcolor == "#e8c237") {
			x1_line = x1_line - 30;
			x2_line = x2_line - 58;
			y1_line = y1_line + 16;
			y2_line = y2_line + 32;
			x_circle_small = x_circle_small - 61;
			y_circle_small = y_circle_small + 33;
		}

		var color = "#FFF"
		thisObject.createRectangle(darkColor, x_rect, y_rect);
		thisObject.createCircle(x_circle, y_circle, radiusOuter, lightcolor,
				lightcolor, 0); /* creates the outer circle */
		thisObject.createCircle(x_circle, y_circle, 22, smallInnerCircleColor,
				darkColor, 6); /* creates the inner circle */
		// thisObject.createLine(x1_line, x2_line, y1_line, y2_line,
		// lightcolor);
		/*
		 * creates the pointer line
		 */
		thisObject.writeText(x_coordinate, y_text, indicatorValue, font_text,
				color); /*
						 * insert text inside the circle
						 */
		// thisObject.createCircle(x_circle_small, y_circle_small,
		// point_circle_radius, lightcolor, "", 0);
		/*
		 * creates the pointer head
		 */
		thisObject.writeText(x_text + 60, y_text - 1, ideal_score, "12", color); /*
																					 * insert
																					 * the
																					 * ideal
																					 * score
																					 * text
																					 */
	}

	this.allignText = function(indicatorValue, x_coordinateText, textLength) {

		// alert(indicatorValue+ " length "+ textLength);
		var xCoordinate = 0;
		if (textLength == 1) {
			xCoordinate = x_coordinateText + 10;
		} else if (textLength == 2) {
			xCoordinate = x_coordinateText + 7;
		} else if (textLength == 3) {
			xCoordinate = x_coordinateText + 3;
		} else if (textLength == 4) {
			xCoordinate = x_coordinateText;
		} else if (textLength == 5) {
			xCoordinate = x_coordinateText - 3;
		} else if (textLength == 6) {
			xCoordinate = x_coordinateText - 3;
		} else if (textLength == 7) {
			xCoordinate = x_coordinateText - 3;
		} else if (textLength == 8) {
			xCoordinate = x_coordinateText - 4;
		} else if (textLength == 9) {
			xCoordinate = x_coordinateText - 5;
		} else if (textLength > 9) {
			xCoordinate = x_coordinateText - 20;
		}

		return xCoordinate;
	}

	this.createRectangle = function(color, x, y) {
		// var rect =
		// thisObject.parentDocument.createElementNS("http://www.w3.org/2000/svg",
		// "rect");
		var rect = thisObject.svgDoc.createElementNS(
				"http://www.w3.org/2000/svg", "rect");
		rect.width.baseVal.value = 60;
		rect.setAttribute("height", 30);
		rect.style.fill = color;
		rect.setAttribute("x", x);
		rect.setAttribute("y", y);
		// $(thisObject.targetContainer).append(rect);
		thisObject.svgDoc.getElementsByTagName("svg")[0].appendChild(rect);
	}

	this.createCircle = function(x, y, radius, color, strokeColor, strokeWidth) {
		// var circle =
		// thisObject.parentDocument.createElementNS("http://www.w3.org/2000/svg",
		// "circle");
		var circle = thisObject.svgDoc.createElementNS(
				"http://www.w3.org/2000/svg", "circle");
		circle.setAttribute("cx", x);
		circle.setAttribute("cy", y);
		circle.setAttribute("r", radius);
		circle.setAttribute("fill", color);
		circle.setAttribute("stroke", strokeColor);
		circle.setAttribute("stroke-width", strokeWidth);
		// $(thisObject.targetContainer).append(circle);
		thisObject.svgDoc.getElementsByTagName("svg")[0].appendChild(circle);
	}

	this.createLine = function(x1, x2, y1, y2, color) {
		// var line =
		// thisObject.parentDocument.createElementNS('http://www.w3.org/2000/svg',
		// 'line');
		var line = thisObject.svgDoc.createElementNS(
				'http://www.w3.org/2000/svg', 'line');
		line.setAttribute('x1', x1);
		line.setAttribute('y1', y1);
		line.setAttribute('x2', x2);
		line.setAttribute('y2', y2);
		line.setAttribute('stroke', color);
		line.setAttribute('stroke-width', 1);
		// $(thisObject.targetContainer).append(line);
		thisObject.svgDoc.getElementsByTagName("svg")[0].appendChild(line);
	}

	this.writeText = function(x, y, text, font, color) {
		// var textelement =
		// thisObject.parentDocument.createElementNS('http://www.w3.org/2000/svg',
		// 'text');
		var textelement = thisObject.svgDoc.createElementNS(
				'http://www.w3.org/2000/svg', 'text');
		textelement.setAttribute("id", "text1");
		textelement.setAttribute("x", x);
		textelement.setAttribute("y", y);
		textelement.textContent = text;
		textelement.setAttribute("fill", color);
		textelement.setAttribute("font-size", font);
		textelement.setAttribute("font-family", "Myriad Pro Light");
		textelement.setAttribute("text-anchor", "start");

		// $(thisObject.targetContainer).append(textelement);
		thisObject.svgDoc.getElementsByTagName("svg")[0]
				.appendChild(textelement);
	}

	this.createTextArea = function(x, y, text, width, height) {
		var textelement = thisObject.svgDoc.createElementNS(
				'http://www.w3.org/2007/svg12', 'svg12:textArea');
		textelement.setAttribute("x", x+10);
		textelement.setAttribute("y", y);
		//textelement.textAreaContent = text;
		textelement.setAttribute("text", text);
		textelement.setAttribute("width", width);
		textelement.setAttribute("height", height);
		textelement.setAttribute("fill", "#000000");
		textelement.setAttribute("font-size", "15");
		textelement.setAttribute("font-family", "Myriad Pro Light");
		thisObject.svgDoc.getElementsByTagName("svg")[0]
				.appendChild(textelement);
	}

	this.fillPatientInfo = function(patientName, program, date) {
		var x_text = 200;
		var y_text = 950;
		thisObject.writeText(x_text, y_text, patientName, "20", "#FFF");
		y_text = y_text + 25;
		thisObject.writeText(x_text, y_text, program, "20", "#FFF");
		y_text = y_text + 25;
		thisObject.writeText(x_text, y_text, date, "20", "#FFF");
		return thisObject.svgDoc;
	}

	this.tickCheckBox = function(checkedParam) {
		var x1_line = 372;
		var x2_line = 374;
		var y1_line = 264;
		var y2_line = 268;
		var y_standard = 264;
		for (j in checkedParam) {
			var checkedArray = checkedParam[j];
			for (k in checkedArray) {
				var checkedValue = checkedArray[k];
				// alert("checkedValue: "+checkedValue+" y1_line: "+y1_line+"
				// y2_line: "+y2_line);
				if (checkedValue == "true") {
					thisObject.createLine(x1_line, x2_line, y1_line, y2_line,
							"#000000");
					thisObject.createLine(x2_line, x2_line + 4, y2_line,
							y2_line - 8, "#000000");
				}
				y_standard = y_standard + 25;
				y1_line = y_standard;
				y2_line = y_standard + 4;
			}
			y_standard = 784;
			y1_line = y_standard;
			y2_line = y_standard + 4;
		}
		return thisObject.svgDoc;
	}

	this.writePhysicianComments = function(PhysicianComments) {
		var x_text = 60;
		var y_text = 310;
		for (i in PhysicianComments) {
			var comments = PhysicianComments[i];
			//thisObject.writeText(x_text, y_text, comments, "14", "#000000");
			thisObject.createTextArea(x_text-10, y_text, comments, 300, 195);
			thisObject.getTextAreas();
			y_text = y_text + 520;
		}
		return thisObject.svgDoc;
	}

	this.drugIntakeHormone = function(hormoneDrugArray, physicianComments) {
		var x_text = 345;
		var y_text = 305;
		var x_standard = 350;
		var y_standard = 305;
		for (i in hormoneDrugArray) {
			var drugArray = hormoneDrugArray[i];
			for (j in drugArray) {
				var value = drugArray[j];
				thisObject.writeText(x_text, y_text, value, "15", "#000000");
				x_standard = x_standard + 210;
				x_text = x_standard;
			}
			x_standard = 350;
			x_text = 345;
			y_text = y_text + 25;
		}
		//thisObject.writeText(60, 620, physicianComments, "14", "#000000");
		thisObject.createTextArea(60, 600, physicianComments, 700, 195);
		thisObject.getTextAreas();
		
		return thisObject.svgDoc;
	}

	this.drugIntakeAdvancedSupplementation = function(
			advancedSupplementationDrugIntake, physicianComments) {
		var x_text = 240;
		var y_text = 318;
		var x_standard = 240;
		for (i in advancedSupplementationDrugIntake) {
			var drugsArray = advancedSupplementationDrugIntake[i];

			thisObject.fillAdvancedSupplementationTable(x_text, y_text,
					x_standard, drugsArray);
			y_text = y_text + 100;

		}

		//thisObject.writeText(60, 800, physicianComments, "14", "#000000");
		thisObject.createTextArea(60, 790, physicianComments, 680, 195);
		thisObject.getTextAreas();
		
		return thisObject.svgDoc;
	}

	this.fillAdvancedSupplementationTable = function(x_text, y_text,
			x_standard, drugsArray) {

		for (j in drugsArray) {
			var drug1 = drugsArray[j].drug1;
			var drug2 = drugsArray[j].drug2;
			var drug3 = drugsArray[j].drug3;
			var drug4 = drugsArray[j].drug4;
			var drug5 = drugsArray[j].drug5;
			var drug6 = drugsArray[j].drug6;

			for (k in drug1) {
				var value = drug1[k];
				thisObject.writeText(x_text, y_text, value, "12", "#000000");
				x_text = x_text + 75;
			}
			for (k in drug2) {
				var value = drug2[k];
				thisObject.writeText(x_text + 160, y_text, value, "12",
						"#000000");
				x_text = x_text + 75;
			}
			x_text = x_standard;
			y_text = y_text + 30;
			for (k in drug3) {
				var value = drug3[k];
				thisObject.writeText(x_text, y_text, value, "12", "#000000");
				x_text = x_text + 75;
			}
			for (k in drug4) {
				var value = drug4[k];
				thisObject.writeText(x_text + 160, y_text, value, "12",
						"#000000");
				x_text = x_text + 75;
			}
			x_text = x_standard;
			y_text = y_text + 30;
			for (k in drug5) {
				var value = drug5[k];
				thisObject.writeText(x_text, y_text, value, "12", "#000000");
				x_text = x_text + 75;
			}
			for (k in drug6) {
				var value = drug6[k];
				thisObject.writeText(x_text + 160, y_text, value, "12",
						"#000000");
				x_text = x_text + 75;
			}
		}
	}

	/*
	 * this.appendSVG = function() { $(thisObject.targetContainer).append(
	 * XmlUtil.xmlToString(thisObject.svgDoc)); }
	 */

	// wrap text
	function TextObj( el )
    {
		currentObj = this;
		currentObj.el = null;
		currentObj.el     = el;
		currentObj.textEl       = null;
		currentObj.text         = currentObj.el.getAttribute( 'text' );
		currentObj.x            = Number(currentObj.el.getAttribute( 'x' ));
		currentObj.y            = Number(currentObj.el.getAttribute( 'y' ));
		currentObj.width        = Number(currentObj.el.getAttribute( 'width' ));
		currentObj.height       = Number(currentObj.el.getAttribute( 'height' ));
		currentObj.fontSize     = Number(currentObj.el.getAttribute( 'font-size' ));
		currentObj.textAnchor   = currentObj.el.getAttribute( 'text-anchor' );
		currentObj.attributes   = [];         
		currentObj.getAttributes();
    };
    
    TextObj.prototype.getAttributes = function(){
    	 for ( var a = 0, aLen = currentObj.el.attributes.length; aLen > a; a++ )
         {
            var eachAttr = currentObj.el.attributes.item( a );
            if ( !currentObj[ eachAttr.nodeName ] )
            {
            	currentObj.attributes[ eachAttr.nodeName ] = eachAttr.value;
            }
         }
    }
    
    TextObj.prototype.setAttributes = function(targetEl){
    	for (var eachAttr in currentObj.attributes)
        {
           eachAttrValue = currentObj.attributes[ eachAttr ];
           targetEl.setAttribute( eachAttr, eachAttrValue );
        }
    }
	
	
	this.getTextAreas = function() {
		var textAreas = thisObject.svgDoc.getElementsByTagNameNS(svg12ns, 'textArea');
		for ( var t = 0, tLen = textAreas.length; tLen > t; t++) {
			var eachTextArea = textAreas.item(t);
			var eachTextObj = new TextObj(eachTextArea);
			thisObject.createText(eachTextObj);
			thisObject.textEls.push(eachTextObj);
		}
	}
	
	this.createText = function(textObj){
		textObj.textEl = thisObject.svgDoc.createElementNS(svgns, 'text');
        textObj.textEl.setAttribute( 'x', textObj.x );
        textObj.textEl.setAttribute( 'y', textObj.y );
        currentObj.setAttributes( textObj.textEl );        
        thisObject.wrapText( textObj );        
        textObj.el.parentNode.appendChild( textObj.textEl );
	}
	
	this.wrapText = function(textObj){
		//textObj.text = textObj.text.replace('-', '- ');
        var wordArray = textObj.text.split(' ');        
        var x = textObj.x;
        if ( 'end' == textObj.textAnchor )
        {
           x = textObj.x + textObj.width;
        }
        else if ( 'middle' == textObj.textAnchor )
        {
           x = textObj.x + (textObj.width/2);
        }

        var lineIncrement = 1;
        var eachWord = '';
        var tempLine = '';
        var eachLine = '';
        var hide = false;
        for ( var w = 0, wLen = wordArray.length; wLen > w; w++ )
        {
           eachWord = wordArray[w];
           if ( '' != eachWord && ' ' != eachWord )
           {
              tempLine += eachWord + ' ';
              var textWidth = tempLine.length * (textObj.fontSize / 2.2 );
              if ( textWidth < textObj.width )
              {
                 eachLine = tempLine;
              }
              else
              {
                 tempLine = eachWord + ' ';                  
                 var newLine = this.createTextItem( eachLine, x, lineY, hide );
                 textObj.textEl.appendChild( newLine );
                 lineIncrement++;
              }
           }
          
           var lineY = textObj.y + (lineIncrement * textObj.fontSize);
           if ( textObj.y + textObj.height < lineY )
           {
              hide = true;
           }
        }

       var newLine = thisObject.createTextItem( tempLine, x, lineY, hide );
       textObj.textEl.appendChild( newLine );
	}
	
	
	this.createTextItem = function(lineString, x, y, hide){
		var newLine = thisObject.svgDoc.createElementNS( svgns, 'tspan' );
        newLine.setAttribute( 'x', x );
        newLine.setAttribute( 'y', y );
        if ( hide )
        {
           newLine.setAttribute( 'display', 'none' );
        }
       
        var lineText = thisObject.svgDoc.createTextNode( lineString );
        newLine.appendChild( lineText );
        return newLine;
	}
	
	
	
	
	
	
	

}