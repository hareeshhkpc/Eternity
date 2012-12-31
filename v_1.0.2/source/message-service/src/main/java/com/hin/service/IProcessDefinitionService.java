package com.hin.service;

import java.util.List;

import com.hin.domain.ProcessDefinition;

public interface IProcessDefinitionService  extends IBaseService<ProcessDefinition>  {
	public List<ProcessDefinition> getProcess();
	public void DeployProcess();
	public ProcessDefinition findByProcessName(String name);
	public ProcessDefinition findByProcessName(String name,Integer version);
}
