package cn.edu.buaa.im.service;

import java.io.IOException;
import java.util.Properties;

public class Utility {

	public static String getSQLite() {
		return getParameter("sqlile_url");
	}
	
	public static String getParameter(String key) {
		ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
		Properties properties = new Properties();
		try {
			properties.load(classLoader.getResourceAsStream("/parameter.properties"));
		} catch (IOException e) {
			e.printStackTrace();
		}
		String p = properties.getProperty(key);
		return p;
	}
}
