function Snack (grade) {
    this.grade = grade;
    this.speed = grade;

    this.boxHeight = 0;
    this.boxWidth = 0;
    this.snack = [{x: 2, y: 1, act: 'head'},
                {x: 1, y: 1, act: 'body'},
                {x: 0, y: 1, act: 'body'}];

    this.snackWay = 'right';
    this.score = -1;
    this.fruit = null;
    this.move = null;
    this.time = 0;
}

Snack.prototype.init = function () {
    this.again();
    let This = this;
    let viewport = getViewportOffset(),
        box = document.getElementsByClassName("content")[0],
        head = document.getElementsByClassName("header")[0],
        pause = document.getElementsByClassName("pause")[0],
        playAgain = document.getElementsByClassName("again")[0],
        score = document.getElementsByClassName("score")[0];
    head.style.height = viewport.h * 0.1 + 'px';
    this.boxHeight = Math.floor( viewport.h * 0.7 / 20);
    this.boxWidth = Math.floor(viewport.w * 0.7 / 20);
    box.style.height = this.boxHeight * 20 + 'px';
    box.style.width = this.boxWidth * 20 + 'px';

    this.upFruit();
    this.upSnack();

    score.innerHTML = this.score;

    this.startPlay = function () {
        This.snackMove();
    }

    addEvent(pause, 'click', function () {
        This.pause();
    });
    addEvent(playAgain, 'click', function () {
        This.init();
    })
    addEvent(document, 'keydown', This.startPlay);
}

Snack.prototype.startPlay = function () {}

Snack.prototype.pause = function () {
    let pause = document.getElementsByClassName("pause")[0];
    if (this.move) {
        clearInterval(this.move);
        this.move = null;
        pause.innerHTML = '开始';
    } else {
        switch (this.snackWay) {
            case 'left':  
                this.move = setInterval(() => {
                    for (let i = this.snack.length-1; i > 0; i--){
                        this.snack[i].x = this.snack[i-1].x;
                        this.snack[i].y = this.snack[i-1].y;
                    }
                    this.snack[0].x--;
                    this.upSnack();
                }, this.grade);
                break;
            case 'top':
                this.move = setInterval(() => {
                    for (let i = this.snack.length-1; i > 0; i--){
                        this.snack[i].x = this.snack[i-1].x;
                        this.snack[i].y = this.snack[i-1].y;
                    }
                    this.snack[0].y--;
                    this.upSnack();
                }, this.grade);
                break;
            case 'right': 
                this.move = setInterval(() => {
                    for (let i = this.snack.length-1; i > 0; i--){
                        this.snack[i].x = this.snack[i-1].x;
                        this.snack[i].y = this.snack[i-1].y;
                    }
                    this.snack[0].x++;
                    this.upSnack();
                }, this.grade);
                break;
            case 'bottom': 
                this.move = setInterval(() => {
                    for (let i = this.snack.length-1; i > 0; i--){
                        this.snack[i].x = this.snack[i-1].x;
                        this.snack[i].y = this.snack[i-1].y;
                    }
                    this.snack[0].y++;
                    this.upSnack();
                }, this.grade);
                break;
        }
        pause.innerHTML = '暂停';
    }
}

Snack.prototype.getSpeed = function () {

}

Snack.prototype.upFruit = function () {
    let box = document.getElementsByClassName("content")[0],
        fruitDom = document.getElementsByClassName("fruit")[0],
        score = document.getElementsByClassName("score")[0];
    let fruit = document.createElement("div");

    if (fruitDom) {
        fruitDom.remove();
    }

    fruit.style.position = 'absolute';
    this.fruit = {left: Math.floor(Math.random() * this.boxWidth),
                 top: Math.floor(Math.random() * this.boxHeight)};
    fruit.className = 'fruit';
    fruit.style.left = this.fruit.left * 20 + 'px';
    fruit.style.top = this.fruit.top * 20 + 'px';
    fruit.style.height = '20px';
    fruit.style.width = '20px';
    fruit.style.backgroundColor = 'orange';
    fruit.style.borderRadius = '50%';
    box.appendChild(fruit);
    this.score++;
    score.innerHTML = this.score;
}

