var LOCALLINK = "https://fastdevs-api.com"
var API_ENDPOINT = "/BUDDYGBLAPI/MTDAPI/application.php";

// var LOCALLINK = 'http://localhost/v2';
// var API_ENDPOINT = "/nestle/connectionString/LOCALSTORAGE/Reports_Backend/application.php"

var MtdDetsHolder = [];
var reportDetails = [];
var todaysDat;

getTodaysDat();

function getTodaysDat(){
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    var formattedDate = year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');

    todaysDat = formattedDate;
}

function mtdOverviewMainCall(mdCode, date){
    $('#mdCodeHolder').val(mdCode);
    getRemainingDays(mdCode);
    // fetchMTD_All(mdCode, date);
    // local_Mtd_Checker(mdCode, date);
    local_Optimized_Checker(mdCode, date);
}

function local_Mtd_Checker(mdCode, date){
    var isSeen = false;

    MtdDetsHolder.forEach(function(salesmanMtd){
        if(salesmanMtd.mdCode == mdCode && salesmanMtd.date == date){
            if(salesmanMtd.data.isHaveData){
                if(date == todaysDat){
                    execData1(salesmanMtd.data);
                }
                else{
                    execData2(salesmanMtd.data);
                }
            } else{
                if(date == todaysDat){
                    execDefaultData1(salesmanMtd.data);
                }
                else{
                    execDefaultData2(salesmanMtd.data);
                }
            }
            isSeen = true;
            return;
        }
            
    })
    if (!isSeen) {
        if(date == todaysDat){
            fetchMTD_All(mdCode, date).then(function(data) {
                var mtdDetails = {
                    data: data,
                    mdCode: mdCode,
                    date: date,
                    sync: false
                };
                MtdDetsHolder.push(mtdDetails);
            });
        }
        else{
            fetch_EOD(mdCode, date).then(function(data) {
                var mtdDetails = {
                    data: data,
                    mdCode: mdCode,
                    date: date,
                    sync: false
                };
                MtdDetsHolder.push(mtdDetails);
            });
        }
    }
}

$('#changeMtdEod').click(function() {
    $('.cardFlip-inner').css("transform", "rotateY(0)")
});

$('#changeEodMtd').click(function() {
    $('.cardFlip-inner').css("transform", "rotateY(-180deg)")
});



