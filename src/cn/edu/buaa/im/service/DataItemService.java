package cn.edu.buaa.im.service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

import cn.edu.buaa.im.data.SQLiteCRUD;
import cn.edu.buaa.im.data.SQLiteConn;
import cn.edu.buaa.im.model.BaseData;
import cn.edu.buaa.im.model.DataItem;
import cn.edu.buaa.im.model.TreeNode;
import cn.edu.buaa.im.model.BaseData.CurveDataItem;
import cn.edu.buaa.im.model.BaseData.D3DataItem;
import cn.edu.buaa.im.model.BaseData.FloatDataItem;
import cn.edu.buaa.im.model.BaseData.ImageDataItem;
import cn.edu.buaa.im.model.BaseData.TextDataItem;

/**
	FIELD_GROUP = 16,
	FIELD_FLOAT = 17,
	FIELD_TEXT = 18,
	FIELD_CURVE = 19,
	FIELD_ATTACHMENT = 20,
	FIELD_MODEL = 21,
	FIELD_FLOATSELECT = 22,
	FIELD_CURVEGROUP = 23,
	FIELD_DATETIME = 24,
	FIELD_CASELINK = 25
	{ NodeType.FIELD_GROUP, "数据项分类" },
    { NodeType.FIELD_FLOAT, "浮点数" },
    { NodeType.FIELD_TEXT, "文本" },
    { NodeType.FIELD_CURVE, "曲线" },
    { NodeType.FIELD_ATTACHMENT, "图片" },
    { NodeType.FIELD_MODEL, "3D模型" },
    { NodeType.FIELD_FLOATSELECT, "浮点数选项"},
    { NodeType.FIELD_CURVEGROUP, "曲线簇模型" },
    { NodeType.FIELD_DATETIME, "日期时间" },
    { NodeType.FIELD_CASELINK, "实例链接" }
 * @author Shaohan
 *
 */
public class DataItemService {
	private String sid;
	private String cid;
	
	private List<DataItem> dataItems;
	
	public DataItemService(String sid, String cid){
		this.sid = sid;
		this.cid = cid;
		dataItems = new ArrayList<DataItem>();
		init();
	}
	
	private void init() {
		TreeNodeService treeNodeService = new TreeNodeService(this.sid);
		List<TreeNode> treeNodes = treeNodeService.geTreeNodes();
		buildDataItems(treeNodes);
	}
	