Snack.prototype.upSnack = function () {
    let gameOver = false,
        x = this.snack[0].x,
        y = this.snack[0].y,
        box = document.getElementsByClassName("content")[0],
        snackDom = document.getElementsByClassName("snack"),
        snackDomLen = snackDom.length,
        fruitDom = document.getElementsByClassName("fruit")[0];
        len = this.snack.length;

    if (x < 0 || x >= this.boxWidth || y < 0 || y >= this.boxHeight) {
        gameOver = true;
    }
    if (this.snack[0].x == this.fruit.left && this.snack[0].y == this.fruit.top) {
        this.snack.push({
            x: this.snack[len-1].x - this.snack[len-2].x + this.snack[len-1].x,
            y: this.snack[len-1].y - this.snack[len-2].y + this.snack[len-1].y,
            act: 'body'
        });
        len++;
        this.upFruit();
    }
    
    for (let i = snackDomLen-1; i > -1; i--) {
        snackDom[i].remove();
    }
    for (let i = 0; i < len; i++) {
        if (i != 0 && this.snack[i].x == this.snack[0].x && this.snack[i].y == this.snack[0].y) {
            gameOver = true;
        } 
        let snackBody = document.createElement("div");
        snackBody.style.position = 'absolute';
        snackBody.className = 'snack';
        snackBody.style.left = this.snack[i].x * 20 + 'px';
        snackBody.style.top = this.snack[i].y * 20 + 'px';
        snackBody.style.height = '20px';
        snackBody.style.width = '20px';
        if (this.snack[i].act == 'body') {
            snackBody.style.backgroundColor = 'orange';
            snackBody.style.borderRadius = '50%';
        } else {
            snackBody.style.backgroundColor = 'red';
        }
        box.appendChild(snackBody);
    }
    if (gameOver) {
        alert(`游戏结束，得分${this.score}`);
        clearInterval(this.move);
        removeEvent(document, 'keydown', this.startPlay);
    }
}

Snack.prototype.snackMove = function (event) {
    let e = event || window.event;
    let This = this;
    let pause = document.getElementsByClassName("pause")[0];
    let time2 = new Date().getTime();
    if (time2 - this.time <= this.grade) {
        this.time = time2;
        return;
    }
    this.time = time2;

    pause.innerHTML = '暂停';

    switch (e.keyCode) {
        case 37: 
            if (this.snackWay != 'right') {
                clearInterval(this.move);
                this.move = setInterval(() => {
                    for (let i = this.snack.length-1; i > 0; i--){
                        this.snack[i].x = this.snack[i-1].x;
                        this.snack[i].y = this.snack[i-1].y;
                    }
                    this.snack[0].x--;
                    this.upSnack();
                }, this.grade);
                this.snackWay = 'left';
            }
            break;
        case 38: 
            if (this.snackWay != 'bottom') {
                clearInterval(this.move);
                this.move = setInterval(() => {
                    for (let i = this.snack.length-1; i > 0; i--){
                        this.snack[i].x = this.snack[i-1].x;
                        this.snack[i].y = this.snack[i-1].y;
                    }
                    this.snack[0].y--;
                    this.upSnack();
                }, this.grade);
                this.snackWay = 'top';
            }
            break;
        case 39: 
            if (this.snackWay != 'left') {
                clearInterval(this.move);
                this.move = setInterval(() => {
                    for (let i = this.snack.length-1; i > 0; i--){
                        this.snack[i].x = this.snack[i-1].x;
                        this.snack[i].y = this.snack[i-1].y;
                    }
                    this.snack[0].x++;
                    this.upSnack();
                }, this.grade);
                this.snackWay = 'right';
            }
            break;
        case 40: 
            if (this.snackWay != 'top') {
                clearInterval(this.move);
                this.move = setInterval(() => {
                    for (let i = this.snack.length-1; i > 0; i--){
                        this.snack[i].x = this.snack[i-1].x;
                        this.snack[i].y = this.snack[i-1].y;
                    }
                    this.snack[0].y++;
                    this.upSnack();
                }, this.grade);
                this.snackWay = 'bottom';
            }
            break;
        case 32: 
            // this.speedChange = function () {
            //     This.speedDown();
            // }
            // addEvent(document, 'keyup', This.speedChange);

            // this.grade = this.grade / 2;
            // console.log(this.grade)
           
            
            // removeEvent(document, 'keyup', This.speedChange);

            clearInterval(this.move);
            pause.innerHTML = '开始';
            break;
    }
}

Snack.prototype.speedChange = function () {}

Snack.prototype.speedUp = function () {
    console.log('upupup')
}

Snack.prototype.speedDown = function () {
    this.grade = this.speed;
    console.log('down')
}

Snack.prototype.again = function () {
    this.snack = [{x: 2, y: 1, act: 'head'},
                {x: 1, y: 1, act: 'body'},
                {x: 0, y: 1, act: 'body'}];

    this.snackWay = 'right';
    this.score = -1;
    this.fruit = null;
    clearInterval(this.move);
    this.move = null;
}

let snack = new Snack(100);
snack.init();