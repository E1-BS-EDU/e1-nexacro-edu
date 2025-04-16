(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        this.on_create = function()
        {
            // Declare Reference
            var obj = null;
            
            if (Form == this.constructor) {
                this.set_name("test2");
                this.set_titletext("New Form");
                this._setFormPosition(0,0,1024,768);
            }

            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("ds_list", this);
            obj._setContents("<ColumnInfo><Column id=\"EMPLOYEE_ID\" type=\"STRING\" size=\"256\"/></ColumnInfo>");
            this.addChild(obj.name, obj);

            obj = new Dataset("ds_cond", this);
            obj._setContents("<ColumnInfo><Column id=\"EMP_ID\" type=\"STRING\" size=\"256\"/></ColumnInfo><Rows><Row/></Rows>");
            this.addChild(obj.name, obj);


            
            // UI Components Initialize
            obj = new Button("Button00", "absolute", "3.13%", "24", null, "109", "82.81%", null, this);
            obj.set_taborder("0");
            obj.set_text("Button00");
            this.addChild(obj.name, obj);

            obj = new Button("Button01", "absolute", "19.73%", "23", null, "111", "66.02%", null, this);
            obj.set_taborder("1");
            obj.set_text("Button01");
            this.addChild(obj.name, obj);

            obj = new Grid("Grid00", "absolute", "3.03%", "166", null, "147", "62.6%", null, this);
            obj.set_taborder("2");
            obj.set_binddataset("ds_list");
            obj._setContents("<Formats><Format id=\"default\"><Columns><Column size=\"80\"/></Columns><Rows><Row band=\"head\" size=\"24\"/><Row band=\"body\" size=\"24\"/></Rows><Band id=\"head\"><Cell col=\"0\" disptype=\"normal\" text=\"EMPLOYEE_ID\"/></Band><Band id=\"body\"><Cell col=\"0\" disptype=\"normal\" text=\"bind:EMPLOYEE_ID\"/></Band></Format></Formats>");
            this.addChild(obj.name, obj);


            
            // Layout Functions
            //-- Default Layout
            obj = new Layout("default", "", 1024, 768, this,
            	//-- Layout function
            	function(p) {
            		p.set_titletext("New Form");

            	}
            );
            this.addLayout(obj.name, obj);


            
            // BindItem Information

            
            // Remove Reference
            obj = null;
        };
        

        
        // User Script
        this.registerScript("test2.xfdl", function(exports) {

        this.Button00_onclick = function(obj,e)
        {
        	this.go("Main::test1.xfdl");
        }

        this.Button01_onclick = function(obj,e)
        {
        	alert("@");
        	this.fn_Search();
        }

        //데이터 조회 트랜잭션
        this.fn_Search = function ()
        {
        	// 조회조건 셋팅
        	//this.ds_search.setColumn(0, "searchType", this.Combo00.value);
        	this.ds_cond.setColumn(0, "EMP_ID", "2");

        	var strSvcId    = "search";
        	var strSvcUrl   = "svc::searchList.do";
        	var inData      = "ds_cond=ds_cond"
        	var outData     = "ds_list=ds_list";
        	var strArg      = "";
        	var callBackFnc = "fn_Search_Callback";
        	var isAsync   	= true;

        	this.transaction(strSvcId , 		// transaction을 구분하기 위한 svc id값
        						strSvcUrl , 	// trabsaction을 요청할 주소
        						inData , 		// 입력값으로 보낼 dataset id , a=b형태로 실제이름과 입력이름을 매칭
        						outData , 		// 처리결과값으로 받을 dataset id, a=b형태로 실제이름과 입력이름을 매칭
        						strArg, 		// 입력값으로 보낼 arguments, a=b
        						callBackFnc, 	// transaction의 결과를 받을 Function 이름
        						isAsync); 		// 비동기통신 여부 [생략가능]
        };

        this.fn_Search_Callback = function ()
        {
        	trace("!@#$%^");
        }
        });


        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Button00.addEventHandler("onclick", this.Button00_onclick, this);
            this.Button01.addEventHandler("onclick", this.Button01_onclick, this);

        };

        this.loadIncludeScript("test2.xfdl", true);

       
    };
}
)();
