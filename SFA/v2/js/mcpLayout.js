var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var sourceDat;
var startPickDate, endPickDate;
var tableData;
var LOCALLINK = "https://php-7.4.ravamate.com"


VirtualSelect.init({
    ele: '#mcp_daysval',
});

VirtualSelect.init({
    ele: '#mcp_weekvisited_f3',
});


determineUserType(usertype); 

// getcompname();
getcompname_dynamic('MCP Layout', 'titleHeading');

VirtualSelect.init({
    ele: '#salesmanSelectList'
});

VirtualSelect.init({
    ele: '#mcp_daysval',
    search: true,
    width: '100%', 
    placeholder: 'Select Specific days',
    multiple: true,
    maxValues: 2
});

VirtualSelect.init({
    ele: '#mcp_weekvisited_f3',
    search: true,
    width: '100%', 
    placeholder: 'Select Specific weeks',
    maxValues: 3
});

VirtualSelect.init({
    ele: '#filter_daysOfVisit',
    search: true,
    maxWidth: '100%',
    multiple: true
});

VirtualSelect.init({
    ele: '#filter_WeekVisited',
    search: true,
    maxWidth: '100%',
    multiple: true
});

VirtualSelect.init({
    ele: '#filter_MCPStatus',
    search: true,
    maxWidth: '100%',
    multiple: true
});

VirtualSelect.init({
    ele: '#filter_ActiveFlag',
    search: true,
    maxWidth: '100%',
    multiple: true
});

setTimeout(() => {
    Swal.close();   
}, 1000);

function loadSalesman() {
    $.ajax({
        url: GLOBALLINKAPI+'/connectionString/applicationipAPI.php',
        type: "POST",
        data:{
            "type": "get_all_salesman_bohol",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function (data) {
            document.querySelector('#salesmanSelectList').destroy();
            
            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].Salesman, value: data[x].mdSalesmancode };
                myOptions.push(obj);
            }
            VirtualSelect.init({
                ele: '#salesmanSelectList',
                options: myOptions,
                search: true,
                maxWidth: '100%', 
                placeholder: 'Select Specific Salesman'
            });
            setTimeout(() => {
                Swal.close();   
            }, 1000);
        }
    });
}

function loadCustomer(start, end, mdCode) {
    $.ajax({
        url: LOCALLINK + API_ENDPOINT,
        type: "GET",
        data:{
            "type": "stockTake_Customer",
            "CONN": con_info,
            "startdate": start,
            "salesman": mdCode,
            "enddate": end
        },
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function (data) {
            document.querySelector('#customerSelectList').destroy();
            
            var myOptions = [];
            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].custName, value: data[x].custCode };
                myOptions.push(obj);
            }
            VirtualSelect.init({
                ele: '#customerSelectList',
                options: myOptions,
                search: true,
                multiple: true,
                maxWidth: '100%', 
                placeholder: 'Select Specific Customer'
            });
            setTimeout(() => {
                Swal.close();   
            }, 1000);
        }
    });
}

function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' | MCP Layout');
        }
    });
} 

$('.loading-table').hide();
function stockRequestSourceData(salesman){
    $('#filterReport').modal('hide');
    $('#stockRequest_TAB').hide();
    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
        backdrop: true
    });
    var botboxMsg = '';
    $.ajax ({
        url: GLOBALLINKAPI+'/connectionString/applicationipAPI.php',
        type: "POST",
        data: {
            type: "GET_MNC_CUST_F_LAYOUT_LST",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            salesman: salesman,
        },  
        dataType: "JSON",
        crossDomain: true,
        cache: false,  
        success: function(r){ 
            sourceDat = r;
            initializeFiltration(sourceDat);
            $('#stockRequest_TAB').show();
            tableData.clear().rows.add(sourceDat).draw();
            dialog.modal('hide');
        },//success
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            botboxMsg = '<b class="text-danger">Ops! Something went wrong!</b><br/>' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!';
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
                }, 1000);
            });
        }
    }).done(function () {
        setTimeout(() => {
            dialog.modal('hide');
        }, 1000);
    });
}

