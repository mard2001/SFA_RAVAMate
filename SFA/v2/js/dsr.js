var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var dssdate;
var myOptions;
var printCompany, printSalesman, printDate;
determineUserType(usertype);

var todaysAch_dailyTarget = 0.0;
getcompname_dynamic("DSR", "titleHeading");
// getcompname();
function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' | DSR');
            printCompany = r[0].company.toUpperCase()
        }
    });
} 

console.log(user);
loadSalesman();

dsspicker();
function dsspicker(){
    $('#dsrDateSpan').html('Pick a date <span class="mdi mdi-menu-down"></span>');
    $('#dssdatePicker').daterangepicker({
        "singleDatePicker": true,
        "startDate": moment(),
        "endDate": moment(),
        "maxDate": moment(),
        "opens": "left" 
    }, function(start, end, label) {
        dssdate = start.format('YYYY-MM-DD');
        var today = moment().format('YYYY-MM-DD');
        $('#dsrDate').val(dssdate);
        let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        let daysfull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let formattedDate = formatDate(dssdate);
        let dayOfWeek = days[(new Date(dssdate)).getDay()];
        let dayOfWeekfull = daysfull[(new Date(dssdate)).getDay()];
        $('#dsrDateSpan').html('<b>'+dayOfWeek+'</b> | '+ formattedDate + ' <span class="mdi mdi-menu-down"></span>');
        printDate = formattedDate + ' ('+ dayOfWeekfull +')';
        if(!($("#salesmanList").val())){
            $("#myDropdown").toggleClass("showDropdown");
        }
        
    });
}

// $("#printThisTable").show();

$("#printButton").click(function () {
    var selectedSalesman = $("#salesmanList").val();
    var date = $('#dsrDate').val();

    if(date == ''){
        Swal.fire({
            text: "Please select a date first.",
            icon: "info"
        });
    }else if(!selectedSalesman){
        Swal.fire({
            text: "Please select a salesman first.",
            icon: "info"
        });
    } else{
        $('.printTableHeader').show();
        $('#nutriDSR-container').addClass("removeTopMargin");
        $('#printButton').hide();
        $('#generateBtn').hide();
        $('.hideThis-header').hide();
        $('.fdc-image').hide();
        $('.removeThisHeader').hide();
        $('#filterButton').hide();
        $('.menubtn').hide();
        $('#defaultrightHeader .dropdown').hide();
        $('#printCompany').html(printCompany);
        $('#printSalesman').html(printSalesman);
        $('#printDate').html(printDate);
        window.focus();
        window.print();

        $('.removeThisHeader').show();
        $('.fdc-image').show();
        $('#printButton').show();
        $('#generateBtn').show();
        $('.hideThis-header').show();
        $('#nutriDSR-container').removeClass("removeTopMargin");
        $('#filterButton').show();
        $('.menubtn').show();
        $('#defaultrightHeader .dropdown').show();
        $('.printTableHeader').hide();
    }
});

VirtualSelect.init({
    ele: '#salesmanList',
});

function loadSalesman(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"get_all_salesman_georeset", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(data){ 
            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].mdSalesmancode+'_'+data[x].Salesman, value: data[x].mdCode };
                myOptions.push(obj);
            }

            document.querySelector('#salesmanList').destroy();
            VirtualSelect.init({
                ele: '#salesmanList',
                options: myOptions,
                search: true,
                keepAlwaysOpen: true,
                placeholder: 'Select Salesman'
            });
        }
    });
}

function todaysProductive(){
    var salesman = $('#salesmanList').val();
    var date = $('#dsrDate').val();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"todayProductive",
            "salesman": salesman,
            "date":date,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "html",
        crossDomain: true,
        cache: false,            
        success: function(response){ 
            var data = [], productive = 0;
            data = JSON.parse(response);
            productive = (data[1].actual / data[0].target) * 100;
            $("#targetTPC").html(data[0].target);
            $("#actualTPC").html(data[1].actual);
            $("#percentProd").html(productive.toFixed(2) +'%');
        }
    });
}

function sellingDays(){
    var salesman = $('#salesmanList').val();
    var date = $('#dsrDate').val();
    var numericMonth = new Date(date).getMonth() + 1;
    var targetData = 0.0;
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"sellingDays",
            "salesman": salesman,
            "date":date,
            "numericMonth":numericMonth,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        async: false,            
        success: function(data){ 
            var montly = parseInt(data.amount);
            var balance = data.day - data.actualDays;
            var mtdSales = parseFloat(Number(data.mtdSales.sales).toFixed(2)).toLocaleString();
            var mtdPercent = (parseFloat(Number(data.mtdSales.sales).toFixed(2)) / parseFloat(montly)) * 100;
            var balanceToSell = montly - parseFloat(Number(data.mtdSales.sales).toFixed(2));
            var daliySalesTarget = parseFloat(Number(montly / data.day).toFixed(2)).toLocaleString();
            var lapse = data.day - balance - data.actualDays;

            //assign the daily target to use as global variable
            targetData = parseFloat((montly / data.day).toFixed(2));
            $("#targetSellingD").html(data.day);
            $("#monthSalesTarget").html(montly.toLocaleString());
            $("#actualSellingD").html(data.actualDays);
            $("#balanceSellingD").html(balance);
            $("#mtdActualSales").html(mtdSales);
            $("#mtdActPercent").html(mtdPercent.toFixed(2) + '%');
            $("#balanceToSell").html(Number(balanceToSell.toFixed(2)).toLocaleString());
            $("#daliySalesTarget").html(daliySalesTarget);
            $("#lapesSellingD").html(lapse);

            console.log('monthly: ' + montly + '\nday: ' + data.day + '\ntargetData: ' + targetData);
        }
    });
    todaysAch_dailyTarget = targetData;
}

