let time = 60;
let timer;
function countTime(endCallback){
  time--;
  if(time<1){
    time = 60;
    clearTimeout(timer);
    endCallback.call(this);
    return;
  }
  this.setData({
    seconds:time
  })
  timer = setTimeout(countTime.bind(this,endCallback),1000);

}
countTime.resetTime=function(){
  time = 60;
  clearTimeout(timer)
  this.setData({
    seconds:false
  })
}
module.exports=countTime;