datePicker();
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
            // $('#reportrange1 span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            // startPickDate = start.format('YYYY-MM-DD');
            // endPickDate = end.format('YYYY-MM-DD');
            if(start.format('MMMM D, YYYY') == end.format('MMMM D, YYYY')){
                let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
                let dayOfWeek = days[(new Date(start.format('MMMM D, YYYY'))).getDay()];
                $('#reportrange1 span').html('<b>'+dayOfWeek+'</b> | '+ start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            } else{
                $('#reportrange1 span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            }
            $('#dateSelected').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            startPickDate = start.format('YYYY-MM-DD');
            endPickDate = end.format('YYYY-MM-DD');

    });

    $('#reportrange1').on('apply.daterangepicker', function(ev, picker) {
        // loadSalesman(startPickDate, endPickDate);
        Swal.fire({
            html: "Please Wait... Fetching Salesman...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        // $('#stockRequest_TAB').hide();
        // var start = picker.startDate.format('YYYY-MM-DD');
        // var end = picker.endDate.format('YYYY-MM-DD');
        // startPickDate = start;
        // endPickDate = end;
        // stockRequestSourceData(startPickDate, endPickDate);
        // tableData.clear().rows.add(sourceDat).draw();
    });


}


loadSalesman();

// $('#salesmanSelectList').on('change', function () {
//     let selectedValue = $(this).val();
//     if (selectedValue) {
//         // Perform your action here
//         loadCustomer(startPickDate, endPickDate, selectedValue);
//         Swal.fire({
//             html: "Please Wait... Fetching Customers...",
//             timerProgressBar: true,
//             allowOutsideClick: false,
//             didOpen: () => {
//                 Swal.showLoading();
//             },
//         });
//         $('.customerFilterDiv').show();
//     }
// });


$('#filterReportBtn').on('click', function() {

    var salesmanCode = $('#salesmanSelectList').val();
  
    if(!salesmanCode){
        Swal.fire({
            text: "Please select a salesman",
            icon: "error"
        });
        return;
    } 

    stockRequestSourceData(salesmanCode);
});

$('#mcp_timevisit').bootstrapMaterialDatePicker({
    date: false,
    format: 'HH:mm',
    time: true
    
});

datatableApp();
function datatableApp(){
    tableData = $('#stockRequest_TAB').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><"currentWeekNumber"><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "responsive": true,
        "data": sourceDat,
        "scrollX": true,
        "ordering": true,
        "language": {
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            }
        },
        columns: [
            { data: "salesman", title:"Salesman" },
            { data: "frequency", title:"Frequency" },
            { data: "daysofVisittext", title:"Days of Visit" },
            { data: "weekVisitedtext", title:"Week Visited" },
            { data: "timeofVisit", title:"Time of Visit" },
            { data: "custCode", title:"CustCode" },
            { data: "custName", title:"CustName"},
            { data: "Addresss", title:"Address" },
            { data: "lastUpdated", title:"Last Updated" },
            { data: "isActivetext", title:"MCP Status" },
            { 
                data: "custStatusval", 
                title:"Active Flags",
                render: function(data, type) {
                    if (data && data == "Yes"){
                        return '<b style="color: green !important;">Yes</b>';
                    } else{
                        return '<b style="color: red !important;">No</b>';
                    }
                }
            },
        ],
        buttons: [
            {
                extend: 'print',
                text: 'print',
            },
            {
                extend: 'excelHtml5',
                text: 'Excel',
                title: '',
                filename: function(){
                    var firstCell = tableData.cell(0, 0).data();
                    if (!firstCell) firstCell = "export";

                    return firstCell + '_MCP Layout - '+ moment().format("DD-MMM-YYYY");
                },
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5]  
                },
                customize: function ( xlsx ) {
                    var sheet = xlsx.xl.worksheets['sheet1.xml'];

                    $('row c[r="A1"] t', sheet).text('Salesman');
                    $('row c[r="B1"] t', sheet).text('Frequency');
                    $('row c[r="C1"] t', sheet).text('Days of Vist');
                    $('row c[r="D1"] t', sheet).text('Week Visited');
                    $('row c[r="E1"] t', sheet).text('Time of Visit');
                    $('row c[r="F1"] t', sheet).text('CustCode');

                    $('row:first c', sheet).attr('s', '2');
                },
                action: function(e, dt, button, config) {
                    var that = this;

                    Swal.fire({
                        icon: 'info',
                        title: "Are you sure?",
                        html: 'You want to export filtered salesman MCP layout? <br />Press Okay to continue.',
                        showCancelButton: true,
                        confirmButtonText: "Okay",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $('.loading').fadeIn();
                            setTimeout(function () {
                                $.fn.dataTable.ext.buttons.excelHtml5.action.call(that,e, dt, button, config);
                                $('.loading').fadeOut();
                            },500);
                        }
                    });
                },
            },
        ],
        columnDefs: [
            {
                targets: [1, 3, 5],
                className: 'dt-body-center'
            },
        ],
        rowCallback: function(row, data, index){
            
        },
        
    });
    $('#excelBtn').on('click', function() {
        $('.buttons-excel').trigger('click');
    });
    $('#printBtn').on('click', function() {
        $('.buttons-print').trigger('click');
    });
    $('#copyBtn').on('click', function() {
        $('.buttons-copy').trigger('click');
    });
    $('#dlTempBtn').on('click', function() {
        // Swal.fire({
        //     text: "The template is currently being prepared and will be released soon.",
        //     icon: "info"
        // });
        window.location.href = 'https://ravamate.com/template/mcplayout_template.csv';
    });
    $('#uploadTempBtn').on('click', function() {
        $('#uploadCsv').modal('show');
    });
    $('#filterResultsBtn').on('click', function() {
        $('#filterResultsModal').modal('show');
    });

    var weekNum = moment().week();
    var isEven = weekNum % 2 === 0 ? "Even" : "Odd";

    $('.currentWeekNumber').html("<h6 style='padding: 20px 0 0 20px;'>Today's Week No: <b>" + weekNum + "</b> (" + isEven + " week)</h6>" );
    $('.updateModalcurrentWeekNumber').html("Note: Today's Week No: <b>" + weekNum + "</b> (" + isEven + " week)" );
}
$('#stockRequest_TAB tbody').on('click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData.row(tr);
        viewDetails(row.data());
});