function getDsrData_average(){
    var salesman = $('#salesmanList').val();
    var date = $('#dsrDate').val();
    var dataAve = 0;
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"dsr_average", "salesman": salesman, "date":date, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "html",
        crossDomain: true,
        cache: false,
        async: false,            
        success: function(response){ 
            // var data = [];
            var data = JSON.parse(response);
            var average = parseFloat(Number(data.average).toFixed(2)).toLocaleString();
            //var todaysArch = (parseFloat(Number(data.average).toFixed(2)) / todaysAch_dailyTarget) * 100;
            dataAve = parseFloat(Number(data.average).toFixed(2));
            $("#average").html(average);
        }
    });
    dataAverage = dataAve;
}

function monthToDatePRD(){
    var salesman = $('#salesmanList').val();
    var date = $('#dsrDate').val();
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"monthToDatePRD", "salesman": salesman, "date":date, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "html",
        crossDomain: true,
        cache: false,
        async: false,            
        success: function(response){ 
            // var data = [];
            var data = JSON.parse(response);
            var active = data.active.active;
            var target = data.target.target;
            var prdPercent = (active / target) * 100;
            var balance = target - active;
                
            $("#mtdTarget").html(active);
            $("#mtdActive").html(target);
            $("#mtdPrdPercent").html(prdPercent.toFixed(2) + '%');
            $("#mtdBalance").html(Math.abs(balance));
        }
    });
}

$('#notif-empty').hide();
function getDsrData(){
    var salesman = $('#salesmanList').val();
    var date = $('#dsrDate').val();

    
    if(date == ''){
        Swal.fire({
            text: "Please select a date first.",
            icon: "info"
        });
    }else if(!salesman){
        Swal.fire({
            text: "Please select a salesman first.",
            icon: "info"
        });
    }else{
        var name = document.querySelector('#salesmanList').getDisplayValue();
        var ajaxTime= new Date().getTime();
        var totalTime= 0;

        $('#generateBtn').html("<i class='fa fa-spin fa-spinner'></i> Generating..");
        $('#generateBtn').prop('disabled', true);
        // $('#generateBtn').css('background-color', "white");

        

        Swal.fire({
            html: "Please Wait... Generating Data...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                setTimeout(() => {
                    getDsrData_average();
                    todaysProductive();
                    sellingDays();
                    monthToDatePRD();

                    var todaysArch = (dataAverage / todaysAch_dailyTarget) * 100;
                    console.log('dataverage: ' + dataAverage +'\n'+'todaysAch_dailyTarget: ' + todaysAch_dailyTarget);
                    $("#todaysSalesAch").html(todaysArch.toFixed(2)+ '%');

                    $.ajax ({
                        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
                        type: "POST",
                        data: {"type":"dsr_data", "dsrSalesman": salesman, "dsrDate":date, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
                        dataType: "json",
                        crossDomain: true,
                        cache: false,            
                        success: function(response){ 
                            $('#printThisTable').hide();
                            if(response.delimeter == 0){
                                $('#defaultDiv').hide();
                                $('#notif-empty').show();
                                $('#notif-empty p').html('No data to show for salesman <br /> <strong style="font-size: 20px; color: #000;">' + name +'</strong> <br /> in <br /> <strong style="font-size: 20px; color: #000;">'+date+'</strong> <br /> Please select another salesman and date.');
                            }else{
                                $('#defaultDiv').hide();
                                $('#notif-empty').hide();
                                var sales = $(calculateAve);
                                $('#printThisTable').show();
                                $('#dsrSalesmanData').html(response.content);
                                $('#btsTotal').html(response.btsTotal);
                                $('#targetTotal').html(response.targetTotal);
                                totalTime = new Date().getTime()-ajaxTime;
                            }
                                
                            $('#generateBtn').html('<span class="mdi mdi-file-chart-outline"></span> Generate');
                            $('#generateBtn').prop('disabled', false);

                            Swal.close();
                        },error: function(XMLHttpRequest, textStatus, errorThrown) {
                            $('#generateBtn').html("Generate");
                            $('#generateBtn').prop('disabled', false);
                            Swal.fire({
                                icon: "error",
                                title: "NETWORK ERROR:",
                                html: "CONTACT SYSTEM ADMINISTRATOR! " + JSON.stringify(XMLHttpRequest.responseText)
                            });
                        }
                    });
                }, 1000);
            },
        });
    }//else close
}


function calculateAve(){
    var sum = 0;
    // iterate through each td based on class and add the values
    $(".sales").each(function() {
        var value = $(this).text();
        // add only if the value is number
        if(!isNaN(value) && value.length != 0) {
            sum += parseFloat(value);
        }
    });
}

function formatDate(dateString) {
    let date = new Date(dateString);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function dropDown() {
    $("#myDropdown").toggleClass("showDropdown");
}

$('#dsrDate').on('input', function() {
    var selectedDate = $(this).val();
    if (selectedDate !== '') {
        $('.dropdown-toggle').removeClass("show");
        $('.dropdown-menu').removeClass("show");
        $('.dropdown-toggle').attr('aria-expanded', 'false');
    }
});


$('#salesmanList').on('change', function() {
    var selectedSalesman = $(this).val();
    var name = document.querySelector('#salesmanList').getDisplayValue();
    if (selectedSalesman !== '') {
        $('#myDropdown').removeClass("showDropdown");
        $('#tableTitle').html(name);
        printSalesman = name;
    }
});

