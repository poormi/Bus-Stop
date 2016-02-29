var keyCode = {
 KEYCODE_DPAD_UP: 19, // 向上选择
 KEYCODE_UP: 38,    // 向上选择
 KEYCODE_DPAD_DOWN: 20, // 向下选择
 KEYCODE_DOWN: 40,    // 向下选择
 KEYCODE_OK: 66,    // 确认
 KEYCODE_ENTER: 13,   // 确认
 KEYCODE_BACK: 4  // 取消
}
var currentList,maxHeight=0;
$(function(){
    showLoading();
    $.mobile.defaultPageTransition = "none";
    var top = parseInt($(".ui-header").css("marginTop"));
    maxHeight = document.body.clientHeight-$(".wrapper").offset().top-top;
    $(".wrapper").each(function(){$(this).height(maxHeight)});    

    currentList = $("#list1");
    getData();
});

function changePage(that){
    $(".flip-container")[0].classList.toggle("hover");
    $(".wrapper").scrollTop(0);
    currentList = $($(that).attr("url")).find(".listView");
    $($(that).attr("url")).show();
    $(that).parents(".ui-header").parent().hide();
    $(".focus").removeClass("focus");
    $(currentList.children()[0]).addClass("focus"); 
}

var json = {
  lines:{
    line:[{
      stats:"晶澳站;通威太阳能;长习路口;望江西路;长彩路口;永和家园;创新示范区;中试基地;创新大道;创新公寓;高新区管委会;动漫基地;永和路;浮山路;枫林路;蜀南庭苑;警察学院;新华学院;开福寺;蜀山森林公园;蜀山公园管理处;大铺头(长江西路);新加坡花园城;天海路口(天柱路与海关路交叉口)",
      info:"刷公交卡0.5元，普通票价1元,发车时间6:00到19:00;"
    },{
      stats:"站点1;站点2;站点3;站点4;站点5;站点6;站点7;站点8;线路9;站点10",
      info:"刷公交卡0.5元，普通票价1元,发车时间6:00到19:00;"
    }]
  }
};

function getData(){
    if(json && json.lines && json.lines.line &&json.lines.line.length>0){
      var lines=json.lines.line, info = lines[0].info;
      var si = info.indexOf(";")+1,mi = info.lastIndexOf("票价");
      var fee = info.substr(mi+2,2),txt=info.substring(si,info.indexOf(";",si));
      if(txt.indexOf(",")<0 && txt.indexOf("-")>0){
          var time = info.substring(si,info.indexOf(";",si)).split("-");
          txt = "首车："+ time[0]+"，末车："+time[1]
      }       
      //txt += "最高票价"+fee;
      //speakText+= txt;
      $(".busInfo").each(function(){$(this).html(txt)});
      var len = lines.length>=2?2:1;
      for(var i=0;i<=len-1;i++){
        var routes = lines[i].stats.split(';');
        for(var j=0;j<=routes.length-1;j++){
          var li = document.createElement("li");
          li.style.height = maxHeight/2+"px";
          li.className = "ell";
          if (i==0 && j==0) {
            li.className+=" focus";
          };
          var a = document.createElement("a");
          var span = document.createElement("span");
          span.style.display = "block";
          span.innerText = j+1;
          var span2=document.createElement("span");
          span2.className = "station-name";
          span2.innerText = routes[j].split("(")[0].split("[")[0];
          a.title = routes[j];
          a.appendChild(span);a.appendChild(span2);
          if(span2.innerText.length>5){
               var clip = document.createElement("span");
               clip.innerText="...";
               span2.innerText = span2.innerText.substr(0,5);
               a.appendChild(clip);
          }
          li.appendChild(a);
          $("#list"+(i+1)).append(li);
        }
        $("#list"+(i+1)).listview('refresh');
        $(".first_station")[i].innerText =routes[0].trim().split("(")[0].split("[")[0];
        $(".last_station")[i].innerText =routes[routes.length-1].trim().split("(")[0].split("[")[0];        
      }
      $(".listView li").bind("click",function(){
         hover(this);
         var line = $(this).find(".station-name").text().trim();
         var q = encodeURI(cityName+line+"有哪几路公交经过");
         linkTo(q);
      });
    }else{
     error("没有查询到该站点的信息");
    }
    $.mobile.loading( 'hide' );
}

function error(errorText){
     var wrapper = currentList.parents(".ui-content");
     wrapper.css({"display":"table-cell","verticalAlign":"middle","width":document.documentElement.clientWidth+"px","textAlign":"center","fontSize":"0.6em","color":"#000"});
     wrapper.html(errorText);
}

function showLoading(){
  $.mobile.loading( 'show', {
    text: '正在查询中....',
    textVisible: true,
    theme: 'a',
    textonly: true,
     html: ""
  });
}

function handleKeyDown(e){
    e = e || window.event;
    switch(e.keyCode){
        case keyCode.KEYCODE_DPAD_UP:
        case keyCode.KEYCODE_UP:
           upOrDown(-1);
           break;
        case keyCode.KEYCODE_DPAD_DOWN:
        case keyCode.KEYCODE_DOWN:
           upOrDown(1);
           break;
        case keyCode.KEYCODE_OK:
        case keyCode.KEYCODE_ENTER:
           goto();
           break;
    }
    return false;
}

function hover(node){
       $(".listview .ui-btn-active").removeClass("ui-btn-active");
       $(".focus").removeClass("focus");
       var that = $(node);
       that.addClass("focus"); 
}

function goto(){
   if($(".focus").length>0){
        $(".focus").click();
   }
}

function upOrDown(index){
    var i = currentList.children("li").index($(".focus"));
    var wrapper = currentList.parents(".ui-content");
    if(index>0 && $(".focus").next().length>0){
       var next = $(".focus").next();
       $(".focus").removeClass("focus").next().addClass("focus"); 
       if(next.offset().left == 0){
             var t = next.offset().top;
             wrapper .scrollTop(t-wrapper.offset().top);
       }
    }
    else if(index<0 && $(".focus").prev().length>0){
       var prev = $(".focus").prev();
       if($(".focus").offset().left==0){
           wrapper.scrollTop(prev.offset().top-wrapper.offset().top);
       }
       $(".focus").removeClass("focus").prev().addClass("focus"); 
           
    }
    $(".focus").height($(".focus").height-2);
}
