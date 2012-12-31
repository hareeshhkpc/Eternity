/**
 * 
 */
package com.hin.hl7messaging.api;

import com.hin.domain.vo.MessageVO;


/**
 * @author vineeth.ng
 * 
 */
public interface IArchiveMessageService {
	public void archiveMessage(MessageVO messageVo,String programName) throws Exception;

}
