var LOCALLINK = "https://fastdevs-api.com"
var API_ENDPOINT = "/BUDDYGBLAPI/MTDAPI/application.php";

// var LOCALLINK = 'http://localhost/v2';
// var API_ENDPOINT = "/connectionString/LOCALSTORAGE/Reports_Backend/application.php"

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

$('.flipBtn_MTD_EOD').click(function() {
    var today = moment().format('YYYY-MM-DD');
    if($('.spanTitle').html() == 'MTD Overview'){
        $('.flipBtn_MTD_EOD .mdi-flip-horizontal').css({"display":"inline-block", "transform":"rotateY(-180deg)"});
        $('.card .card-inner').css("transform", "rotateY(-180deg)");
        
        $('.spanTitle').html((today == date_selected)? 'Current Day Overview' : 'End Of Day Overview');
    } else{
        $('.card .card-inner').css("transform", "rotateY(0deg)");
        $('.flipBtn_MTD_EOD .mdi-flip-horizontal').css({"display":"inline-block", "transform":"rotateY(0deg)"});
        $('.spanTitle').html('MTD Overview');
    }
});


$('#mtdSyncBtn').click(function(){
    var date = $('#lateDateHolder').val();
    var mdCode = $('#mdCodeHolder').val();
    reportDetails.forEach(function(salesmanObj){
        if(salesmanObj.mdCode == mdCode && salesmanObj.date == date ){
            // if(salesmanObj.sync == false){
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
                    Swal.close();
                }, 2000);
                return;
            // } else{
            //     alert("MTD Overview Detail of Salesman Has Already Been Synced");
            //     return;
            // }
        }
    });  
});


