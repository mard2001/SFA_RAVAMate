var user = localStorage.getItem("adminUserName");
var usertype = localStorage.getItem("usertype");
var sourceDat;
var startPickDate, endPickDate;
var tableData;
var LOCALLINK = "https://php-7.4.ravamate.com";

VirtualSelect.init({
    ele: '#mcp_daysval',
});

VirtualSelect.init({
    ele: '#mcp_weekvisited_f3',
});


determineUserType(usertype); 

// getcompname();
getcompname_dynamic("Sales Target", "titleHeading");


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
                var obj = { label: data[x].Salesman, value: data[x].mdCode };
                myOptions.push(obj);
            }
            VirtualSelect.init({
                ele: '#salesmanSelectList',
                options: myOptions,
                search: true,
                multiple: true,
                maxWidth: '100%', 
                placeholder: 'Select Specific Salesman'
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
        url: GLOBALLINKAPI+'/connectionString/applicationipAPI.php',
        type: "POST",
        data: {
            type: "GET_SALES_TARGET",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
            mdCode: salesman,
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
            { data: "mdCode", title:"Md Code" },
            { data: "salesman", title:"Salesman" },
            { data: "TargetYear", title:"Year" },
            { data: "TargetMonth", title:"Month" },
            { 
                data: "SalesTarget", 
                title:"Sales Target",
                render: function(data, type, row){
                    return data ? "₱"+parseFloat(data).toLocaleString() : 0; 
                }
            
            },
            { data: "MarkupPercentage", title:"Markup %" },
            { data: "lastUpdated", title:"Last Updated"}
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
                filename: 'SALES_TARGET-'+ moment().format("DD-MMM-YYYY"),
            },
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
            {
                targets: [2, 3, 5],
                className: 'dt-body-center'
            },
            {
                targets: [4],
                className: 'text-end'
            },
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

    //  $('#uploadbtn').on('click', function() {
    //     $('#uploadmcplayouttemplateModal').modal('show');
    // });

}
$('#stockRequest_TAB tbody').on('click', 'tr', function () {
        var tr = $(this).closest('tr');
        var row = tableData.row(tr);
        viewDetails(row.data());
});

function viewDetails(r){
    $('#dispsalesman').html(r.salesman);
    $('#dispyear').html(r.TargetYear);
    $('#dispmonth').html(r.TargetMonth);
    $('#salestarget').val(r.SalesTarget);
    $('#markupperc').val(r.MarkupPercentage);
    $('#cidiholder').val(r.cID);
    $('#mdCodeHolder').val(r.mdCode);
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

function exec_update_salestarget(){

    var salestarget = $('#salestarget').val();
    var markupperc = $('#markupperc').val();

    var cidiholder = $('#cidiholder').val();
    var mdcode = $('#salesmanSelectList').val();

    var f = confirm('Are you sure you want to update this sales target ?');
    if(f){
            $.ajax ({
                url: GLOBALLINKAPI+'/connectionString/applicationipAPI.php',
                type: "POST",
                data: {
                    type: "UPDATE_SALES_TARGET",
                    salesTarget:salestarget,
                    markupperc:markupperc,
                    cID:cidiholder,
                    "userID": GBL_USERID,
                    "distCode": GBL_DISTCODE
                },  
                dataType: "JSON",
                crossDomain: true,
                cache: false,  
                success: function(r){ 

                    alert('Sales Target for was successfully updated.');
                    stockRequestSourceData(mdcode);
                    $('#mcpmoduleModal').modal('hide');
                },//success
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                
                    alert('ERROR: ' + XMLHttpRequest.responseText);
                }
            });
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


    

