$(document).ready(function(){
   
    dateTimeFormat= 'yyyy-MM-dd HH:mm';
    
    $("#createTimesheet").hide();
    
    var rDate = trim($(".date").val());
    if (rDate == '') {
        $(".date").val(dateDisplayFormat);
    }

    //Bind date picker
    daymarker.bindElement(".date",
    {
        onSelect: function(date){


            $(".date").trigger('change');
        },
        dateFormat:jsDateFormat
    });

    $('#DateBtn').click(function(){


        daymarker.show(".date");


    });
  
    $(".date").change(function() {
        $('#validationMsg').removeAttr('class');
        $('#validationMsg').html("");
        var startdate=$(".date").val();
      
        if(startdate.isValidDate()){
         
            var endDate= calculateEndDate(Date_toYMD()); 
         
            var startDate = new Date(startdate);
            var newEndDate= new Date(endDate);

           
            
            if (newEndDate < startDate)
            { 
                $('#validationMsg').attr('class', "messageBalloon_failure");
                $('#validationMsg').html("It is Not Possible to Create Future Timesheets");
            }else{
             
        
                url=createTimesheet+"?startDate="+startdate+"&employeeId="+employeeId
                $.getJSON(url, function(data) {
                
                    if(data[0]==1){
                        $('#validationMsg').attr('class', "messageBalloon_failure");
                        $('#validationMsg').html("Timesheet Overlaps with Existing Timesheets");
                    }
                    if(data[0]==3){
                        $('#validationMsg').attr('class', "messageBalloon_failure");
                        $('#validationMsg').html("Timesheet Already Exists"); 
                    }
                    if(data[0]==2){
                        startDate=data[1].split(' ');
                        $('form#createTimesheetForm').attr({
                            
                            //action:linkForViewTimesheet+"?state=SUBMITTED"+"&date="+date
                            action:linkForViewTimesheet+"?&timesheetStartDateFromDropDown="+startDate[0]+"&employeeId="+employeeId
                        });
                        $('form#createTimesheetForm').submit();
                    }
        
        
                })
            //            }
            //            else{
            //                $('#validationMsg').attr('class', "messageBalloon_failure");
            //                $('#validationMsg').html("Invalid Start date");
            //            }
            
        
                
            }
        }
        else{
            $('#validationMsg').attr('class', "messageBalloon_failure");
            $('#validationMsg').html("Invalid date");
        }
    });
    
    

    $("#commentDialog").dialog({
        autoOpen: false,
        width: 350,
        height: 225
    });

    $("#btnEdit").click(function(){
        $('form#timesheetFrm').attr({
            action:linkForEditTimesheet+"?employeeId="+employeeId+"&timesheetId="+timesheetId+"&actionName="+actionName
        });
        $('form#timesheetFrm').submit();
    });

    $("#btnSubmit").click(function(){
     
        $('form#timesheetFrm').attr({
            //action:linkForViewTimesheet+"?state=SUBMITTED"+"&date="+date
            action:linkForViewTimesheet+"?state="+submitNextState+"&timesheetStartDate="+date+"&employeeId="+employeeId+"&submitted="+true+"&updateActionLog="+true
        });
        $('form#timesheetFrm').submit();
    });

    $("#btnReject").click(function(){
       
        if(validateComment()){

            $('form#timesheetFrm').attr({
                //action:linkForViewTimesheet+"?state=REJECTED"+"&date="+date
                action:linkForViewTimesheet+"?state="+rejectNextState+"&timesheetStartDate="+date+"&employeeId="+employeeId+"&updateActionLog="+true
            });
            $('form#timesheetFrm').submit();
        }
    });

    $("#btnReset").click(function(){
        $('form#timesheetFrm').attr({
            //action:linkForViewTimesheet+"?state=SUBMITTED"+"&date="+date
            action:linkForViewTimesheet+"?state="+resetNextState+"&timesheetStartDate="+date+"&employeeId="+employeeId+"&updateActionLog="+true+"&resetAction="+true
        });
        $('form#timesheetFrm').submit();
    });

    $("#btnApprove").click(function(){
        if(validateComment()){
            $('form#timesheetFrm').attr({
                //action:linkForViewTimesheet+"?state=APPROVED"+"&date="+date
                action:linkForViewTimesheet+"?state="+approveNextState+"&timesheetStartDate="+date+"&employeeId="+employeeId+"&updateActionLog="+true
            });
            $('form#timesheetFrm').submit();
        }
    });
    $("#commentCancel").click(function() {
        $("#commentDialog").dialog('close');
    });
    $("#btnAddTimesheet").click(function(){
        $("#createTimesheet").show();
    });

    //$('#txtComment').change(function() {
    //
    //
    //    var flag= validateComment();
    //
    //    if(!flag) {
    //        $('#btnApprove').attr('disabled', 'disabled');
    //        $('#btnReject').attr('disabled', 'disabled');
    //        $('#validationMsg').attr('class', "messageBalloon_failure");
    //    }
    //    else{
    //        $('#btnApprove').removeAttr('disabled');
    //        $('#btnReject').removeAttr('disabled');
    //        $("#txtComment").removeAttr('style');
    //    }
    //
    //
    //});


    $(".icon").click(function(){

        $("#timeComment").attr("disabled","disabled");
        //removing errors message in the comment box
        $("#commentError").html("");
        var array = ($(this).attr('id')).split('##');
        timesheetItemId = array[0];

        var comment = getComment(timesheetItemId);
        var decoded = $("<div/>").html(comment).text();
        $("#timeComment").val(decoded);
        $("#commentProjectName").text(":"+" "+array[1]);
        $("#commentActivityName").text(":"+" "+array[2]);
        $("#commentDate").text(":"+" "+date);
        $("#commentDialog").dialog('open');


    });



});