function viewDetails(r){

    var cont = `<tr>
                    <td>Salesman</td>
                    <td>`+r.salesman+`</td>
                </tr>
                <tr>
                    <td>CustCode</td>
                    <td>`+r.custCode+`</td>
                </tr>
                <tr>
                    <td>Customer</td>
                    <td>`+r.custName+`</td>
                </tr>
                <tr>
                    <td>Address</td>
                    <td>`+r.Addresss+`</td>
                </tr>
                <tr>
                    <td>Last Updated</td>
                    <td>`+r.lastUpdated+`</td>
                </tr>
                <tr>
                    <td>Status</td>
                    <td>`+r.isActivetext+`</td>
                </tr>
                
                 <tr>
                    <td>Frequency</td>
                    <td>`+r.frequency+`</td>
                </tr>
                 <tr>
                    <td>Days of Visit</td>
                    <td>`+r.daysofVisittext+`</td>
                </tr>
                 <tr>
                    <td>Week Visited</td>
                    <td>`+r.weekVisitedtext+`</td>
                </tr>
                 <tr>
                    <td>Time of Visit</td>
                    <td>`+r.timeofVisit+`</td>
                </tr>`;

    $('#salesmanselGBLval').val(r.salesman);
    $('#custselGBLval').val(r.custCode);

    $('#basiccustdetails').html(cont);
    $('#mcpmoduleModal').modal('show');
}

$('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
    // Get the search term from the input field
    var searchTerm = $(this).val();

    tableData.search(searchTerm).draw();
});
    
$('#printBtn').on('click', function() {
    if ( ! tableData.data().any() ) {
        alert( 'No data to print!' );
    }else{
        // loadSalesman(startPickDate, endPickDate);
        $('#salesmanListModal').modal('show');
    }
});

