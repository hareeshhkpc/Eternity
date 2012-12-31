/**
 * 
 */
package com.hin.hl7messaging.utils;

/**
 * @author sreekumar.s
 * 
 */
public enum Action {

	REGISTER("register"), LOGIN("login"), PROFILE("profile"), INBOX("inbox"), SAVE(
			"save"), STORE("store"), RETRIEVE("retrieve"), TEST("test"), GMAP(
			"gmap"), LOAD("load"), LOADREGISTRATION("loadRegistration"), ORGUSERREGISTRATION(
			"orguserregistration"), SAVEREGISTRATION("saveregistration"), SERVICES(
			"services"), MESSAGE_LOOKUP("messageLookup"), LOGOUT("logout"), STATISTICS(
			"statistics"), SELECTED_PROFILE("selectedProfile"), GMAPLOCATIONSSAVE(
			"gmaplocationssave"), CALENDAR("calendar"), CONTACT_REQUESTED(
			"contact_requested"), LINKED_PROFILE_MESSAGE(
			"linked_profile_message"), CONTACT_REQUESTED_REPLY(
			"contact_requested_reply"), STATISTICS_MESSAGES(
			"statistics_messages"),HISTORY("history"),RETRIEVEPROFILE("retrieveprofile"),SEARCH_PROFILE("search_profile"),
			WORK_FLOW_DIAGRAM("workflowdiagram"),TIME_LINE("timeLine"),SELECTED_TIME_LINE("selectedTimeLine");

	private final String value;

	private Action(String value) {
		this.value = value;
	}

	/**
	 * @return the value
	 */
	public String getValue() {
		return value;
	}

	public static Action fromString(String value) {
		if (value != null) {
			for (Action action : Action.values()) {
				if (value.equalsIgnoreCase(action.value)) {
					return action;
				}
			}
		}
		return null;
	}

}
