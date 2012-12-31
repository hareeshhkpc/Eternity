package com.hin.hl7messaging.web;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.domain.vo.AppointmentVO;
import com.hin.domain.vo.PatientVO;
/*import com.hin.hl7messaging.web.vo.AppointmentVO;
import com.hin.hl7messaging.web.vo.PatientVO;*/
/**
 * 
 * @author madhu.murmu
 *
 */
@Controller
public class AppointmentScheduleController {
	
	/*@Autowired
	ILoginService loginService;*/
	
	@RequestMapping(value = "/app/schedule", method = RequestMethod.GET)
	public @ResponseBody String scheduleAppointment(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		List<AppointmentVO> appointmentDate = new ArrayList<AppointmentVO>();
		AppointmentVO appointmentVO = gson.fromJson(json, AppointmentVO.class);
		System.out.println("Rescheduled Date "+appointmentVO.getStart());
		System.out.println("Rescheduled Date "+appointmentVO.getEnd());
		System.out.println("Rescheduled Date String "+appointmentVO.getStartStr());
		System.out.println("Rescheduled Date String "+appointmentVO.getEndStr());
	    try {
			
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		data = gson.toJson(appointmentDate);
	    return data;
	}
	
	@RequestMapping(value = "/fetchApp/schedule", method = RequestMethod.GET)
	public @ResponseBody String fetchAppointment(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		List<AppointmentVO> appointmentDate = new ArrayList<AppointmentVO>();
		AppointmentVO appointmentVO = gson.fromJson(json, AppointmentVO.class);
		System.out.println("Scheduled Patient "+appointmentVO.getPatientVO().getFirstName()); 
		System.out.println("Requested User "+appointmentVO.getUserVO().getUserName());
	    try {
	    	
	  
	    	
	    	/*String data= Object[ {"id" : 1,"start" : new Date(year, month, day, 12),"end" : new Date(year, month, day, 13, 30),"title" : "Lunch with Mike","img" : "images/logo.jpg"	}, 
	    	    {"id" : 2,"start" : new Date(year, month, day, 14),"end" : new Date(year, month, day, 14, 45),"title" : "Dev Meeting","img" : "images/logo.jpg"	}, 
	    	    {"id" : 3,"start" : new Date(year, month, day + 1, 17),"end" : new Date(year, month, day + 1, 17, 45),"title" : "Hair cut","img" : "images/logo.jpg"}, 
				{"id" : 4,"start" : new Date(year, month, day - 1, 8),"end" : new Date(year, month, day - 1, 9, 30),"title" : "Team breakfast","img" : "images/logo.jpg"}, 
				{"id" : 5,"start" : new Date(year, month, day + 1, 14),"end" : new Date(year, month, day + 1, 15),"title" : "<b>Madhu Sudan</b><br>Welcome. jQuery Mobile","img" : "images/logo.jpg"}, 
				{"id" : 6,"start" : new Date(year, month, day, 10),"end" : new Date(year, month, day, 11),"title" : "I'm read-only","img" : "images/logo.jpg"//readOnly : true
					}";*/
			for(int i=0;i<10;i++){
				PatientVO patientVO = new PatientVO();
		    	patientVO.setId(Long.valueOf(i+""));
		    	patientVO.setFirstName("Sudhir"+i);
		    	patientVO.setLastName("Kumar"+i);
		    	
		    	Date d1 = new Date();
		    	// timed code goes here
		    	Date d2 = new Date();
		    	
		    	String fromDate = "2012-05-1"+(i+5)+" 13:30:00";
		    	String toDate = "2012-05-1"+(i+5)+" 14:30:00";
		    	DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		    	Date from = (Date)df.parse(fromDate);
		    	Date end = (Date)df.parse(toDate);
		    	
		    	
		    	/*UserVO userVO = new UserVO("Madhu"+i,null,null,null,null);
				AppointmentVO appVO = new AppointmentVO(patientVO.getId(),userVO,patientVO,fromDate,toDate);
				appointmentDate.add(appVO);*/
			}
	    	/*PatientVO patientVO = new PatientVO();
	    	patientVO.setId(1l);
	    	patientVO.setFirstName("Sudhir");
	    	patientVO.setLastName("Kumar");
	    	
	    	UserVO userVO = new UserVO("Madhu",null,null,null,null);
	    	
	    	appointmentDate.add(new AppointmentVO(1l,userVO,patientVO,new Date(),new Date()));
	    	*/
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		data = gson.toJson(appointmentDate);
	    return data;
	}
	public static void main(String[] args) {
		//Date date = new Date();
		DateFormat formatter = null;
		Date date = null;
		String dateStr = "2012-05-15 13:30:00";
		try {
			formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			//formatter = new SimpleDateFormat("E, dd MMM yyyy HH:mm:ss Z");
			date = (Date)formatter.parse(dateStr);
			DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			System.out.println("Today = " + df.format(date));
			System.out.println(date); 
			Date d1 = new Date();
	    	// timed code goes here
	    	Date d2 = new Date();
	    	long elapsed_time = d2.getTime() - d1.getTime();
	    	
	    	Date y = new Date(elapsed_time);
	    	System.out.println(d1+"=="+y); 
		} catch (Exception e) {
			// TODO: handle exception
		}
		System.out.println(date); 
	}

}
