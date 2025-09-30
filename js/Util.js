//#region 'Class comments' // [
/**
 * <p>Title: Bks web page module</p>
 * <pre>
 *  Date    PG          Description
 *  ------- ----------- ------------------------------------------------------
 *  20230920  Robin        create this module
 *  ------- ----------- ------------------------------------------------------
 * </pre>
 * @author Robin Hsu
 * @version 1.0
 * @since 2023/08
 */
//#endregion // ] Class comments
var Util = Util || {
			prefixUrl:"./sp",
			checkCaptcha:function(input){
			var oResult = false;
			$.ajax({
		        async:false,
		        type: "get",
		        url: "./cpa/checkCaptcha?code="+input,
		        contentType: "application/json;charset=utf-8",
		        dataType: "json",
		        success: function(result) {
		            oResult = result;
		          	return result.data;
		        },error: function(result){
					alert('checkCaptcha:'+result);
		        }
	    	});
	    	return oResult;
		},filterString:function(str){
			var newStr = str.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"");
			newStr = newStr.replace(/[！＂＃＄％＆＇（）＊＋，－．／：；。＜＝＞？＠［＼］＾＿｀｛｜｝]/g, '');
			return newStr;
		},filterSubjectString:function(str){
			var newStr = str.replace(/[\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"");
			newStr = newStr.replace(/[！＂＃＄％＆＇（）＊＋，－．／：；。＜＝＞？＠［＼］＾＿｀｛｜｝]/g, '');
			return newStr;
		},sendOptCode:function(csrfToken){
			$.ajax({
		        async:false,
		        type: "post",
		        url: Util.prefixUrl+"/sendVarMail",
		        contentType: "application/json;charset=utf-8",
		        data: JSON.stringify({}),
		        headers: { 'X-CSRF-TOKEN': csrfToken },
		        dataType: "json",
		        success: function(result) {
		            if(result.returnCode!="000"){                          
	                  alert(result.returnMsg);
	                  return false;
	                }
	                
	              	return true;
	            },error: function(result){
					console.error('sendOptCode error!'+result);
	            }
	    	});
		},validateVarCode : function(){
			var csrfToken = $("input[name='_csrf']").val();
			var code = $("#inputVarCode").val();
			if(code==""){
				alert("請輸入驗證碼！");
				return false;
			}
			var isTrue = Util.checkMailCaptcha(code,csrfToken);
			if(isTrue==false){
				alert("驗證碼輸入錯誤或驗證碼已過期！");
				return false;
			}
			
			return true;
		},checkMailCaptcha:function(input,csrfToken){
			var oResult;
			$.ajax({
		        async:false,
		        type: "get",
		        url: "./cpa/checkMailCaptcha?code="+input,
		        contentType: "application/json;charset=utf-8",
		        headers: { 'X-CSRF-TOKEN': csrfToken },
		        dataType: "json",
		        success: function(result) {
		            oResult = result;
		          	return result.data;
		        },error: function(result){
					alert('checkMailCaptcha:'+result);
		        }
	    	});
	    	return oResult;
		},dateUtil : function (cellvalue, options, rowObject){  //.getHours() .getMinutes() .getSeconds()
			var oValue = new Date(cellvalue);
			var oYearStr = oValue.getFullYear();
			var oMonthStr = new String(oValue.getMonth()+1);
			var oDateStr = new String(oValue.getDate());
			if (oMonthStr.length < 2) 
				oMonthStr = '0' + oMonthStr;
		    if (oDateStr.length < 2) 
		    	oDateStr = '0' + oDateStr;
		
		    return [oYearStr, oMonthStr, oDateStr].join('-');
		},dateTimeUtil : function (cellvalue, options, rowObject){  //.getHours() .getMinutes() .getSeconds()
			var oValue = new Date(cellvalue);
			var oYearStr = oValue.getFullYear();
			var oMonthStr = new String(oValue.getMonth()+1);
			var oDateStr = new String(oValue.getDate());
			var oHourStr = new String(oValue.getHours());
			var oMinuteStr = new String(oValue.getMinutes());
			var oSecondStr = new String(oValue.getSeconds());
			
			if (oMonthStr.length < 2) 
				oMonthStr = '0' + oMonthStr;
		    if (oDateStr.length < 2) 
		    	oDateStr = '0' + oDateStr;
		    	
		    if (oHourStr.length < 2) 
		    	oHourStr = '0' + oHourStr;
		    if (oMinuteStr.length < 2) 
		    	oMinuteStr = '0' + oMinuteStr;	
		    if (oSecondStr.length < 2) 
		    	oSecondStr = '0' + oSecondStr;		
		
		    return [oYearStr, oMonthStr, oDateStr].join('-') + ' ' + [oHourStr,oMinuteStr,oSecondStr].join(':');
		},bindDropDownList : function(id,list,textColumnName,keyColumnName,defaultEmptyText){
			$("#"+id).children().remove();
			if(defaultEmptyText){
				$("#"+id)[0].add(new Option(defaultEmptyText,""));
			}
			if(list){
				var nCnt = list.length;
				for(var index=0;index<nCnt;index++){
					var oRec = list[index];
					if(typeof oRec == 'string'){
						var optionDom = new Option(oRec,oRec);		
						$("#"+id)[0].add(optionDom);
					}else{
						var keyValue = oRec[keyColumnName];
						if(keyColumnName == "rowIndex"){
							keyValue = ""+index;
						}
						var optionDom = new Option(oRec[textColumnName],keyValue);
						$("#"+id)[0].add(optionDom);			
					}		
				}
			}
			
			
		},bindDropDownList2 : function(id,list,textColumnName,keyColumnName,specialColumnName,defaultEmptyText){
			$("#"+id).children().remove();
			if(defaultEmptyText){
				$("#"+id)[0].add(new Option(defaultEmptyText,""));
			}
			if(list){
				var nCnt = list.length;
				for(var index=0;index<nCnt;index++){
					var oRec = list[index];
					if(typeof oRec == 'string'){
						var optionDom = new Option(oRec,oRec);		
						$("#"+id)[0].add(optionDom);
					}else{
						var optionDom = new Option(oRec[textColumnName],oRec[keyColumnName]);
						var oItemCnt = oRec[specialColumnName];
						optionDom.setAttribute('data-itemcnt',oItemCnt);
						$("#"+id)[0].add(optionDom);			
					}	
					
					$("#"+id)[0].add(optionDom);
				}	
			}
			
		},ajaxQueryPanel:function(csrfToken,type,inputCond,cb){//
		
			$.ajax({
		        async:false,
		        type: "post",
		        url: Util.prefixUrl+"/queryPanel/"+type,
		        contentType: "application/json;charset=utf-8",
		        data: JSON.stringify(inputCond),
		        headers: { 'X-CSRF-TOKEN': csrfToken },
		        dataType: "json",
		        success: function(result) {
		            if(result.returnCode!="000"){                          
	                  alert(result.returnMsg);
	                  return false;
	                }
	                
	                if(cb){
						cb(result);
					}
	              	return true;
	            },error: function(result){
					console.error('ajaxQueryPanel error!'+JSON.stringify(result));
	            }
	    	});
	    	    	     
		},ajaxFetchDetail:function(type,inputCond,cb){//csrfToken,
			$.ajax({
		        async:false,
		        type: "post",
		        url: Util.prefixUrl+"/fetchDetail/"+type,
		        contentType: "application/json;charset=utf-8",
		        data: JSON.stringify(inputCond),
		        //headers: { 'X-CSRF-TOKEN': csrfToken },
		        dataType: "json",
		        success: function(result) {
		            if(result.returnCode!="000"){                          
	                  alert(result.returnMsg);
	                  return false;
	                }
	                
	                if(cb){
						cb(result);
					}
	              	return true;
	            },error: function(result){
					console.error('ajaxFetchDetail error!'+result);
	            }
	    	});
	    	    	
		},ajaxDelete:function(type,inputCond,cb){//csrfToken,
			$.ajax({
		        async:false,
		        type: "post",
		        url: Util.prefixUrl+"/delete/"+type,
		        contentType: "application/json;charset=utf-8",
		        data: JSON.stringify(inputCond),
		        //headers: { 'X-CSRF-TOKEN': csrfToken },
		        dataType: "json",
		        success: function(result) {
		            if(result.returnCode!="000"){                          
	                  alert(result.returnMsg);
	                  return false;
	                }
	                
	                if(cb){
						cb(result);
					}
	              	return true;
	            },error: function(result){
					console.error('ajaxDelete error!'+result);
	            }
	    	});
	    	    	
		},ajaxResetPwd:function(csrfToken,inputCond){
			$.ajax({
		        async:false,
		        type: "post",
		        url: Util.prefixUrl+"/changePwd",
		        contentType: "application/json;charset=utf-8",
		        data: JSON.stringify(inputCond),
		        headers: { 'X-CSRF-TOKEN': csrfToken },
		        dataType: "json",
		        success: function(result) {
		        	//$("#errorMsg").text(result.returnMsg);
					Util.showHintMsg(result.returnMsg);
		          	return true;
		        },error: function(result){
					console.error('changePwdBtn error!'+result);
		        }
			});
		},ajaxInitData:function(type,inputCond,cb){//csrfToken,
			$.ajax({
		        async:false,
		        type: "post",
		        url: Util.prefixUrl+"/initPage/"+type,
		        contentType: "application/json;charset=utf-8",
		        data: JSON.stringify(inputCond),
		        //headers: { 'X-CSRF-TOKEN': csrfToken },
		        dataType: "json",
		        success: function(result) {
		            if(result.returnCode!="000"){                          
	                  alert(result.returnMsg);
	                  return false;
	                }
	                if(cb){
						cb(result);
					}
	              	return true;
	            },error: function(result){
					console.error('ajaxInitData error!'+result);
	            }
	    	});
	    	    	
		},ajaxChangeStatus:function(type,inputCond,cb){//csrfToken,
			$.ajax({
		        async:false,
		        type: "post",
		        url: Util.prefixUrl+"/changeStatus/"+type,
		        contentType: "application/json;charset=utf-8",
		        data: JSON.stringify(inputCond),
		        //headers: { 'X-CSRF-TOKEN': csrfToken },
		        dataType: "json",
		        success: function(result) {
		            if(result.returnCode!="000"){                          
	                  alert(result.returnMsg);
	                  return false;
	                }
	                if(cb){
						cb(result);
					}
	              	return true;
	            },error: function(result){
					console.error('ajaxSaveData error!'+result);
	            }
	    	});
	    	    	
		},ajaxSaveData:function(type,inputCond,cb){//csrfToken,
			$.ajax({
		        async:false,
		        type: "post",
		        url: Util.prefixUrl+"/save/"+type,
		        contentType: "application/json;charset=utf-8",
		        data: JSON.stringify(inputCond),
		        //headers: { 'X-CSRF-TOKEN': csrfToken },
		        dataType: "json",
		        success: function(result) {
		            if(result.returnCode!="000"){                          
	                  alert(result.returnMsg);
	                  return false;
	                }
	                if(cb){
						cb(result);
					}
	              	return true;
	            },error: function(result){
					console.error('ajaxSaveData error!'+result);
	            }
	    	});
	    	    	
		},getUploadformData:function(type,formData){//csrfToken,
	        var item = {//使用此方法才能夠帶cookie，json格式無法使用
	            'url': Util.prefixUrl+'/save/'+type,
	            'type': 'POST',
	            'headers': {
	              'X-Requested-With': 'XMLHttpRequest'
	              //'X-CSRF-TOKEN': csrfToken
	            },
	            'contentType': false, //required
	            //'contentType': "application/json;charset=utf-8",
	            'processData': false, // required
	            'mimeType': 'multipart/form-data',
	            'data': formData,
	            'xhrFields': {
	                'withCredentials': true
	            },
	            'crossDomain': true
	        }
	        return item;
	    },handleFileUpload:function(type,formData,cb){//csrfToken,csrfToken,			
	        var item = Util.getUploadformData(type,formData);
			$.ajax(item).done(function (response) {
	            if(cb){
					cb(JSON.parse(response));
				}
	        }).fail(function (response) {
	            alert('Util.handleFileUpload: Fail ' + response.responseText);
        	});
		},exportXlsx:function(type,inputCond){
			var a = document.createElement("a");
			a.rel="noreferrer noopenner";
			a.href = Util.prefixUrl+"/exportXlsx/"+type + "?" + inputCond;
			a.target = "_blank";
			a.click();
		},showMaxImg : function(src){
   		//var src=$(obj).attr("src");
	   		$("#imgModal").find("#imgshow").html("<img src='"+src+"' class='carousel-inner img-responsive img-rounded' width='900' width='1200' data-dismiss='modal'>");
				$("#imgModal").modal('show');
		},showHintMsg: function(msg){
			if($("#hintMsgViewDiv").length>0){
				$("#hintMsgViewDiv")[0].innerHTML=msg;
			$('#hintMsgModalCenter').modal('show');
			}else{
				alert(msg);
			}
		},buildMenuTreeV2:function(menuData, parentElement) {
        if(menuData !=null){
			$("#menuTree")[0]="";
        	var menu = $('#menuTree');
        	
        	$.each(menuData, function (key, item) {
        		
				
                if (item.child && item.child.length > 0) {
					var menuItem = $('<li class="nav-item dropdown">');
					var aId = item.funcId + "Dropdown";
	                var menuItemLink = $('<a class="nav-link dropdown-toggle" href="#" id="'+aId+'" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a>').text(item.funcName);
					var subMenu = $('<div class="dropdown-menu" aria-labelledby="'+aId+'"></div>');
					$.each(item.child, function (key1, item1) {
						var aLink = $('<a class="dropdown-item"></a>').text(item1.funcName);
						aLink.click(function () {						                	
		                    // 在右侧 iframe 区域显示内容
		                    var url = item1.url;
		                    if (url) {
		                        $('#iframeContent').attr('src', url);
		                    }		                    
		                });
						subMenu.append(aLink);
					});
	                menuItem.append(menuItemLink);
					menuItem.append(subMenu);
	                menu.append(menuItem);
                }else if(item.url != undefined && item.url != ""){
					var menuItem = $('<li class="nav-item">');
	                var menuItemLink = $('<a class="nav-link"></a>').text(item.funcName);
	                
	                menuItem.append(menuItemLink);
	                menu.append(menuItem);
					// 设置点击事件
	                menuItemLink.click(function () {
	                	
	                    // 在右侧 iframe 区域显示内容
	                    var url = item.url;
	                    if (url) {
	                    	$("#collapse").trigger("click");
	                        $('#iframeContent').attr('src', url);
	                    }
	                    
	                });
				}
              
            });
        	return menu;
        }
    	return '';
    },buildMenuTree:function(menuData, parentElement) {
        if(menuData !=null){
        	var menu = $('<ul>');
        	if(parentElement){
        		menu.attr("style","max-height:0;overflow: hidden;");
        	}
        	
        	$.each(menuData, function (key, item) {
        		var menuItem = $('<li>');
                var menuItemLink = $('<a>').text(item.funcName);
                
                menuItem.append(menuItemLink);
                menu.append(menuItem);
				
                if (item.child && item.child.length > 0) {
                	var iconPlus = $('<i class="fa fa-angle-down">');
                	menuItemLink.append(iconPlus);
                    var subMenu = Util.buildMenuTree(item.child,true);
                    menuItem.append(subMenu);
                }

                // 设置点击事件
                menuItemLink.click(function () {
                	
                    // 在右侧 iframe 区域显示内容
                    var url = item.url;
                    if (url) {
                    	$("#collapse").trigger("click");
                        $('#iframeContent').attr('src', url);
                    }
                    //$(this).find("i").length
                    //$(this).find("i").hasClass("fa-angle-down")
                    if (item.child && item.child.length > 0) {
                    	if($(this).find("i").length>0){
                    		var bClose = $(this).find("i").hasClass("fa-angle-down");
	                    	var content = this.nextElementSibling;
						    if (bClose){
						    	$(this).find("i").removeClass("fa-angle-down");
						    	$(this).find("i").addClass("fa-angle-up");
						        content.style.maxHeight = content.scrollHeight + "px";
						    } else {
						    	$(this).find("i").addClass("fa-angle-down");
						    	$(this).find("i").removeClass("fa-angle-up");
						        content.style.maxHeight = 0;
						    } 
                    	}
                    }
                });
            });
        	return menu;
        }
    	return '';
    }
}



