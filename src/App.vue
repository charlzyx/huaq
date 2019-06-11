<template>
  <div id="app">
    <van-nav-bar>
      <div slot="title">花Q~</div>
      <a href="https://github.com/charlzyx/huaq" slot="right">
        <svg
          class="octicon octicon-mark-github v-align-middle"
          height="24"
          viewBox="0 0 16 16"
          version="1.1"
          width="24"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
          ></path>
        </svg>
      </a>
    </van-nav-bar>
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
          <div class="center">
            <colorPicker class="colorpicker" :value="fontColor" @input="onChangeColor"/>
          </div>
        </van-col>
        <van-col span="8">
          <div class="center">
            <colorPicker
              defaultColor
              class="colorpicker"
              :value="bgColor"
              @input="onChangeBgColor"
            />
          </div>
        </van-col>
      </van-row>
    </van-cell-group>
    <canvas :width="box.width" :height="box.height" id="canvas" :style="style"></canvas>
    <canvas style="display: none" id="masure"></canvas>
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
      fontColor: "#000",
      bgColor: "#fff",
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
        height: size * 1.1
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
    onChangeColor(value) {
      this.fontColor = value;
      this.$nextTick(() => {
        this.draw();
      });
    },
    onChangeBgColor(value) {
      console.log("value", value);
      this.bgColor = value;
      this.$nextTick(() => {
        this.draw();
      });
    },
    masure() {
      const el = document.getElementById("masure");
      if (!el) return Promise.reject("no el");
      const ctx = el.getContext("2d");
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
        const el = document.getElementById("canvas");
        if (!el) return;
        const ctx = el.getContext("2d");
        ctx.restore();
        ctx.save();
        this.drawBg(ctx);
        this.drawBig(ctx);
        this.drawLite(ctx);
      });
    },
    clear() {
      const el = document.getElementById("canvas");
      if (!el) return;
      const ctx = el.getContext("2d");
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
#app .colorpicker {
  border: 1px solid #cecece;
}
</style>
