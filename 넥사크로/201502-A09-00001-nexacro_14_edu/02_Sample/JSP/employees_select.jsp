<%@ page import="org.apache.commons.logging.*" %>

<%@ page import="com.nexacro.xapi.data.*" %>
<%@ page import="com.nexacro.xapi.tx.*" %>

<%@ page import = "java.util.*" %>
<%@ page import = "java.sql.*" %>
<%@ page import = "java.io.*" %>

<%@ page contentType="text/xml; charset=UTF-8" %>

<%! 

public static String EucToUni(String s) 
{
    String result = "";

    try {
        //result = new String(s.getBytes("8859_1"), "EUC-KR");
        result = new String(s.getBytes("8859_1"), "UTF-8");
    } catch(Exception e) {
        System.out.println(e);
    }
    return result;
}
%>

<%

// PlatformData
PlatformData out_PlatformData = new PlatformData();
    
int    nErrorCode  = 0;
String strErrorMsg = "START";

try {    
    /******* JDBC Connection *******/
    Connection conn = null;
    Statement  stmt = null;
    ResultSet  rs   = null;
    
    try { 
        Class.forName("org.sqlite.JDBC");
        conn = DriverManager.getConnection("jdbc:sqlite:C:\\Tomcat 7.0\\webapps\\edu\\Local_Edu.db3");
        
        stmt = conn.createStatement();
      
        /******* SQL ************/
        String name = request.getParameter("full_name");
		System.out.println(name);    
        
        String SQL;
        if( name.equals("") == true )
            SQL = "SELECT * FROM EMPLOYEES"; 
        else
            SQL = "SELECT * FROM EMPLOYEES WHERE FULL_NAME like '%" + EucToUni(name) + "%'"; 
        
        System.out.println(SQL);
        
        rs = stmt.executeQuery(SQL);
      
        /********* Dataset **********/    
        DataSet ds = new DataSet("ds_employees");
      
        ds.addColumn("EMPL_ID"   ,DataTypes.STRING  ,(short)10   );
        ds.addColumn("FULL_NAME" ,DataTypes.STRING  ,(short)50   );
        ds.addColumn("HIRE_DATE" ,DataTypes.STRING  ,(short)30   );
        ds.addColumn("MARRIED"   ,DataTypes.STRING  ,(short)1    );
        ds.addColumn("SALARY"    ,DataTypes.INT     ,(short)10   );
        ds.addColumn("GENDER"    ,DataTypes.STRING  ,(short)1    );
        ds.addColumn("DEPT_ID"   ,DataTypes.STRING  ,(short)10   );
        ds.addColumn("EMPL_MEMO" ,DataTypes.STRING  ,(short)4000 );
            
        while(rs.next())
        {
            int row = ds.newRow();

            ds.set(row ,"EMPL_ID"    ,rs.getString("EMPL_ID")   );
            ds.set(row ,"FULL_NAME"  ,rs.getString("FULL_NAME") );
            ds.set(row ,"HIRE_DATE"  ,rs.getString("HIRE_DATE") );
            ds.set(row ,"MARRIED"    ,rs.getString("MARRIED")   );
            ds.set(row ,"SALARY"     ,rs.getString("SALARY")    );
            ds.set(row ,"GENDER"     ,rs.getString("GENDER")    );
            ds.set(row ,"DEPT_ID"    ,rs.getString("DEPT_ID")   );
            ds.set(row ,"EMPL_MEMO"  ,rs.getString("EMPL_MEMO") );
        }
          
		// #1 
        out_PlatformData.addDataSet(ds);

		// #2
        //DataSetList dataList = out_PlatformData.getDataSetList();
        //dataList.add(ds);

        nErrorCode  = 0;
        strErrorMsg = "SUCC";
        
    } catch (SQLException e) {
        nErrorCode = -1;
        strErrorMsg = e.getMessage();
    }    
    
    /******** JDBC Close ********/
    if ( stmt != null ) try { stmt.close(); } catch (Exception e) {nErrorCode = -1; strErrorMsg = e.getMessage();}
    if ( conn != null ) try { conn.close(); } catch (Exception e) {nErrorCode = -1; strErrorMsg = e.getMessage();}
            
} catch (Throwable th) {
    nErrorCode = -1;
    strErrorMsg = th.getMessage();
}

VariableList varList = out_PlatformData.getVariableList();
varList.add("ErrorCode", nErrorCode);
varList.add("ErrorMsg" , strErrorMsg);


/*
Variable varErrCD = new Variable("ErrorCode");
varErrCD.set(nErrorCode);

Variable varErrMSG = new Variable("ErrorMsg");
varErrMSG.set(strErrorMsg);

out_PlatformData.addVariable(varErrCD);
out_PlatformData.addVariable(varErrMSG);
*/

HttpPlatformResponse pRes = new HttpPlatformResponse(response, PlatformType.CONTENT_TYPE_XML, "utf-8");
pRes.setData(out_PlatformData);

// Send data
pRes.sendData();
%>
