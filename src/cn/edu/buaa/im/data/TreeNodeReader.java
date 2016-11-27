package cn.edu.buaa.im.data;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import cn.edu.buaa.im.model.TreeNode;
import cn.edu.buaa.im.service.Utility;
import cn.edu.buaa.im.servlet.Util;

public class TreeNodeReader {
	public static List<TreeNode> ReadTreeNodes(){
		List<TreeNode> treeNodes = new ArrayList<>();
		
		HashMap<String, String> keys = new HashMap<>();
		
	    try { 
	    	String filePath = Utility.getParameter("sample");
	        FileInputStream fis = new FileInputStream(filePath);
	        InputStreamReader isr = new InputStreamReader(fis, "UTF-8"); 
	        BufferedReader br = new BufferedReader(isr); 
	        int line = -2; 
	        String tempString = null;
	        while ((tempString = br.readLine()) != null) { 
	        	line++;
            	if (line < 1)
            		continue;
            	
//            	System.out.println(line);
            	String[] tokens = StringUtils.splitPreserveAllTokens(tempString, ",");
            	
            	String text = tokens[0];
            	String id = "treenode" + String.valueOf(line);
            	String type = tokens[1];
            	
            	keys.put(text, id);
            	
            	String parent = GetParent(keys, tokens[3]);
            	String icon = GetIcon(type);
            	
            	
            	TreeNode treeNode = new TreeNode(id, parent, text, icon);
            	treeNode.type = type;
            	treeNode.unit = tokens[2];
            	
            	treeNodes.add(treeNode);
	        } 
	    } catch (Exception e) { 
	        e.printStackTrace(); 
	    }
        return treeNodes;
	}
	
	public static String GetParent(HashMap<String, String> keys, String key) {
		if (key.isEmpty())
			return "#";
		else
			return keys.get(key);
	}
	
	public static String GetIcon(String type) {
		if (type.equals("标题"))
			return "folder";
		return "file";
	}
}
