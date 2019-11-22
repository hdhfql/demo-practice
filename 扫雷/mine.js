function Mine (tr, td, mineNum) {
    this.tr = tr;
    this.td = td;
    this.mineNum = mineNum;
    this.restMine = mineNum;

    this.mineData = [];
    this.domData = [];
    this.data = [];

    this.flagRight = [];
    this.numRight = [];
}
Mine.prototype.init = function () {
    This = this;
    this.reload();
    this.getMineData();

    let table = document.createElement("table"),
        n = 0;
    table.oncontextmenu = function () {
        return false;
    }

    for (let i = 0; i < this.tr; i++) {
        let tr = document.createElement("tr");
        this.domData[i] = [];
        this.data[i] = [];
        for (let j = 0; j < this.td; j++) {
            let td = document.createElement("td");
            this.domData[i][j] = td;
            if (i * this.td + j == this.mineData[n]) {
                n++;
                this.data[i][j] = {type: "mine", x: i, y: j, flag: false, show: false};
            } else {
                this.data[i][j] = {type: "number", x: i, y: j, value: 0, show: false, flag: false};
            }

            td.pos = {x: i, y: j};

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    this.upValue();

    document.querySelector(".mineBox").innerHTML = '';
    document.querySelector(".mineBox").appendChild(table);
    document.querySelector(".mineNum").innerHTML = this.mineNum;
    
    let tab = document.querySelector("table");

    this.startPlay = function (event) {
        let e = event || window.event;
        let target = e.target || e.src.Element;
        if (target != this && target) {
            This.play(e, target);
        }
    }

    removeEvent(tab, 'mousedown', this.startPlay);
    addEvent(tab, 'mousedown', this.startPlay);

}

Mine.prototype.setBtns = function () {
    let This = this;
    let btns = document.querySelectorAll(".btn");
    let arr = [[9,9,10], [16,16,40], [28,28,99]];
    let mine;
    let arrs = [];
    let ln = 0;
    for (let i = 0; i < btns.length-1; i++) {
        addEvent(btns[i], 'click', function () {
            btns[ln].className = 'btn';
            this.className = 'btnActive btn';
            ln = i;
            mine = new Mine(...arr[i]);
            mine.init();
            arrs.push(mine);
        });
    }

    addEvent(btns[btns.length-1], 'click', function () {
        mine.init()
    });

    btns[0].click();

}

Mine.prototype.upValue = function () {
    for (let i = 0; i < this.tr; i++) {
        for (let j = 0; j < this.td; j++) {
            if (this.data[i][j].type == 'mine') {
                let around = this.getAround(i, j);
                for (let k = 0; k < around.length; k++) {
                    this.data[around[k][0]][around[k][1]].value++;
                }
            }
        }
    }
}

Mine.prototype.getMineData = function () {
    let arr = [];
    let len = this.tr * this.td;
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    arr.sort(function () {
        return 0.5 - Math.random();
    });
    arr = arr.slice(0, this.mineNum).sort(function (a, b) {
        return a - b;
    });
    this.mineData = arr;
}

Mine.prototype.getAround = function (x, y) {
    let around = [];
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (
                i < 0 ||
                j < 0 ||
                i == this.tr ||
                j == this.td ||
                (i == x && j == y) ||
                this.data[i][j].type == "mine"
            ) {
                continue;
            } else {
                around.push([i, j]);
            }
        }
    }
    return around;
}

Mine.prototype.startPlay = function () {}

Mine.prototype.play = function (event, ele) {
    console.log('play')

    let This = this;
    let e = event || window.event;
    let mineNum = document.querySelector(".mineNum");
    let x = ele.pos.x;
    let y = ele.pos.y;
    let numStyle = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
    function clearZero (i, j) {
        let around = This.getAround(i, j);

        for (let k = 0; k < around.length; k++) {
            let x = around[k][0];
            let y = around[k][1];
            if (This.data[x][y].type == 'number' && This.data[x][y].show == false) {
                if (This.data[x][y].value === 0) {
                    This.data[x][y].value = '';
                    This.data[x][y].show = true;
                    This.domData[x][y].className = 'numActive';
                    This.numRight.push('right');
                    clearZero(x, y);
                } else {
                    This.data[x][y].show = true;
                    This.domData[x][y].className = `${numStyle[This.data[x][y].value]} numActive`;
                    This.domData[x][y].innerHTML = This.data[x][y].value;
                    This.numRight.push('right');
                }
            }
        }
    }

    if (this.data[x][y].show == false) {
        if (e.button == 0 && this.data[x][y].flag == false) {
            if (this.data[x][y].type == "number") {
                if (this.data[x][y].value === 0) {
                    this.data[x][y].value = '';
                    this.data[x][y].show = true;
                    clearZero(x, y);
                }
                this.data[x][y].show = true;
                this.domData[x][y].className = `${numStyle[this.data[x][y].value]} numActive`;
                this.domData[x][y].innerHTML = this.data[x][y].value;
                this.numRight.push("right");
                if (this.numRight.length == this.tr * this.td - this.mineNum) {
                    setTimeout(() => {
                        this.gameOver('win');
                    }, 100);
                }
            } else {
                this.domData[x][y].className = "mineActive";
                setTimeout(() => {
                    this.gameOver('failed');
                }, 100);
            }
        } else if (e.button == 2) {
            if (this.data[x][y].flag == false) {
                this.domData[x][y].className = 'flag';
                this.restMine--;
                if (this.data[x][y].type == 'number') {
                    this.flagRight.push('flagWrong');
                }
            } else {
                this.domData[x][y].className = '';
                this.restMine++;
                if (this.data[x][y] == 'number') {
                    this.flagRight.pop();
                }
            }
            this.data[x][y].flag = !this.data[x][y].flag;
            mineNum.innerHTML = this.restMine;
            if (this.restMine == 0) {
                setTimeout(() => {
                    if (this.flagRight.length == 0) {
                        this.gameOver('win');
                    } else {
                        this.gameOver('failed');
                    }
                }, 100);
            }
        }
    } else {
        if (e.button != 0 && e.button != 2) {
            let around = this.getAround(x, y);
            for (let k = 0; k < around.length; k++) {
                let i = around[k][0];
                let j = around[k][1];
                if (this.data[i][j].show == false) {
                    this.domData[i][j].style.backgroundColor = 'rgb(180,180,180)';
                    addEvent(document, 'mouseup', function () {
                        This.domData[i][j].style.backgroundColor = null;
                    });
                }
            }
        }
    }
}

Mine.prototype.gameOver = function (over) {
    let again;
    let tab = document.querySelector("table");
    for (let i = 0; i < this.tr; i++) {
        for (let j = 0; j < this.td; j++) {
            if (this.data[i][j].type == 'mine') {
                this.domData[i][j].className = 'mineActive';
            }
        }
    }
    switch (over) {
        case 'win': again = confirm("游戏胜利啦！\n再来一局吧！");break;
        default: again = confirm("游戏失败了！\n再来一局吧！");break;
    }
    if (again) {
        this.init();
    } else {
        removeEvent(tab, 'mousedown', this.startPlay);
    }
}

Mine.prototype.reload = function () {
    this.restMine = this.mineNum;
    this.numRight = [];
    this.flagRight = [];
}

let mine = new Mine();
mine.setBtns();