$("#btn-print").click(function () {
    var salesman = $("#salesmanList option:selected").text();
    var selectedSalesman = $("#salesmanList").val();
    var date = $('#jobberDate').val();
    var datePrinted = new Date().toLocaleString();

    if(selectedSalesman == ''){
        alert('Please select date first!');
    }else{
        //printData();
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

// emptyfields_mcp();
function emptyfields_mcp(){
    $('#mcp_freqval').val('');
    $('#mcp_daysval')[0].virtualSelect.reset();
    $('#mcp_weekvisited_f3')[0].virtualSelect.reset();
    $('#mcp_timevisit').val('');

    //  document.querySelector('#mcp_weekvisited').destroy();
    //  document.querySelector('#mcp_daysval').destroy();

    //  VirtualSelect.init({
    //     ele: '#mcp_daysval',
    //     search: true,
    //     maxWidth: '100%', 
    //     placeholder: 'Select Specific days'
    // });

    // VirtualSelect.init({
    //     ele: '#mcp_weekvisited',
    //     search: true,
    //     maxWidth: '100%', 
    //     placeholder: 'Select Specific weeks'
    // });

}

function exec_update_mcp_layout(){

    var mcp_freqval = $('#mcp_freqval').val();
    // var mcp_daysval = $('#mcp_daysval').val();
    // var mcp_weekvisited = $('#mcp_weekvisited').val();
    var mcp_daysval = '';
    var mcp_weekvisited = '';
    var mcp_timevisit = $('#mcp_timevisit').val();


    var salesmanselGBLval = $('#salesmanselGBLval').val();
    var custselGBLval = $('#custselGBLval').val();

    if(mcp_freqval == '' || mcp_freqval == null || mcp_timevisit == '' || mcp_timevisit == null){
        Swal.close();
        Swal.fire({
            icon: "warning",
            title: "Warning",
            text: "All fields are required."
        });
    }else{   
        Swal.fire({
            title: "Are you sure?",
            html: 'You want to update the MCP of ' +salesmanselGBLval+' ?',
            showCancelButton: true,
            confirmButtonText: "Update",
        }).then((result) => {
            if (result.isConfirmed) {
                //check frequency if 4 or 8
                if(mcp_freqval == '4' || mcp_freqval == '8'){
                    mcp_weekvisited = 'ALL';
                }

                if(mcp_freqval == '1'){
                    mcp_weekvisited = $('#mcp_weekvisited_f1').val();
                }else if(mcp_freqval == '2'){
                    mcp_weekvisited = $('#mcp_weekvisited_f2').val();
                }else if(mcp_freqval == '3'){
                    mcp_weekvisited = $('#mcp_weekvisited_f3').val();
                }

                if(mcp_freqval == '8'){
                    mcp_daysval = $('#mcp_daysval').val();
                }else{
                    mcp_daysval = $('#mcp_daysval_not_f8').val();
                }

                Swal.fire({
                    html: "Please Wait... Updating Request...",
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();

                        setTimeout(() => {
                            $.ajax ({
                                url: GLOBALLINKAPI+'/connectionString/applicationipAPI.php',
                                type: "POST",
                                data: {
                                    type: "EXEC_UPDATE_NEW_MCP_LAYOUT",
                                    mcp_freqval:mcp_freqval,
                                    mcp_daysval:mcp_daysval,
                                    mcp_weekvisited:mcp_weekvisited,
                                    mcp_timevisit:mcp_timevisit,
                                    salesmanselGBLval:salesmanselGBLval,
                                    custselGBLval:custselGBLval,
                                    "userID": GBL_USERID,
                                   "distCode": GBL_DISTCODE
                                },  
                                dataType: "JSON",
                                crossDomain: true,
                                cache: false,  
                                success: function(r){ 
                                    $('#mcpmoduleModal').modal('hide');
                                    Swal.close();
                                    if(r == 'timealreadyinsert'){
                                        Swal.fire({
                                            icon: "error",
                                            html: 'Time of visit ' +mcp_timevisit+ ' already set to another customer with the same day. Please select another.'
                                        });
                                    }else{
                                        emptyfields_mcp();
                                        stockRequestSourceData(salesmanselGBLval);

                                        Swal.fire({
                                            icon: "success",
                                            html: 'MCP for salesman was successfully updated.'
                                            // html: 'MCP for salesman ' +salesmanselGBLval+ ' was successfully updated.'
                                        });
                                    }
                                },//success
                                error: function(XMLHttpRequest, textStatus, errorThrown) {
                                    Swal.fire({
                                        icon: "error",
                                        html: 'ERROR: ' + XMLHttpRequest.responseText
                                    });
                                }
                            });
                        }, 1000);
                    },
                });
            }
        });
    }
}

$('#mcp_freqval').on('change', function() {
    var val =  this.value;
    console.log('the val: ' + val);

    if(val == '8'){
        $('.notf8days').hide();
        $('.f8days').show();
    }else{
        $('.notf8days').show();
        $('.f8days').hide();
    }

    if(val == '4' || val == '8'){
        $('.mcpweek_div').hide();

        $('#f1selected').hide();
        $('#f2selected').hide();
        $('#f3selected').hide();
    }else{
        $('.mcpweek_div').show();
    }

    if(val == '1'){
        $('#f1selected').show();
        $('#f2selected').hide();
        $('#f3selected').hide();
    }else if(val == '2'){
        $('#f1selected').hide();
        $('#f2selected').show();
        $('#f3selected').hide();
    }else if(val == '3'){
        $('#f1selected').hide();
        $('#f2selected').hide();
        $('#f3selected').show();
    }
});

$('#f1selected').hide();
$('#f2selected').hide();
$('#f3selected').hide();


$('#mcp_daysval').on('change', function() {
    var mcp_daysval = $('#mcp_daysval').val();
    //  console.log(mcp_daysval.length);
    if(parseInt(mcp_daysval.length) >= 3){
        alert('The required no. of days for F8 is 2. Please try again.');
    }  
});

$('#mcp_weekvisited_f3').on('change', function() {
    var mcp_daysval = $('#mcp_weekvisited_f3').val();
    console.log(mcp_daysval.length);
    if(parseInt(mcp_daysval.length) >= 4){
        alert('The required no. of days for F3 is 3. Please try again.');
    }
});


    // document.querySelector('#mcp_daysval').addEventListener('change', function () {
    //     var selectedValues = VirtualSelect.getSelectedValues('#mcp_daysval');
    //     var counter = selectedValues.length;

    //     if(counter > 3){
    //         alert('The required no. of days is 2. Please try again.');
    //     }
    // });

    //  document.querySelector('#mcp_weekvisited').addEventListener('change', function () {
    //     var selectedValues = VirtualSelect.getSelectedValues('#mcp_weekvisited');
    //     var counter = selectedValues.length;

    //     if(counter > 4){
    //         alert('The required no. of week visited is 3. Please try again.');
    //     }
    // });

// UPLOADER
async function ajaxCall(method, formDataArray = null, id) {
    let formData = new FormData();
    formData.append('customers', JSON.stringify(formDataArray));

    return await $.ajax({
        url: globalApi + 'api/maintenance/v2/customer/upload',
        type: method,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('api_token')
        },
        processData: false, // Required for FormData
        contentType: false, // Required for FormData
        data: JSON.stringify(formDataArray), // Convert the data to JSON format

        success: async function(response) {
            insertion++;
            expectedtotalRows += response.totalFileLength;
            actualtotalRows += response.successful;

            iconResult = `<span class="mdi mdi-alert-circle text-danger resultIcon"></span>`;
            var insertedResultColor = `text-danger`;

            if (response.status_response == 1) {
                iconResult = `<span class="mdi mdi-check-circle text-success resultIcon"></span>`
                insertedResultColor = 'text-success';


            } else if (response.status_response == 2) {
                iconResult = `<span class="mdi mdi-alert-circle text-warning resultIcon"></span>`
                insertedResultColor = 'text-warning';
                console.log('warning')
            }

            $('#totalUploadSuccess').text(insertion);
            $("#fileStatus" + id).html(iconResult);
            $("#insertedStat" + id).html(`${response.successful} / ${response.totalFileLength}`).addClass(insertedResultColor);

            if(fileCtrTotal>0 && fileCtrTotal==insertion){
                console.log('1')
                if(expectedtotalRows>0 && expectedtotalRows == actualtotalRows){
                    Swal.fire({
                        title: "Success!",
                        text: 'All data successfully Inserted',
                        icon: "success"
                    });
                } else {
                    var unsucc = expectedtotalRows-actualtotalRows;
                    let message = `Some data could not be inserted. <br>Please review the uploaded CSV file.<br><strong>${unsucc}</strong> customer${unsucc > 1 ? 's' : ''} were not inserted.<br><br><br>${issueTable}`;

                    Swal.fire({
                        title: "Warning!",
                        html: message,
                        icon: "warning"
                    });
                }
            }
            datatables.loadCustomerData();
        },
        error: async function(xhr, subTotal, error) {
            Swal.fire({
                icon: "error",
                title: "Api Error",
                text: xhr.responseJSON?.message || xhr.statusText,

            });
            return xhr, subTotal, error;
        }
    });
}

function trNew(fileName, indexId) {
    return `<tr id="fileRow${indexId}">
                <td class="imgSizeContainer col-1">
                    <span class="mdi mdi-file-document-outline"></span>
                </td>
                <td class = "col-9" style="padding-left: 0px;">
                    <span>${fileName}</span>
                </td>
                <td id="insertedStat${indexId}" class="text-end col-2">

                </td>
                <td id="fileStatus${indexId}" class="text-center col-1">
                    <span class="loader">
                    </span>
                </td>
            </tr>`;
}

const uploadconfirmUpload = document.getElementById('uploadBtn2')
    .addEventListener('click', () => {
        var appendTable = '';
        insertion = 0;
        fileCtrTotal = 0;
        expectedtotalRows = 0;
        actualtotalRows = 0;
        errorFile = false;
        // Get all the files selected in the file input
        var files = document.getElementById('formFileMultiple').files;

        $('#totalFiles').html(files.length);
        $('#totalFile').html(files.length);
        fileCtrTotal = files.length;
        // Loop over each file and check the extension
        for(let i=0; i < files.length; i++){
            var fileExtension = files[i].name.split('.').pop().toLowerCase();

            appendTable += trNew(files[i].name, i);
            if(!['csv','xlsx'].includes(fileExtension)){
                setTimeout(function() {
                    iconResult = `<span class="mdi mdi-alpha-x-circle text-danger resultIcon"></span>`;
                    $("#fileStatus" + i).html(iconResult);
                }, 100);
                errorFile = true;
            }

            $('#fileListTable').html(appendTable);
        }

        if(!errorFile){
            for(let i=0; i < files.length; i++){
                var fileExtension = files[i].name.split('.').pop().toLowerCase();

                appendTable += trNew(files[i].name, i);
                if (fileExtension === 'csv') {
                    processCSVFile(files[i], i); // Process CSV
                    console.log('CSV file.')
                }
                else if(fileExtension === 'xlsx'){
                    processExcelFile(files[i], i); // Process XLXS
                    console.log('Excel file.')
                }
            }
            $('#uploadBtn2').html('Upload');
        } else{
            Swal.fire({
                icon: "error",
                title: "Review files",
                text: "Please select .csv files only",
        });
        $('#uploadBtn2').html('Reupload');
    }
});

function processCSVFile(file, ctr) {
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            ajaxCall('POST', results.data, ctr);
        }
    });
}

