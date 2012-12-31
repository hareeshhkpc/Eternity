var HIN;

if (!HIN)
	HIN = {};
/**
 * HashMap that maps keys to values. Each key can map to at most one value.
 */
HIN.HashMap = function() {
	this.maps = new Array();
	this.index = 0;
};

/**
 * Associates the specified value with the specified key in this map.
 * 
 * @param key :
 *            Its a string value.
 * @param value :
 *            Its an type of object.
 * @returns {void}
 */
HIN.HashMap.prototype.put = function(key, value) {
	var map = new Object();
	map.key = key;
	map.value = value;
	this.maps[this.index++] = map;
};

/**
 * Returns the object to which the specified key is mapped in this identity hash
 * map, or null if the map contains no mapping for this key.
 * 
 * @param key :
 *            Its a string value.
 * @returns {Object}
 */
HIN.HashMap.prototype.get = function(key) {
	for (i = 0; i < this.maps.length; i++) {
		var map = this.maps[i];
		if (map != null && map.key == key)
			return map;
	}
	return null;
};

/**
 * Returns the value to which the specified key is mapped in this identity hash
 * map, or null if the map contains no mapping for this key.
 * 
 * @param key :
 *            Its a string value.
 * @returns {Object}
 */
HIN.HashMap.prototype.getItem = function(key) {
	for (i = 0; i < this.maps.length; i++) {
		var map = this.maps[i];
		if (map != null && map.key == key)
			return map.value;
	}
	return null;
};

/**
 * Returns the number of key-value mappings in this map.
 * 
 * @returns {Integer}
 */
HIN.HashMap.prototype.length = function() {
	return this.maps.length;
};

HIN.HashMap.prototype.getItemAt = function(i) {
	return this.maps[i];
};

HIN.HashMap.prototype.itemSelectionChanged = function(key, value) {
	var map = this.get(key);
	if (map != null) {
		map.value = value;
	} else {
		this.put(key, value);
	}
};
HIN.HashMap.prototype.getSelectedItems = function() {
	var items = "";
	if (this.maps == null || this.maps.length == 0)
		return items

	for (i = 0; i < this.maps.length; i++) {
		var map = this.maps[i];
		if (map != null && map.value == true) {
			items = items.concat(map.key).concat(",");
		}
	}
	if (items.lastIndexOf(",") > -1) {
		items = items.substring(0, items.length - 1);
	}
	return items;
};

HIN.HashMap.prototype.clearItems = function() {
	if (this.maps != null && this.maps.length > 0) {
		this.maps.splice(0, this.maps.length);
		this.index = 0;
	}
};

HIN.HashMap.prototype.removeItem = function(key) {
	for ( var i = 0; i < this.maps.length; i++) {
		var map = this.maps[i];
		if (map != null && map.key == key) {
			map.key = -1;
			// alert(map.key + "==" + key);
			this.maps.splice(i, 1);
			return true;
		}
	}
	return false;
};