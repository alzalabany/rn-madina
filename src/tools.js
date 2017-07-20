import moment from 'moment'
export const range = (start, stop, step)=>{
    var a=[start], b=start;
    while((b+step)<stop){b+=step;a.push(b)}
    return a;
  };
export const getRanges = ($start=8,$end=15,$time=30) =>{
    var d = new Date();
    $start = Math.floor(d.setHours($start,0,0)/1000);
    $end = Math.floor(d.setHours($end,0,0)/1000);
    
    $halfHourSteps = range($start, $end-($time*60), $time*60);
    return $halfHourSteps.map($t=> moment($t*1000).format('hh:mm'));
 }


export const timeToHuman = (time)=>{
 let x = String(time)
 let min = x.split(':')[1] || '00';
 let y = x.indexOf(':') ? x.split(':')[0]/1 : x/1;
 let am = y>=12 ? 'pm' : 'am';
 y =  y===12 ? 12 : y > 12 ? y-12 : y<10 ? '0'+y : y;
 
 return ' '+y+':'+min+am+' ';
}