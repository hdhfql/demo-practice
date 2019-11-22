<template>
  <div class="map" ref="map">
    <div class="map-content">
      <h1 class="title">3D图片查看器</h1>
      <div class="content">
        <div class="top-wrapper">
          <button class="rise" @mousedown="high_low('rise')">高</button>
          <button class="turnup" @mousedown="keepTurn('u')">上</button>
          <button class="lower" @mousedown="high_low('lower')">低</button>
        </div>
        <div class="middle-wrapper">
          <button class="turnleft" @mousedown="keepTurn('l')">左</button>
          <div class="box" @mousedown="down">
            <img class="img" ref="img" :src="imgdate.imgSrc">
          </div>
          <button class="turnright" @mousedown="keepTurn('r')">右</button>
        </div>
        <div class="bottom-wrapper">
          <button class="big" @click="changeSize(1)">放大</button>
          <button class="turndown" @mousedown="keepTurn('d')">下</button>
          <button class="small" @click="changeSize(0)">缩小</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'v-map',
  props: {
    imgdate: {
      type: Object,
      default () {
        return {
          imgSrc: 'static/img/m.jpg',
          boxHeight: 400,
          boxWidth: 400
        }
      }
    }
  },
  data () {
    return {
      mag: 0,
      x0: 0,
      y0: 0,
      x1: 0,
      y1: 0,
      dragFlag: false,
      otop: 0,
      oleft: 0,
      boxPerspective: 500,
      imgHeight: 0,
      imgWidth: 0,
      transX: 45,
      transY: 0
    }
  },
  mounted () {// dom加载完成后初始化数据（一些距离运算的自变量）
    let content = this.$refs.map.querySelector(".map-content");
    let img = this.$refs.map.querySelector(".box .img");
    let box = this.$refs.map.querySelector(".box");
    this.imgWidth = img.offsetWidth;
    this.imgHeight = img.offsetHeight;
    this.oleft = img.offsetLeft;
    this.otop = img.offsetTop;
    box.style.height = `${this.imgdate.boxHeight}px`;
    box.style.width = `${this.imgdate.boxWidth}px`;
    box.style.perspective = '500px';
    img.style.left = (box.offsetWidth - img.offsetWidth) / 2 + 'px';
    img.style.top = (box.offsetHeight - img.offsetHeight) / 2 + 'px';
    img.style.transform = 'rotateX(45deg) rotateY(0deg)';
    content.style.width = box.offsetWidth * 2 + 'px';
  },
  methods: {
    changeSize (sym) {// 改变图片尺寸的按钮的函数
      let img = this.$refs.map.querySelector(".box img");
      let box = this.$refs.map.querySelector(".box");
      if (sym) {// sym为1则放大，为0则缩小
        if (this.mag < 15) {
          img.style.width = `${img.offsetWidth * 1.2}px`;
          img.style.height = `${img.offsetHeight * 1.2}px`;
        } 
      } else {
        if (this.mag > -1) {
          img.style.width = `${img.offsetWidth / 1.2}px`;
          img.style.height = `${img.offsetHeight / 1.2}px`;
        }
      }
      img.style.left = this.imgdate.boxWidth / 2 - (this.imgdate.boxWidth / 2 - img.offsetLeft) *  img.offsetWidth / this.imgWidth + 'px';// 在缩放以box的中心为中心
      img.style.top = this.imgdate.boxHeight / 2 - (this.imgdate.boxHeight / 2 - img.offsetTop) *  img.offsetHeight / this.imgHeight + 'px';
      box.style.perspective = `${this.boxPerspective + (img.offsetHeight - this.imgHeight) * 1.2}px`;
      this.imgWidth = img.offsetWidth;// 时时改变自变量，防止move中的因变量突变
      this.imgHeight = img.offsetHeight;
      this.boxPerspective = parseFloat((box.style.perspective).slice(0,-2));
      this.otop = img.offsetTop;
      this.oleft = img.offsetLeft;
      if (sym) {
        this.mag++;
      } else {
        this.mag--;
      }
    },
    high_low (type) {// 改变图片父元素box的perspective，即透视高度
      let box = this.$refs.map.querySelector(".box");
      switch (type) {
        case 'rise': box.style.perspective = `${this.boxPerspective + 50}px`;break;
        case 'lower': box.style.perspective = `${this.boxPerspective - 50}px`;break;
      }
      this.boxPerspective = parseFloat((box.style.perspective).slice(0,-2));
    },
    transStr () {// 运用正则取图片的transform
      let img = this.$refs.map.querySelector(".box img");
      let str = img.style.transform;
      let test = /-?\d+\.?\d*(?=deg)/g;
      let arr = str.match(test);
      this.transX = parseFloat(arr[0]);
      this.transY = parseFloat(arr[1]);
    },
    overTurn (type) {// 实现图片转动
      let img = this.$refs.map.querySelector(".box img");
      this.transStr();
      switch (type) {
        case 'u': img.style.transform = `rotateX(${this.transX + 2}deg) rotateY(${this.transY}deg)`;break;
        case 'd': img.style.transform = `rotateX(${this.transX - 2}deg) rotateY(${this.transY}deg)`;break;
        case 'l': img.style.transform = `rotateX(${this.transX}deg) rotateY(${this.transY - 2}deg)`;break;
        case 'r': img.style.transform = `rotateX(${this.transX}deg) rotateY(${this.transY + 2}deg)`;break;
      }
      this.transStr();
    },
    keepTurn (type) {
      let turnTimeId = setInterval(() => {this.overTurn(type)}, 50);
      document.onmouseup = () => {
        document.onmouseup = null;
        clearInterval(turnTimeId);
      }
    },
    down (e) {
      let img = this.$refs.map.querySelector(".box img");
      let box = this.$refs.map.querySelector(".box");
      this.otop = img.offsetTop;
      this.oleft = img.offsetLeft;
      e.returnValue = false || e.preventDefault();
      this.dragFlag = true;
      this.x0 = e.clientX;
      this.y0 = e.clientY;
      document.onmousemove = (e) => {
        this.move(e);
      }
      document.onmouseup = (e) => {
        this.up(e);
      }
    },
    up (e) {
      let img = this.$refs.map.querySelector(".box img");
      let box = this.$refs.map.querySelector(".box");
      this.dragFlag = false;
      this.otop = img.offsetTop;
      this.oleft = img.offsetLeft;
      this.imgWidth = img.offsetWidth;
      this.imgHeight = img.offsetHeight;
      // this.boxPerspective = parseFloat((box.style.perspective).slice(0,-2));
      this.transStr();
      document.onmousemove = null;
      document.onmouseup = null;
    },
    move (e) {
      let img = this.$refs.map.querySelector(".box img");
      let box = this.$refs.map.querySelector(".box");
      this.movearea();
      if (this.dragFlag) {
        this.x1 = e.clientX;
        this.y1 = e.clientY;
        let x = this.x1 - this.x0;
        let y = this.y1 - this.y0;
        img.style.left = img.offsetLeft + x + 'px';
        img.style.top = img.offsetTop + y + 'px';
        [this.x0, this.y0] = [this.x1, this.y1];
        this.perspectiveAction(img,box);
      }
    },
    perspectiveAction (img,box) {
      img.style.width = `${this.imgWidth + (img.offsetTop - this.otop) / 5}px`;
      img.style.height = `${this.imgHeight + (img.offsetTop - this.otop) / 5}px`;
      // box.style.perspective = `${this.boxPerspective + (img.offsetHeight - this.imgHeight) * 50}px`;
      img.style.transform = `rotateX(${this.transX - (img.offsetTop - this.otop) / 100}deg) rotateY(${this.transY + (img.offsetLeft - this.oleft) / 20}deg)`;
    },
    movearea () {
      let box = this.$refs.map.querySelector(".box");
      let img = this.$refs.map.querySelector(".box img");
      try {
        if (img.offsetLeft < box.offsetWidth / 4 - img.offsetWidth) {
          throw {img: 'left', value: box.offsetWidth / 4 - img.offsetWidth}
        }
        if (img.offsetTop < (box.offsetHeight / 4 - img.offsetHeight) / 1.3) {
          throw {img: 'top', value: (box.offsetHeight / 3 -img.offsetHeight) / 1.3}
        }
        if (img.offsetLeft > box.offsetWidth - box.offsetWidth / 4) {
          throw {img: 'left', value: box.offsetWidth - box.offsetWidth / 4}
        }
        if (img.offsetTop > (box.offsetHeight - box.offsetHeight / 4) / 1.5) {
          throw {img: 'top', value: (box.offsetHeight - box.offsetHeight / 4) / 1.5}
        }
      }
      catch (o) {
        if (o) {
          switch (o.img) {
            case 'left': img.style.left = Math.ceil(o.value) + 'px';break;
            case 'top': img.style.top = Math.ceil(o.value) + 'px';break;
          }
        }
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .map
    .map-content
      width: 1000px
      margin: 400px
      background-color: skyblue
      .title
        display: block
        height: 50px
        width: 100%
        border-bottom: 2px solid rgba(7,17,27,0.2)
        text-align: center
        font-size: 40px
        line-height: 50px
        font-weight: 700
        color: white
        background-color: orange
        margin: 0
      .content
        .top-wrapper
          display: flex
          justify-content: space-around
          margin-left: 10%
          height: 60px
          width: 80%
          text-align: center
          button
            display: inline-block
            margin-top: 5px
            height: 50px
            width: 25%
            line-height: 50px
            font-size: 30px
            text-align: center
        .middle-wrapper
          text-align: center
          display: flex
          justify-content: space-around
          width: 90%
          margin-left: 5%
          button
            display: inline-block
            flex: 1
            font-size: 30px
          .box
            display: inline-block
            position: relative
            // transform-origin: 50% 50%
            perspective-origin: 50% 50%
            background-color: rgba(0,0,0,0.3)
            cursor: move
            margin: 0 40px
            overflow: hidden
            .img
              position: absolute
              height: 300px
              width: 300px
              box-shadow: 0 10px 10px rgba(7,17,27,0.8)
              transform: rotateX(45deg)
        .bottom-wrapper
          display: flex
          justify-content: space-around
          margin-left: 10%
          height: 60px
          width: 80%
          text-align: center
          button
            display: inline-block
            margin-top: 5px
            height: 50px
            width: 25%
            line-height: 50px
            text-align: center
            font-size: 30px
</style>
