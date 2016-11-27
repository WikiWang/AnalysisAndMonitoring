package cn.edu.buaa.im.service;

import java.util.List;
import java.util.Vector;

import cn.edu.buaa.im.data.SQLiteCRUD;
import cn.edu.buaa.im.data.SQLiteConn;

public class CaseService {
	public String cid;
	public String sid;
	public String name;
	
	public CaseService(String cid) {
		this.cid = cid;
		init();
	}
	
	private void init() {
		String s = Utility.getSQLite();
		SQLiteConn sqLiteConn = new SQLiteConn(s);
		try {
			SQLiteCRUD sqLiteCRUD = new SQLiteCRUD(sqLiteConn.getConnection());
			String table = "CasesDefinition";
			String key = "ID";
			Vector<Vector<Object>> vectors = sqLiteCRUD.selectVector(table, key, this.cid);
			List<String> names = sqLiteCRUD.getFields(table);
			
			int nameIdx = getIdx(names, "name");
			int sidIdx = getIdx(names, "Sid");
			
			for (Vector<Object> vector : vectors) {
				this.sid =  String.valueOf(vector.get(sidIdx));
				this.name = String.valueOf(vector.get(nameIdx));
			}
			sqLiteCRUD.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private int getIdx(List<String> names, String name) {
		for (int i = 0; i < names.size(); i++) {
			if (names.get(i).equalsIgnoreCase(name))
				return i;
		}
		return -1;
	}
}
