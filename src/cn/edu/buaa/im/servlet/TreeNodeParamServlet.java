package cn.edu.buaa.im.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLConnection;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.edu.buaa.im.service.Utility;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class TreeNodeParamServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws  IOException {
		//		List<TreeNode> treeNodes;
		//
		//		String sid = request.getParameter("sid");
		//		if (sid == null || sid.equals("undefined"))
		//			treeNodes = TreeNodeReader.ReadTreeNodes();
		//		else{
		//			TreeNodeService treeNodeService = new TreeNodeService(sid);
		//			treeNodes = treeNodeService.geTreeNodes();
		//		}
		//		Gson gson = new Gson();
		//		responseString(response, gson.toJson(treeNodes));
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

		String packet_id = request.getParameter("packet_id");
		String parentId = request.getParameter("parentId");
		String tree_url;
		if(parentId != null){
			tree_url = Utility.getParameter("tree_url") + "/web/packList?id=" + packet_id+"&pid=" + parentId;
		}else{
			tree_url = Utility.getParameter("tree_url") + "/web/packList?id=" + packet_id;
		}
		String treeJsonString = loadJSON(tree_url);

		JsonObject node;
		JsonArray nodes = new JsonParser().parse(treeJsonString).getAsJsonArray();

		int size = nodes.size();
		for(int i=0; i<size; i++){
			node = (JsonObject) nodes.get(i);
//			node.addProperty("parentId", parentId);
			node.addProperty("isParent", true);
		}

		String result = nodes.toString();
		//		responseString(response, result);
		OutputStream ps = response.getOutputStream();  
		//这句话的意思，使得放入流的数据是utf8格式  
		ps.write(result.getBytes("UTF-8"));  
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
