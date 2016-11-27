package cn.edu.buaa.im.model;

public class DataItem {
	public String title;
	public String type;
	public String id;
	public BaseData data;
	
	public DataItem(String title, String id, BaseData baseData){
		this.title = title;
		this.id = id.replace("#", "");
		this.data = baseData;
		this.type = baseData.getClass().getSimpleName();
	}
}

