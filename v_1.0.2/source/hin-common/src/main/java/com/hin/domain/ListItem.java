package com.hin.domain;

public class ListItem {

		private String key;
		private String value;
		private String logicalOperator="OR";
		
		public String getKey() {
			return key;
		}

		public void setKey(String key) {
			this.key = key;
		}

		public String getValue() {
			return value;
		}

		public void setValue(String value) {
			this.value = value;
		}

		public String getLogicalOperator() {
			return logicalOperator;
		}

		public void setLogicalOperator(String logicalOperator) {
			this.logicalOperator = logicalOperator;
		}
		
	
}
