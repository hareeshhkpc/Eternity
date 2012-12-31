package com.hin.hl7messaging.api;

import com.hin.domain.vo.ClientReportVO;

public interface IClientReportService {
	public ClientReportVO fetchData(ClientReportVO clientReportVO);

	public void exportToPDF(ClientReportVO clientReportVO) throws Exception;
}
