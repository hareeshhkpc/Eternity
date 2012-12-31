/**
 * 
 */
package com.hin.hl7messaging.configuration.generator;

import javax.swing.JFrame;
import javax.swing.JPanel;

/**
 * @author Administrator
 *
 */
public class XMLGenerator extends JFrame {

	public XMLGenerator(){
		setTitle("XML Generator for HIN");
		
		JPanel content = new JPanel();
		
	}
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {		
		XMLGenerator generator = new XMLGenerator();
		generator.pack();
		generator.setSize(800, 800);
		generator.setVisible(true);
	}

}