function processExcelFile(file, ctr) {
    readXlsxFile(file).then((rows) => {
        let keys = rows[0]; // First row contains the keys
        let result = rows.slice(1).map(row => {
            return keys.reduce((obj, key, index) => {
                obj[key] = row[index]; // Map key to corresponding value in row
                return obj;
            }, {});
        });
        ajaxCall('POST', result, ctr);
    });
}


function uploadmcplayout(){
    var product_file = $('#formFileMultiple').val();
    if(product_file == ''){
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Please select a csv file to upload."
        });
    }else{
        $('.temp1').hide();
        $('#uploadv1Btn').html('<i class="icon-copy fa fa-spinner fa-spin" aria-hidden="true"></i> Uploading please wait..');
        $("#uploadv1Btn").prop("disabled", true);

        Swal.fire({
            html: "Please Wait... Uploading MCP...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });


        var UPLOADERHOLDER = localStorage.getItem('S_ADMID');
        var CONN = con_info;
        var formData = new FormData();
        var files = $('#formFileMultiple')[0].files[0];
        
        formData.append('formFileMultiple', files);
        formData.append("userID",  GBL_USERID,);
        formData.append('distCode', GBL_DISTCODE);
        
        setTimeout(() => {
            $.ajax ({
                url: GLOBALLINKAPI+'/connectionString/uploadmcplayout.php',
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                dataType: 'text',
                async: false,
                success: function(r){ 
                    if(r == 1){
                        $('.temp1').show();
                        $('#uploadv1Btn').html('Upload');
                        $("#uploadv1Btn").prop("disabled", false);

                        $('#template1Modal').modal('hide');
                        Swal.close();
                        Swal.fire({
                            icon: "success",
                            title: "Data Successfully Uploaded",
                            allowOutsideClick: false,  
                            allowEscapeKey: false, 
                            allowEnterKey: false 
                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.reload();
                            }
                        });
                    }else{
                        Swal.close();
                        
                        Swal.fire({
                            icon: "error",
                            html: 'ERROR WHILE UPDATING: ' + r + '\n' + 'Please try again.',
                            allowOutsideClick: false,  
                            allowEscapeKey: false, 
                            allowEnterKey: false
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $('#uploadv1Btn').html('Upload');
                                $("#uploadv1Btn").prop("disabled", false);
                                $('#template1Modal').modal('hide');

                            }
                        });
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    Swal.close();
                    Swal.fire({
                        icon: "error",
                        // html: 'Server takes to long to respond, please try again.',
                        title: 'Ops! Something went wrong!',
                        html: XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!',
                        allowOutsideClick: false,  
                        allowEscapeKey: false, 
                        allowEnterKey: false
                    })
                    $('#uploadv1Btn').html('Upload');
                    $("#uploadv1Btn").prop("disabled", false);
                }
            });
        }, 1000);
    }
  }

