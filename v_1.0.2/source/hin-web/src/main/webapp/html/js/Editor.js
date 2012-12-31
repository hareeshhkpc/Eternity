function Editor(){
	var editorDom = null;
	this.PNCompleteValues = PNCompleteValues;
	this.openEditor = openEditor;
	
	$.get("./pages/form/DATATYPE_EDITOR_FORM.html", function(data){
		editorDom = data;
	});
	
	function openEditor(){
		$('.field').each(function(key, value){
			var edit = 1;
			$(value).click(function(){
				var dataType       = $(value).attr("dataType");
				var id             = $(value).attr("id");
				var editorFragment = $(editorDom).find("#"+dataType+"Editor").clone();
				if(edit == 1)
				{					
					var htmlFragment = $('<div id="fieldEditor">'+ editorFragment.html()+'</div>');
					$("#fieldEditor").remove();
					htmlFragment.insertAfter("#"+id);
					$("#fieldEditor").trigger("create");	
					edit = 0;
				}
				else if(edit == 0)
				{
					var fieldEditor = $("#fieldEditor");
					var values = null;
					eval("values="+dataType+"Values(fieldEditor)");
					edit = 1;
					$(value).attr("value", values);
					$("#fieldEditor").remove();							
				}
			});										
		});	
	}
	
	function PNCompleteValues(fieldEditor){
		var prefix = $(fieldEditor).find("#select-prefix").attr("value");
		var family = $(fieldEditor).find("#PNfamily").attr("value");
		var given  = $(fieldEditor).find("#PNgiven").attr("value");
		var suffix = $(fieldEditor).find("#PNsuffix").attr("value");
		
		var value = prefix +" "+ family +" "+ given +" "+ suffix;
		return value;		
	}
	
	function IIValues(fieldEditor){
		var root = $(fieldEditor).find("#IIroot").attr("value");
		var extension = $(fieldEditor).find("#IIextension").attr("value");
		var assigningAuthorityName  = $(fieldEditor).find("#IIassigningAuthorityName").attr("value");
		
		var value = assigningAuthorityName +" "+ extension;
		return value;		
	}
	
	function ADValues(fieldEditor){
		var houseNumber = $(fieldEditor).find("#ADhouseNumber").attr("value");
		var streetName = $(fieldEditor).find("#ADstreetName").attr("value");
		var city  = $(fieldEditor).find("#ADcity").attr("value");
		var state  = $(fieldEditor).find("#ADstate").attr("value");
		var country  = $(fieldEditor).find("#ADcountry").attr("value");
		var postalCode  = $(fieldEditor).find("#ADpostalCode").attr("value");
		
		var value = houseNumber +" "+ streetName +" "+ city +" "+ state +" "+ country +" "+ postalCode;
		return value;		
	}
	

	
	
}

