package cn.edu.buaa.im.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

import cn.edu.buaa.im.data.SQLiteCRUD;
import cn.edu.buaa.im.data.SQLiteConn;
import cn.edu.buaa.im.model.DPVersion;
import cn.edu.buaa.im.wsdl.WSDLClient;

public class VersionService {
	private String sid;
	private String cid;
	
	List<DPVersion> versions;		
	
	public VersionService(String sid, String cid){
		this.sid = sid;
		this.cid = cid;
		versions = new ArrayList<DPVersion>();	
		init();
	}
	
	public VersionService(String userId, String passWord, String nodeId){
		versions = new ArrayList<DPVersion>();	
		init(userId, passWord, nodeId);
	}
	
	private void init(String userId, String passWord, String nodeId) {
		WSDLClient w = WSDLClient.getInstance();
		
		String method = "getNodeHistory";
		String[] arg = new String[]{userId, passWord, nodeId};
		w.getS(method, arg);
	}
	
	private void init() {
		String s = Utility.getSQLite();
		SQLiteConn sqLiteConn = new SQLiteConn(s);
		try {
			SQLiteCRUD sqLiteCRUD = new SQLiteCRUD(sqLiteConn.getConnection());
			String table = "CasesDefinition";
			String sql = String.format("select * from %s as A where A.[Sid] = %s and A.[id] != %s ORDER BY A.[id];", table,
					this.sid, this.cid);
			Vector<Vector<Object>> vectors = sqLiteCRUD.selectVector(sql);
			
			List<String> names = sqLiteCRUD.getFields(table);

			int nameIdx = getIdx(names, "Name");
			int fidIdx = getIdx(names, "ID");
			for (Vector<Object> vector : vectors) {
				String name = String.valueOf(vector.get(nameIdx));
				String fid = String.valueOf(vector.get(fidIdx));
				
				DPVersion version = new DPVersion();
				version.setId(fid);
				version.setAbs(name);
				version.setName(name);
				version.setDate("");
				version.setPerson("");
				
				versions.add(version);
			}
			sqLiteCRUD.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public List<DPVersion> getVersions() {
		return this.versions;
	}
	
	private int getIdx(List<String> names, String name) {
		for (int i = 0; i < names.size(); i++) {
			if (names.get(i).equalsIgnoreCase(name))
				return i;
		}
		return -1;
	}
}
