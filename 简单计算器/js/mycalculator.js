var text = document.getElementById("myinput"),
    btns = document.getElementsByTagName("button"),
    p = document.getElementById("pp"),
    d = document.getElementById("dd"),
    g = document.getElementById("gg"),
    t = document.getElementById("tt");


for(var i=2;i<btns.length-1;i++){
    (function(i){
        btns[i].onclick = function(){
            text.value = text.value + btns[i].innerHTML;
            d.pause();
            p.play();
        }
    })(i);
}
// 归零函数
btns[0].onclick = function(){
    text.value = "";
    d.pause();
    g.play();
}
// 退格函数
btns[1].onclick = function(){
    d.pause();
    t.play();
    if(text.value.substring(text.value.length-1) == ' '){
    text.value = text.value.substring(0,text.value.length-3);
    } else{
    text.value = text.value.substring(0,text.value.length-1);
    }
}
// 等号函数
btns[18].onclick = function(){
    d.play();
    // 拿到符号数组
    var str = text.value.substring(0),
        operatorstr = [],
        j=0;
    for(i=0;i<str.length;i++){
        if(str[i]=="+" || str[i]=="-" || str[i]=="*" || str[i]=="/"){
            operatorstr[j] = str[i];
            j++;
        }
    }
    // 拿到参与计算的各个数
    str = str.replace(/\ /g,'');
    str = str.replace(/\+/g,',');
    str = str.replace(/\-/g,",");
    str = str.replace(/\*/g,',');
    str = str.replace(/\//g,',');
    var numstr = str.split(',');

    //%的计算和输入多个%的bug处理
    for(i=0;i<numstr.length;i++){
        if(numstr[i].indexOf('%')!=-1){
            if(numstr[i].indexOf('%')!=numstr[i].length-1){
                operatorstr[operatorstr.length] = '错误字符';
            }
            else{
                numstr[i] = parseFloat(numstr[i].substring(0,numstr[i].length-1)) / 100;
            }
        }
    }
    //输入多个.的bug处理
    var sums = 0;
    for(i=0;i<numstr.length;i++){
        for(j=0;j<numstr[i].length;j++){
            if(numstr[i].charAt(j)=='.'){
                sums = sums + 1;
            }
        }
        if(sums>1){
            operatorstr[operatorstr.length] = '错误字符';
            break;
        }
        else{
            sums = 0;
        }
    }

    for(i=0;i<numstr.length;i++){
        if(numstr[i] == ""){
            operatorstr[operatorstr.length] = '错误字符';            
        }
    }

    //先计算乘除
    for(i=0;i<operatorstr.length;i++){
        if(operatorstr[i]=='*' || operatorstr[i]=='/'){
            switch(operatorstr[i]){
                case '*': numstr[i] = parseFloat(numstr[i]) * parseFloat(numstr[i+1]);break;
                case '/': numstr[i] = parseFloat(numstr[i]) / parseFloat(numstr[i+1]);break; 
            }
            operatorstr.splice(i,1);
            numstr.splice(i+1,1);
            i--;
        }
    }
    //再计算加减
    for(i=0;i<operatorstr.length;i++){
        switch(operatorstr[i]){
            case '+':numstr[i+1] = parseFloat(numstr[i]) + parseFloat(numstr[i+1]);break;
            case '-':numstr[i+1] = parseFloat(numstr[i]) - parseFloat(numstr[i+1]);break; 
            case '错误字符' : numstr[i+1] = "计算错误！";alert("输入有误！");
        }
    }
    
    text.value = numstr[numstr.length-1];


   
}
