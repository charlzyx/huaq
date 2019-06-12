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
    <van-field input-align="center" label="大字" placeholder="冷   静" v-model="big.word" @input="draw"></van-field>
    <van-field
      input-align="center"
      label="小字"
      placeholder="反      正      他      们      都      傻"
      v-model="lite.word"
      @input="draw"
    ></van-field>
    <van-cell-group title="一些设置">
      <div>
        <van-row>
          <van-col span="8">
            <div class="center">大字字号</div>
          </van-col>
          <van-col span="8">
            <div class="center">小字字号</div>
          </van-col>
          <van-col span="8">
            <div class="center">小字y轴调整</div>
          </van-col>
        </van-row>
      </div>
      <van-row>
        <van-col span="8">
          <div class="center">
            <van-stepper v-model="big.fontSize" integer @input="drawWithLiteY"/>
          </div>
        </van-col>
        <van-col span="8">
          <div class="center">
            <van-stepper v-model="lite.fontSize" integer @input="drawWithLiteY"/>
          </div>
        </van-col>
        <van-col span="8">
          <div class="center">
            <van-stepper v-model="lite.boundingY" integer @input="draw"/>
          </div>
        </van-col>
      </van-row>
    </van-cell-group>
    <van-cell-group title="另一些设置">
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
      <van-row>
        <van-col span="8">
          <van-picker :columns="fontlist" @change="onChangeFont"/>
        </van-col>
        <van-col span="8">
          <div class="center">
            <colorPicker class="colorpicker" :value="common.fontColor" @input="onChangeColor"/>
          </div>
        </van-col>
        <van-col span="8">
          <div class="center">
            <colorPicker
              defaultColor
              class="colorpicker"
              :value="common.bgColor"
              @input="onChangeBgColor"
            />
          </div>
        </van-col>
      </van-row>
    </van-cell-group>
    <van-cell-group title="自己写">
      <van-row>
        <van-col span="8">
          <van-field
            input-align="center"
            :value="inputFont"
            @input="onInputFont"
            placeholder="<font-family>"
          />
        </van-col>
        <van-col span="8">
          <van-field
            input-align="center"
            :value="common.fontColor"
            @input="onChangeColor"
            placeholder="<color>"
          />
        </van-col>
        <van-col span="8">
          <van-field
            input-align="center"
            :value="common.bgColor"
            @input="onChangeBgColor"
            placeholder="<background-color>"
          />
        </van-col>
      </van-row>
    </van-cell-group>
    <div style="display: flex; justify-content: center">
      <canvas :width="box.width" :height="box.height" id="canvas" :style="style"></canvas>
    </div>
    <canvas style="display: none" id="masure"></canvas>
  </div>
</template>
<script>
import FONTMAP from "./fontmap";
import { measure } from "./helper";

export default {
  name: "app",
  data() {
    return {
      inputFont: "",
      common: {
        fontFamily: FONTMAP["MAC-华文仿宋"],
        fontColor: "#000",
        bgColor: "#fff",
        textBaseline: "top"
      },
      big: {
        word: "不发脾气",
        fontSize: 320
      },
      lite: {
        word:
          "谁         给         的         钱         多         听         谁         的",
        fontSize: 52,
        boundingY: 0
      },
      fontlist: Object.keys(FONTMAP),
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
    this.drawWithLiteY();
  },
  computed: {
    litexy() {
      const { boundingY } = this.lite;
      return {
        x: 0,
        y: boundingY
      };
    }
  },
  methods: {
    drawWithLiteY() {
      this.draw(false);
    },
    onInputFont(value) {
      this.common.fontFamily = FONTMAP[value];
      this.$nextTick(() => {
        this.draw();
      });
    },
    onChangeFont(picker, value) {
      this.common.fontFamily = FONTMAP[value];
      this.$nextTick(() => {
        this.draw();
      });
    },
    onChangeColor(value) {
      this.common.fontColor = value;
      this.$nextTick(() => {
        this.draw();
      });
    },
    onChangeBgColor(value) {
      this.common.bgColor = value;
      this.$nextTick(() => {
        this.draw();
      });
    },
    getCommon(type = "big") {
      const { fontFamily, textBaseline } = this.common;
      const { big, lite } = this;
      return {
        font: `${
          type === "big" ? big.fontSize : lite.fontSize
        }px/1 ${fontFamily}`,
        textBaseline
      };
    },

    draw(dontAdjustLiteBoundingY) {
      this.clear();
      const { big, lite } = this;
      const conf = this.getCommon();
      const { height, width, offsetY } = measure(conf, big.word);
      this.box.width = width;
      this.box.height = height;
      if (!dontAdjustLiteBoundingY) {
        this.lite.boundingY = height / 2 + lite.fontSize;
      }
      this.$nextTick(() => {
        const el = document.getElementById("canvas");
        if (!el) return;
        const ctx = el.getContext("2d");
        ctx.restore();
        ctx.save();
        this.drawBg(ctx);
        this.drawBig(ctx, offsetY);
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
      const { bgColor } = this.common;
      if (bgColor) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, this.box.width, this.box.height);
      }
    },
    drawBig(ctx, offsetY) {
      const { fontColor } = this.common;
      const conf = this.getCommon();
      const { word } = this.big;

      // 写写大字
      ctx.beginPath();
      ctx.font = conf.font;
      ctx.fillStyle = fontColor;
      ctx.textBaseline = conf.textBaseline;

      ctx.fillText(word, 0, -offsetY);
    },
    drawLite(ctx) {
      const { fontColor, bgColor } = this.common;
      const { width } = this.box;
      const conf = this.getCommon("lite");
      const { word, boundingY } = this.lite;
      const { height, offsetY } = measure(conf, word);

      // 绘制矩形
      if (!bgColor) {
        ctx.clearRect(0, boundingY, width, height);
      } else {
        ctx.beginPath();
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, boundingY, width, height);
      }

      // 写写小字
      ctx.beginPath();
      ctx.fillStyle = fontColor;
      ctx.textAlign = "center";
      ctx.textBaseline = conf.textBaseline;
      ctx.font = conf.font;

      ctx.fillText(word, width / 2, boundingY - offsetY);
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