function initializeFiltration(data){
    var DaysOfVisit = [...new Set(data.map(item => item.daysofVisittext))];
    var myOptionsDaysOfVisit = [];
    var WeekVisited = [...new Set(data.map(item => item.weekVisitedtext))];
    var myOptionsWeekVisited = [];
    var MCPStatus = [...new Set(data.map(item => item.isActive))];
    var myOptionsMCPStatus = [];
    var ActiveFlag = [...new Set(data.map(item => item.custStatusval))];
    var myOptionsActiveFlag = [];

    for (var x = 0; x < DaysOfVisit.length; x++) {
        var obj = { label: DaysOfVisit[x], value: DaysOfVisit[x] };
        myOptionsDaysOfVisit.push(obj);
    }

    for (var x = 0; x < WeekVisited.length; x++) {
        var obj = { label: WeekVisited[x], value: WeekVisited[x] };
        myOptionsWeekVisited.push(obj);
    }

    for (var x = 0; x < MCPStatus.length; x++) {
        if(MCPStatus[x] == "Y"){
            var obj = { label: "Yes", value: MCPStatus[x] };
            myOptionsMCPStatus.push(obj);
        } else {
            var obj = { label: "No Schedule", value: "N" };
            myOptionsMCPStatus.push(obj);
        }
    }

    for (var x = 0; x < ActiveFlag.length; x++) {
        if(ActiveFlag[x] == "No"){
            var obj = { label: "No", value: ActiveFlag[x] };
            myOptionsActiveFlag.push(obj);
        } else {
            var obj = { label: "Yes", value: ActiveFlag[x] };
            myOptionsActiveFlag.push(obj);
        }
    }

    document.querySelector('#filter_daysOfVisit').setOptions(myOptionsDaysOfVisit);
    document.querySelector('#filter_WeekVisited').setOptions(myOptionsWeekVisited);
    document.querySelector('#filter_MCPStatus').setOptions(myOptionsMCPStatus);
    document.querySelector('#filter_ActiveFlag').setOptions(myOptionsActiveFlag);
}

