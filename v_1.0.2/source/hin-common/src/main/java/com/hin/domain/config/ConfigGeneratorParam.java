/**
 * 
 */
package com.hin.domain.config;

import java.util.List;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamImplicit;

/**
 * @author Administrator
 *
 */
@XStreamAlias(value="config-generation")
public class ConfigGeneratorParam {

	@XStreamAsAttribute
	private String configFilePath;
	
	@XStreamAsAttribute
	private String rootClass;
	
	@XStreamAsAttribute
	private String description;
	
	@XStreamAsAttribute
	private String artifactId;
	
	@XStreamAsAttribute
	private Boolean artifactIDAsRootTag;
	
	@XStreamImplicit(itemFieldName="schema-set")
	private List<ConfigSchemaSet> schemaSets;
	
	@XStreamImplicit(itemFieldName="tree-node")
	private List<ConfigParamTreeNode> treeNodes;

	public void initDefaults(){
		if(artifactIDAsRootTag == null){
			artifactIDAsRootTag = false;
		}
		
		if(treeNodes != null){
			for(ConfigParamTreeNode node : treeNodes){
				node.initDefaults();
			}
		}
	}
	
	public ConfigSchemaSet getSchemaSetForType(SCHEMA_TYPE type){
		ConfigSchemaSet schemaSet = null;
		for(ConfigSchemaSet set : schemaSets){
			if(set.getType() == type){
				schemaSet = set;
				break;
			}
		}
		return schemaSet;
	}
	
	public ConfigParamTreeNode getParamTreeNode(String path){
		ConfigParamTreeNode node = new ConfigParamTreeNode();
		if(treeNodes == null){
			return node;
		}
		
		for(ConfigParamTreeNode treeNode : treeNodes){
			if(treeNode.getXpath().equals(path)){
				node = treeNode;
				break;
			}
		}
		return node;
	}
	
	/**
	 * @return the configFilePath
	 */
	public String getConfigFilePath() {
		return configFilePath;
	}

	/**
	 * @param configFilePath the configFilePath to set
	 */
	public void setConfigFilePath(String configFilePath) {
		this.configFilePath = configFilePath;
	}

	/**
	 * @return the rootClass
	 */
	public String getRootClass() {
		return rootClass;
	}

	/**
	 * @param rootClass the rootClass to set
	 */
	public void setRootClass(String rootClass) {
		this.rootClass = rootClass;
	}

	/**
	 * @return the artifactIDAsRootTag
	 */
	public Boolean getArtifactIDAsRootTag() {
		return artifactIDAsRootTag;
	}

	/**
	 * @param artifactIDAsRootTag the artifactIDAsRootTag to set
	 */
	public void setArtifactIDAsRootTag(Boolean artifactIDAsRootTag) {
		this.artifactIDAsRootTag = artifactIDAsRootTag;
	}

	/**
	 * @return the treeNodes
	 */
	public List<ConfigParamTreeNode> getTreeNodes() {
		return treeNodes;
	}

	/**
	 * @param treeNodes the treeNodes to set
	 */
	public void setTreeNodes(List<ConfigParamTreeNode> treeNodes) {
		this.treeNodes = treeNodes;
	}

	/**
	 * @return the schemaSet
	 */
	public List<ConfigSchemaSet> getSchemaSets() {
		return schemaSets;
	}

	/**
	 * @param schemaSet the schemaSet to set
	 */
	public void setSchemaSet(List<ConfigSchemaSet> schemaSets) {
		this.schemaSets = schemaSets;
	}

	/**
	 * @return the description
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * @param description the description to set
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * @return the artifactId
	 */
	public String getArtifactId() {
		return artifactId;
	}

	/**
	 * @param artifactId the artifactId to set
	 */
	public void setArtifactId(String artifactId) {
		this.artifactId = artifactId;
	}

	/**
	 * @param schemaSets the schemaSets to set
	 */
	public void setSchemaSets(List<ConfigSchemaSet> schemaSets) {
		this.schemaSets = schemaSets;
	}

}
