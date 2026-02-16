var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");

determineUserType(usertype); 

getcompname_dynamic("Prebooking Delivery Monitoring Report", "titleHeading");
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
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Prebooking Delivery Monitoring Report');
        }
    });
}

var sourceDat;
function stockRequestSourceData(start, end){
    $('#stockRequest_TAB').hide();
    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
        backdrop: true
        // closeButton: false
    });
    var botboxMsg = '';
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_BTDT_DELIVERMONITORING", "start":start, "end":end, "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: false,          
        success: function(r){ 
            if(r.lenght != 0){ 
                sourceDat = r;
                dialog.modal('hide');
                $('#stockRequest_TAB').show();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            botboxMsg = '<b class="text-danger">Ops! Something went wrong!</b><br/>' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!';
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                }, 1000);
            });
        }
    }).done(function () {
        dialog.init(function(){
            setTimeout(() => {
                dialog.modal('hide');
            }, 1000);
        });
    });
}

datePicker();
var startPickDate, endPickDate;
function datePicker(){
    var start = moment().subtract(29, 'days');
    var end = moment();

    $('#reportrange1').daterangepicker({
        "alwaysShowCalendars": true,
        "startDate": start,
        "endDate": end,
        "applyClass": "btn-primary",
        "autoApply": false,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, function(start, end, label) {
        if(start.format('MMMM D, YYYY') == end.format('MMMM D, YYYY')){
            let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            let dayOfWeek = days[(new Date(start.format('MMMM D, YYYY'))).getDay()];
            $('#reportrange1 span').html(dayOfWeek + ' | '+start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        } else{
            $('#reportrange1 span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }
        startPickDate = start.format('YYYY-MM-DD');
        endPickDate = end.format('YYYY-MM-DD')
    });
        

    $('#reportrange1').on('apply.daterangepicker', function(ev, picker) {
        $('#stockRequest_TAB').hide();
        var start = picker.startDate.format('YYYY-MM-DD');
        var end = picker.endDate.format('YYYY-MM-DD');
        stockRequestSourceData(start, end);
        
        tableData.clear().rows.add(sourceDat).draw();
    });
}

datatableApp();
var tableData;
function datatableApp(){
    tableData = $('#stockRequest_TAB').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "responsive": true,
        "data": sourceDat,
        "scrollX": true,
        "ordering": true,
        "language": {
            "search": "<i class='fa-solid fa-magnifying-glass search-icon'></i>",
            "searchPlaceholder": "Search",
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "Salesman", title: "Salesman" },
            { data: "Customer", title: "Customer" },
            { data: "transactionID", title: "Transaction ID" },
            { data: "stockCode", title: "Stock Code" },
            { data: "QUANTITY ORDERED UM", title: "Qty Ordered UoM" },
            { data: "QUANTITY ORDERED IN PCS", title: "Qty Ordered PCS" },
            { data: "DATE ORDERED", title: "Date Orderded" },
            { data: "DRIVER", title: "Driver" },
            { data: "QUANTITY DELIVERED UM", title: "Qty Delivered UoM" },
            { data: "QUANTITY DELIVERED IN PCS", title: "Qty Delivered PCS" },
            { data: "DATE DELIVERED", title: "Date Delivered" },
            { 
                data: "STATUS (DELIVERED OR CANCELLED)", 
                title: "Status",
                render: function(data, type, row){
                    if(data == 'D'){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:60px; font-size:9px; text-align:center; color: #22bb33; border: 1px solid #22bb33; background-color: #caf8d2;'>Delivered</span>`
                    } else if (data == 'c'){
                        return `<span class="badge rounded-pill py-1 mx-2" style='width:60px; font-size:9px; text-align:center; color: #df3639; border: 1px solid #df3639; background-color: #efcdc4;'>Cancelled</span>`;
                    } else {
                        return '';
                    }
                }
            },

        ],
        buttons: [ 'excel', 'print', 'copy' ],
        columnDefs: [
            {
                targets: [4,5,8,9,10],
                className: 'dt-body-center'
            },
        ],
        rowCallback: function(row, data, index){

            // var duration = data.duration.toString();
            // var converted_h = convertHoursToDHm(duration);
            // console.log(duration +' '+converted_h);
            // $(row).find('td:eq(8)').html(converted_h);
               
        }
    });

    $('#excelBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-excel').trigger('click');
    });
    $('#printBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-print').trigger('click');
    });
    $('#copyBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-copy').trigger('click');
    });
}

function convertHoursToDHm(totalMinutes) {
   const totalSeconds = Math.round(totalMinutes * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSecondsAfterHours = totalSeconds - hours * 3600;
  const minutes = Math.floor(remainingSecondsAfterHours / 60);
  const seconds = remainingSecondsAfterHours % 60;

  if(hours < 1){
    return  minutes + 'min ' + seconds + 'sec';
  }else{
     return hours +'hr '+ minutes + 'min '+ seconds + 'sec';
  }
  
}

function updateStockReq(refNo, mdCode, stockCode){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"updateStockRequest",
            "refNo": refNo,
            "mdCode":mdCode,
            "stockCode":stockCode,
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "html",
        crossDomain: true,
        cache: false,           
        async: false, 
        success: function(r){
            if(r != 0){
                alert('Something went wrong! ERROR: ' + r);
            }
        }//success
    });
}
        
function getJobberData(){
    var salesman = $('#salesmanList').val();
    var date = $('#jobberDate').val();
         
    $('#selectedDate').html(date);
    $('#prepBy').html($('#salesmanList option:selected').text());
          
    $.ajax ({
        url: "../nestle/sqlApi_"+user+".php",
        type: "GET",
        data: {"type":"jobberRequest", "salesman": salesman, "date":date},
        dataType: "html",
        crossDomain: true,
        cache: false,            
        success: function(response){ 
            $('#jobberTableBody').html(response);
        }//success
    });
}

    
$("#btn-print").click(function () {
    var salesman = $("#salesmanList option:selected").text();
    var selectedSalesman = $("#salesmanList").val();
    var date = $('#jobberDate').val();
    var datePrinted = new Date().toLocaleString();

    if(selectedSalesman == ''){
        alert('Please select date first!');
    }else{
        $('#printThisTable').printThis({
            importCSS: true,
            header: "<div>"+salesman+"<small class='pull-right'> Date Created: "+datePrinted+"</small></div>",
            pageTitle: "JOBBER FULL OUT FORM",
            printContainer: true,
            copyTagClasses: true
        });
    }      
}); 

function printData(){
    window.print();
}

$('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
    // Get the search term from the input field
    var searchTerm = $(this).val();

    tableData.search(searchTerm).draw();
});