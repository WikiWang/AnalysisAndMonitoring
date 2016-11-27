package cn.edu.buaa.im.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Vector;

import cn.edu.buaa.im.data.SQLiteCRUD;
import cn.edu.buaa.im.data.SQLiteConn;
import cn.edu.buaa.im.model.TreeNode;

/**
 * 通过一个sid，从数据库FieldsDefinition中找到相关的Fields，构建出整个树
 * @author Shaohan
 *
 */
public class TreeNodeService {
	
	private String sid;
	private List<TreeNode> treeNodes;
	
	public TreeNodeService(String sid){
		this.sid = sid;
		treeNodes = new ArrayList<>();
		init();
	}
	
	private void init() {
		String s = Utility.getSQLite();
		SQLiteConn sqLiteConn = new SQLiteConn(s);
		try {
			SQLiteCRUD sqLiteCRUD = new SQLiteCRUD(sqLiteConn.getConnection());
			String table = "FieldsDefinition";
			String sql = String.format("select * from %s as A where A.[Sid] = %s ORDER BY A.[Level], A.[Order];", table,
					this.sid);
			Vector<Vector<Object>> vectors = sqLiteCRUD.selectVector(sql);
			
			List<String> names = sqLiteCRUD.getFields(table);
			
			Convert2TreeNodes(vectors, names);
			
			sqLiteCRUD.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public List<TreeNode> geTreeNodes() {
		return this.treeNodes;
	}
	
	/**
	 * 把vector转化为nodes，按照树的顺序
	 * @return
	 */
	private void Convert2TreeNodes(Vector<Vector<Object>> vectors, List<String> names) {
		HashMap<String, List<TreeNode>> hashMap = new HashMap<>();
		List<TreeNode> roots = new ArrayList<>();
		
		int nameIdx = getIdx(names, "Name");
		int fidIdx = getIdx(names, "ID");
		int typeIdx = getIdx(names, "Type");
		int pidIdx = getIdx(names, "PID");
		int remarkIdx = getIdx(names, "remark");
		
		for (Vector<Object> vector : vectors) {
			String name = String.valueOf(vector.get(nameIdx));
			String fid = "fid" + String.valueOf(vector.get(fidIdx));
			String type = String.valueOf(vector.get(typeIdx));
			String pid = "fid" + String.valueOf(vector.get(pidIdx));
			String parent = GetParent(pid);
			String icon = GetIcon(type);
			String unit = String.valueOf(vector.get(remarkIdx));
			
			TreeNode treeNode = new TreeNode(fid, parent, name, icon);
			treeNode.type = type;
			treeNode.unit = unit;
			
			if (pid.equals("fid0"))
				roots.add(treeNode);
			
			if (hashMap.containsKey(pid) == false)
				hashMap.put(pid, new ArrayList<TreeNode>());
			hashMap.get(pid).add(treeNode);
		}
		
		OrderTreeNodes(hashMap, roots);
	}
	
	private void OrderTreeNodes(HashMap<String, List<TreeNode>> hashMap, List<TreeNode> roots) {
		if (roots.size() == 0)
			return;
		for (TreeNode treeNode : roots) {
			treeNodes.add(treeNode);
			int i = treeNodes.size() - 1;
			while (i != treeNodes.size()) {
				TreeNode now = treeNodes.get(i);
				if(hashMap.containsKey(now.id))
					treeNodes.addAll(hashMap.get(now.id));
				i += 1;
			}
		}
		
	}
	
	private int getIdx(List<String> names, String name) {
		for (int i = 0; i < names.size(); i++) {
			if (names.get(i).equalsIgnoreCase(name))
				return i;
		}
		return -1;
	}
	
	private String GetParent(String pid) {
		if (pid.equals("fid0"))
			return "#";
		return pid;
	}
	
	private String GetIcon(String type) {
		if (type.equals("16"))
			return "folder";
		return "file";
	}
}