$('#mtdSyncBtn').click(function(){
    var date = $('#lateDateHolder').val();
    var mdCode = $('#mdCodeHolder').val();
    reportDetails.forEach(function(salesmanObj){
        if(salesmanObj.mdCode == mdCode && salesmanObj.date == date ){
            if(salesmanObj.sync == false){
                // var dialog = bootbox.dialog({
                //     message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
                //     backdrop: true
                // });
                // var botboxMsg = '';
                Swal.fire({
                    html: "Please Wait... Syncing Salesman Data...",
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                if(salesmanObj.isHaveMonthlyData){
                    fetchMTD_All(mdCode, date).then(function(data){
                        salesmanObj.perMonth = data;
                    });
                }
                
                if(date == todaysDat){
                    fetch_CURRENTDAY(mdCode, date).then(function(data){
                        salesmanObj.perDay = data;
                    });
                } else{
                    fetch_EOD(mdCode, date).then(function(data){
                        salesmanObj.perDay = data;
                    });
                }
                salesmanObj.sync = true;

                setTimeout(() => {
                    // dialog.modal('hide');
                    Swal.close();
                }, 2000);
                return;
            } else{
                alert("MTD Overview Detail of Salesman Has Already Been Synced");
                return;
            }
        }
    });  
});


function execData2(data){
    $('#eodremdaysCont').html(data.sellingDays);
    $('#centeredWeekNo').html(data.weekNo);

    $('#eodA_percentage').html(data.MTD_Percentage);
    $('#eodA_target').html(simplifyAmount(parseInt(data.MTD_targetSales)));
    $('#eodA_sales').html("₱ "+ (parseFloat(data.MTD_totalSales)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    $('#eodA_balance').html("₱ "+ (parseFloat(data.MTD_balance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    arrowStatus(data.MTD_ArrowStat, "eodAArrowStatus");

    $('#mustHaveTarget').html(data.mustHaveTarget);
    $('#mustHaveHit').html(data.mustHaveHit);
    $('#mustHaveBalance').html(data.mustHaveBalance);
    $('#mustHave_Percentage').html(data.mustHave_Percentage);
    arrowStatus(data.mustHave_ArrowStat, "mustHave_ArrowStat");

    $('#cp_target').html(data.cp_target);
    $('#cp_hit').html(data.cp_hit);
    $('#cp_balance').html(data.cp_balance);
    $('#cp_percentage').html(data.cp_percentage);
    arrowStatus(data.cp_ArrowStat, "cpArrowStatus");

    $('#eodgcr_percentage').html(data.GCRpercentage);
    $('#eodgcr_target').html(data.GCRtarget);
    $('#eodgcr_visited').html(data.GCRvisited);
    $('#eodgcr_unvi').html(data.GCRunvisited);
    arrowStatus(data.GCRArrowStat, "eodgcr_arrowStatus");

    $('#eodsrPercentage').html(data.SRpercentage);
    $('#eodsrTarget').html(data.SRtarget);
    $('#eodsrProd').html(data.SRprod);
    $('#eodsrUnprod').html(data.SRunprod);
    arrowStatus(data.SRArrowStat, "eodsrArrowStatus");

    $('#eodrange_percentage').html(data.R_OverAllPer);
    $('#eodrangeTarget').html(data.R_targetMCP);
    $('#eodbig').html(data.R_big);
    $('#eodbighit').html(data.R_bigHit);
    $('#eodbigbal').html(data.R_bigBal);
    $('#eodbigper').html(data.R_Per_big);
    $('#eodsmall').html(data.R_small);
    $('#eodsmallhit').html(data.R_smallHit);
    $('#eodsmallbal').html(data.R_smallBal);
    $('#eodsmallper').html(data.R_Per_small);
    arrowStatus(data.R_ArrowStat, "eodrange_overallArrowStatus");
    arrowStatus(data.R_ArrowStat_Big, "eodrange_bigArrowStatus");
    arrowStatus(data.R_ArrowStat_Small, "eodrange_smallArrowStatus");

    // $('#mhTotal').html("₱ "+ (parseFloat(data.mhTotalBO)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    // $('#mhTotalAllowance').html("₱ "+ (parseFloat(data.mhBOAllowance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    // $('#mh_percentage').html(data.mhPrecentageRate);
    // arrowStatus(data.mhArrowStat, "mhArrowStatus");
}

function execData1(data){
    $('#mtdA_percentage').html(data.MTD_Percentage);
    $('#mtdA_target').html(simplifyAmount(parseInt(data.MTD_targetSales)));
    $('#mtdA_sales').html("₱ "+ (parseFloat(data.MTD_totalSales)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    $('#mtdA_balance').html("₱ "+ (parseFloat(data.MTD_balance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    arrowStatus(data.MTD_ArrowStat, "mtdAArrowStatus");

    $('#mcpProductiviy_prod').html(data.MCPP_productive);
    $('#mcpProductiviy_unprod').html(data.MCPP_unproductive);
    $('#mcpProductiviy_total').html(data.MCPP_Total);
    $('#mcpProductiviy_percentage').html(data.MCPP_Productivity);
    arrowStatus(data.MCPP_ArrowStat, "mcpProdArrowStatus");

    $('#gcr_percentage').html(data.GCRpercentage);
    $('#gcr_target').html(data.GCRtarget);
    $('#gcr_actual').html(data.GCRtarget);
    $('#gcr_visited').html(data.GCRvisited);
    $('#gcr_unvi').html(data.SRprod);
    arrowStatus(data.GCRArrowStat, "gcr_arrowStatus");

    $('#srPercentage').html(data.SRpercentage);
    $('#srTarget').html(data.SRtarget);
    $('#srProd').html(data.SRprod);
    $('#srUnprod').html(data.SRunprod);
    arrowStatus(data.SRArrowStat, "srArrowStatus");

    $('#range_percentage').html(data.R_OverAllPer);
    $('#rangeTarget').html(data.R_targetMCP);
    $('#big').html(data.R_big);
    $('#bighit').html(data.R_bigHit);
    $('#bigbal').html(data.R_bigBal);
    $('#bigper').html(data.R_Per_big);
    $('#small').html(data.R_small);
    $('#smallhit').html(data.R_smallHit);
    $('#smallbal').html(data.R_smallBal);
    $('#smallper').html(data.R_Per_small);
    arrowStatus(data.R_ArrowStat, "range_overallArrowStatus");
    arrowStatus(data.R_ArrowStat_Big, "range_bigArrowStatus");
    arrowStatus(data.R_ArrowStat_Small, "range_smallArrowStatus");

    $('#mhTotal').html("₱ "+ (parseFloat(data.mhTotalBO)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    $('#mhTotalAllowance').html("₱ "+ (parseFloat(data.mhBOAllowance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    $('#mh_percentage').html(data.mhPrecentageRate);
    arrowStatus(data.mhArrowStat, "mhArrowStatus");

    $('#b2bActive').html(data.B2BActive);
    $('#mybuddySales').html("₱ "+ (parseFloat(data.B2BMyBuddySales)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    $('#fastsosyoSales').html("₱ "+ (parseFloat(data.B2BSosyoSales)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    $('#b2b_reg').html(data.B2BRegistered);
    $('#b2b_reg_per').html("  ("+data.B2BRegisteredPer+"%)");
    $('#b2b_prod').html(data.B2BProductive);
    $('#b2b_prod_per').html("  ("+data.B2BProductivePer+"%)");
    $('#b2b_freq').html(data.B2BHybridFreq);
    
    b2bProductiveFontColor(data.B2BProductivePer);
    b2bFreqFontColor(data.B2BHybridFreq);
}

function execDefaultData2(){
    $('#eodremdaysCont').html('-');
    $('#centeredWeekNo').html('-');

    $('#eodA_percentage').html('-');
    $('#eodA_target').html(' ');
    $('#eodA_sales').html('---');
    $('#eodA_balance').html('---');
    $('#eodAArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    $('#mustHaveTarget').html(' ');
    $('#mustHaveHit').html('---');
    $('#mustHaveBalance').html('---');
    $('#mustHave_Percentage').html('-');
    $('#mustHave_ArrowStat').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    $('#cp_target').html(' ');
    $('#cp_hit').html('---');
    $('#cp_balance').html('---');
    $('#cp_percentage').html('-');
    $('#cpArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    $('#eodgcr_percentage').html('-');
    $('#eodgcr_target').html(' ');
    $('#eodgcr_visited').html('---');
    $('#eodgcr_unvi').html('---');
    $('#eodgcr_arrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    $('#eodsrPercentage').html('-');
    $('#eodsrTarget').html(' ');
    $('#eodsrProd').html('---');
    $('#eodsrUnprod').html('---');
    $('#eodsrArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    $('#eodrange_percentage').html('-');
    $('#eodrangeTarget').html('');
    $('#eodbig').html('-');
    $('#eodbighit').html('-');
    $('#eodbigbal').html('-');
    $('#eodbigper').html('-');
    $('#eodsmall').html('-');
    $('#eodsmallhit').html('-');
    $('#eodsmallbal').html('-');
    $('#eodsmallper').html('-');
    $('#eodrange_overallArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});
    $('#eodrange_bigArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});
    $('#eodrange_smallArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    // $('#mhTotal').html("₱ "+ (parseFloat(data.mhTotalBO)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    // $('#mhTotalAllowance').html("₱ "+ (parseFloat(data.mhBOAllowance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    // $('#mh_percentage').html(data.mhPrecentageRate);
    // arrowStatus(data.mhArrowStat, "mhArrowStatus");
}

function execDefaultData1(){
    $('#centeredWeekNo').html('-');

    $('#mtdA_percentage').html('-');
    $('#mtdA_target').html(' ');
    $('#mtdA_sales').html('---');
    $('#mtdA_balance').html('---');
    $('#mtdAArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    $('#mcpProductiviy_prod').html('---');
    $('#mcpProductiviy_unprod').html('---');
    $('#mcpProductiviy_total').html(' ');
    $('#mcpProductiviy_percentage').html('-');
    $("#mcpProdArrowStatus").html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});
    
    $('#gcr_percentage').html('-');
    $('#gcr_target').html(' ');
    $('#gcr_actual').html('---');
    $('#gcr_visited').html('---');
    $('#gcr_unvi').html('---');
    $('#gcr_arrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    $('#uniquePercentage').html('-');
    $('#uniqueProdCtr').html('---');
    $('#uniqueAllProdCtr').html('---');
    $('#uniqueTrn').html(' ');

    $('#srPercentage').html('-');
    $('#srTarget').html(' ');
    $('#srProd').html('---');
    $('#srUnprod').html('---');
    $('#srArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    $('#range_percentage').html('-');
    $('#rangeTarget').html('');
    $('#big').html('-');
    $('#bighit').html('-');
    $('#bigbal').html('-');
    $('#bigper').html('-');
    $('#small').html('-');
    $('#smallhit').html('-');
    $('#smallbal').html('-');
    $('#smallper').html('-');
    $('#range_overallArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});
    $('#range_bigArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});
    $('#range_smallArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    $('#mhTotal').html('---');
    $('#mhTotalAllowance').html('---');
    $('#mh_percentage').html('-');
    $('#mhArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    $('#b2bActive').html('-');
    $('#mybuddySales').html('-');
    $('#fastsosyoSales').html('-');
    $('#b2b_reg').html('-');
    $('#b2b_reg_per').html('-');
    $('#b2b_prod').html('-');
    $('#b2b_prod_per').html('-');
    $('#b2b_freq').html('-');
}

function fetch_CURRENTDAY(mdCode, date){
    return $.ajax({
        url: LOCALLINK + API_ENDPOINT,
        type: "GET",
        data: {
            "type": "GET_CURRENT_DAY_DETAILS",
            "CONN": con_info,
            "mdCode": mdCode,
            "date": date
        },
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function(data){
            if(data.isHaveData == true){
                execData2(data);
                return data;
            } else {
                execDefaultData2();
            } 
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert('Ops! Something went wrong!' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!');
        }
    })
}

function fetch_EOD(mdCode, date){
    return $.ajax({
        url: LOCALLINK + API_ENDPOINT,
        type: "GET",
        data: {"type": "GET_EOD_MTD", "CONN": con_info, "mdCode": mdCode, "date": date},
        dataType: "JSON",
        crossDomain: true,
        cache: false
    }).done(function(data) {
        if(data.isHaveData == true){
            execData2(data);
            return data;
        } else {
            execDefaultData2();
        }        
    })
    .fail(function(XMLHttpRequest, textStatus, errorThrown) {
        alert('Ops! Something went wrong!' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!');
    });
}

// fetchAllDataSalesman();
function fetchAllDataSalesman(){
    $.ajax({
        url: LOCALLINK + API_ENDPOINT,
        type: "GET",
        data: {"type": "SALESMAN_DATA_LIST", "CONN": con_info},
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function(data){
            console.log("Response from server:", data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert('Ops! Something went wrong!' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!');
        }
    })
}
// getRemainingDays(630001);
function getRemainingDays(mdCode){
    $.ajax({
        url: LOCALLINK + API_ENDPOINT,
        type: "GET",
        data: { "type": "REMAINING_DAYS_MONDE", "CONN": con_info, "mdCode": mdCode },
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function(data){
            // console.log('remaining dats: '+ data);
            $("#remdaysCont").html(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert('Ops! Something went wrong!' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!');
        }
    })
}

function fetchMTD_All(mdCode, date){
    fetchCustomerFreq(mdCode, date);

    return $.ajax({
        url: LOCALLINK + API_ENDPOINT,
        type: "GET",
        data: {"type": "GET_MTD_DETAILS_MONDE", "CONN": con_info, "mdCode": mdCode, "date": date},
        dataType: "JSON",
        crossDomain: true,
        cache: false
    }).done(function(data) {
        if(data) {
            execData1(data);
            return data;
        }
    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
        alert('Ops! Something went wrong!' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!');
    });
}

function syncMTD_EOD_All(mdCode, date){
    fetchCustomerFreq(mdCode, date);
    
    return $.ajax({
        url: LOCALLINK + API_ENDPOINT,
        type: "GET",
        data: {"type": "GET_MTD_DETAILS_MONDE", "CONN": con_info, "mdCode": mdCode, "date": date},
        dataType: "JSON",
        crossDomain: true,
        cache: false
    }).then(function(firstresponseData){
        return $.ajax({
            url: LOCALLINK + API_ENDPOINT,
            type: "GET",
            data: {"type": "GET_EOD_MTD", "CONN": con_info, "mdCode": mdCode, "date": date},
            dataType: "JSON",
            crossDomain: true,
            cache: false
        }).then(function(secondResponseData) {
            var combinedData = {
                monthlydata: firstresponseData,
                currdatedata: secondResponseData
            };
            return combinedData;
        });
    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
        alert('Ops! Something went wrong!' + XMLHttpRequest.responseText + ' CONTACT SYSTEM ADMINISTRATOR!');
    })
}

function fetchACHIEVEMENT(mdCode, date){
    $.ajax({
        url: LOCALLINK + API_ENDPOINT,
        type: "GET",
        data: { "type": "MTD_ACHIEVEMENT", "CONN": con_info, "mdCode": mdCode, "date": date },
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function(data){
            // console.log(data);
            // "₱ "+ (parseFloat(data.MTD_totalSales)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            $('#mtdA_percentage').html(data.MTD_Percentage);
            $('#mtdA_target').html(simplifyAmount(parseInt(data.MTD_targetSales)));
            $('#mtdA_sales').html("₱ "+ (parseFloat(data.MTD_totalSales)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
            $('#mtdA_balance').html("₱ "+ (parseFloat(data.MTD_balance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
            arrowStatus(data.MTD_ArrowStat, "mtdAArrowStatus");
        }
    })
}

function fetchCustomerFreq(mdCode, date){
    $.ajax({
        url: LOCALLINK + API_ENDPOINT,
        type: "GET",
        data: { "type": "CUST_FREQUENCY", "CONN": con_info, "mdCode": mdCode },
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function(data){
            // console.log(data);
            // RAVAMATE
            // $('#uniquePercentage').html(data.unique_product_rate + "%");
            $('#targetBuying').html(data.targetCount);
            $('#activeBuying').html(data.activeCount);
            $('#uniqueBuying').html(data.uniqueCount);

        }
    })

}
function local_Optimized_Checker(mdCode, date){
    var isSeen = false;

    reportDetails.forEach(function(salesmanDetails){
        if(salesmanDetails.mdCode == mdCode && salesmanDetails.date == date){
            (salesmanDetails.isHaveMonthlyData)? execData1(salesmanDetails.perMonth) : execDefaultData1(salesmanDetails.perMonth);
            (salesmanDetails.isHaveDayData)?  execData2(salesmanDetails.perDay) : execDefaultData2(salesmanDetails.perDay);
            isSeen = true;
            return;
        }
    });

    if(!isSeen){
        // var dialog = bootbox.dialog({
        //     message: '<p style="text-align: center;"><i class="fa fa-spin fa-spinner"></i> please wait...</p>',
        //     backdrop: true
        // });
        // var botboxMsg = '';
        Swal.fire({
            html: "Please Wait... Syncing Salesman Data...",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        fetchMTD_All(mdCode, date).then(function(monthlydata) {
            if(date == todaysDat){
                fetch_CURRENTDAY(mdCode, date).then(function(currdatedata) {
                    var isHaveDayData = currdatedata.isHaveData;
                    var isHaveMonthlyData = monthlydata.isHaveData;
                    var salesmandets = {
                        mdCode: mdCode,
                        date: date,
                        sync: false,
                        isHaveDayData: isHaveDayData,
                        isHaveMonthlyData: isHaveMonthlyData,
                        perMonth: monthlydata,
                        perDay: currdatedata,
                    };
                    reportDetails.push(salesmandets);
                }).always(function() {
                    setTimeout(() => {
                        // dialog.modal('hide');
                        Swal.close();
                    }, 1000);
                });
            } else{
                fetch_EOD(mdCode, date).then(function(currdatedata) {
                    var isHaveDayData = currdatedata.isHaveData;
                    var isHaveMonthlyData = monthlydata.isHaveData;
                    var salesmandets = {
                        mdCode: mdCode,
                        date: date,
                        sync: false,
                        isHaveDayData: isHaveDayData,
                        isHaveMonthlyData: isHaveMonthlyData,
                        perMonth: monthlydata,
                        perDay: currdatedata,
                    };
                    reportDetails.push(salesmandets);
                }).always(function() {
                    setTimeout(() => {
                        // dialog.modal('hide');
                        Swal.close();
                    }, 1000);
                });
            }
            
        });
    }
}

function fetchPROD(mdCode){
    $.ajax({
        url: LOCALLINK + API_ENDPOINT,
        type: "GET",
        data: { "type": "FETCH_PROD", "CONN": con_info, "mdCode": mdCode },
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function(data){
            // console.log(data);
            $('#mcpProductiviy_prod').html(data.MCPP_productive);
            $('#mcpProductiviy_unprod').html(data.MCPP_unproductive);
            $('#mcpProductiviy_total').html(data.MCPP_Total);
            $('#mcpProductiviy_percentage').html(data.MCPP_Productivity);
            arrowStatus(data.MCPP_ArrowStat, "mcpProdArrowStatus");
        }
    })
}

function getRemainingDays(mdCode){
    $.ajax({
        url: LOCALLINK + API_ENDPOINT,
        type: "GET",
        data: { "type": "REMAINING_DAYS_MONDE", "CONN": con_info, "mdCode": mdCode },
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function(data){
            // console.log(data);
            $('#remdaysCont').html(data);
        }
    })
}

function fetchGCR(mdCode, date){
    $.ajax({
        url: LOCALLINK + API_ENDPOINT,
        type: "GET",
        data: { "type": "FETCH_GCR", "CONN": con_info, "mdCode": mdCode, "date": date},
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function(data){
            // console.log(data);
            $('#gcr_percentage').html(data.GCRpercentage);
            $('#gcr_target').html(data.GCRtarget);
            $('#gcr_actual').html(data.GCRtarget);
            $('#gcr_visited').html(data.GCRvisited);
            $('#gcr_unvi').html(data.GCRunvisited);
            arrowStatus(data.GCRArrowStat, "gcr_arrowStatus");
        }
    })
}

function fetchSTRIKERATE(mdCode, date){
    $.ajax({
        url: LOCALLINK + API_ENDPOINT,
        type: "GET",
        data: { "type": "FETCH_STRIKERATE", "CONN": con_info, "mdCode": mdCode, "date": date},
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function(data){
            $('#srPercentage').html(data.SRpercentage);
            $('#srTarget').html(data.SRtarget);
            $('#srProd').html(data.SRprod);
            $('#srUnprod').html(data.SRunprod);
            arrowStatus(data.SRArrowStat, "srArrowStatus");
        }
    })
}

function fetchRANGE(mdCode){
    $.ajax({
        url: LOCALLINK + API_ENDPOINT,
        type: "GET",
        data: { "type": "FETCH_RANGE", "CONN": con_info, "mdCode": mdCode },
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function(data){
            // console.log(data);
            $('#range_percentage').html(data.R_OverAllPer);
            $('#rangeTarget').html(data.R_targetMCP);
            $('#big').html(data.R_big);
            $('#bighit').html(data.R_bigHit);
            $('#bigbal').html(data.R_bigBal);
            $('#bigper').html(data.R_Per_big);
            $('#small').html(data.R_small);
            $('#smallhit').html(data.R_smallHit);
            $('#smallbal').html(data.R_smallBal);
            $('#smallper').html(data.R_Per_small);
            arrowStatus(data.R_ArrowStat, "range_overallArrowStatus");
            arrowStatus(data.R_ArrowStat_Big, "range_bigArrowStatus");
            arrowStatus(data.R_ArrowStat_Small, "range_smallArrowStatus");
        }
    })
}

function fetchMH(mdCode){
    $.ajax({
        url: LOCALLINK + API_ENDPOINT,
        type: "GET",
        data: { "type": "FETCH_MH", "CONN": con_info, "mdCode": mdCode },
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function(data){
            // console.log(data);
            // (parseFloat("8208.2300") / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            $('#mhTotal').html("₱ "+ (parseFloat(data.mhTotalBO)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
            $('#mhTotalAllowance').html("₱ "+ (parseFloat(data.mhBOAllowance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
            $('#mh_percentage').html(data.mhPrecentageRate);
            arrowStatus(data.mhArrowStat, "mhArrowStatus");
        }
    })
}

function simplifyAmount(number) {
    var suffixes = ["", "K", "M", "B", "T"];
    
    var magnitude = 0;
    while (number >= 1000 && magnitude < suffixes.length - 1) {
        number /= 1000;
        magnitude++;
    }
    return number.toFixed(1) + suffixes[magnitude];
}

function arrowStatus(status, arrowID){
    if(status == true){
        $('#'+arrowID+'').removeClass("fa-arrow-down").css({"color":"#03F61B"});
        $('#'+arrowID+'').addClass("fa-arrow-up").css({"color":"#03F61B"});
        // <i class="fa-solid fa-arrow-up" style="color: #03F61B;"></i>
    } else if(status == -1){
        $('#'+arrowID+'').removeClass("fa-arrow-down").css({});
        $('#'+arrowID+'').removeClass("fa-arrow-up").css({});
    } else{
        $('#'+arrowID+'').removeClass("fa-arrow-up").css({"color":"#03F61B"});
        $('#'+arrowID+'').addClass("fa-arrow-down").css({"color":"#FF0000"});
        // <i class="fa-solid fa-arrow-down" style="color: #FF0000;"></i>
    }
}

function b2bProductiveFontColor(value){
    if(value == 0){
        $('#b2b_prod_per').css({"color":"#000"});
    } else if(value > 50){
        $('#b2b_prod_per').css({"color":"#03F61B"});
    } else {
        $('#b2b_prod_per').css({"color":"#FF0000"});
    }
}

function b2bFreqFontColor(value){
    if(value == 0){
        $('#b2b_freq').css({"color":"#000"});
    } else if(value < 5){
        $('#b2b_freq').css({"color":"#FF0000"});
    } else {
        $('#b2b_freq').css({"color":"#03F61B"});
    }
}