function Products(renderingEngine) {
	this.eventHandler = eventHandler;
	this.className = "Products";
	this.loadUI = loadUI;
	var renderingEngine = renderingEngine;
	var productsObj = this;

	this.productConceptIndex = 0;
	this.productConcepts = null;
	this.currentConceptVO = null;

	this.uiFinanceTypeIndex = 0;
	this.finaceTypes = [ "Cost", "Fee" ];
	this.uiMessages = [];

	this.productDoasageIndex = 0;
	this.productDoasages = null;

	this.productsMap = new HIN.HashMap();
	this.dosagesMap = new HIN.HashMap();

	this.products = null;

	this.selectedQty = null;
	this.selectedUnit = null;
	/* Function definitions */
	function eventHandler(event) {
		if (event.type == AppConstants.Event.PRODUCTS_PAGE_BIND_EVENTS) {
			var userVO = renderingEngine.getComponent("Context").getUserVo();
			if (userVO)
				searchConsumingProducts(userVO);

		} else if (event.type == AppConstants.Event.PRODUCTS_HOME_FILL_DATA_EVENT) {

		}
	}
	;

	function loadUI() {
		var searchVO = new HIN.SearchVO();
		searchVO.type = AppConstants.SearchType.PATIENT_PRODUCT_SEARCH;
		searchVO.max = 100;
		searchVO.searchServiceClass = "productSearchService";
		searchVO.serverURI = "/hin-web/rest/search/getLuceneIndex";
		searchVO.messageType = "POSA_MT920000HT03_Supplements";
		renderingEngine.getComponent("Context").setSearchVO(searchVO);
		clearContext();
		renderingEngine.loadPage("pages/products/products.html", "form",
				AppConstants.Event.PRODUCTS_PAGE_BIND_EVENTS);
	}
	;

	this.searchConsumingProducts = searchConsumingProducts;
	function searchConsumingProducts(userVO) {
		var subscriberId = "2bce549b-0b03-2cfd-3fa8-6f62a7d28ec3";
		var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		searchVO.queryString = "+subscriberId:" + subscriberId;
		renderingEngine.getComponent("DataLayer").search(searchVO, null,
				searchConsumingProductsCallback);
	}
	;

	this.searchConsumingProductsCallback = searchConsumingProductsCallback;
	function searchConsumingProductsCallback(results) {
		addProducts(results);
		var productsLength = productsObj.productsMap.length();
		for ( var index = 0; index < productsObj.productsMap.length(); index++) {
			var map = productsObj.productsMap.getItemAt(index);
			var messageId = map.key;
			var productVO = map.value;
			createTimelineUI(productVO);
		}
		fetchProducts();
	}
	;

	this.fetchProducts = fetchProducts;
	function fetchProducts() {
		var conceptClassName = "Supplements";
		renderingEngine.getComponent("DataLayer").loadAllConceptServices(
				conceptClassName, loadProducts, null);

	}
	;

	this.loadProducts = loadProducts;
	function loadProducts(productConcepts) {
		productsObj.productConcepts = productConcepts;
		processProducts();
	}
	;

	this.processProducts = processProducts;
	function processProducts() {
		if (productsObj.productConceptIndex < productsObj.productConcepts.json.length) {
			var productConcepts = productsObj.productConcepts;
			productsObj.currentConceptVO = productConcepts
					.getConcept(productConcepts.json[productsObj.productConceptIndex].name);
			var productUnitClass = productsObj.currentConceptVO
					.getAttribute("ProductUnitClass");
			if (productUnitClass) {
				var productHtmlFragment = generateProductUI(productsObj.currentConceptVO);

				$("#productView").append(productHtmlFragment);

				fetchProductsDose(productUnitClass);
			} else {
				productsObj.productConceptIndex++;
				processProducts();
			}
		} else {
			productsObj.productConceptIndex = 0;
		}
	}
	;

	this.fetchProductsDose = fetchProductsDose;
	function fetchProductsDose(productUnitClass) {
		var productUnitClass = productUnitClass;
		renderingEngine.getComponent("DataLayer").loadAllConceptServices(
				productUnitClass, loadProductsDose, null);
	}
	;

	this.loadProductsDose = loadProductsDose;
	function loadProductsDose(productDoasages) {
		productsObj.productDoasages = productDoasages;
		processProductsDose();
	}
	;

	this.processProductsDose = processProductsDose;
	function processProductsDose() {
		if (productsObj.productDoasageIndex < productsObj.productDoasages.json.length) {
			var productDoasages = productsObj.productDoasages;
			var productDoasageVO = productDoasages
					.getConcept(productDoasages.json[productsObj.productDoasageIndex].name)
			productsObj.dosagesMap.put(productDoasageVO.name, productDoasageVO);
			generateProductDoseUI(productDoasageVO);

			productsObj.productDoasageIndex++;
			processProductsDose();
		} else {
			var productConceptVO = productsObj.currentConceptVO;
			var productDesc = productConceptVO.description;
			var productName = productConceptVO.name;
			var addButtonHtml = createUIForAddButton(productDesc, productName);
			$("#" + productName + "Dosage").append(addButtonHtml);
			productsObj.productDoasageIndex = 0;
			productsObj.productConceptIndex++;
			productsObj.processProducts();
		}
	}
	;

	this.generateProductUI = generateProductUI;
	function generateProductUI(productConceptVO) {
		var productName = productConceptVO.name;
		this.productName = productName;
		var productDescription = productConceptVO.description;

		var productHtmlFragment = '<tr id="'
				+ productConceptVO.name
				+ '"><td class="table-column1"><div class="ui-product-image ui-products-display"><div class="ui-product-name">'
				+ productDescription
				+ '</div><div class="ui-product-picture"><img src="images/product.png" /></div></div></td><td class="table-column2"><div class="ui-product-desc ui-products-display"><div class="ui-product-description">Supports optimal thyroid function and improves the bodys utilization of thyroid hormones. The nutrients and glandulars in Thyroid Support all of the biological processes involved in both the production and conversion of thyroid hormones. *(thyroxin free)<ul><li>Essential nutrients for proper thyroid function.</li><li>Thyroxin-free glandular product.</li></ul>Includes iodine, selenium, N-acetyl L-tyrosine, and pituitary anterior.</div></div></td><td class="table-column3" id="'
				+ productConceptVO.name
				+ 'Dosage"><div class="ui-product-weight ui-products-display" id="'
				+ productConceptVO.name + 'DoseWrapper"></div></td></tr>'

		return productHtmlFragment;
	}
	;

	this.generateProductDoseUI = generateProductDoseUI;
	function generateProductDoseUI(productDoasageVO) {
		var productDoseName = productDoasageVO.name;
		var productDoseDesc = productDoasageVO.description;
		var productDoasageAttributes = productDoasageVO.conceptAttributes;
		var productName = productsObj.currentConceptVO.name;
		var productDesc = productsObj.currentConceptVO.description;

		var productDoseHtml = '<div class="ui-product-wght-list" id="'+ productDoseName + '"></div>';
		var doseWrapperId = productName + "DoseWrapper";

		$("#" + doseWrapperId).append(productDoseHtml);

		if (productDoseDesc != '0mg') {
			var doseNameHtml = createUIForDoseName(productDoseName,
					productDoseDesc);
			$("#" + productDoseName).append(doseNameHtml);
		}

		$.each(productDoasageAttributes, function(index, value) {
			if (value.key == 'quantity1' || value.key == 'quantity2'
					|| value.key == 'quantity3') {
				var quantity = parseInt(value.value);
				var doseHtml = createUIForEachDosage(productDoasageVO,
						quantity, index);
				$("#" + productDoseName).append(doseHtml);
				var productQtyId = productDoseName + "quantity" + index;
				$("#" + productDoseName).find("#" + productQtyId).unbind(
						'click', selectProductsQty);
				$("#" + productDoseName).find("#" + productQtyId).bind('click',
						selectProductsQty);
			}

		});
	}
	;

	this.createUIForEachDosage = createUIForEachDosage;
	function createUIForEachDosage(productDoasageVO, quantity, idSuffix) {
		var productDoseName = productDoasageVO.name;
		var productName = productsObj.currentConceptVO.name;
		var intakePerDay = productDoasageVO.getAttribute("intakePerDay");
		var quantityLabel = (quantity > 1) ? "Bottles" : "Bottle";
		var id = productDoseName + 'quantity' + idSuffix;
		var displayQuantity = quantity + " " + quantityLabel;
		var doseHtml = '<div class="ui-weightage ui-wght-tablet" productName="'
				+ productName + '" doseClass="' + productDoseName + '" id="'
				+ id + '" quantity="' + quantity
				+ '"><span class="ui-wght-text">' + displayQuantity
				+ '</span></div>';

		return doseHtml;

	}
	;

	this.createUIForDoseName = createUIForDoseName;
	function createUIForDoseName(productDoseName, productDoseDesc) {
		var id = productDoseName + "doseName";
		var doseNameHtml = '<div class="ui-weightage ui-wght-mg"><span class="ui-wght-text" id="'
				+ id + '">' + productDoseDesc + '</span></div>';
		return doseNameHtml;

	}
	;

	this.generateProductTimelineUI = generateProductTimelineUI;
	function generateProductTimelineUI(productDoseName, productDesc) {
		var timeLineHtml = '<div style="height:40px;border: 1px solid #000000" id="'
				+ productDoseName + 'Timeline">' + productDesc + '</div>'

		return timeLineHtml;
	}
	;

	this.createUIForAddButton = createUIForAddButton;
	function createUIForAddButton(productDesc, productName) {
		var addId = productName + 'Add';
		var addButtonHtml = '<div class="ui-product-btn-area"><div class="ui-product-btn ui-product-btn-gradient" id="'
				+ addId
				+ '" productDesc="'
				+ productDesc
				+ '" productName="'
				+ productName + '">Add</div></div>';

		return addButtonHtml;
	}
	;

	this.selectProductsQty = selectProductsQty;
	function selectProductsQty() {
		var doseClass = $(this).attr("doseClass");
		var productName = $(this).attr('productName');
		var addButtonId = productName + "Add";
		var quantity = $(this).attr('quantity');
		
		$("#"+productName+"Add").removeClass("ui-product-btn-gradient").addClass("ui-product-btn-gradient-press");
		$("#" + productName + "Dosage").find("#" + addButtonId).unbind(
				'click', orderProduct);
		$("#" + productName + "Dosage").find("#" + addButtonId).bind(
				'click', orderProduct);

		$("#" + productName + "DoseWrapper").find(
				'[productName="' + productName + '"]').each(
				function(key, value) {
					$(value).removeClass("ui-weightage-press");
					$(value).addClass("ui-wght-tablet");
				});
		$(this).removeClass("ui-wght-tablet");
		$(this).addClass("ui-weightage-press");
		productsObj.selectedUnit = doseClass;
		productsObj.selectedQty = quantity;
	}
	;

	this.orderProduct = orderProduct;
	function orderProduct() {
		var productDesc = $(this).attr('productDesc');
		var productName = $(this).attr('productName');
		$("#"+productName+"Add").removeClass("ui-product-btn-gradient-press").addClass("ui-product-btn-gradient");
		$("#" + productName + "DoseWrapper").find(
				'[productName="' + productName + '"]').each(
				function(key, value) {
					$(value).removeClass("ui-weightage-press");
					$(value).addClass("ui-wght-tablet");
				});
		var productConceptVO = productsObj.productConcepts
				.getConcept(productName);
		var message = createMessage(productConceptVO);
		processDependentMessages(message, productConceptVO);
	}
	;

	this.createMessage = createMessage;
	function createMessage(productConceptVO) {
		var message = factoryClass.createMessage();
		message.title = productConceptVO.description;
		message.description = productConceptVO.description;
		message.messageType = productConceptVO.getAttribute("MessageType");
		return message;
	}
	;

	this.processDependentMessages = processDependentMessages;
	function processDependentMessages(uiMessage, productConceptVO) {
		if (productsObj.uiFinanceTypeIndex < productsObj.finaceTypes.length) {
			addDependentMessage(uiMessage, productConceptVO,
					productsObj.finaceTypes[productsObj.uiFinanceTypeIndex]);
		} else {
			productsObj.uiFinanceTypeIndex = 0;
			processProductMessage(uiMessage, productConceptVO);
		}
	}
	;

	this.processProductMessage = processProductMessage;
	function processProductMessage(uiMessage, productConceptVO) {
		renderingEngine.getComponent("DataLayer").processMessage(
				uiMessage,
				"",
				function(messageId, msg, messageObj) {
					uiMessage.messageId = messageId;
					if (msg) {

						uiMessage.msg = msg;
						uiMessage.message = msg.getXML();
						var messageType = messageObj.messageType

						uiMessage.msg = fillMessage(uiMessage.msg, messageType,
								productConceptVO);

						/*
						 * alert("xml:message \n" +
						 * XmlUtil.xmlToString(msg.getXML()));
						 */
						productsObj.addMessage(uiMessage);

						var productVO = new HIN.ProductVO();
						productVO.messageId = messageId;
						productVO.messageTitle = productConceptVO.description;
						productVO.createdDate = new Date().getTime();
						productVO.setMessage(msg.getXML());
						productsObj.productsMap.put(productVO.messageId,
								productVO);
						createTimelineUI(productVO);
						finishCompleteHandler();
					}
				});
	}
	;

	this.fillMessage = fillMessage;
	function fillMessage(msg, messageType, productConceptVO) {
		var map = productsObj.dosagesMap.get(productsObj.selectedUnit);
		var selectedDosageVO = null;
		if (typeof (map) === 'object' && map != null)
			selectedDosageVO = map.value;

		var messageAndUIBinder = new MessageAndUIBinder(null, msg, messageType);

		messageAndUIBinder.updateId('MSG_TITLE', productConceptVO.description);

		var fields = "subject,patient,patientPerson";
		var type = "II";
		var tagName = "id";
		var pathFields = fields.split(',');
		var instanceObject = [ 'SUBSCRIBER_ID',
				'2bce549b-0b03-2cfd-3fa8-6f62a7d28ec3' ];
		messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
				instanceObject);

		var formattedDate = formatDate(new Date(), 'yyyy-MM-dd');
		var fields = "";
		var type = "TS";
		var tagName = "effectiveTime";
		var pathFields = fields.split(',');
		var instanceObject = [ new Date().getTime() ];
		messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
				instanceObject);

		fields = "";
		type = "CE";
		tagName = "doseQuantity";
		pathFields = fields.split(',');
		instanceObject = [ productsObj.selectedQty ];
		messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
				instanceObject);

		var unitQty = parseInt(selectedDosageVO.getAttribute('quantityPerUnit'))
				* parseInt(productsObj.selectedQty);
		fields = "";
		type = "RTO_PQ_PQ";
		tagName = "doseCheckQuantity";
		pathFields = fields.split(',');
		instanceObject = [ unitQty ];
		messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
				instanceObject);

		return msg;

	}
	;

	this.addDependentMessage = addDependentMessage;
	function addDependentMessage(uiMessage, conceptVO, uiFinanceType) {
		var selectedMessage = uiMessage;
		var selecetedConceptVO = conceptVO;
		var map = productsObj.dosagesMap.get(productsObj.selectedUnit);
		var selectedDosageVO = null;
		if (typeof (map) === 'object' && map != null)
			selectedDosageVO = map.value;
		var selectedQty = productsObj.selectedQty;
		var dataLayer = appController.getComponent("DataLayer");
		appController
				.getComponent("DataLayer")
				.createMessageByType(
						AppConstants.XPaths.Finance.MESSAGE_TYPE,
						function(message) {
							selectedMessage.addDependendMessage(message);
							var financeType = uiFinanceType;
							var amt = selectedDosageVO
									.getAttribute(financeType);
							var concept = selecetedConceptVO.getName();
							var className = selecetedConceptVO
									.getMessageTypeClassName();
							var messageTypeScript = new MessageTypeScript(
									message.msg, message.messageType,
									appController);
							dataLayer
									.loadData(
											"JS_" + message.messageType,
											{},
											function(data) {
												messageTypeScript
														.loadScript(data);
												messageTypeScript.initialize();

												var subscriberId = '72ee1390-5981-b9b4-28b6-53ec64628a58';

												messageTypeScript.fillData(
														'SUBSCRIBER_ID',
														subscriberId);

												var formattedDate = formatDate(
														new Date(),
														'yyyy-MM-dd');
												messageTypeScript.fillData(
														'effectiveTime',
														formattedDate);

												messageTypeScript.fillData(
														'amt', amt);
												var netAmout = selectedQty
														* amt;
												var components = [ {
													'quantity' : selectedQty,
													'unitPrice' : amt,
													'netAmount' : netAmout
												} ];
												messageTypeScript
														.fillData(
																'financialTransactionChargeDetail',
																components);

												components = [ {
													'concept' : selecetedConceptVO
															.getName(),
													'description' : selecetedConceptVO
															.getDescription()
												} ];
												var transactionType = null;
												if (className == "Drug") {
													if (financeType == "Fee")
														transactionType = AppConstants.TransactionType.PRODUCT_FEE;
													else if (financeType == "Cost")
														transactionType = AppConstants.TransactionType.PRODUCT_COST;
													messageTypeScript.fillData(
															'drug', components);
												}

												messageTypeScript.fillData(
														'transactionType',
														transactionType);
												messageTypeScript
														.fillData(
																'transactionStatus',
																AppConstants.TransactionStatus.ORDERED);
												productsObj.uiFinanceTypeIndex++;
												processDependentMessages(
														uiMessage, conceptVO);
											});
						});

	}
	;

	this.addMessage = addMessage;
	function addMessage(message) {
		if (!this.getMessage(message.id)) {
			this.uiMessages.push(message);
		} else {
			alert("Exist : " + message.id);
		}
	}
	;

	this.getMessage = getMessage;
	function getMessage(id) {
		for ( var index = 0; index < this.uiMessages.length; index++) {
			if (this.uiMessages[index].id == id) {
				return this.uiMessages[index];
			}
		}
	}
	;

	this.getMessages = getMessages;
	function getMessages() {
		return this.uiMessages;
	}
	;

	this.deleteMessage = deleteMessage;
	function deleteMessage(id) {
		var deleteIndex = -1;
		for ( var index = 0; index < this.uiMessages.length; index++) {
			if (this.uiMessages[index].id == id) {
				deleteIndex = index;
				break;
			}
		}
		if (deleteIndex != -1) {
			this.uiMessages.splice(deleteIndex);
		}
	}
	;

	this.addProducts = addProducts;
	function addProducts(results) {
		productsObj.products = results;
		$.each(results,
				function(index, resultVO) {
					if (resultVO) {
						var productVO = new HIN.ProductVO();
						productVO.messageId = resultVO.messageId;
						productVO.messageTitle = resultVO.messageTitle;
						productVO.messageStatus = resultVO.messageStatus;
						productVO.createdDate = resultVO.createdDate;
						productVO.isActive = resultVO.isActive;
						if (resultVO.message)
							productVO.setMessage(XmlUtil
									.stringToXml(resultVO.message));
						productsObj.productsMap.put(productVO.messageId,
								productVO);
					}
				});
	}
	;

	this.createTimelineUI = createTimelineUI;
	function createTimelineUI(productVO) {
		var date = null;
		var startPart = null;
		var endPart = null;
		var endMonth = null;
		var endDate = new Date();
		var daysItLastsFor = null;
		var productName = productVO.messageTitle;
		var totalQuantity = null;
		if (productVO.unitQuantity) {
			totalQuantity = productVO.unitQuantity;
		} else {
			totalQuantity = 60;
		}
		var intakePerDay = getIntakePerDay(productVO.doseQuantity);
		var startDateTS = parseInt(productVO.createdDate);
		var startDate = new Date(startDateTS);
		var startMonth = parseInt(startDate.getMonth()) + 1;
		var subId = productVO.messageId;
		createUITimeTemplate(
				productName,
				productVO,
				function() {
					date = startDate.getDate();
					startPart = findDatePart(date);
					daysItLastsFor = parseInt(totalQuantity)
							/ parseInt(intakePerDay);

					endDate.setDate(startDate.getDate() + daysItLastsFor);
					endMonth = parseInt(endDate.getMonth()) + 1;
					date = endDate.getDate();
					endPart = findDatePart(date);
					if (startMonth <= endMonth) {
						for ( var month = startMonth; month <= endMonth; month++) {
							if (month == startMonth) {
								var endPoint = 4;
								fillProductDuration(startPart, endPoint,
										startMonth, subId);
							} else if (month == endMonth) {
								var startPoint = 1;
								fillProductDuration(startPoint, endPart,
										endMonth, subId);
							} else {
								var startPoint = 1;
								var endPoint = 4;
								var month = parseInt(month) + 1;
								fillProductDuration(startPoint, endPoint,
										month, subId);
							}
						}

					}
					if (startMonth > endMonth) {
						for ( var month = startMonth; month <= 12; month++) {
							if (month == startMonth) {
								var endPoint = 4;
								fillProductDuration(startPart, endPoint,
										startMonth, subId);
							} else if (month == endMonth) {
								var startPoint = 1;
								fillProductDuration(startPoint, endPart,
										endMonth, subId);
							} else {
								var startPoint = 1;
								var endPoint = 4;
								var month = 12;
								fillProductDuration(startPoint, endPoint,
										month, subId);
							}
						}

						for ( var month = 1; month <= endMonth; month++) {
							if (month == startMonth) {
								var endPoint = 4;
								var month = 1;
								fillProductDuration(startPart, endPoint, month,
										subId);
							} else if (month == endMonth) {
								var startPoint = 1;
								fillProductDuration(startPoint, endPart,
										endMonth, subId);
							} else {
								var startPoint = 1;
								var endPoint = 4;
								var month = parseInt(month);
								fillProductDuration(startPoint, endPoint,
										month, subId);
							}
						}
					}

				});
	}
	;

	this.fillProductDuration = fillProductDuration;
	function fillProductDuration(startPoint, endPoint, month, subId) {
		for ( var i = startPoint; i <= endPoint; i++) {
			var subCellId = "week" + month + i;
			$("#uiTable").find("#" + subId).find("#" + subCellId).css(
					"background-color", "#56104E");
			$("#uiTable").find("#" + subId).find("#" + subCellId).css("border",
					"2px solid #56104E");
		}
	}
	;

	this.findDatePart = findDatePart;
	function findDatePart(date) {
		var date = parseInt(date);
		var part = null;
		if (date > 0 && date <= 7) {
			part = 1;
		}
		if (date > 7 && date <= 14) {
			part = 2;
		}
		if (date > 14 && date <= 21) {
			part = 3;
		}
		if (date > 21 && date <= 30) {
			part = 4;
		}
		return part;
	}

	this.getIntakePerDay = getIntakePerDay;
	function getIntakePerDay(doseQuantity) {
		var intakePerDay = null;
		var convertedValue = Number(doseQuantity);
		if (convertedValue) {
			intakePerDay = convertedValue;
			return intakePerDay;
		}
		if (doseQuantity == 'Single in a day' || doseQuantity == '1') {
			intakePerDay = 1;
		}
		if (doseQuantity == 'Twice in a day' || doseQuantity == '2') {
			intakePerDay = 2;
		}
		if (doseQuantity == 'Thrice in a day' || doseQuantity == '3') {
			intakePerDay = 3;
		}
		if (doseQuantity == 'Four in a day' || doseQuantity == '4') {
			intakePerDay = 4;
		}
		return intakePerDay;
	}

	this.createUITimeTemplate = createUITimeTemplate;
	function createUITimeTemplate(productName, productVO, callback) {
		var id = productVO.messageId;
		var timelineHtml = '<tr class="timeline-row" id="' + id
				+ '"><td class=\"timeline-heading\">' + productName + '</td>';
		for ( var month = 1; month <= 12; month++) {
			timelineHtml += '<td class=\"timeline\" id=\"month'
					+ month
					+ '\"> <table class=\"subTable\">  <tr>   <td class=\"subtbCol\"></td>   <td class=\"subtbCol\"></td>   <td class=\"subtbCol\"></td>   <td class=\"subtbCol\"></td>  </tr>  <tr>   <td class=\"subtbCol\" id=\"week'
					+ month
					+ '1\"></td>   <td class=\"subtbCol\" id=\"week'
					+ month
					+ '2\"></td>   <td class=\"subtbCol\" id=\"week'
					+ month
					+ '3\"></td>   <td class=\"subtbCol\" id=\"week'
					+ month
					+ '4\"></td>  </tr>  <tr>   <td class=\"subtbCol\"></td>   <td class=\"subtbCol\"></td>   <td class=\"subtbCol\"></td>   <td class=\"subtbCol\"></td>  </tr>         </table></td>'
		}
		timelineHtml += '</tr>';
		var lineContent = $("#uiTable").find("#" + id).html();
		if (!lineContent) {
			$("#uiTable").append(timelineHtml);
		} else {
			$("#uiTable").remove('#' + id);
			$("#uiTable").append(timelineHtml);
		}

		if (callback) {
			callback();
		}
	}

	this.finishCompleteHandler = finishCompleteHandler
	function finishCompleteHandler() {
		var parameters = [];
		parameters = [ productsObj.uiMessages ];
		appController.getComponent("DataLayer").createOrUpdateTasks(parameters);
	}
	;

	this.clearContext = clearContext;
	function clearContext() {
		productsObj.productsMap.clearItems();
		productsObj.dosagesMap.clearItems();
		productsObj.uiMessages = [];
	}
	;
}
