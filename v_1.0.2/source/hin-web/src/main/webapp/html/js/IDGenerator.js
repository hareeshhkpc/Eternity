function IDGenerator() {
	// id variable
	var id = 1;

	// instance of the idGenerator
	this.idGeneratorInstance = null;

	// Get the instance of the SingletonClass
	// If there is no instance in this.idGeneratorInstance, instanciate one
	var getInstance = function() {
		if (!this.idGeneratorInstance) {
			// create a instance
			this.idGeneratorInstance = createInstance();
		}

		// return the instance of the idGeneratorClass
		return this.idGeneratorInstance;
	}

	// function for the creation of the SingletonClass class
	var createInstance = function() {

		// public methodes
		return {
			getId : function() {
				return id++;
			},
			reset : function() {
				id = 1;
				//alert(id);
			}
		}
	}

	// wen constructed the getInstance is automaticly called and return the
	// SingletonClass instance
	return getInstance();
}