var timesheetItemId;
var question;
//var date;
var close= "close";

function clicked(dropdown){

    var selectedIndex = document.getElementById('startDates').value;
    var dateString = document.getElementById('startDates').options[selectedIndex].text;
    var dates = dateString.split(" ");

    location.href = linkForViewTimesheet+"?timesheetStartDateFromDropDown="+dates[0]+"&selectedIndex="+selectedIndex+"&employeeId="+employeeId;

}

function getComment(timesheetItemId){
    var r = $.ajax({
        type: 'POST',
        url: linkToViewComment,
        data: "timesheetItemId="+timesheetItemId,
        async: false,

        success: function(msg){
            var array = msg.split('##');
            question = array[0];
            date = array[1];

        }
    });
    return question;
}

function viewComment(e){

    $("#timeComment").attr("disabled","disabled");
    //removing errors message in the comment box
    $("#commentError").html("");
    var array = ($(e.target).attr('id')).split('##');
    timesheetItemId = array[0];
    var comment = getComment(timesheetItemId);
    $("#timeComment").val(comment);
    $("#commentProjectName").text(":"+" "+array[1]);
    $("#commentActivityName").text(":"+" "+array[2]);
    $("#commentDate").text(":"+" "+date);
    $("#commentDialog").dialog('open');

}








function validateComment(){

    errFlag1 = false; 
    $('#btnApprove').removeAttr('disabled');
    $('#btnReject').removeAttr('disabled');
    $("#txtComment").removeAttr('style');

    $('#validationMsg').removeAttr('class');
    $('#validationMsg').html("");

    var errorStyle = "background-color:#FFDFDF;";

    if ($("#txtComment").val().length > 250) {
        $('#btnReject').attr('disabled', 'disabled');
        $('#btnApprove').attr('disabled', 'disabled');
        $('#validationMsg').attr('class', "messageBalloon_failure");
        $('#validationMsg').html(erorrMessageForInvalidComment);
        $("#txtComment").attr('style', errorStyle);

        errFlag1 = true;
    }

    return !errFlag1;

}


String.prototype.isValidDate = function() {
    var IsoDateRe = new RegExp("^([0-9]{4})-([0-9]{2})-([0-9]{2})$");
    var matches = IsoDateRe.exec(this);
    if (!matches) return false;
  

    var composedDate = new Date(matches[1], (matches[2] - 1), matches[3]);

    return ((composedDate.getMonth() == (matches[2] - 1)) &&
        (composedDate.getDate() == matches[3]) &&
        (composedDate.getFullYear() == matches[1]));

}

function calculateEndDate(startDate){

    var r = $.ajax({
        type: 'POST',
        url:  returnEndDate,
        data: "startDate="+startDate,
        async: false,

        success: function(msg){
           
            var array = msg.split(' ');
            date1 = array[0];
           
        }
        
    });
   
    return date1;
  

        
}



function Date_toYMD() {
    var dt=new Date();
    var year, month, day;
    year = String(dt.getFullYear());
    month = String(dt.getMonth() + 1);
    if (month.length == 1) {
        month = "0" + month;
    }
    day = String(dt.getDate());
    if (day.length == 1) {
        day = "0" + day;
    }
    return year + "-" + month + "-" + day;
}
