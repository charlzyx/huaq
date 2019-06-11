<template>
  <div id="app">
    <van-nav-bar title="花Q~"/>
    <van-field label="大字" placeholder="冷   静" v-model="big.word" @input="draw"></van-field>
    <van-field
      label="小字"
      placeholder="反      正      他      们      都      傻"
      v-model="lite.word"
      @input="draw"
    ></van-field>
    <van-cell-group title="一些设置">
      <div>
        <van-row>
          <van-col span="6">
            <div class="center">大字字号</div>
          </van-col>
          <van-col span="6">
            <div class="center">大字y轴调整</div>
          </van-col>
          <van-col span="6">
            <div class="center">小字字号</div>
          </van-col>
          <van-col span="6">
            <div class="center">小字y轴调整</div>
          </van-col>
        </van-row>
      </div>
      <van-row>
        <van-col span="6">
          <div class="center">
            <van-stepper v-model="big.font.size" integer @input="updateYThenDraw"/>
          </div>
        </van-col>
        <van-col span="6">
          <div class="center">
            <van-stepper v-model="offsetY" integer @input="draw"/>
          </div>
        </van-col>
        <van-col span="6">
          <div class="center">
            <van-stepper v-model="lite.font.size" integer @input="updateYThenDraw"/>
          </div>
        </van-col>
        <van-col span="6">
          <div class="center">
            <van-stepper v-model="boundingY" integer @input="draw"/>
          </div>
        </van-col>
      </van-row>
    </van-cell-group>
    <van-cell-group title="另一些设置">
      <div>
        <van-row>
          <van-col span="8">
            <div class="center">字体</div>
          </van-col>
          <van-col span="8">
            <div class="center">字体颜色</div>
          </van-col>
          <van-col span="8">
            <div class="center">背景颜色</div>
          </van-col>
        </van-row>
      </div>
      <van-row>
        <van-col span="8">
          <van-picker :columns="fontlist" @change="onChangeFont"/>
        </van-col>
        <van-col span="8">
          <van-picker :columns="colorList" @change="onChangeColor"/>
        </van-col>
        <van-col span="8">
          <van-picker :columns="bgColorList" @change="onChangeBgColor"/>
        </van-col>
      </van-row>
    </van-cell-group>
    <canvas :width="box.width" :height="box.height" id="canvas" :style="style"></canvas>
    <canvas style="display: none" id="masure"></canvas>
    <van-button @click="draw" type="primary" size="large">it works!</van-button>
  </div>
</template>
<script>
import FONTMAP from "./fontmap";

const TEXTBASELINE = "ideographic";
const COLORLIST = ["#000", "#fff", "red", "green", "blue"];

export default {
  name: "app",
  data() {
    return {
      offsetY: 0,
      boundingY: 0,
      fontlist: Object.keys(FONTMAP),
      fontFamily: FONTMAP.华文仿宋,
      colorList: COLORLIST,
      fontColor: "#000",
      bgColorList: [false, ...COLORLIST],
      bgColor: null,
      big: {
        word: "不 发 脾 气",
        font: {
          size: 320,
          lineHeight: "100%"
        }
      },
      lite: {
        word:
          "谁            给            的            钱            多            听            谁            的",
        font: {
          size: 52,
          lineHeight: "100%"
        }
      },
      style: {
        border: "1px dashed #08C160"
      },
      box: {
        height: 0,
        width: 0
      }
    };
  },
  mounted() {
    this.updateYThenDraw();
  },
  computed: {
    bouding() {
      const { width, height } = this.box;
      const { boundingY } = this;
      const { size } = this.lite.font;
      const bouding = {
        x: 0,
        y: boundingY,
        width,
        height: size
      };
      return bouding;
    }
  },
  methods: {
    onChangeFont(picker, value) {
      this.fontFamily = FONTMAP[value];
      this.$nextTick(() => {
        this.draw();
      });
    },
    onChangeColor(picker, value) {
      this.fontColor = value;
      this.$nextTick(() => {
        this.draw();
      });
    },
    onChangeBgColor(picker, value) {
      this.bgColor = value;
      this.$nextTick(() => {
        this.draw();
      });
    },
    masure() {
      const ctx = document.getElementById("masure").getContext("2d");
      const { fontFamily } = this;
      const {
        word,
        font: { size }
      } = this.big;

      ctx.font = `${size}px ${fontFamily}`;
      ctx.textBaseline = TEXTBASELINE;

      const { width } = ctx.measureText(word);
      const height = size;

      this.box = { width, height };

      return new Promise(resolve => {
        this.$nextTick(resolve);
      });
    },
    updateYThenDraw() {
      const {
        box: { height },
        big: {
          font: { size }
        },
        lite: {
          font: { size: liteSize }
        }
      } = this;
      this.boundingY = height
        ? height / 2 + liteSize / 2
        : size / 2 + liteSize / 2;
      this.$nextTick(() => {
        this.draw();
      });
    },
    draw() {
      this.clear();
      this.masure().then(() => {
        const ctx = document.getElementById("canvas").getContext("2d");
        ctx.restore();
        ctx.save();
        this.drawBg(ctx);
        this.drawBig(ctx);
        this.drawLite(ctx);
      });
    },
    clear() {
      const ctx = document.getElementById("canvas").getContext("2d");
      ctx.clearRect(0, 0, this.box.width, this.box.height);
    },
    drawBg(ctx) {
      const { bgColor } = this;
      if (bgColor) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, this.box.width, this.box.height);
      }
    },
    drawBig(ctx) {
      const { fontFamily, fontColor, offsetY } = this;
      const {
        word,
        font: { size }
      } = this.big;

      ctx.font = `${size}px/${size} ${fontFamily}`;
      ctx.textBaseline = TEXTBASELINE;
      ctx.fillStyle = fontColor;

      ctx.fillText(word, 0, size + offsetY);
    },
    drawLite(ctx) {
      const { fontFamily, fontColor, bgColor, bouding, box } = this;
      const {
        word,
        font: { size }
      } = this.lite;

      if (!bgColor) {
        ctx.clearRect(bouding.x, bouding.y, bouding.width, bouding.height);
      } else {
        ctx.fillStyle = bgColor;
        ctx.fillRect(bouding.x, bouding.y, bouding.width, bouding.height);
      }

      ctx.fillStyle = fontColor;
      ctx.textBaseline = TEXTBASELINE;
      ctx.textAlign = "center";
      ctx.font = `${size}px/${size}px ${fontFamily}`;

      ctx.fillText(word, box.width / 2, bouding.y + size);
    }
  }
};
</script>

<style>
#app {
  font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#app .center {
  margin: 10px;
  text-align: center;
}
</style>
