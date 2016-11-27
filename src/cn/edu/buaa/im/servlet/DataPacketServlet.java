package cn.edu.buaa.im.servlet;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import cn.edu.buaa.im.model.DataPacketAbs;
import cn.edu.buaa.im.service.CaseService;
import cn.edu.buaa.im.service.DataPacketService;
import cn.edu.buaa.im.service.VersionService;
import cn.edu.buaa.im.model.DPVersion;

public class DataPacketServlet extends BaseServlet{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws  IOException {
		
		if (request.getParameter("cid") == null || request.getParameter("cid").equals("null")){
			Fake(request, response);
			return;
		}
		
		String arg = request.getParameter("arg");
		if (arg.equals("abs")){
			String cid = request.getParameter("cid");
			DataPacketService dataPacketService = new DataPacketService(cid);
			
			List<DataPacketAbs> dataPacket = dataPacketService.getDataPacketAbs();
			
			Gson gson = new Gson();
			responseString(response, gson.toJson(dataPacket));
		}
		else if (arg.equals("version")){
			String cid = request.getParameter("cid");
			String sid = request.getParameter("sid");
			VersionService version = new VersionService(sid, cid);
			List<DPVersion> versions = version.getVersions();
			Gson gson = new Gson();
			responseString(response, gson.toJson(versions));
		}
		else if (arg.equals("sid")){
			String cid = request.getParameter("cid");
			CaseService caseService = new CaseService(cid);
			Gson gson = new Gson();
			responseString(response, gson.toJson(caseService));
		}
	}
	
	private void Fake(HttpServletRequest request, HttpServletResponse response){
		String arg = request.getParameter("arg");
		if (arg.equals("abs")){
			String fake = "[{\"name\":\"所属主模型\",\"value\":\"总体数据包\"},{\"name\":\"关键字\",\"value\":\"王恩泽\"},{\"name\":\"主模型所属分类\",\"value\":\"空气动力学\"},{\"name\":\"完成日期\",\"value\":\"2015-12-20\"},{\"name\":\"所属专业\",\"value\":\"飞行器设计\"},{\"name\":\"数据更新说明\",\"value\":\"王恩泽\"}]";
			responseString(response, fake);
		}
		else if (arg.equals("version")){
			String fake = "[{\"name\":\"总体数据包结构化数据v1\",\"date\":\"\",\"person\":\"\",\"abs\":\"总体数据包结构化数据v1\",\"id\":\"12648\"},{\"name\":\"总体数据包结构化数据v2\",\"date\":\"\",\"person\":\"\",\"abs\":\"总体数据包结构化数据v2\",\"id\":\"12653\"}]";
			responseString(response, fake);
		}
		else if (arg.equals("sid")){
			String fake = "{\"name\":\"总体数据包结构化数据v3\"}";
			responseString(response, fake);
		}
	}
}
