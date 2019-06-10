<template>
  <div id="app">
    <van-nav-bar title="花Q~"/>
    <van-cell-group>
      <van-field label="大字" placeholder="我是这么说的" v-model="big.word" @change="draw"></van-field>
      <van-stepper v-model="big.font.size" step="20" @change="draw"/>
      <van-field label="小字" placeholder="但我的意思其实是" v-model="lite.word" @change="draw"></van-field>
      <van-stepper v-model="lite.font.size" step="4" @change="draw"/>
      <van-picker :columns="columns" :default-index="2" @change="onChange"/>
    </van-cell-group>
    <canvas :width="box.width" :height="box.height" id="canvas" :style="style"></canvas>
    <canvas style="display: none" id="masure"></canvas>
    <van-button @click="draw" type="primary" size="large">it works!</van-button>
  </div>
</template>
<script>
// 字体列表: https://blog.csdn.net/athrenzala/article/details/45430963

const RATIO = 1;
const BOUNDING_RATIO = 0.1;
export default {
  name: "app",
  data() {
    return {
      fontFamily: "STFangsong",
      big: {
        word: "不 发 脾 气",
        font: {
          family: "STFangsong",
          size: 320,
          color: "#000",
          lineHeight: "100%"
        }
      },
      lite: {
        word:
          "谁            给            的            钱            多            听            谁            的",
        font: {
          family: "STFangsong",
          size: 52,
          lineHeight: "100%",
          color: "#000"
        }
      },
      v: false,
      style: {
        margin: "16px",
        border: "1px solid #cecece"
      },
      box: {
        height: 100,
        width: 100
      }
    };
  },
  mounted() {
    this.draw();
  },
  components: {},
  methods: {
    draw() {
      this.clear();
      const masureCtx = document.getElementById("masure").getContext("2d");
      this.masure(masureCtx).then(() => {
        const ctx = (this.tmp = document
          .getElementById("canvas")
          .getContext("2d"));
        ctx.restore();
        ctx.save();
        this.drawBig(ctx);
        this.drawLite(ctx);
      });
    },
    clear() {
      const ctx = (this.tmp = document
        .getElementById("canvas")
        .getContext("2d"));
      ctx.clearRect(0, 0, this.box.width, this.box.height);
    },
    masure(ctx) {
      const {
        word,
        font: { size, family }
      } = this.big;

      const font = `${size}px ${family || ""}`;
      ctx.font = font;
      ctx.textBaseline = "middle";
      const width = ctx.measureText(word).width;
      const height = size + size * BOUNDING_RATIO;
      this.box = { width, height };
      return new Promise(resolve => {
        this.$nextTick(resolve);
      });
    },
    drawBig(ctx) {
      const {
        word,
        font: { size, family, color }
      } = this.big;

      const font = `${size}px/${size} ${family || ""}`;
      ctx.textBaseline = "middle";
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.fillText(word, 0, size / 2);
    },
    getLiteBounding() {
      const { width, height } = this.box;
      const { size } = this.lite.font;
      const fontHeight = size + size * BOUNDING_RATIO;
      const bouding = {
        x: 0,
        y: height / 2 + height * 0.2 - fontHeight / 2,
        width: width,
        height: fontHeight
      };
      return bouding;
    },
    drawLite(ctx) {
      const {
        word,
        font: { size, family, color }
      } = this.lite;
      const bouding = this.getLiteBounding();
      ctx.clearRect(bouding.x, bouding.y, bouding.width, bouding.height);
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      const font = `${size}px/${size}px ${family || ""}`;
      ctx.font = font;
      ctx.fillText(
        word,
        this.box.width / 2,
        bouding.y + size / 2 + size * BOUNDING_RATIO
      );
    },
    clip(ctx) {
      const { width, height } = this.box;
      const { size } = this.lite.font;
      const liteBox = this.getLiteBounding();
      const topBox = {
        x: 0,
        y: 0,
        width,
        height: height - liteBox.y
      };
      const bottomBox = {
        x: 0,
        y: liteBox.y + liteBox.height,
        width,
        height
      };
      ctx.beginPath();
      ctx.rect(topBox.x, topBox.y, topBox.width, topBox.height);
      ctx.rect(bottomBox.x, bottomBox.y, bottomBox.width, bottomBox.height);
      ctx.clip();
    }
  }
};
</script>

<style>
#app {
  font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 47px;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