function execData2(data){
    // $('#eodremdaysCont').html(data.sellingDays);
    // $('#centeredWeekNo').html(data.weekNo);

    // $('#eodA_percentage').html(data.MTD_Percentage);
    // $('#eodA_target').html(simplifyAmount(parseInt(data.MTD_targetSales)));
    // $('#eodA_sales').html("₱ "+ (parseFloat(data.MTD_totalSales)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    // $('#eodA_balance').html("₱ "+ (parseFloat(data.MTD_balance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    // arrowStatus(data.MTD_ArrowStat, "eodAArrowStatus");

    // $('#mustHaveTarget').html(data.mustHaveTarget);
    // $('#mustHaveHit').html(data.mustHaveHit);
    // $('#mustHaveBalance').html(data.mustHaveBalance);
    // $('#mustHave_Percentage').html(data.mustHave_Percentage);
    // arrowStatus(data.mustHave_ArrowStat, "mustHave_ArrowStat");

    // $('#cp_target').html(data.cp_target);
    // $('#cp_hit').html(data.cp_hit);
    // $('#cp_balance').html(data.cp_balance);
    // $('#cp_percentage').html(data.cp_percentage);
    // arrowStatus(data.cp_ArrowStat, "cpArrowStatus");

    // $('#eodgcr_percentage').html(data.GCRpercentage);
    // $('#eodgcr_target').html(data.GCRtarget);
    // $('#eodgcr_visited').html(data.GCRvisited);
    // $('#eodgcr_unvi').html(data.GCRunvisited);
    // arrowStatus(data.GCRArrowStat, "eodgcr_arrowStatus");

    // $('#eodsrPercentage').html(data.SRpercentage);
    // $('#eodsrTarget').html(data.SRtarget);
    // $('#eodsrProd').html(data.SRprod);
    // $('#eodsrUnprod').html(data.SRunprod);
    // arrowStatus(data.SRArrowStat, "eodsrArrowStatus");

    // $('#eodrange_percentage').html(data.R_OverAllPer);
    // $('#eodrangeTarget').html(data.R_targetMCP);
    // $('#eodbig').html(data.R_big);
    // $('#eodbighit').html(data.R_bigHit);
    // $('#eodbigbal').html(data.R_bigBal);
    // $('#eodbigper').html(data.R_Per_big);
    // $('#eodsmall').html(data.R_small);
    // $('#eodsmallhit').html(data.R_smallHit);
    // $('#eodsmallbal').html(data.R_smallBal);
    // $('#eodsmallper').html(data.R_Per_small);
    // arrowStatus(data.R_ArrowStat, "eodrange_overallArrowStatus");
    // arrowStatus(data.R_ArrowStat_Big, "eodrange_bigArrowStatus");
    // arrowStatus(data.R_ArrowStat_Small, "eodrange_smallArrowStatus");

    // $('#mhTotal').html("₱ "+ (parseFloat(data.mhTotalBO)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    // $('#mhTotalAllowance').html("₱ "+ (parseFloat(data.mhBOAllowance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    // $('#mh_percentage').html(data.mhPrecentageRate);
    // arrowStatus(data.mhArrowStat, "mhArrowStatus");

    // MONDE PER DAY KPIs
    $('.centeredWeekNo').html(data.weekNo);
    $('#eodA_percentage').html(data.A_Percentage);
    $('#eodA_target').html(data.A_Target != null ? '₱' + simplifyAmount(parseInt(data.A_Target)): '0');
    $('#eodA_sales').html('₱' + parseFloat(data.A_Sales).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    $('#eodA_balance').html('₱' + parseFloat(data.A_Balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    arrowStatus(data.A_ArrowStat, "eodAArrowStatus");

    $('#perDay_aveRange_volume').html(parseInt(data.avg_volume).toLocaleString('en-US'));
    $('#perDay_aveRange_value').html('₱' + parseFloat(data.avg_value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    $('#perDay_aveRange_time').html((parseFloat(data.avg_time_spent)/60).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

    $('#perDay_prod_Percentage').html(data.Prod_Percentage);
    $('#perDay_prod_Target').html(data.MCP_totalCalls);
    $('#perDay_prod_Visited').html(data.MCP_Pro);
    $('#perDay_prod_Balance').html((data.MCP_Bal));
    arrowStatus(data.ProdArrowStat, "perDay_prod_ArrawStat");

    $('#perDay_gcr_Percentage').html(data.GCR_Percentage);
    $('#perDay_gcr_Target').html(data.MCP_totalCalls);
    $('#perDay_gcr_Offsite').html(data.MCP_Offsite);
    $('#perDay_gcr_Onsite').html(data.MCP_Onsite);
    $('#perDay_gcr_Unpro').html(data.MCP_Unpro);
    arrowStatus(data.GCRArrowStat, "perDay_gcr_ArrowStat");
}

function execData1(data){
    $('#remsellingDays').html(data.sellingDays);

    $('#mtdA_percentage').html(data.MTD_Percentage);
    $('#mtdA_target').html(simplifyAmount(parseInt(data.MTD_targetSales)));
    $('#mtdA_sales').html("₱ "+ (parseFloat(data.MTD_totalSales)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    $('#mtdA_balance').html("₱ "+ (parseFloat(data.MTD_balance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    arrowStatus(data.MTD_ArrowStat, "mtdAArrowStatus");

    $('#mtdCustBuy_percentage').html(data.CustFreq_per)  
    $('#mtdCustBuy_target').html((data.CustFreq_targetCount).toLocaleString('en-US'));  
    $('#mtdCustBuy_active').html((data.CustFreq_activeCount).toLocaleString('en-US'));  
    $('#mtdCustBuy_unique').html((data.CustFreq_uniqueCount).toLocaleString('en-US'));  
    arrowStatus(data.CustFreq_ArrowStat, "mtdCustBuyArrowStatus");

    $('#mcpProductiviy_prod').html((data.MCPP_Prod).toLocaleString('en-US'));
    $('#mcpProductiviy_unprod').html((data.MCPP_Unprod).toLocaleString('en-US'));
    $('#mcpProductiviy_total').html((data.MCPP_Target).toLocaleString('en-US'));
    $('#mcpProductiviy_percentage').html(data.MCPP_Productivity);
    arrowStatus(data.MCPP_ArrowStat, "mcpProdArrowStatus");

    $('#gcr_percentage').html(data.GCRpercentage);
    $('#gcr_target').html((data.GCRtarget).toLocaleString('en-US'));
    $('#gcr_unpro').html((data.GCRUnprod).toLocaleString('en-US'));
    $('#gcr_on').html((data.GCROnsite).toLocaleString('en-US'));
    $('#gcr_off').html((data.GCROffsite).toLocaleString('en-US'));
    arrowStatus(data.GCRArrowStat, "gcr_arrowStatus");

    // $('#srPercentage').html(data.SRpercentage);
    // $('#srTarget').html(data.SRtarget);
    // $('#srProd').html(data.SRprod);
    // $('#srUnprod').html(data.SRunprod);
    // arrowStatus(data.SRArrowStat, "srArrowStatus");

    // $('#range_percentage').html(data.R_OverAllPer);
    // $('#rangeTarget').html(data.R_targetMCP);
    // $('#big').html(data.R_big);
    // $('#bighit').html(data.R_bigHit);
    // $('#bigbal').html(data.R_bigBal);
    // $('#bigper').html(data.R_Per_big);
    // $('#small').html(data.R_small);
    // $('#smallhit').html(data.R_smallHit);
    // $('#smallbal').html(data.R_smallBal);
    // $('#smallper').html(data.R_Per_small);
    // arrowStatus(data.R_ArrowStat, "range_overallArrowStatus");
    // arrowStatus(data.R_ArrowStat_Big, "range_bigArrowStatus");
    // arrowStatus(data.R_ArrowStat_Small, "range_smallArrowStatus");
    $('#aveRange_volume').html(parseInt(data.avg_volume).toLocaleString('en-US'));
    $('#aveRange_value').html('₱' + parseFloat(data.avg_value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    $('#aveRange_time').html((parseFloat(data.avg_time_spent)/60).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

    // $('#mhTotal').html("₱ "+ (parseFloat(data.mhTotalBO)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    // $('#mhTotalAllowance').html("₱ "+ (parseFloat(data.mhBOAllowance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    // $('#mh_percentage').html(data.mhPrecentageRate);
    // arrowStatus(data.mhArrowStat, "mhArrowStatus");

    // $('#b2bActive').html(data.B2BActive);
    // $('#mybuddySales').html("₱ "+ (parseFloat(data.B2BMyBuddySales)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    // $('#fastsosyoSales').html("₱ "+ (parseFloat(data.B2BSosyoSales)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    // $('#b2b_reg').html(data.B2BRegistered);
    // $('#b2b_reg_per').html("  ("+data.B2BRegisteredPer+"%)");
    // $('#b2b_prod').html(data.B2BProductive);
    // $('#b2b_prod_per').html("  ("+data.B2BProductivePer+"%)");
    // $('#b2b_freq').html(data.B2BHybridFreq);
    $('#b2b_ActiveMCP').html((data.MCPP_Target).toLocaleString('en-US'));
    $('#b2b_sales1').html('₱' + parseFloat(data.MCPP_Target).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

    
    b2bProductiveFontColor(data.B2BProductivePer);
    b2bFreqFontColor(data.B2BHybridFreq);
}

function execDefaultData2(){
    // $('#eodremdaysCont').html('-');
    // $('#centeredWeekNo').html('-');

    // $('#eodA_percentage').html('-');
    // $('#eodA_target').html(' ');
    // $('#eodA_sales').html('---');
    // $('#eodA_balance').html('---');
    // $('#eodAArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    // $('#mustHaveTarget').html(' ');
    // $('#mustHaveHit').html('---');
    // $('#mustHaveBalance').html('---');
    // $('#mustHave_Percentage').html('-');
    // $('#mustHave_ArrowStat').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    // $('#cp_target').html(' ');
    // $('#cp_hit').html('---');
    // $('#cp_balance').html('---');
    // $('#cp_percentage').html('-');
    // $('#cpArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    // $('#eodgcr_percentage').html('-');
    // $('#eodgcr_target').html(' ');
    // $('#eodgcr_visited').html('---');
    // $('#eodgcr_unvi').html('---');
    // $('#eodgcr_arrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    // $('#eodsrPercentage').html('-');
    // $('#eodsrTarget').html(' ');
    // $('#eodsrProd').html('---');
    // $('#eodsrUnprod').html('---');
    // $('#eodsrArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    // $('#eodrange_percentage').html('-');
    // $('#eodrangeTarget').html('');
    // $('#eodbig').html('-');
    // $('#eodbighit').html('-');
    // $('#eodbigbal').html('-');
    // $('#eodbigper').html('-');
    // $('#eodsmall').html('-');
    // $('#eodsmallhit').html('-');
    // $('#eodsmallbal').html('-');
    // $('#eodsmallper').html('-');
    // $('#eodrange_overallArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});
    // $('#eodrange_bigArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});
    // $('#eodrange_smallArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    // $('#mhTotal').html("₱ "+ (parseFloat(data.mhTotalBO)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    // $('#mhTotalAllowance').html("₱ "+ (parseFloat(data.mhBOAllowance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    // $('#mh_percentage').html(data.mhPrecentageRate);
    // arrowStatus(data.mhArrowStat, "mhArrowStatus");

    // MONDE PER DAY KPIs
    $('.centeredWeekNo').html('-');
    $('#eodA_percentage').html('-');
    $('#eodA_target').html('-');
    $('#eodA_sales').html('---');
    $('#eodA_balance').html('---');
    $('#eodAArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    $('#perDay_aveRange_volume').html('---');
    $('#perDay_aveRange_value').html('---');
    $('#perDay_aveRange_time').html('---');

    $('#perDay_prod_Percentage').html('-');
    $('#perDay_prod_Target').html('-');
    $('#perDay_prod_Visited').html('---');
    $('#perDay_prod_Balance').html('---');
    $('#perDay_prod_ArrawStat').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    $('#perDay_gcr_Percentage').html('-');
    $('#perDay_gcr_Target').html('-');
    $('#perDay_gcr_Offsite').html('---');
    $('#perDay_gcr_Onsite').html('---');
    $('#perDay_gcr_Unpro').html('---');
    $('#perDay_gcr_ArrowStat').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});
}

function execDefaultData1(){
    // $('#centeredWeekNo').html('-');

    // $('#mtdA_percentage').html('-');
    // $('#mtdA_target').html(' ');
    // $('#mtdA_sales').html('---');
    // $('#mtdA_balance').html('---');
    // $('#mtdAArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    // $('#mcpProductiviy_prod').html('---');
    // $('#mcpProductiviy_unprod').html('---');
    // $('#mcpProductiviy_total').html(' ');
    // $('#mcpProductiviy_percentage').html('-');
    // $("#mcpProdArrowStatus").html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});
    
    // $('#gcr_percentage').html('-');
    // $('#gcr_target').html(' ');
    // $('#gcr_actual').html('---');
    // $('#gcr_on').html('---');
    // $('#gcr_off').html('---');
    // $('#gcr_arrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    // $('#uniquePercentage').html('-');
    // $('#uniqueProdCtr').html('---');
    // $('#uniqueAllProdCtr').html('---');
    // $('#uniqueTrn').html(' ');

    // $('#srPercentage').html('-');
    // $('#srTarget').html(' ');
    // $('#srProd').html('---');
    // $('#srUnprod').html('---');
    // $('#srArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    // $('#range_percentage').html('-');
    // $('#rangeTarget').html('');
    // $('#big').html('-');
    // $('#bighit').html('-');
    // $('#bigbal').html('-');
    // $('#bigper').html('-');
    // $('#small').html('-');
    // $('#smallhit').html('-');
    // $('#smallbal').html('-');
    // $('#smallper').html('-');
    // $('#range_overallArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});
    // $('#range_bigArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});
    // $('#range_smallArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    // $('#mhTotal').html('---');
    // $('#mhTotalAllowance').html('---');
    // $('#mh_percentage').html('-');
    // $('#mhArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    // $('#b2bActive').html('-');
    // $('#mybuddySales').html('-');
    // $('#fastsosyoSales').html('-');
    // $('#b2b_reg').html('-');
    // $('#b2b_reg_per').html('-');
    // $('#b2b_prod').html('-');
    // $('#b2b_prod_per').html('-');
    // $('#b2b_freq').html('-');

    // MONDE
    $('.centeredWeekNo').html('-');
    $('#mtdA_percentage').html('-');
    $('#mtdA_target').html('-');
    $('#mtdA_sales').html('---');
    $('#mtdA_balance').html('---');
    $('#mtdAArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    $('#mtdCustBuy_percentage').html('-')  
    $('#mtdCustBuy_target').html('-');  
    $('#mtdCustBuy_active').html('---');  
    $('#mtdCustBuy_unique').html('---');  
    $('#mtdCustBuyArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    $('#mcpProductiviy_prod').html('---');
    $('#mcpProductiviy_unprod').html('---');
    $('#mcpProductiviy_total').html('-');
    $('#mcpProductiviy_percentage').html('-');
    $('#mcpProdArrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});

    $('#gcr_percentage').html('-');
    $('#gcr_target').html('-');
    $('#gcr_unpro').html('---');
    $('#gcr_on').html('---');
    $('#gcr_off').html('---');
    $('#gcr_arrowStatus').html(' ').removeClass("fa-arrow-up").removeClass("fa-arrow-down").css({});
}

function fetch_CURRENTDAY(mdCode, date){
    return $.ajax({
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: {
            "type": "GET_CURRENT_DAY_DETAILS_MONDE",
            "userID": GBL_USERID,
            "distCode": GBL_DISTCODE,
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
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type": "GET_EOD_MTD", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "mdCode": mdCode, "date": date},
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
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type": "SALESMAN_DATA_LIST", "userID": GBL_USERID, "distCode": GBL_DISTCODE},
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
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: { "type": "REMAINING_DAYS_MONDE", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "mdCode": mdCode },
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
    return $.ajax({
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type": "GET_MTD_DETAILS_MONDE", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "mdCode": mdCode, "date": date},
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
    return $.ajax({
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: {"type": "GET_MTD_DETAILS_MONDE", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "mdCode": mdCode, "date": date},
        dataType: "JSON",
        crossDomain: true,
        cache: false
    }).then(function(firstresponseData){
        return $.ajax({
            url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
            type: "POST",
            data: {"type": "GET_EOD_MTD", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "mdCode": mdCode, "date": date},
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
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: { "type": "MTD_ACHIEVEMENT", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "mdCode": mdCode, "date": date },
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
            // if(date == todaysDat){
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
            // } else{
            //     fetch_EOD(mdCode, date).then(function(currdatedata) {
            //         var isHaveDayData = currdatedata.isHaveData;
            //         var isHaveMonthlyData = monthlydata.isHaveData;
            //         var salesmandets = {
            //             mdCode: mdCode,
            //             date: date,
            //             sync: false,
            //             isHaveDayData: isHaveDayData,
            //             isHaveMonthlyData: isHaveMonthlyData,
            //             perMonth: monthlydata,
            //             perDay: currdatedata,
            //         };
            //         reportDetails.push(salesmandets);
            //     }).always(function() {
            //         setTimeout(() => {
            //             // dialog.modal('hide');
            //             Swal.close();
            //         }, 1000);
            //     });
            // }
            
        });
    }
}

function fetchPROD(mdCode){
    $.ajax({
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: { "type": "FETCH_PROD", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "mdCode": mdCode },
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
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: { "type": "REMAINING_DAYS_MONDE", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "mdCode": mdCode },
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
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: { "type": "FETCH_GCR", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "mdCode": mdCode, "date": date},
        dataType: "JSON",
        crossDomain: true,
        cache: false,
        success: function(data){
            // console.log(data);
            $('#gcr_percentage').html(data.GCRpercentage);
            $('#gcr_target').html(data.GCRtarget);
            $('#gcr_actual').html(data.GCRtarget);
            $('#gcr_on').html(data.GCRvisited);
            $('#gcr_off').html(data.GCRunvisited);
            arrowStatus(data.GCRArrowStat, "gcr_arrowStatus");
        }
    })
}

function fetchSTRIKERATE(mdCode, date){
    $.ajax({
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: { "type": "FETCH_STRIKERATE", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "mdCode": mdCode, "date": date},
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
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: { "type": "FETCH_RANGE", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "mdCode": mdCode },
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
        url: GLOBALLINKAPI + "/connectionString/applicationipAPI.php",
        type: "POST",
        data: { "type": "FETCH_MH", "userID": GBL_USERID, "distCode": GBL_DISTCODE, "mdCode": mdCode },
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
    // return number.toFixed(1) + suffixes[magnitude]; correct but it will round up.
    return (Math.floor(number * 10) / 10) + suffixes[magnitude];
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