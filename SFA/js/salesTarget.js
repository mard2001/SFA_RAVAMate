var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var sourceDat;
var startPickDate, endPickDate;
var tableData;
var LOCALLINK = "https://fastdevs-api.com"
var API_ENDPOINT = "/BUDDYGBLAPI/MTDAPI/application.php";
var API_ENDPOINT2 = "/BUDDYGBLAPI/MTDAPI/applicationCharlie.php";


VirtualSelect.init({
    ele: '#mcp_daysval',
});

VirtualSelect.init({
    ele: '#mcp_weekvisited_f3',
});


determineUserType(usertype); 

getcompname();

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

setTimeout(() => {
    Swal.close();   
}, 1000);

function loadSalesman() {
    $.ajax({
      url: LOCALLINK + '/MYMONDE/nestle/connectionString/applicationipAPI.php',
        type: "GET",
        data:{
            "type": "get_all_salesman_bohol",
            "CONN": con_info
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
        url: GLOBALLINKAPI+"/nestle/connectionString/applicationipAPI.php",
        type: "GET",
        data: {"type":"GET_COMPANYNAME", "CONN":con_info},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Sales Target');
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
        url: LOCALLINK + '/MYMONDE/nestle/connectionString/applicationipAPI.php',
        type: "GET",
        data: {
            type: "GET_SALES_TARGET",
            CONN: con_info,
            // salesman: salesman,
        },  
        dataType: "JSON",
        crossDomain: true,
        cache: false,  
        success: function(r){ 
            sourceDat = r;
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
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
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
            { data: "mdCode", title:"MDCODE" },
            { data: "salesman", title:"SALESMAN" },
            { data: "TargetYear", title:"YEAR" },
            { data: "TargetMonth", title:"MONTH" },
            { data: "SalesTarget", title:"SALES TARGET" },
            { data: "MarkupPercentage", title:"MaRKUP %" },
        ],
        buttons: [
            // {
            //     extend: 'print',
            //     text: 'print',
            // },
            // {
            //     extend: 'excelHtml5',
            //     text: 'Excel',
            //     title: '',
            //     filename: 'MCPLAYOUT - '+ moment().format("DD-MMM-YYYY"),
            //     customize: function ( xlsx ) {
            //     },
            //     action: function(e, dt, button, config) {
                 
            //             $('.loading').fadeIn();
            //             var that = this;
            //             setTimeout(function () {
            //                 $.fn.dataTable.ext.buttons.excelHtml5.action.call(that,e, dt, button, config);
            //                 $('.loading').fadeOut();
            //             },500);
                    
            //     },
            // },
           {
                text: 'Sales Summary',
                // className: 'bringtoprint',
                action: function(e, dt, node, config){
                // printDSS();
                $('#dssmodal').modal('show');
                }   
            },
        ],
        columnDefs: [
            // {
            //     targets: [1, 3, 5],
            //     className: 'dt-body-center'
            // },
        ],
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

     $('#uploadbtn').on('click', function() {
        $('#uploadmcplayouttemplateModal').modal('show');
    });

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

    var f = confirm('Are you sure you want to update the MCP of ' +salesmanselGBLval+' ?');
    if(f){
        if(mcp_freqval == '' || mcp_timevisit == ''){
            alert('All fields are required.');
        }else{
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

            // console.log(mcp_daysval.length);

            $.ajax ({
                url: LOCALLINK + '/MYMONDE/nestle/connectionString/applicationipAPI.php',
                type: "GET",
                data: {
                    type: "EXEC_UPDATE_NEW_MCP_LAYOUT",
                    mcp_freqval:mcp_freqval,
                    mcp_daysval:mcp_daysval,
                    mcp_weekvisited:mcp_weekvisited,
                    mcp_timevisit:mcp_timevisit,
                    salesmanselGBLval:salesmanselGBLval,
                    custselGBLval:custselGBLval,
                    CONN: con_info
                },  
                dataType: "JSON",
                crossDomain: true,
                cache: false,  
                success: function(r){ 

                    if(r == 'timealreadyinsert'){
                       alert('Time of visit ' +mcp_timevisit+ ' already set to another customer with the same day. Please select another.');
                    }else{
                        alert('MCP for salesman ' +salesmanselGBLval+ ' was successfully updated.');
                        emptyfields_mcp();
                        stockRequestSourceData(salesmanselGBLval);
                    }
             

                    $('#mcpmoduleModal').modal('hide');
                },//success
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                
                    alert('ERROR: ' + XMLHttpRequest.responseText);
                }
            });
        }
    }// if
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


    

