/**
 * 
 */
package com.hin.web.base;

import java.io.Serializable;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

import javax.faces.application.FacesMessage;
import javax.faces.context.FacesContext;
import javax.faces.model.SelectItem;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import com.hin.domain.ConceptDataType;
import com.hin.domain.Status;

/**
 * @author sreekumar.s
 * 
 */
public class BaseBean implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public static final String jstlBundleParam = "javax.servlet.jsp.jstl.fmt.localizationContext";

	private List<SelectItem> statuses = new ArrayList<SelectItem>();

	public String getParameter(String name) {
		return getRequest().getParameter(name);
	}

	protected HttpServletRequest getRequest() {
		return (HttpServletRequest) FacesContext.getCurrentInstance()
				.getExternalContext().getRequest();
	}

	public void errorMessage(String message) {
		FacesContext.getCurrentInstance()
				.addMessage(
						null,
						new FacesMessage(FacesMessage.SEVERITY_ERROR, message,
								message));
	}

	/**
	 * @return the statuses
	 */
	public List<SelectItem> getStatuses() {
		if (statuses.isEmpty()) {
			Status[] statusArr = Status.values();
			SelectItem options = new SelectItem();
			for (Status status : statusArr) {
				if (!status.equals(Status.OBSOLETE)) {
					options = new SelectItem(status.getName(), status
							.getValue());
					statuses.add(options);
				}
			}
		}
		return statuses;
	}

	/**
	 * @param statuses
	 *            the statuses to set
	 */
	public void setStatuses(List<SelectItem> statuses) {
		this.statuses = statuses;
	}

}