	private void buildDataItems(List<TreeNode> treeNodes) {
		String s = Utility.getSQLite();
		SQLiteConn sqLiteConn = new SQLiteConn(s);
		try {
			SQLiteCRUD sqLiteCRUD = new SQLiteCRUD(sqLiteConn.getConnection());
			String table = "table" + this.sid;
			
			for (TreeNode treeNode : treeNodes) {
				String fid = treeNode.id.substring(3);
				String sql = String.format("select value from %s where Cid = %s and Fid = %s;", table,
						this.cid, fid);
				Vector<Vector<Object>> vectors = sqLiteCRUD.selectVector(sql);
				
				String value = "";
				
				if (vectors.size() > 0){
					value = String.valueOf(vectors.get(0).get(0));
				}
				
				DataItem dataItem = Convert2DataItem(treeNode, value);
				
				this.dataItems.add(dataItem);
			}
			
			sqLiteCRUD.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public List<DataItem> getDataItems() {
		return this.dataItems;
	}
	
	private DataItem Convert2DataItem(TreeNode treeNode, String value) {
		DataItem dataitem = null;
		BaseData baseData = null;
		if (treeNode.parent.equals("#")){	
			baseData = BaseData.getInstanceBaseData().new TitleDataItem();
			dataitem = new DataItem(treeNode.text, treeNode.a_attr.href, baseData);
		}
		else if (treeNode.type.equals("16")){
			baseData = BaseData.getInstanceBaseData().new SubtitleDataItem();
			dataitem = new DataItem(treeNode.text, treeNode.a_attr.href, baseData);
		}
		else if (treeNode.type.equals("17")){
			FloatDataItem floatDataItem =  BaseData.getInstanceBaseData().new FloatDataItem();
			floatDataItem.unit = treeNode.unit;
			floatDataItem.value = value;
			dataitem = new DataItem(treeNode.text, treeNode.a_attr.href, floatDataItem);
		}
		else if (treeNode.type.equals("18")){
			TextDataItem textDataItem = BaseData.getInstanceBaseData().new TextDataItem();
			textDataItem.text = new ArrayList<String>();
			textDataItem.text.add(value);
			dataitem = new DataItem(treeNode.text, treeNode.a_attr.href, textDataItem);
		}
		else if (treeNode.type.equals("19")){
			CurveDataItem curveDataItem =  BaseData.getInstanceBaseData().new CurveDataItem();
			curveDataItem.table = null;
			dataitem = new DataItem(treeNode.text, treeNode.a_attr.href, curveDataItem);
		}
		else if (treeNode.type.equals("20")){ // figure
			ImageDataItem imageDataItem = BaseData.getInstanceBaseData().new ImageDataItem();
			imageDataItem.flag = 1;
			String[] strings = value.split(";");
			List<String> urls = new ArrayList<>();
			for (String string : strings) {
				if (string.isEmpty() == false)
					urls.add(getAbsPath(string));
			}
			imageDataItem.urls = urls;
			dataitem = new DataItem(treeNode.text, treeNode.a_attr.href, imageDataItem);
		}
		else if (treeNode.type.equals("21")){ //model
			D3DataItem d3 =  BaseData.getInstanceBaseData().new D3DataItem();
			String[] strings = value.split(";");
			d3.link = getAbsPath(strings[0]);
			dataitem = new DataItem(treeNode.text, treeNode.a_attr.href, d3);
		}
		// TODO : 浮点数选项
		else if (treeNode.type.equals("22")){
			TextDataItem textDataItem = BaseData.getInstanceBaseData().new TextDataItem();
			textDataItem.text = new ArrayList<String>();
			textDataItem.text.add(value);
			dataitem = new DataItem(treeNode.text, treeNode.a_attr.href, textDataItem);
		}
		// TODO : 曲线簇模型
		else if (treeNode.type.equals("23")){
			TextDataItem textDataItem = BaseData.getInstanceBaseData().new TextDataItem();
			textDataItem.text = new ArrayList<String>();
			textDataItem.text.add(value);
			dataitem = new DataItem(treeNode.text, treeNode.a_attr.href, textDataItem);
		}
		else if (treeNode.type.equals("24")){
			TextDataItem textDataItem = BaseData.getInstanceBaseData().new TextDataItem();
			textDataItem.text = new ArrayList<String>();
			textDataItem.text.add(value);
			dataitem = new DataItem(treeNode.text, treeNode.a_attr.href, textDataItem);
		}
		// TODO : 实例链接
		else if (treeNode.type.equals("25")){
			TextDataItem textDataItem = BaseData.getInstanceBaseData().new TextDataItem();
			textDataItem.text = new ArrayList<String>();
			textDataItem.text.add(value);
			dataitem = new DataItem(treeNode.text, treeNode.a_attr.href, textDataItem);
		}
		else{
			TextDataItem textDataItem = BaseData.getInstanceBaseData().new TextDataItem();
			textDataItem.text = new ArrayList<String>();
			textDataItem.text.add(value);
			dataitem = new DataItem(treeNode.text, treeNode.a_attr.href, textDataItem);
		}
		return dataitem;
	}
	
	private String getAbsPath(String path){
		String db = Utility.getSQLite();
		File dbFile = new File(db);
		File parent = new File(dbFile.getParent());
		File p = new File(parent, path);
		System.out.println(p.getAbsolutePath());
		return p.getAbsolutePath();
	}
	
	public static void main(String[] args) {
		//DataItemService d = new DataItemService("", "");
		
	}

}
