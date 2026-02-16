var usertype = localStorage.getItem("usertype");
var sourceDat;
var tableData;

VirtualSelect.init({
    ele: '#fenceList',
});

determineUserType(usertype); 
// getcompname();
getcompname_dynamic("Fence Details v.1.0", "titleHeading");
function getcompname(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_COMPANYNAME", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            $('#titleHeading').html(r[0].company.toUpperCase() +' | Fence Details v.1.0');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $('#titleHeading').html('<i class="fa fa-circle blinking"></i> <b style="color:red;">ERROR:</b> Unable to establish a connection from your server. Please check your server settings.');
        }
    });
} 

loadFence();
function loadFence(){
 $.ajax ({
      url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
      type: "POST",
      data: {"type":"GET_ALL_FENCE_HEADER", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
      dataType: "json",
      crossDomain: true,
      cache: false,          
      async: false,  
        success: function(data){ 
            document.querySelector('#fenceList').destroy();
            var myOptions = [];

            for (var x = 0; x < data.length; x++) {
                var obj = { label: data[x].FENCENAME, value: data[x].cID };
                myOptions.push(obj);
            }
            VirtualSelect.init({
                ele: '#fenceList',
                options: myOptions,
                search: true,
                maxWidth: '100%', 
                placeholder: 'Select Fence'
            });
        }
    });
}


$('.loading-table').hide();
function stockRequestSourceData(){
    var fenceRefNo = $('#fenceList').val();
    $('#stockRequest_TAB').hide();
    var dialog = bootbox.dialog({
        message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
        backdrop: true
    });
    var botboxMsg = '';

    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type":"GET_ALL_FENCE_DETAILS",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE
        },
        dataType: "json",
        crossDomain: true,
        cache: false,  
        async: true,          
        success: function(r){ 
            if(r.lenght != 0){ 
                console.log(r);//sourceDat
                sourceDat = [];

                sourceDat = r.filter(item => fenceRefNo.includes(item.REFERENCENO));
                console.log(sourceDat);
                tableData.clear().rows.add(sourceDat).draw();
                $('#stockRequest_TAB').show();
                $('.loading-table').hide();
            }else{
                alert('NO DATA FOUND IN YOUR SELECTED SALESMAN: ' + mdCode);
            }

            dialog.modal('hide');
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
        setTimeout(function(){
            // dialog.find('.bootbox-body').html('<p>'+botboxMsg+'</p>');
        }, 1000);
    });
}

datatableApp();



function datatableApp(){
    // $('[data-toggle="tooltip"]').tooltip();
    tableData = $('#stockRequest_TAB').DataTable({
        "dom": '<"dataTableMainDiv" <"d-flex justify-content-between dataTableSubDiv"<"defaultDataTableBtns"B><><"d-flex flex-column justify-content-end"<""i><"dataTableTopPagination" p>>><rt>>',
        "responsive": true,
        "data": sourceDat,
        "scrollX": true,
        "language": {
            "emptyTable": "No available records as of now.",
            "paginate": {
                "previous": "<i class='fa-solid fa-caret-left'></i>",
                "next": "<i class='fa-solid fa-caret-right'></i>"
            },
        },
        columns: [
            { data: "FENCENAME", title: "Fence Name" },
            { data: "SALESMAN", title: "Salesman" },
            { data: "CUSTCODE", title: "CustCode" },
            { data: "STORENAME", title: "Store Name" },
            { data: "STORETYPE", title: "Store Type" },
            { data: "TOTALORDERS", title: "Sales" },
            { data: "DATECREATED", title: "Date Inserted" },
            { data: "ADDRESS", title: "Address" },
            { data: "LATITUDE", title: "Latitude" },
            { data: "LONGITUDE", title: "longitude" },
        ],
        drawCallback: function (settings) {
            // $('[data-toggle="tooltip"]').tooltip();
        },
        rowCallback: function(row, data, index){
            var isfencename = $(row).find('td:eq(0)').text();
            if(isfencename == ''){
                $(row).find('td:eq(0)').text('---');
            }

            $(row).find('td:eq(5)').text('₱' + data.TOTALORDERS);
        },
        buttons: [ 
            {
                extend: 'copyHtml5',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                }
            },
            {
                extend: 'excelHtml5',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                }
            },
            {
                extend: 'print',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                }
            }
        ],
        columnDefs: [
            {
                targets: [2, 8, 9],
                className: 'dt-body-center'
            },
            {
                targets: [5],
                className: 'dt-body-right'
            },
        ],
    });

    $('#stockRequest_TAB_filterSearchBarInputField').on('keyup', function() {
        var searchTerm = $(this).val();
        tableData.search(searchTerm).draw();
    });
    $('#excelBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-excel').trigger('click');
    });
    $('#copyBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-copy').trigger('click');
    });
    $('#printBtn').on('click', function() {
        console.log('Custom button clicked');
        $('.buttons-print').trigger('click');
    });
}

tableData.on( 'draw', function () {
    $('[data-toggle="tooltip"]').tooltip();
});

// var startPickDate, endPickDate;
// function datePicker(){
//     var start = moment().subtract(29, 'days');
//     var end = moment();

//     $('#reportrange1').daterangepicker({
//         "alwaysShowCalendars": true,
//         "startDate": start,
//         "endDate": end,
//         "maxDate": moment(),
//         "applyClass": "btn-primary",
//         "autoApply": false,
//         ranges: {
//             'Today': [moment(), moment()],
//             'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
//             'Last 7 Days': [moment().subtract(6, 'days'), moment()],
//             'This Month': [moment().startOf('month'), moment().endOf('month')],
//             'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
//         }
//     }, function(start, end, label) {
//         $('#reportrange1 span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
//         startPickDate = start.format('YYYY-MM-DD');
//         endPickDate = end.format('YYYY-MM-DD')
//         });

//     $('#reportrange1').on('apply.daterangepicker', function(ev, picker) {
//         $('#stockRequest_TAB').hide();
//         var start = picker.startDate.format('YYYY-MM-DD');
//         var end = picker.endDate.format('YYYY-MM-DD');
//         stockRequestSourceData(start, end);
//         tableData.clear().rows.add(sourceDat).draw();
//     });
// }

