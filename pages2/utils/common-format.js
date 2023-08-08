export function formatFullDate1(time) {

	if (time) {
		let date = new Date(time)
		var md = date.getMonth() + 1 + '-' + date.getDate()
		return date.getFullYear() + '-' + md
	}
}
export function parseDate(str){
 if(str.match(/^\d{4}[\-\/\s+]\d{1,2}[\-\/\s+]\d{1,2}$/)){
  return new Date(str.replace(/[\-\/\s+]/i,'/'));
 }
 else if(str.match(/^\d{8}$/)){
  return new Date(str.substring(0,4)+'/'+str.substring(4,6)+'/'+str.substring(6));
 }
 else{
  return ('时间转换发生错误！');
 }
}

export function GetAgeByBrithday(birthday){
 var age=-1;
 var today=new Date();
 var todayYear=today.getFullYear();
 var todayMonth=today.getMonth()+1;
 var todayDay=today.getDate();
 var birthday=parseDate(birthday);
 if(parseDate(birthday)!='时间转换发生错误！')
 {
 birthdayYear=birthday.getFullYear();
 birthdayMonth=birthday.getMonth();
 birthdayDay=birthday.getDate();
 if(todayYear-birthdayYear<0)
 {
  alert("出生日期选择错误!");
 }
 else
 {
  if(todayMonth*1-birthdayMonth*1<0)
  {
    age = (todayYear*1-birthdayYear*1)-1;
  }
  else
  {
    if(todayDay-birthdayDay>=0)
    {//alert(thisDay+'-'+brithd+"_ddd");
      age = (todayYear*1-birthdayYear*1);
    }
    else
    {
      age = (todayYear*1-birthdayYear*1)-1;
    }
  }
 }
 return age*1;
 }
 else{
 return -1;
 }
}
