var s = (CryptoJS.AES.decrypt(localStorage.getItem("srvr"),"/")).toString(CryptoJS.enc.Utf8);
var u = (CryptoJS.AES.decrypt(localStorage.getItem("usrnm"),"/")).toString(CryptoJS.enc.Utf8);
var p = (CryptoJS.AES.decrypt(localStorage.getItem("psswrd"),"/")).toString(CryptoJS.enc.Utf8);
var d = (CryptoJS.AES.decrypt(localStorage.getItem("dtbse"),"/")).toString(CryptoJS.enc.Utf8);
var con_info = [s, p, u, d];


iframelinkchecker2();
function iframelinkchecker2(){
    var site = localStorage.getItem('BIID');
    var url = "https://fastbi-analytics.com/public/dashboard/612778d8-aae2-4744-a24f-4da9b349622b?tab=33-executive-summary&loading_date=thismonth&driver_name=&status=&sitecode="+site+"#hide_parameters=sitecode";
    $('#otdMonitoring').prop('src', url);
}


const ACCESS_TOKEN = 'ya29.c.c0ASRK0GaXC997M2Ulabhd-cc5eNO4wI6sQOEjVVYW-MZZcPCkGZhKuxTfaWXifs4tI222qUJhZ-7wZxWhJjSnL8xljzSIMVyxI7kgFqU_3dRVo90WZOKSRO-v8A4zeU8lgcQBTAOSJ3DLuBJMTBFP1juxCbGgIzbiIz-_la8GkkgchbmWcsVpw0JIp5p7TOlepQUKA2WGtn7IVHD4CpAbZJNirQeseyouDuVxJS1LIjpGu7fAjt6p7tsgG9rl4_UDnoTtzJOvXGrdaEvN9qlAOD-y8sgFlkSKdjpU0rrtuvXHn-VjZ2VX_CrU_fm7oWwHkOQkT9EBmFTdjWhiNCgsWeOvJkxvXbcXAEfx8rBaLvatxXOnYgiIPaCyN385D9qduW3oO3Q_kfrzfxr_92B7RfxymZ71gXucaiWW0cIkqMMzjI_9062QY81XbxmefxXujr-QfeU5WMgq0qiwrrynOo7l8eBs0Xofn-274dO4MfRg3Bz9xVy1Ov8bZ7FkpeBB_I92J65Ogeyn8quMr5q63_w7p--1SF_epiVOcuyoU2jBnI4o9m1p6wZ9hoYRbpF0Jpl_ZUiz6xk9_a2zpsu-gVI2g_RzR317xWmvJ8WJwZX04im6duSglZjYXIMY_jQlSMp-WJR8bcln2_zi3e3Wsfsa1h2Xp80lVJks4udJY7Zwt7yx0w_295JaqR594wZIUd_J2RwB6cc_fFu-Qjd0Y7bMFJSQd9c8FppVF6qpSWo5us5z3Sknkv179BRguw0WkywhXzuQx7fscQSvcc7QBu482hg-kSfx5tYtl_9ypsgpJwfdtIbzVIFX2Zgy59YgzdFW2sdxsJ_kVb2Iy7dd6wr5nOQWdJQ6ex4Zn_8SjMd0ZjkbRrcF7ZfX0SSVtdcz7iWsgono0By6x6-hZdccIUatz5pBWbwWdf4J4Uz_brb5cnIBtcvn9ls5fxm31I2Usa3f9x_Mim8s24h470nqit9XtXwcgQp2sX8ZWVW0QnFdcupiFRuFmR6';