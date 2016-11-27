package cn.edu.buaa.im.model;

import java.util.List;


public class BaseData {
	public static BaseData getInstanceBaseData() {  
		BaseData single = new BaseData();  
		return single;  
   }
	
	public class TitleDataItem extends BaseData{
	}
	
	public class SubtitleDataItem extends BaseData{
	}

	public class ImageDataItem extends BaseData{
		public int flag;
		public List<String> urls;
		
		public ImageDataItem()
		{
			this.flag = 0;
		}
	}
	
	public class FileDataItem extends BaseData{
		public List<String> filePaths;
	}
	
	public class TextDataItem extends BaseData{
		public List<String> text;
	}
	
	public class FloatDataItem extends BaseData{
		public String unit;
		public String value;
	}
	
	public class RadioDataItem extends BaseData{
		public List<String> filePaths;
	}
	
	public class UrlDataItem extends BaseData{
		public List<String> links;
	}
	
	public class CurveDataItem extends BaseData{
		public List<List<String>> table;
	}
	
	public class D3DataItem extends BaseData{
		public String link;
	}
}



