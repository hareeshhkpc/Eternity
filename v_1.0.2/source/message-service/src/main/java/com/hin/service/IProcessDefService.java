package com.hin.service;

import java.util.List;

import com.hin.domain.ProcessDefinition;

public interface IProcessDefService {
	public List<ProcessDefinition> getAllProcess();
	public void DeployProcess();
	public ProcessDefinition findByProcessName(String name);
	public ProcessDefinition findByProcessName(String name,Integer version);
	public void save(ProcessDefinition processDefinition);
	public void deleteProcessDefinition(ProcessDefinition processDefinition);
}