function exec_filter(){
    var filteredSourceData = sourceDat;

    var selected_daysOfVisit = $('#filter_daysOfVisit').val();
    var selected_WeekVisited = $('#filter_WeekVisited').val();
    var selected_MCPStatus = $('#filter_MCPStatus').val();
    var selected_ActiveFlag = $('#filter_ActiveFlag').val();

    var result = filteredSourceData.filter(item => {
        let match = true;

        if (selected_daysOfVisit && selected_daysOfVisit.length > 0) {
            match = match && selected_daysOfVisit.includes(item.daysofVisittext);
        }

        if (selected_WeekVisited && selected_WeekVisited.length > 0) {
            match = match && selected_WeekVisited.includes(item.weekVisitedtext);
        }

        if (selected_MCPStatus && selected_MCPStatus.length > 0) {
            if(item.isActive == null && selected_MCPStatus.includes('N')){
                return match;
            }
            match = match && selected_MCPStatus.includes(item.isActive);
        }

        if (selected_ActiveFlag && selected_ActiveFlag.length > 0) {
            match = match && selected_ActiveFlag.includes(item.custStatusval);
        }

        return match;
    });

    $('#filterResultsModal').modal('hide');
    Swal.fire({
        html: "Please Wait... Filtering Data...",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
            tableData.clear().rows.add(result).draw();

            setTimeout(() => {
                Swal.close();
            }, 1000);
        },
    });
}

