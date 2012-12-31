var ConfigUtil = {};
ConfigUtil.objectToString =  function(anObject){
	var str = "";
	for(_data in anObject){
		str += _data + ":" + anObject[_data] + ", ";
	}
	return str;
}