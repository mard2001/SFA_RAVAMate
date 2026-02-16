var user = localStorage.getItem("adminUserName");
var dateselected = localStorage.getItem("DSSdateSelected");

salessummary();
// getcompname();
getcompname_dynamic("", "titleHeading");

$('.hidethis').hide();
$('#heading').hide();
function execprint(){
    $('#heading').show();
    var printContents = document.getElementById('printableArea').innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    $('#heading').hide();
}

function salessummary(){
    $.ajax ({
        url: GLOBALLINKAPI+"/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type":"GET_ENDOFDAY_DETALS", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "date":dateselected},
        dataType: "json",
        crossDomain: true,
        cache: false,            
        success: function(r){ 
            var cont = '';
            for(var x = 0; x < r.transactions.length; x++){
            cont += '<tr>'+
                '<td>'+(x+1)+'</td>'+
                '<td class="text-left">'+r.transactions[x].mdName+'</td>'+
                '<td>'+r.transactions[x].tcalls+'</td>'+
                '<td>'+r.transactions[x].pCalls+'</td>'+
                '<td>'+r.transactions[x].unpCalls+'</td>'+
                '<td>'+r.transactions[x].missCall+'</td>'+
                '<td>'+r.transactions[x].fcall+'</td>'+
                '<td>'+r.transactions[x].lcall+'</td>'+
                '<td>'+r.transactions[x].tSellHour+'</td>'+
                '<td style="padding-right: 15px !important; text-align: right !important;">₱ '+r.transactions[x].amount+'</td>'+
            '</tr>';
            }

            $('#totalSales').html('<b>TOTAL: ' + parseFloat(r.totalsales[0].total).toLocaleString()+'</b>');
            $('#salesSummaryBody').html(cont);   
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
            $('#company').html(r[0].company.toUpperCase());
            $('#titleHeading').html(r[0].company.toUpperCase());


            $('#dateAndTime').html(dateselected);
            let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            let formattedDate = new Date(dateselected).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
            let dayOfWeek = days[(new Date(dateselected)).getDay()];
            $('#reportrange1 span').html('<b>' + dayOfWeek+ '</b>' + ' | '+formattedDate);
            

            $('#compExp').html(r[0].company.toUpperCase());
            $('#dateExp').html(dateselected);
        }
    });
}

function getmiss(miss){
    if(miss == '()'){
        return '-';
    }
    return miss;
}

function fnExcelReport(){
    var tab_text="<html xmlns='http://www.w3.org/1999/xhtml' lang='el-GR' lang='el-GR'>";
    var tab_text=tab_text+"<?php Response.AddHeader('Content-Disposition', 'inline;filename=Dailysales.xls') ?>";
    var tab_text=tab_text+"<meta http-equiv='content-type' content='text/plain; charset=UTF-8'/>";
    var tab_text=tab_text+"<table border='1px'><tr>";
    var textRange; var j=0;
    tab = document.getElementById('exceltbl'); // id of table

    for(j = 0 ; j < tab.rows.length ; j++){
		tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
    }

    tab_text=tab_text+"</table>";
    tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");
    tab_text= tab_text.replace(/<img[^>]*>/gi,"");
    tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, "");
    tab_text= tab_text.replace(/<button[^>]*>|<\/button>/gi, "");

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    sa = window.open('data:application/vnd.ms-excel,filename=Dailysales.xls,' + encodeURIComponent(tab_text));

    return (sa);
}

const today = new Date();

    // Format the date as YYYY-MM-DD
const formattedDate = today.getFullYear() + '-' +
        ('0' + (today.getMonth() + 1)).slice(-2) + '-' +
        ('0' + today.getDate()).slice(-2);


function exportTableToXLSX(tableID){
    let filename = "DailySalesSummary_"+formattedDate;

    let table = document.getElementById(tableID);
    
    
    let wb = XLSX.utils.table_to_book(table, {sheet: "Sheet1"}); // Convert the table to a workbook object
    let wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'}); // Generate a binary string of the workbook

    // Convert the binary string to an array buffer
    function s2ab(s) {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    }

    // Trigger the download of the file
    let blob = new Blob([s2ab(wbout)], {type: "application/octet-stream"});
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = filename ? filename + '.xlsx' : 'data.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
}