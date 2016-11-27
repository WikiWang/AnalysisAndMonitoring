package cn.edu.buaa.im.model;

public class TreeNode {
	public String id;
	public String parent;
	public String text;
	public String icon;
	public String type;
	public String unit;
	
	public A_attr a_attr;
	
	public TreeNode(String id, String parent, String text, String icon){
		this.id = id;
		this.parent = parent;
		this.text = text;
		this.icon = icon;
		this.a_attr = this.new A_attr("#" + this.id + "_target");
	}
	
	public class A_attr{
		public String href;
		
		public A_attr(String href){
			this.href = href;
		}
	}
}
