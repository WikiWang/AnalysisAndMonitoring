package cn.edu.buaa.im.servlet;

import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import cn.edu.buaa.im.data.TreeNodeReader;
import cn.edu.buaa.im.model.BaseData;
import cn.edu.buaa.im.model.DataItem;
import cn.edu.buaa.im.model.TreeNode;
import cn.edu.buaa.im.service.DataItemService;
import cn.edu.buaa.im.model.BaseData.CurveDataItem;
import cn.edu.buaa.im.model.BaseData.D3DataItem;
import cn.edu.buaa.im.model.BaseData.FileDataItem;
import cn.edu.buaa.im.model.BaseData.FloatDataItem;
import cn.edu.buaa.im.model.BaseData.ImageDataItem;
import cn.edu.buaa.im.model.BaseData.TextDataItem;
import cn.edu.buaa.im.model.BaseData.UrlDataItem;

public class DataItemServlet extends BaseServlet{
	/**
	 * 
	 */
	
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws  IOException {
		String arg = request.getParameter("arg");
		if (arg != null)
		{
			String fileName = request.getParameter("file");

			response.reset();
			// 设置response的Header
			response.setContentType("application/x-cortona");

			byte[] result = Util.toByteArray(fileName);
			response.addHeader("Content-Disposition", "attachment;filename="
					+ fileName);
			response.addHeader("Content-Length", "" + result.length);
			OutputStream outputStream = null;
			outputStream = response.getOutputStream();
			outputStream.write(result, 0, result.length);
			outputStream.close();
			return;
		}
			
		String sid = request.getParameter("sid");
		String cid = request.getParameter("cid");
		if (sid == null || cid == null || sid.equals("undefined")){
			sampleData(response);
			return;
		}
		
		List<DataItem> dataItems = new ArrayList<DataItem>();
		
		DataItemService dataItemService = new DataItemService(sid, cid);
		
		dataItems = dataItemService.getDataItems();
		
		Gson gson = new Gson();
		responseString(response, gson.toJson(dataItems));
	}
	
	private List<List<String>> getTable() {
		int l = 6;
		Random r = new Random();
		List<List<String>> lists = new ArrayList<>();
		List<String> list = new ArrayList<>();
		list.add("时间");
		list.add("质量");
		list.add("转动惯量");
		list.add("质心");
		lists.add(list);
		for (int i = 1; i < l; i++) {
			list = new ArrayList<>();
			list.add(String.valueOf(i));
			list.add(String.valueOf(r.nextFloat() * 100));
			list.add(String.valueOf(r.nextFloat() * 100));
			list.add(String.valueOf(r.nextFloat() * 100));
			lists.add(list);
		}
		
		return lists;
	}
	
	private void sampleData(HttpServletResponse response) {
		List<DataItem> dataItems = new ArrayList<DataItem>();
		
		String title = "dataitem0";
		String id = "dataitem0";
		ImageDataItem di0 =  BaseData.getInstanceBaseData().new ImageDataItem();
		di0.urls = new ArrayList<String>();
		di0.urls.add("/AnalysisAndMonitoring/DataItem?arg=123&file=F:/data/hsh/data/ex_1.jpg");
		di0.urls.add("/AnalysisAndMonitoring/DataItem?arg=123&file=F:/data/hsh/data/ex_2.jpg");
		di0.urls.add("/AnalysisAndMonitoring/DataItem?arg=123&file=F:/data/hsh/data/ex_3.jpg");
		di0.urls.add("/AnalysisAndMonitoring/DataItem?arg=123&file=F:/data/hsh/data/ex_4.jpg");		
		DataItem dataItem = new DataItem(title, id, di0);
		dataItems.add(dataItem);

//		title = "dataitem8";
//		id = "dataitem8";
//		UrlDataItem di8 =  BaseData.getInstanceBaseData().new UrlDataItem();
//		di8.links = new ArrayList<String>();
//		di8.links.add("http://baidu.com");
//		di8.links.add("http://baidu.com");
//		dataItem = new DataItem(title, id, di8);
//		dataItems.add(dataItem);
		
		List<TreeNode> treeNodes = TreeNodeReader.ReadTreeNodes();
		
		for (TreeNode treeNode : treeNodes) {
			DataItem dataitem;
			BaseData baseData = null;
			if (treeNode.parent.equals("#")){
				baseData = BaseData.getInstanceBaseData().new TitleDataItem();
				dataitem = new DataItem(treeNode.text, treeNode.a_attr.href, baseData);
				dataItems.add(dataitem);
			}
			else if (treeNode.type.equals("标题")){
				baseData = BaseData.getInstanceBaseData().new SubtitleDataItem();
				dataitem = new DataItem(treeNode.text, treeNode.a_attr.href, baseData);
				dataItems.add(dataitem);
			}
			else if (treeNode.type.equals("文本")){
				TextDataItem textDataItem = BaseData.getInstanceBaseData().new TextDataItem();
				textDataItem.text = new ArrayList<String>();
				textDataItem.text.add("推进剂又称推进药，有规律地燃烧释放出能量，产生气体，推送火箭和导弹的火药。");
				textDataItem.text.add("推进剂具有下列特性：①比冲量高；②密度大；③燃烧产物的气体（或蒸气）分子量小，离解度小，无毒、无烟、无腐蚀性，不含有凝聚态物质；④火焰温度不应过高，以免烧蚀喷管；⑤应有较宽的温度适应范围；");
				dataitem = new DataItem(treeNode.text, treeNode.a_attr.href, textDataItem);
				dataItems.add(dataitem);
			}
			else if (treeNode.type.equals("浮点数")){
				Random r = new Random();
				FloatDataItem floatDataItem =  BaseData.getInstanceBaseData().new FloatDataItem();
				floatDataItem.unit = treeNode.unit;
				floatDataItem.value = String.valueOf(r.nextFloat() * 100);
				dataitem = new DataItem(treeNode.text, treeNode.a_attr.href, floatDataItem);
				dataItems.add(dataitem);
			}
			else if (treeNode.type.equals("曲线")){
				CurveDataItem curveDataItem =  BaseData.getInstanceBaseData().new CurveDataItem();
				curveDataItem.table = getTable();
				dataitem = new DataItem(treeNode.text, treeNode.a_attr.href, curveDataItem);
				dataItems.add(dataitem);
			}
			else if (treeNode.type.equals("三维模型")){
				D3DataItem d3 =  BaseData.getInstanceBaseData().new D3DataItem();
				d3.link = "F:/data/hsh/data/003.wrl";
				dataitem = new DataItem(treeNode.text, treeNode.a_attr.href, d3);
				dataItems.add(dataitem);
			}
		}
		
		Gson gson = new Gson();
		responseString(response, gson.toJson(dataItems));
		
	}
}
