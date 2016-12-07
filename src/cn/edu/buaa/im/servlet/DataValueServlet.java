package cn.edu.buaa.im.servlet;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.edu.buaa.im.util.LoadJson;
import cn.edu.buaa.im.util.Utility;

import com.google.gson.JsonArray;
import com.google.gson.JsonParser;

public class DataValueServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * The doGet method of the servlet. <br>
	 *
	 * This method is called when a form has its tag value method equals to get.
	 * 
	 * @param request the request send by the client to the server
	 * @param response the response send by the server to the client
	 * @throws ServletException if an error occurred
	 * @throws IOException if an error occurred
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		try {
			this.doPost(request, response);
		} catch (ServletException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * The doPost method of the servlet. <br>
	 *
	 * This method is called when a form has its tag value method equals to post.
	 * 
	 * @param request the request send by the client to the server
	 * @param response the response send by the server to the client
	 * @throws ServletException if an error occurred
	 * @throws IOException if an error occurred
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// TODO Auto-generated method stub
		request.setCharacterEncoding("UTF-8");
		response.setHeader("Content-type", "text/html;charset=UTF-8");

		String type = request.getParameter("type");
		String id = request.getParameter("id");
		String parentId = request.getParameter("parentId");
		String version = request.getParameter("version");
		String fileData_url;
		if(parentId == null){
			fileData_url = Utility.getParameter(type+"_fileDataValue_url") + "?" + type + "Id=" + id + "&version=" + version + "&pid=";
		}else{
			fileData_url = Utility.getParameter(type+"_fileDataValue_url") + "?" + type + "Id=" + id + "&version=" + version + "&pid=" + parentId;
		}

		String result = LoadJson.loadJSON(fileData_url);
//		System.out.println(fileData_url);
		
		JsonArray nodes = new JsonParser().parse(result).getAsJsonArray();

		result = nodes.toString();

		//		responseString(response, result);
		OutputStream ps = response.getOutputStream();  
		//这句话的意思，使得放入流的数据是utf8格式  
		ps.write(result.getBytes("UTF-8"));  
	}

}
