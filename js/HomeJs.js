//#region 'Class comments' // [
/**
 * <p>Title: Bks web page module</p>
 * <pre>
 *  Date    PG          Description
 *  ------- ----------- ------------------------------------------------------
 *  202308  Robin        create this module
 *  KindEditor
 *  ------- ----------- ------------------------------------------------------
 * </pre>
 * @author Robin Hsu
 * @version 1.0
 * @since 2025/08
 */
//#endregion // ] Class comments

var HomeJs = HomeJs || {
    canvasHeight:"1040px",
    canvasWidth:"760px",
    intCanvasHeight:1040,
    intCanvasWidth:760,
    canvasId:"previewCanvas",
    canvasId2:"previewCanvas2",
    canvasId3:"previewCanvas3",
    wordHeight:60,
    wordWidth:60,
    subWordHeight:60,
    subWordWidth:60,
    betweenWordHeight:80,
    betweenWordWidth:90,
    betweenSubWordHeight:80,
    betweenSubWordWidth:90,
    firstPositionX:0,
    firstPositionY:0,
    subPositionX:0,
    subPositionX:0,
    tmpPositionX:0,
    tmpPositionY:0,
    tmpBetweenWordHeight:80,
    tmpBetweenWordWidth:90,
    tmpSubWordHeight:60,
    tmpSubWordWidth:60,
    tmpWordHeight:60,
    tmpWordWidth:60,
    targetMap:{},
    targetList:[],
    tmpWordList:[],
    tmpSubjectList:[],
    currentIndex:0,
	_initPage:function() {
        try {
			//todo : 
            //全開	B1	104公分*76公分
            //對開/2開	B2	76公分*52公分
			//console.log("Dss._initPage start!");
            HomeJs._doInitPage();
            HomeJs._initPageButtonEvents();
            HomeJs._initLuControls();
            console.log("_initPage done!");
            //console.log("Dss._initPage end!");
            //$("i.icon-user").click();
        } catch (err) {
			console.log("HomeJs._initPage:"+err);
        } finally {
        } // try
    },_doInitPage:function() {
		
		//var now = Bks.dateUtil(new Date());
		//$("#edReservationDateStart").attr("min",now);
		
		HomeJs.setCanvasPanel(HomeJs.canvasHeight,HomeJs.canvasWidth);
        HomeJs.targetList.push(HomeJs.targetMap);
        $("#btnPrev").attr("disabled","disabled");
        $("#btnNext").attr("disabled","disabled");
        $("#btnAddSpace").attr("disabled","disabled");
        $("#btnMinusSpace").attr("disabled","disabled");
        $("#btnAddRowSpace").attr("disabled","disabled");
        $("#btnMinusRowSpace").attr("disabled","disabled");
        $("#btnPositionChange").attr("disabled","disabled");
        $("#btnEditSubject").attr("disabled","disabled");
        //
    },_initPageButtonEvents:function() {
		
        var selector = "#poeticStyle";
        poeticStyleChange = function(e) {
			var value = $("#poeticStyle").val();
            var data = Resource.PoeticStyle;
            if(value == undefined || value == ""){
                Util.bindDropDownList("poetry",[],"value","code","請選擇詩文");
            }else{
                var list = data[value];
                Util.bindDropDownList("poetry",list,"value","code","請選擇詩文");
            }
								
		};		        
        $(selector).unbind("click");
        $(selector).on('click',poeticStyleChange);
            
		selector = "#btnAdd2";
        btnAdd2Click = function(e) {
			if(!$("#addModal")[0].checkValidity()){
				return $("#addModal")[0].reportValidity();
			}
            var poeticStyle = $("#poeticStyle").val();
            var poetry = $("#poetry").val();
            var data = Resource.Poetry;
            var poetryMap = data[poeticStyle][poetry];
            if(poetryMap != undefined){
                $("#content").val(poetryMap['poetry']);
                var subject = poetryMap['Author'] + ' ' + poetry;
                $("#subject").val(subject);
            }else{
                 $("#content").val("");
                $("#subject").val("");
            }	
            $("#addModalCenter").modal('hide');
		};		        
        $(selector).unbind("click");
        $(selector).on('click',btnAdd2Click);
        
       //$("input:radio:checked[name=size]")
       selector = "input:radio[name=size]";
       radioSizeChange = function(e) {
			var tagSize = $("input:radio:checked[name=size]")[0].value;
            HomeJs.setCanvasEabled(false);
            if(tagSize=="B1"){
                HomeJs.setCanvasPanel("1040px","760px");
            }else if(tagSize=="B2"){
                HomeJs.setCanvasPanel("760px","520px");
            }else if(tagSize=="SQ"){
                HomeJs.setCanvasPanel("690px","680px");
            }else if(tagSize=="CU"){
                HomeJs.setCanvasEabled(true);
            }
		};		        
        $(selector).unbind("change");
        $(selector).on('change',radioSizeChange);

        selector = "#formWeight";
        formWeightChange = function(e) {
			var value = $(this).val();
            try {
                var width = parseInt(value);
                HomeJs.canvasWidth = width + "px";
                HomeJs.setCanvasPanel(HomeJs.canvasHeight,HomeJs.canvasWidth);
            } catch (error) {
                
            }
		};		        
        $(selector).unbind("change");
        $(selector).on('change',formWeightChange);

        selector = "#formHeight";
        formHeightChange = function(e) {
			var value = $(this).val();
            try {
                var height = parseInt(value);
                HomeJs.canvasHeight = height + "px";
                HomeJs.setCanvasPanel(HomeJs.canvasHeight,HomeJs.canvasWidth);
            } catch (error) {
                
            }
		};		        
        $(selector).unbind("change");
        $(selector).on('change',formHeightChange);

        selector = "#btnDrawImage";
	        
        $(selector).unbind("click");
        $(selector).on('click',HomeJs.btnDrawImageEvent);

        selector = "#btnPrev";
	        
        $(selector).unbind("click");
        $(selector).on('click',HomeJs.btnPrevClick);

        selector = "#btnNext";
	        
        $(selector).unbind("click");
        $(selector).on('click',HomeJs.btnNextClick);

        selector = "#btnAddSpace";
        btnAddSpaceClick = function(e) {
            HomeJs.betweenWordHeight = HomeJs.betweenWordHeight + 1;
            HomeJs.btnDrawImageEvent();
		};		        
        $(selector).unbind("click");
        $(selector).on('click',btnAddSpaceClick);

        selector = "#btnMinusSpace";
        btnMinusSpaceClick = function(e) {
            if(HomeJs.betweenWordHeight > HomeJs.wordHeight){
                HomeJs.betweenWordHeight = HomeJs.betweenWordHeight - 1;
                HomeJs.btnDrawImageEvent();
            }           
		};		        
        $(selector).unbind("click");
        $(selector).on('click',btnMinusSpaceClick);

         selector = "#btnAddRowSpace";
        btnAddRowSpaceClick = function(e) {
            // HomeJs.betweenWordWidth = HomeJs.betweenWordWidth + 1;
            // HomeJs.btnDrawImageEvent();
            $.each(HomeJs.targetMap.wordList,function(index,wordMap){
                if(wordMap['line'] > 1){
                    wordMap['posX'] = wordMap['posX'] - 1;
                }
            });
            HomeJs.clearImageDiv(HomeJs.canvasId);
            HomeJs.drawContentImage(false);
		};		        
        $(selector).unbind("click");
        $(selector).on('click',btnAddRowSpaceClick);

        selector = "#btnMinusRowSpace";
        btnMinusRowSpaceClick = function(e) {
            // if(HomeJs.betweenWordWidth > HomeJs.wordWidth){
            //     HomeJs.betweenWordWidth = HomeJs.betweenWordWidth - 1;
            //     HomeJs.btnDrawImageEvent();
            // }           
            $.each(HomeJs.targetMap.wordList,function(index,wordMap){
                if(wordMap['line'] > 1){
                    wordMap['posX'] = wordMap['posX'] + 1;
                }
            });
            HomeJs.clearImageDiv(HomeJs.canvasId);
            HomeJs.drawContentImage(false);
		};		        
        $(selector).unbind("click");
        $(selector).on('click',btnMinusRowSpaceClick);

        selector = "#contentModalCenter";
        beforeContentModalCenterShow = function(e) {
            // HomeJs.tmpWordWidth= HomeJs.wordWidth;
            // HomeJs.tmpWordHeight = HomeJs.wordHeight;
            // HomeJs.tmpPositionX = HomeJs.firstPositionX;
            // HomeJs.tmpPositionY = HomeJs.firstPositionY;
            // HomeJs.tmpBetweenWordHeight = HomeJs.betweenWordHeight;
            // HomeJs.tmpBetweenWordWidth = HomeJs.betweenWordWidth;
            if(HomeJs.targetMap['wordList'] != undefined){
                Util.bindDropDownList("targetWord",HomeJs.targetMap['wordList'],'word','rowIndex',"請選擇");
                $("#contentModal").find("input:radio[name=moveType][value='ALL']")[0].checked=true;
                $("#contentModal").find("input:radio[name=moveType][value='ALL']").trigger("change");            
            }
            HomeJs.btnPositionChangeEvent(true);

		};		        
        $(selector).unbind("show.bs.modal");
        $(selector).on('show.bs.modal',beforeContentModalCenterShow);

        selector = "input:radio[name=moveType]";
        radioMoveTypeChange = function(e) {
			var tagSize = $("#contentModal").find("input:radio:checked[name=moveType]")[0].value;
            $("#targetWord").attr("disabled","disabled");
            $("#imgTargetWord").hide();
            if(tagSize=="ALL"){
                $("#targetWord").attr("disabled","disabled");
                $("#imgTargetWord").hide();
                HomeJs.btnPositionChangeEvent();
            }else if(tagSize=="ONE"){
                $("#targetWord").removeAttr("disabled");
                HomeJs.btnPositionChangeEvent();
            }
		};		        
        $("#contentModal").find(selector).unbind("change");
        $("#contentModal").find(selector).on('change',radioMoveTypeChange);

        selector = "input:radio[name=moveType]";
        radioMoveTypeChange2 = function(e) {
			var tagSize = $("#subjectModal").find("input:radio:checked[name=moveType]")[0].value;
            $("#targetSubWord").attr("disabled","disabled");
            $("#imgTargetSubWord").hide();
            if(tagSize=="ALL"){
                $("#targetSubWord").attr("disabled","disabled");
                $("#imgTargetSubWord").hide();
                HomeJs.btnSubPositionChangeEvent();
            }else if(tagSize=="ONE"){
                $("#targetSubWord").removeAttr("disabled");
                HomeJs.btnSubPositionChangeEvent();
            }
		};		        
        $("#subjectModal").find(selector).unbind("change");
        $("#subjectModal").find(selector).on('change',radioMoveTypeChange2);

        selector = "#targetWord";
        targetWordChange = function(e) {
            var targetWord = $(this).val();
            if(targetWord == "") {
                $("#imgTargetWord").hide();
                return;               
            }
            $("#imgTargetWord").show();
            var bodyFontType = $("#bodyFont").val();
            var targetIndex = $("#targetWord")[0].options.selectedIndex;
            var fontName = $("#targetWord")[0].options[targetIndex].text;
            $("#imgTargetWord").attr("src","./font_data/"+bodyFontType+"/"+fontName+".png");

            HomeJs.btnPositionChangeEvent();
            HomeJs.drawTargetWord();
            
            
		};		        
        $(selector).unbind("change");
        $(selector).on('change',targetWordChange);

        selector = "#targetSubWord";
        targetSubWordChange = function(e) {
            var targetWord = $(this).val();
            if(targetWord == "") {
                $("#imgTargetSubWord").hide();
                return;               
            }
            $("#imgTargetSubWord").show();
            var userFontType = $("#userFont").val();
            var targetIndex = $("#targetSubWord")[0].options.selectedIndex;
            var fontName = $("#targetSubWord")[0].options[targetIndex].text;
            $("#imgTargetSubWord").attr("src","./font_data/"+userFontType+"/"+fontName+".png");

            HomeJs.btnSubPositionChangeEvent();
            HomeJs.drawTargetSubWord();
            
            
		};		        
        $(selector).unbind("change");
        $(selector).on('change',targetSubWordChange);

        selector = "#btnPositionUp";
        btnPositionUpClick = function(e) {
            var step = $("#intPositionWidth").val();
            if(step == undefined || step == "") {
                step = "1";
                $("#intPositionWidth").val(step);               
            }
            step = parseInt(step);
            var tagSize = $("#contentModal").find("input:radio:checked[name=moveType]")[0].value;
            var targetWord = $("#targetWord").val();
            if(tagSize=="ONE" && targetWord == ""){
                 $("#targetWord").focus();
                return;
            }
            $.each(HomeJs.tmpWordList,function(index,wordMap){
                var bPass = false;
                if(tagSize == "ALL"){
                    bPass = (wordMap['posY'] - step >= 0);
                }else if(tagSize=="ONE"){
                    var targetIndex = parseInt(targetWord);
                    bPass = (wordMap['posY'] - step >= 0) && index == targetIndex;
                }
                if(bPass){
                    wordMap['posY'] = wordMap['posY'] - step;
                }
            });
            HomeJs.btnPositionChangeEvent();
            HomeJs.drawTargetWord();
            
		};		        
        $(selector).unbind("click");
        $(selector).on('click',btnPositionUpClick);

        selector = "#btnPositionDown";
        btnPositionDownClick = function(e) {
            var step = $("#intPositionWidth").val();
            if(step == undefined || step == "") {
                step = "1";
                $("#intPositionWidth").val(step);               
            }
            step = parseInt(step);
            var tagSize = $("#contentModal").find("input:radio:checked[name=moveType]")[0].value;
            var targetWord = $("#targetWord").val();
            if(tagSize=="ONE" && targetWord == ""){
                 $("#targetWord").focus();
                return;
            }
            $.each(HomeJs.tmpWordList,function(index,wordMap){
                var bPass = false;
                if(tagSize == "ALL"){
                    bPass = (wordMap['posY'] + step <= HomeJs.intCanvasHeight);
                }else if(tagSize=="ONE"){
                    var targetIndex = parseInt(targetWord);
                    bPass = (wordMap['posY'] + step <= HomeJs.intCanvasHeight) && index == targetIndex;
                }
                if(bPass){
                    wordMap['posY'] = wordMap['posY'] + step;
                }
            });
            HomeJs.btnPositionChangeEvent();
            HomeJs.drawTargetWord();
            
		};		        
        $(selector).unbind("click");
        $(selector).on('click',btnPositionDownClick);

        selector = "#btnPositionLeft";
        btnPositionLeftClick = function(e) {
            var step = $("#intPositionWidth").val();
            if(step == undefined || step == "") {
                step = "1";
                $("#intPositionWidth").val(step);               
            }
            step = parseInt(step);
            var tagSize = $("#contentModal").find("input:radio:checked[name=moveType]")[0].value;
            var targetWord = $("#targetWord").val();
            if(tagSize=="ONE" && targetWord == ""){
                 $("#targetWord").focus();
                return;
            }
            $.each(HomeJs.tmpWordList,function(index,wordMap){
                var bPass = false;
                if(tagSize == "ALL"){
                    bPass = (wordMap['posX'] - step >= 0);
                }else if(tagSize=="ONE"){
                    var targetIndex = parseInt(targetWord);
                    bPass = (wordMap['posX'] - step >= 0) && index == targetIndex;
                }
                if(bPass){
                    wordMap['posX'] = wordMap['posX'] - step;
                }
            });
            HomeJs.btnPositionChangeEvent();
            HomeJs.drawTargetWord();
            // if(HomeJs.tmpPositionX - step >= 0){
            //     HomeJs.tmpPositionX = HomeJs.tmpPositionX - step;
            //     HomeJs.btnPositionChangeEvent();
            // }
            
		};		        
        $(selector).unbind("click");
        $(selector).on('click',btnPositionLeftClick);

        selector = "#btnPositionRight";
        btnPositionRightClick = function(e) {
            var step = $("#intPositionWidth").val();
            if(step == undefined || step == "") {
                step = "1";
                $("#intPositionWidth").val(step);               
            }
            step = parseInt(step);
            var tagSize = $("#contentModal").find("input:radio:checked[name=moveType]")[0].value;
            var targetWord = $("#targetWord").val();
            if(tagSize=="ONE" && targetWord == ""){
                 $("#targetWord").focus();
                return;
            }
            $.each(HomeJs.tmpWordList,function(index,wordMap){
                var bPass = false;
                if(tagSize == "ALL"){
                    bPass = (wordMap['posX'] + step <= HomeJs.intCanvasWidth);
                }else if(tagSize=="ONE"){
                    var targetIndex = parseInt(targetWord);
                    bPass = (wordMap['posX'] + step <= HomeJs.intCanvasWidth) && index == targetIndex;
                }
                if(bPass){
                    wordMap['posX'] = wordMap['posX'] + step;
                }
            });
            HomeJs.btnPositionChangeEvent();
            HomeJs.drawTargetWord();
            // if(HomeJs.tmpPositionX + step <= HomeJs.intCanvasWidth){
            //     HomeJs.tmpPositionX = HomeJs.tmpPositionX + step;
            //     HomeJs.btnPositionChangeEvent();
            // }
            
		};		        
        $(selector).unbind("click");
        $(selector).on('click',btnPositionRightClick);

        selector = "#btnWordWidthAdd";
        btnWordWidthAddClick = function(e) {
            var step = $("#intWordWidth").val();
            if(step == undefined || step == "") {
                step = "1";
                $("#intWordWidth").val(step);               
            }
            step = parseInt(step);
            var tagSize = $("#contentModal").find("input:radio:checked[name=moveType]")[0].value;
            var targetWord = $("#targetWord").val();
            if(tagSize=="ONE" && targetWord == ""){
                 $("#targetWord").focus();
                return;
            }
            
            $.each(HomeJs.tmpWordList,function(index,wordMap){
                var bPass = false;
                if(tagSize == "ALL"){
                    bPass = (wordMap['width'] + step <= HomeJs.intCanvasWidth);
                }else if(tagSize=="ONE"){
                    var targetIndex = parseInt(targetWord);
                    bPass = (wordMap['width'] + step <= HomeJs.intCanvasWidth) && index == targetIndex;
                }
                if(bPass){
                    wordMap['width'] = wordMap['width'] + step;
                    if($("#fixWordHeight")[0].checked){
                        wordMap['height'] = wordMap['height'] + step;
                    }
                }
            });
            HomeJs.btnPositionChangeEvent();
            HomeJs.drawTargetWord();
		};		        
        $(selector).unbind("click");
        $(selector).on('click',btnWordWidthAddClick);

        selector = "#btnWordWidthMinus";
        btnWordWidthMinusClick = function(e) {
            var step = $("#intWordWidth").val();
            if(step == undefined || step == "") {
                step = "1";
                $("#intWordWidth").val(step);               
            }
            step = parseInt(step);
            var tagSize = $("#contentModal").find("input:radio:checked[name=moveType]")[0].value;
            var targetWord = $("#targetWord").val();
            if(tagSize=="ONE" && targetWord == ""){
                 $("#targetWord").focus();
                return;
            }
            $.each(HomeJs.tmpWordList,function(index,wordMap){
                var bPass = false;
                if(tagSize == "ALL"){
                    bPass = (wordMap['width'] - step >= 20);
                }else if(tagSize=="ONE"){
                    var targetIndex = parseInt(targetWord);
                    bPass = (wordMap['width'] - step >= 20) && index == targetIndex;
                }
                if(bPass){
                    wordMap['width'] = wordMap['width'] - step;
                    if($("#fixWordHeight")[0].checked){
                        wordMap['height'] = wordMap['height'] - step;
                    }
                }
            });
            HomeJs.btnPositionChangeEvent();
            HomeJs.drawTargetWord();
		};		        
        $(selector).unbind("click");
        $(selector).on('click',btnWordWidthMinusClick);

        selector = "#btnAddSubject";
	        
        $(selector).unbind("click");
        $(selector).on('click',HomeJs.btnDrawSubjectEvent);

        selector = "#btnSaveContentConfig";
	    btnSaveContentConfigClick = function(e) {
            HomeJs.targetMap['wordList'] = HomeJs.tmpWordList;
            HomeJs.clearImageDiv(HomeJs.canvasId);
            if(HomeJs.targetMap['subjectList'] != undefined){
                HomeJs.drawSubjectImage();
            }else{
                HomeJs.drawContentImage(false);
            }
            $("#contentModalCenter").modal('hide');
		};		            

        $(selector).unbind("click");
        $(selector).on('click',btnSaveContentConfigClick);

        selector = "#btnCloseContentConfig";
	    btnCloseContentConfigClick = function(e) {
            $("#contentModalCenter").modal('hide');
		};		            

        $(selector).unbind("click");
        $(selector).on('click',btnCloseContentConfigClick);

        selector = "#subjectModalCenter";
        beforeSubjectModalCenterShow = function(e) {
            if(HomeJs.targetMap['subjectList'] != undefined){
                Util.bindDropDownList("targetSubWord",HomeJs.targetMap['subjectList'],'word','rowIndex',"請選擇");
                $("#subjectModal").find("input:radio[name=moveType][value='ALL']")[0].checked=true;
                $("#subjectModal").find("input:radio[name=moveType][value='ALL']").trigger("change");            
            }
            HomeJs.btnSubPositionChangeEvent(true);

		};		        
        $(selector).unbind("show.bs.modal");
        $(selector).on('show.bs.modal',beforeSubjectModalCenterShow);

        selector = "#btnSaveSubjectConfig";
	    btnSaveSubjectConfigClick = function(e) {
            HomeJs.clearImageDiv(HomeJs.canvasId);
            HomeJs.targetMap['subjectList'] = HomeJs.tmpSubjectList;
            HomeJs.drawSubjectImage();
            $("#subjectModalCenter").modal('hide');
		};		            

        $(selector).unbind("click");
        $(selector).on('click',btnSaveSubjectConfigClick);

        selector = "#btnCloseSubjectConfig";
	    btnCloseSubjectConfigClick = function(e) {
            $("#subjectModalCenter").modal('hide');
		};		            

        $(selector).unbind("click");
        $(selector).on('click',btnCloseSubjectConfigClick);

        selector = "#btnSubPositionUp";
        btnSubPositionUpClick = function(e) {
            var step = $("#intSubPositionWidth").val();
            if(step == undefined || step == "") {
                step = "1";
                $("#intSubPositionWidth").val(step);               
            }
            step = parseInt(step);
            var tagSize = $("#subjectModal").find("input:radio:checked[name=moveType]")[0].value;
            var targetWord = $("#targetSubWord").val();
            if(tagSize=="ONE" && targetWord == ""){
                 $("#targetSubWord").focus();
                return;
            }
            $.each(HomeJs.tmpSubjectList,function(index,wordMap){
                var bPass = false;
                if(tagSize == "ALL"){
                    bPass = (wordMap['posY'] - step >= 0);
                }else if(tagSize=="ONE"){
                    var targetIndex = parseInt(targetWord);
                    bPass = (wordMap['posY'] - step >= 0) && index == targetIndex;
                }
                if(bPass){
                    wordMap['posY'] = wordMap['posY'] - step;
                }
            });
            HomeJs.btnSubPositionChangeEvent();
            HomeJs.drawTargetSubWord();
            
		};		        
        $(selector).unbind("click");
        $(selector).on('click',btnSubPositionUpClick);

        selector = "#btnSubPositionDown";
        btnSubPositionDownClick = function(e) {
            var step = $("#intSubPositionWidth").val();
            if(step == undefined || step == "") {
                step = "1";
                $("#intSubPositionWidth").val(step);               
            }
            step = parseInt(step);
            var tagSize = $("#subjectModal").find("input:radio:checked[name=moveType]")[0].value;
            var targetWord = $("#targetSubWord").val();
            if(tagSize=="ONE" && targetWord == ""){
                 $("#targetSubWord").focus();
                return;
            }
            $.each(HomeJs.tmpSubjectList,function(index,wordMap){
                var bPass = false;
                if(tagSize == "ALL"){
                    bPass = (wordMap['posY'] + step <= HomeJs.intCanvasHeight - HomeJs.subWordHeight);
                }else if(tagSize=="ONE"){
                    var targetIndex = parseInt(targetWord);
                    bPass = (wordMap['posY'] + step <= HomeJs.intCanvasHeight - HomeJs.subWordHeight) && index == targetIndex;
                }
                if(bPass){
                    wordMap['posY'] = wordMap['posY'] + step;
                }
            });
            HomeJs.btnSubPositionChangeEvent();
            HomeJs.drawTargetSubWord();            
		};		        
        $(selector).unbind("click");
        $(selector).on('click',btnSubPositionDownClick);

        selector = "#btnSubPositionLeft";
        btnSubPositionLeftClick = function(e) {
            var step = $("#intSubPositionWidth").val();
            if(step == undefined || step == "") {
                step = "1";
                $("#intSubPositionWidth").val(step);               
            }
            step = parseInt(step);
            var tagSize = $("#subjectModal").find("input:radio:checked[name=moveType]")[0].value;
            var targetWord = $("#targetSubWord").val();
            if(tagSize=="ONE" && targetWord == ""){
                 $("#targetSubWord").focus();
                return;
            }
            $.each(HomeJs.tmpSubjectList,function(index,wordMap){
                var bPass = false;
                if(tagSize == "ALL"){
                    bPass = (wordMap['posX'] - step >= 0);
                }else if(tagSize=="ONE"){
                    var targetIndex = parseInt(targetWord);
                    bPass = (wordMap['posX'] - step >= 0) && index == targetIndex;
                }
                if(bPass){
                    wordMap['posX'] = wordMap['posX'] - step;
                }
            });
            HomeJs.btnSubPositionChangeEvent();
            HomeJs.drawTargetSubWord();
		};		        
        $(selector).unbind("click");
        $(selector).on('click',btnSubPositionLeftClick);

        selector = "#btnSubPositionRight";
        btnSubPositionRightClick = function(e) {
            var step = $("#intSubPositionWidth").val();
            if(step == undefined || step == "") {
                step = "1";
                $("#intSubPositionWidth").val(step);               
            }
            step = parseInt(step);
            var tagSize = $("#subjectModal").find("input:radio:checked[name=moveType]")[0].value;
            var targetWord = $("#targetSubWord").val();
            if(tagSize=="ONE" && targetWord == ""){
                 $("#targetSubWord").focus();
                return;
            }
            $.each(HomeJs.tmpSubjectList,function(index,wordMap){
                var bPass = false;
                if(tagSize == "ALL"){
                    bPass = (wordMap['posX'] + step <= HomeJs.intCanvasWidth);
                }else if(tagSize=="ONE"){
                    var targetIndex = parseInt(targetWord);
                    bPass = (wordMap['posX'] + step <= HomeJs.intCanvasWidth) && index == targetIndex;
                }
                if(bPass){
                    wordMap['posX'] = wordMap['posX'] + step;
                }
            });
            HomeJs.btnSubPositionChangeEvent();
            HomeJs.drawTargetSubWord(); 
		};		        
        $(selector).unbind("click");
        $(selector).on('click',btnSubPositionRightClick);
        
        selector = "#btnSubWordWidthAdd";
        btnSubWordWidthAddClick = function(e) {
            var step = $("#intSubWordWidth").val();
            if(step == undefined || step == "") {
                step = "1";
                $("#intSubWordWidth").val(step);               
            }
            step = parseInt(step);
            var tagSize = $("#subjectModal").find("input:radio:checked[name=moveType]")[0].value;
            var targetWord = $("#targetSubWord").val();
            if(tagSize=="ONE" && targetWord == ""){
                 $("#targetSubWord").focus();
                return;
            }
            $.each(HomeJs.tmpSubjectList,function(index,wordMap){
                var bPass = false;
                if(tagSize == "ALL"){
                    bPass = (wordMap['width'] + step <= HomeJs.intCanvasWidth);
                }else if(tagSize=="ONE"){
                    var targetIndex = parseInt(targetWord);
                    bPass = (wordMap['width'] + step <= HomeJs.intCanvasWidth) && index == targetIndex;
                }
                if(bPass){
                    wordMap['width'] = wordMap['width'] + step;
                }
            });
            HomeJs.btnSubPositionChangeEvent();
            HomeJs.drawTargetSubWord();         
		};		        
        $(selector).unbind("click");
        $(selector).on('click',btnSubWordWidthAddClick);

        selector = "#btnSubWordWidthMinus";
        btnSubWordWidthMinusClick = function(e) {
            var step = $("#intSubWordWidth").val();
            if(step == undefined || step == "") {
                step = "1";
                $("#intSubWordWidth").val(step);               
            }
            step = parseInt(step);
            var tagSize = $("#subjectModal").find("input:radio:checked[name=moveType]")[0].value;
            var targetWord = $("#targetSubWord").val();
            if(tagSize=="ONE" && targetWord == ""){
                 $("#targetSubWord").focus();
                return;
            }
            $.each(HomeJs.tmpSubjectList,function(index,wordMap){
                var bPass = false;
                if(tagSize == "ALL"){
                    bPass = (wordMap['width'] - step >= 20);
                }else if(tagSize=="ONE"){
                    var targetIndex = parseInt(targetWord);
                    bPass = (wordMap['width'] - step >= 20) && index == targetIndex;
                }
                if(bPass){
                    wordMap['width'] = wordMap['width'] - step;
                }
            });
            HomeJs.btnSubPositionChangeEvent();
            HomeJs.drawTargetSubWord();
            
		};		        
        $(selector).unbind("click");
        $(selector).on('click',btnSubWordWidthMinusClick);

        selector = "#btnSavePicture";
        btnSavePictureClick = function(e) {
            if(HomeJs.targetMap['wordList'] == undefined || HomeJs.targetMap['wordList'] == ""){
                return;
            }
            var canvas = $("#"+HomeJs.canvasId)[0];
            const ctx = canvas.getContext("2d");
            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = "source-over";

            const dataURL = canvas.toDataURL("image/png");

            // 動態產生 <a> 下載
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "canvas-image.png"; // 下載的檔名
            link.click();
		};		        
        $(selector).unbind("click");
        $(selector).on('click',btnSavePictureClick);

        selector = "#btnAddOne";

        $(selector).unbind("click");
        $(selector).on('click',HomeJs.btnAddOneEvent);
        
    },_initLuControls:function() {
		

    },setCanvasPanel:function(sHeight,sWidth){
        HomeJs.canvasHeight = sHeight;
        HomeJs.canvasWidth = sWidth;
        $("#"+HomeJs.canvasId).attr("height",HomeJs.canvasHeight);
        $("#"+HomeJs.canvasId).attr("width",HomeJs.canvasWidth);
        $("#"+HomeJs.canvasId2).attr("height",HomeJs.canvasHeight);
        $("#"+HomeJs.canvasId2).attr("width",HomeJs.canvasWidth);
        $("#"+HomeJs.canvasId3).attr("height",HomeJs.canvasHeight);
        $("#"+HomeJs.canvasId3).attr("width",HomeJs.canvasWidth);
       HomeJs.setCanvasSize();
    },setCanvasSize:function(){
        sWidth = HomeJs.canvasWidth.replace("px","");
        sHeight = HomeJs.canvasHeight.replace("px","");
        HomeJs.intCanvasHeight = parseInt(sHeight);
        HomeJs.intCanvasWidth = parseInt(sWidth);
        HomeJs.firstPositionX = sWidth - 3 * HomeJs.wordWidth/2;
        HomeJs.firstPositionY = HomeJs.wordHeight/2;
        HomeJs.subPositionX = 1 * HomeJs.wordWidth/2;
        HomeJs.subPositionY = HomeJs.intCanvasHeight/3;
        //HomeJs.betweenWordHeight =  HomeJs.wordHeight,
        //HomeJs.betweenWordWidth = HomeJs.wordWidth,
        $("#formWeight").val(sWidth);
        $("#formHeight").val(sHeight);
        if(HomeJs.targetMap['subjectList'] != undefined){
            HomeJs.btnDrawSubjectEvent();
        }else if(HomeJs.targetMap['wordList'] != undefined){
            HomeJs.btnDrawImageEvent();
        }
    },setCanvasEabled:function(bEabled){
        if(bEabled){
            $("#formWeight").removeAttr("disabled");
            $("#formHeight").removeAttr("disabled");
        }else{
            $("#formWeight").attr("disabled","disabled");
            $("#formHeight").attr("disabled","disabled");
        }
        
    },createImage:function(id,fontType,wordMap,fixedSpace,fixHeight){
        if(fixedSpace == undefined){
            fixedSpace = false;
        }
        if(fixHeight == undefined){
            fixHeight = false;
        }
        var fontName = wordMap['word'];
        // if(fontName == " "){
        //     return;
        // }
        var imgDom = document.createElement('img');
        $("#imageHideDiv")[0].append(imgDom);
        //imgDom.attr("style",'width:40px;height:40px');
        if(fontName != " "){
            $(imgDom).attr("src","./font_data/"+fontType+"/"+fontName+".png").on('load',function(){
                HomeJs.capture(id,wordMap,imgDom,fixedSpace,fixHeight);
            });
        }else{
            HomeJs.capture(id,wordMap,imgDom,fixedSpace,fixHeight);
        }
	  	
        
        
    },clearImageDiv:function(id){
        $("#imageHideDiv")[0].innerHTML="";
        var canvas = $("#"+id)[0];
		
		var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width,canvas.height) ;
        //alert("it's clear!");
    },capture : function(id,wordMap,imageDom,fixedSpace,fixHeight){
        var targetX = wordMap['posX'];
        var targetY = wordMap['posY'];
        var width = wordMap['width'];
        var height = wordMap['height'];
        if(width == undefined){
            width = HomeJs.wordWidth;
        }
        if(height == undefined){
            height = HomeJs.wordHeight;
        }
        if(fixedSpace == undefined){
            fixedSpace = false;
        }
        if(fixHeight == undefined){
            fixHeight = false;
        }
        var canvas = $("#"+id)[0];
		//var canvas = document.createElement('canvas'); //建立canvas js DOM元素
        var rate = imageDom.height/imageDom.width;
		//console.log("imageDom.width:"+imageDom.width);
		//console.log("imageDom.height:"+imageDom.height);
        //console.log("imageDom.rate:"+rate);
		var ctx = canvas.getContext('2d');
        var oriHeight = rate * width;
        
        if(fixedSpace){
            
            if(!fixHeight){
                if(rate > 1.0){
                    oriHeight = height;
                }     
            }
        }else{
            wordMap['height'] = oriHeight;
            var indexI = wordMap['index'];
            var type = wordMap['type'];
            var list = HomeJs.targetMap['wordList'];
            var wordCnt = list.length;
            var betweenWordHeight = HomeJs.betweenWordHeight;
            var wordHeight = HomeJs.wordHeight;
            var betweenWordWidth = HomeJs.betweenWordWidth;
            var firstPositionY = HomeJs.firstPositionY;
            if(type == "S"){
                list = HomeJs.targetMap['subjectList'];
                wordCnt =list.length;
                betweenWordHeight = HomeJs.betweenSubWordHeight;
                wordHeight = HomeJs.subWordHeight;
                betweenWordWidth = HomeJs.betweenSubWordWidth;
                firstPositionY = HomeJs.subPositionY;
                if(wordMap['word'] == " "){
                    oriHeight = 30;
                    wordMap['height'] = oriHeight;
                }
            }
            //console.log(wordMap['word']+".height:"+oriHeight+",index:"+indexI+",wordCnt:"+wordCnt);
            if(indexI+1 < wordCnt && indexI >=0){
                var diff = betweenWordHeight-wordHeight;
                if(diff <= 20){
                    diff = 20;
                }
                var newPosY = targetY+oriHeight+diff;
                //console.log(list[indexI]['word']+".posY:"+targetY+",index:"+indexI);
                //console.log(list[indexI+1]['word']+".newPosY:"+newPosY+",index:"+indexI);
                if( newPosY <= HomeJs.intCanvasHeight-wordHeight){
                    list[indexI+1]['posY'] = newPosY;
                    list[indexI+1]['posX'] = targetX;
                }else{
                    if(targetX - betweenWordWidth >= 0){
                        list[indexI+1]['posX'] = targetX - betweenWordWidth;
                        list[indexI+1]['posY']= firstPositionY;
                    }else{
                        
                    }
                }
            }
        }
        
		ctx.drawImage(imageDom,targetX,targetY,width,oriHeight);
        
	},buildWordList:function(content,bFinal){
        var wordList = [];
        var firstPositionX = HomeJs.firstPositionX;
        var firstPositionY = HomeJs.firstPositionY;
        
        var posX = HomeJs.firstPositionX;
        var posY = HomeJs.firstPositionY;
        var itemCnt = content.length;
        var betweenWordWidth = HomeJs.betweenWordWidth;
        var betweenWordHeight = HomeJs.betweenWordHeight;
        var height = HomeJs.wordHeight;
        var width = HomeJs.wordWidth;
        if(!bFinal){
            firstPositionX = HomeJs.tmpPositionX;
            firstPositionY = HomeJs.tmpPositionY
        
            posX = HomeJs.tmpPositionX;
            posY = HomeJs.tmpPositionY;  

            betweenWordWidth = HomeJs.tmpBetweenWordWidth;
            betweenWordHeight = HomeJs.tmpBetweenWordHeight;

            height = HomeJs.tmpWordHeight;
            width = HomeJs.tmpWordWidth;
        }
        var line = 1;
        for(var index=0;index<itemCnt;index++){
            var word = content[index];
            var wordMap = {'index':index,'type':'C','word':word,'posX':posX,'posY':posY,'width':width,'height':height,'line':line};
            wordList.push(wordMap);
            if(index+1<itemCnt){
                if(posY+betweenWordHeight <= HomeJs.intCanvasHeight-HomeJs.wordHeight){
                    posY = posY+betweenWordHeight;
                }else{
                    if(posX- betweenWordWidth >= 0){
                        posX = posX- betweenWordWidth;
                        posY = firstPositionY;
                        line = line + 1;
                    }else{
                        break;
                    }
                }
            }
        }
        return wordList;
    },btnPrevClick:function(e){
        if(HomeJs.currentIndex > 0){
            HomeJs.sameCurrentMap(HomeJs.currentIndex);
            HomeJs.currentIndex = HomeJs.currentIndex - 1;
            HomeJs.targetMap = HomeJs.targetList[HomeJs.currentIndex];
            HomeJs.loadInfo();
        }
        HomeJs.refreshIconStatus();
        //btnPrev
    },sameCurrentMap:function(index){
        HomeJs.targetMap['oriContent'] = $("#content").val();
        HomeJs.targetMap['oriSubject'] = $("#subject").val();
        HomeJs.targetMap['bodyFontType'] = $("#bodyFont").val();
        HomeJs.targetMap['fixedSpace'] = $("#fixWordHeight")[0].checked;   
        HomeJs.targetMap['subjectFontType'] = $("#userFont").val();
        HomeJs.targetList[index]= HomeJs.targetMap;
    },btnNextClick:function(e){
        if(HomeJs.currentIndex <  HomeJs.targetList.length - 1){
            HomeJs.sameCurrentMap(HomeJs.currentIndex);
            HomeJs.currentIndex = HomeJs.currentIndex + 1;
            HomeJs.targetMap = HomeJs.targetList[HomeJs.currentIndex];
            HomeJs.loadInfo();
        }
        HomeJs.refreshIconStatus();
        //btnPrev
    },loadInfo:function(){
        $("#content").val("");
        $("#subject").val("");
        $("#bodyFont").val("楷書");
        $("#userFont").val("楷書");
        $("#fixWordHeight")[0].checked = false;
        if(HomeJs.targetMap['oriContent'] != undefined){
            $("#content").val(HomeJs.targetMap['oriContent']);
        }
        if(HomeJs.targetMap['oriSubject'] != undefined){
             $("#subject").val(HomeJs.targetMap['oriSubject']);
        }
        if(HomeJs.targetMap['bodyFontType'] != undefined){
             $("#bodyFont").val(HomeJs.targetMap['bodyFontType']);
        }
        if(HomeJs.targetMap['fixedSpace'] != undefined){
             $("#fixWordHeight")[0].checked = HomeJs.targetMap['fixedSpace'];
        }
        if(HomeJs.targetMap['subjectFontType'] != undefined){
             $("#userFont").val(HomeJs.targetMap['subjectFontType']);
        }
        HomeJs.loadImage();
        
    },loadImage:function(){
        HomeJs.clearImageDiv(HomeJs.canvasId);
        if(HomeJs.targetMap['subjectList'] != undefined){
            HomeJs.drawSubjectImage();
        }else if(HomeJs.targetMap['contentList'] != undefined){
            HomeJs.drawContentImage(); 
        }
    },refreshIconStatus:function(){
        $("#btnPrev").attr("disabled","disabled");
        $('#btnNext').attr("disabled","disabled");
        if(HomeJs.currentIndex > 0){
            $("#btnPrev").removeAttr("disabled");
        }
        if(HomeJs.currentIndex < HomeJs.targetList.length - 1){
            $('#btnNext').removeAttr("disabled");
        }
    },btnAddOneEvent:function(e){
        HomeJs.targetList.push(HomeJs.cloneMap(HomeJs.targetMap));
        HomeJs.targetMap = {};
        HomeJs.loadInfo();       
        HomeJs.currentIndex = HomeJs.targetList.length - 1;
        HomeJs.refreshIconStatus();
    },btnDrawImageEvent:function(e){
        var oriContent = $("#content").val();
        
        var content = Util.filterString(oriContent);
       
        var wordList = [];
        var itemCnt = content.length;
        HomeJs.clearImageDiv(HomeJs.canvasId);
        //HomeJs.clearImageDiv(HomeJs.canvasId2);
        if(itemCnt>0){
            $("#btnAddSpace").removeAttr("disabled");
            $("#btnMinusSpace").removeAttr("disabled");
            $("#btnAddRowSpace").removeAttr("disabled");
            $("#btnMinusRowSpace").removeAttr("disabled");
            $("#btnPositionChange").removeAttr("disabled");
             HomeJs.targetMap['oriContent'] = oriContent;
            HomeJs.targetMap['content'] = content;
            wordList = HomeJs.buildWordList(content,true);
            HomeJs.targetMap['wordList'] = wordList;            
            HomeJs.drawContentImage(); 
            
            $("#btnEditSubject").attr("disabled","disabled");
        }else{
            $("#btnAddSpace").attr("disabled","disabled");
            $("#btnMinusSpace").attr("disabled","disabled");
            $("#btnAddRowSpace").attr("disabled","disabled");
            $("#btnMinusRowSpace").attr("disabled","disabled");
            $("#btnPositionChange").attr("disabled","disabled"); 
            $("#btnEditSubject").attr("disabled","disabled");       
        }
    },drawContentImage:function(init){
        var wordList = HomeJs.targetMap['wordList'];
        var bodyFontType = $("#bodyFont").val();
        //var fixHeight = $("#fixWordHeight")[0].checked;
        var fixedSpace = true;
        var fixHeight = true;
        if(init == undefined || init == true){
            fixedSpace = $("#fixWordHeight")[0].checked; 
                 
        }
        if($("#fixWordHeight")[0].checked){
            fixHeight = false;
        }    
        HomeJs.targetMap['bodyFontType'] = bodyFontType;
        HomeJs.targetMap['fixedSpace'] = $("#fixWordHeight")[0].checked;
        HomeJs.drawImageEvent(HomeJs.canvasId,wordList,bodyFontType,fixedSpace,fixHeight); 
    },drawImageEvent:function(id,list,fontType,fixedSpace,fixHeight){
        //HomeJs.clearImageDiv(id);
        var itemCnt = list.length;
        if(itemCnt>0){
            for(var indexI = 0;indexI<itemCnt;indexI++){
                var wordMap = list[indexI];
                HomeJs.createImage(id,fontType,wordMap,fixedSpace,fixHeight);
            }
        }
    },btnPositionChangeEvent:function(init){
        var wordList = HomeJs.targetMap['wordList'];
        var fixedSpace = true;
        var fixHeight = true;
        if($("#fixWordHeight")[0].checked){
            fixHeight = false;
        }
        if(init){
            HomeJs.tmpWordList = HomeJs.clone(wordList);     
                    
        }else{
            wordList = HomeJs.tmpWordList;
        }

        var bodyFontType = $("#bodyFont").val();
        //var fixHeight = $("#fixWordHeight")[0].checked;
        
        HomeJs.clearImageDiv(HomeJs.canvasId2);
        HomeJs.drawImageEvent(HomeJs.canvasId2,wordList,bodyFontType,fixedSpace,fixHeight); 
    },drawSubjectImage:function(){
        HomeJs.clearImageDiv(HomeJs.canvasId);
        HomeJs.drawContentImage(false);
        var wordList = HomeJs.targetMap['subjectList'];
        var subjectFontType = $("#userFont").val();
        var fixedSpace = true;
        HomeJs.targetMap['subjectFontType'] = subjectFontType;
        HomeJs.drawImageEvent(HomeJs.canvasId,wordList,subjectFontType,fixedSpace,true); 
    },btnDrawSubjectEvent:function(e){
        HomeJs.clearImageDiv(HomeJs.canvasId);
        HomeJs.drawContentImage(false);
        var oriSubject = $("#subject").val();
        //var targetMap = HomeJs.targetList[HomeJs.currentIndex];

        HomeJs.targetMap['oriSubject'] = oriSubject;
        var subject = Util.filterSubjectString(oriSubject);
       HomeJs.targetMap['subject'] = subject;
        var wordList = [];
        var itemCnt = subject.length;
        //HomeJs.clearImageDiv(HomeJs.canvasId);
        //HomeJs.clearImageDiv(HomeJs.canvasId2);
        if(itemCnt>0){
            $("#btnEditSubject").removeAttr("disabled");
            //HomeJs.subPositionY = HomeJs.intCanvasHeight/2 - (itemCnt * HomeJs.wordHeight)/2;
            $("#btnAddSpace").removeAttr("disabled");
            $("#btnMinusSpace").removeAttr("disabled");
            $("#btnPositionChange").removeAttr("disabled");
            wordList = HomeJs.buildSubjectList(subject,true);
            HomeJs.targetMap['subjectList'] = wordList;
            var bodyFontType = $("#userFont").val();
            HomeJs.targetMap['subjectFontType'] = bodyFontType;
            HomeJs.drawImageEvent(HomeJs.canvasId,wordList,bodyFontType,false,false); 
        
        }
    },buildSubjectList:function(content,bFinal){
        var wordList = [];
        var firstPositionX = HomeJs.subPositionX;
        var firstPositionY = HomeJs.subPositionY;
        
        var posX = HomeJs.subPositionX;
        var posY = HomeJs.subPositionY;
        var itemCnt = content.length;
        var betweenWordWidth = HomeJs.betweenSubWordWidth;
        var betweenWordHeight = HomeJs.betweenSubWordHeight;
        var height = HomeJs.subWordHeight;
        var width = HomeJs.subWordWidth;
        if(!bFinal){
            firstPositionX = HomeJs.tmpPositionX;
            firstPositionY = HomeJs.tmpPositionY;
        
            posX = HomeJs.tmpPositionX;
            posY = HomeJs.tmpPositionY;  

            betweenWordWidth = HomeJs.tmpBetweenWordWidth;
            betweenWordHeight = HomeJs.tmpBetweenWordHeight;

            height = HomeJs.tmpSubWordHeight;
            width = HomeJs.tmpSubWordWidth;
        }
        var line = 1;
        for(var index=0;index<itemCnt;index++){
            var word = content[index];
            var wordMap = {'index':index,'type':'S','word':word,'posX':posX,'posY':posY,'width':width,'height':height,'line':line};
            wordList.push(wordMap);
            if(index+1<itemCnt){
                if(posY+betweenWordHeight <= HomeJs.intCanvasHeight-HomeJs.subWordHeight){
                    if(word == " "){
                        posY = posY + betweenWordHeight/2;  
                    }else{
                        posY = posY + betweenWordHeight;    
                    }
                    
                }else{
                    if(posX + betweenWordWidth >= 0){
                        posX = posX - betweenWordWidth;
                        posY = firstPositionY;
                        line = line + 1;
                    }else{
                        break;
                    }
                }
            }
        }
        return wordList;
    },btnSubPositionChangeEvent:function(init){
        HomeJs.clearImageDiv(HomeJs.canvasId3);
        var content = HomeJs.targetMap['content'];
        var itemCnt = content.length;
        if(itemCnt>0){
            var wordList = HomeJs.targetMap['wordList'];
            var wordCnt = wordList.length;
            var bodyFontType = $("#bodyFont").val();
            //var fixedSpace = $("#fixWordHeight")[0].checked;
            var fixedSpace = true;
            var fixHeight = true;
            if($("#fixWordHeight")[0].checked){
                fixHeight = false;
            }
            for(var indexI = 0;indexI<wordCnt;indexI++){
                var wordMap = wordList[indexI];
                HomeJs.createImage(HomeJs.canvasId3,bodyFontType,wordMap,fixedSpace,fixHeight);
            }
        }
        var subject = HomeJs.targetMap['subject'];
        itemCnt = subject.length;
        if(itemCnt>0){
            var subjectList = HomeJs.targetMap['subjectList'];
            var fixedSpace = true;
            var fixHeight = true;
            if(init){
                HomeJs.tmpSubjectList = HomeJs.clone(subjectList);
                fixedSpace = false;
            }else{
                subjectList = HomeJs.tmpSubjectList;
                //fixHeight = true;
            }
            var wordCnt = subjectList.length;
            var userFontType = $("#userFont").val();  
            HomeJs.targetMap['subjectFontType'] = userFontType; 
            for(var indexI = 0;indexI<wordCnt;indexI++){
                var wordMap = subjectList[indexI];
                var word = wordMap['word'];
                HomeJs.createImage(HomeJs.canvasId3,userFontType,wordMap,fixedSpace,fixHeight);
            }
        }
    },clone:function(list){
        var newList = [];
        if(list == undefined) return newList;
        var itemCnt = list.length;
        for(var index=0;index<itemCnt;index++){
            var oRec = list[index];
            newList.push(oRec);
        }
        return newList;
    },cloneMap:function(map){
        var newMap = {};
        if(map == undefined) return newMap;
        $.each(map,function(key,value,map){
            newMap[key] = value;
        });
        return newMap;
    },drawTargetWord:function(){
        var tagSize = $("#contentModal").find("input:radio:checked[name=moveType]")[0].value;
        if(tagSize=="ONE"){
            if($("#targetWord").val()=="") return;
            var canvas = $("#"+HomeJs.canvasId2)[0];
            var ctx = canvas.getContext('2d');
            // Set the border color
            ctx.strokeStyle = 'red';
            var sIndex = $("#targetWord").val();
            // Set the border thickness
            ctx.lineWidth = 5;
            var index = parseInt(sIndex);
            // Draw the rectangle border
            var wordMap = HomeJs.tmpWordList[index];
            var posX = wordMap['posX'];
            var posY = wordMap['posY'];
            var width = wordMap['width'];
            var height = wordMap['height'];
            ctx.strokeRect(posX, posY, width, height);
        }
    },drawTargetSubWord:function(){
        var tagSize = $("#subjectModal").find("input:radio:checked[name=moveType]")[0].value;
        if(tagSize=="ONE"){
            if($("#targetSubWord").val()=="") return;
            var canvas = $("#"+HomeJs.canvasId3)[0];
            var ctx = canvas.getContext('2d');
            // Set the border color
            ctx.strokeStyle = 'red';
            var sIndex = $("#targetSubWord").val();
            // Set the border thickness
            ctx.lineWidth = 5;
            var index = parseInt(sIndex);
            // Draw the rectangle border
            var wordMap = HomeJs.tmpSubjectList[index];
            var posX = wordMap['posX'];
            var posY = wordMap['posY'];
            var width = wordMap['width'];
            var height = wordMap['height'];
            ctx.strokeRect(posX, posY, width, height);
        }
    }
};
  
 