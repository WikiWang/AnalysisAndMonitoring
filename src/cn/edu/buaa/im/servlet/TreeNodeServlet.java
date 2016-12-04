package cn.edu.buaa.im.servlet;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import javax.servlet.ServletException;

import cn.edu.buaa.im.util.LoadJson;
import cn.edu.buaa.im.util.Utility;

public class TreeNodeServlet extends HttpServlet{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws  IOException {
		try {
			this.doPost(request, response);
		} catch (ServletException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		request.setCharacterEncoding("UTF-8");
		response.setHeader("Content-type", "text/html;charset=UTF-8");

		String type = request.getParameter("type");
		String id = request.getParameter("id");
		String parentId = request.getParameter("parentId");
		String tree_url;
		tree_url = Utility.getParameter(type+"_tree_url") + "?" + type + "Id=" + id + "&pid=" + parentId;
			
		String treeJsonString = LoadJson.loadJSON(tree_url);
		
		JsonObject node;
		JsonArray nodes = new JsonParser().parse(treeJsonString).getAsJsonArray();
		
		int size = nodes.size();
		for(int i=0; i<size; i++){
			node = (JsonObject) nodes.get(i);
			node.addProperty("parentId", parentId);
			node.addProperty("isParent", false);
		}
		
		String result = nodes.toString();
		//		responseString(response, result);
		OutputStream ps = response.getOutputStream();  
		//这句话的意思，使得放入流的数据是utf8格式  
		ps.write(result.getBytes("UTF-8"));  
	}

}
