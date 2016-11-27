package cn.edu.buaa.im.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.concurrent.Callable;

public class GetJsonService implements Callable<String>{

	private String positiveAvgUrl;	

	public GetJsonService() {
		
	}
	public GetJsonService(String positiveAvgUrl) {
		super();
		this.positiveAvgUrl = positiveAvgUrl;
	}
	
	public String call() throws Exception {
		String positiveAvgMessage = null;
		positiveAvgMessage = loadJSON(positiveAvgUrl); 
		return positiveAvgMessage;
	}
	
	/**
	 * 访问url获取json数据
	 * 
	 * @param url
	 *            地址
	 * @return json字符串
	 */
	private String loadJSON(String url) {
		StringBuilder json = new StringBuilder();
		try {
			URL oracle = new URL(url);
			URLConnection yc = oracle.openConnection();
			BufferedReader in = new BufferedReader(new InputStreamReader(
					yc.getInputStream()));
			String inputLine = null;
			while ((inputLine = in.readLine()) != null) {
				json.append(inputLine);
			}
			in.close();
		} catch (Exception e) {
		}
		return json.toString();
	}
	
}