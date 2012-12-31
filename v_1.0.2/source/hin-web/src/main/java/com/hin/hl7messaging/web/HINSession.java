package com.hin.hl7messaging.web;

import javax.servlet.http.HttpSession;

import com.hin.hl7messaging.HinUserProfile;

public class HINSession {

	private static HINSession hinSession;
	private static final String HIN_USER_PROFILE_SESSION = "HIN_USER_PROFILE_SESSION";
	public static final String ORG_USER_PROFILE_SESSION = "ORG_USER_PROFILE_SESSION";

	private HttpSession session;

	private HINSession(HttpSession session) {
		this.session = session;
	}

	public static HINSession getHINSession(HttpSession session) {
		if (hinSession == null)// && session != null)*/
			hinSession = new HINSession(session);
		hinSession.session = session;
		return hinSession;
	}
	
	public static void removeHINSession(){
		hinSession.session.invalidate();
		hinSession.session =null;
		hinSession=null;
		
	}

	public HinUserProfile getHinUserProfile() {
		return (HinUserProfile) session.getAttribute(HIN_USER_PROFILE_SESSION);
	}

	public void setHinUserProfile(HinUserProfile hinUserProfile) {
		session.setAttribute(HIN_USER_PROFILE_SESSION, hinUserProfile);
	}

	public Object getAttribute(String key) {
		return session.getAttribute(key);
	}

	public void setAttribute(String key, Object value) {
		session.setAttribute(key, value);
	}
	public void removeAttribute(String key) {
		session.removeAttribute(key);
	}

	/*
	 * public static void setHinUserProfile(HinUserProfile hinUserProfile) {
	 * hinUserProfile = hinUserProfile; } public static HttpSession getSession()
	 * { return session; } public static void setSession(HttpSession session) {
	 * session = session; }
	 */

}
