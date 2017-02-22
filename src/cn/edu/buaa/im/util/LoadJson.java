package cn.edu.buaa.im.util;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;


public class LoadJson {
	public static byte[] toByteArray(String filename) throws IOException {
		File f = new File(filename);
		if (!f.exists()) {
			throw new FileNotFoundException(filename);
		}

		ByteArrayOutputStream bos = new ByteArrayOutputStream((int) f.length());
		BufferedInputStream in = null;
		try {
			in = new BufferedInputStream(new FileInputStream(f));
			int buf_size = 1024;
			byte[] buffer = new byte[buf_size];
			int len = 0;
			while (-1 != (len = in.read(buffer, 0, buf_size))) {
				bos.write(buffer, 0, len);
			}
			return bos.toByteArray();
		} catch (IOException e) {
			e.printStackTrace();
			throw e;
		} finally {
			try {
				in.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
			bos.close();
		}
	}
	
	/**
	 * 访问url获取json数据
	 * 
	 * @param url
	 *            地址
	 * @return json字符串
	 */
	public static String loadJSON(String url) {
		StringBuilder json = new StringBuilder();
		try {
			URL httpURL = new URL(url);
			URLConnection yc = httpURL.openConnection();
			BufferedReader in = new BufferedReader(new InputStreamReader(
					yc.getInputStream(),"utf-8"));
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
