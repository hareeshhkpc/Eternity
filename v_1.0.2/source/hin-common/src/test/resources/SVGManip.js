
function SVGManip(data){
	
	var svgManip = this;
	
	this.data = data;
	this.svgXml = null;
	
	this.printData = function(){
		println("svgManip.data: " + svgManip.data);
	}
	
}