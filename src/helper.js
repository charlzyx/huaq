
const edge = (imageData) => {
  const { width, height, data } = imageData;
  // 在透明背景下, 第一个黑色的点是 [0...0, 0, 0, 255...];
  const len = width * height * 4;
  const line = width * 4;
  let topi = 0;
  let bottomi = len - 1;
  // 当没有遍历完这个图像, 并且所在位不为0
  while (topi < len && data[topi] === 0) {
    // eslint-disable-next-line no-plusplus
    topi++;
  }
  // 从最后一个开始, 反向遍历
  while (bottomi > 0 && data[bottomi] === 0) {
    // eslint-disable-next-line no-plusplus
    bottomi--;
  }

  const box = {
    top: Math.floor(topi / line),
    bottom: Math.floor(bottomi / line),
  };

  return box;
};

const measure = ({ font, textBaseline }, txt) => {
  const div = document.createElement('div');
  div.style.font = font;
  div.style.position = 'position';
  div.style.visibility = 'hidden';
  document.body.appendChild(div);
  const size = parseInt(
    document.defaultView
      .getComputedStyle(div, null)
      .fontSize.replace('px', ''),
    10,
  );
  document.body.removeChild(div);

  const canvas = document.createElement('canvas');
  const padding = size;
  canvas.style.position = 'position';
  canvas.style.zIndex = -999999;
  canvas.style.visibility = 'hidden';
  canvas.style.border = '1px solid blue';
  canvas.width = size * 2;
  canvas.height = size + padding * 2;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  ctx.font = font;
  ctx.textBaseline = textBaseline;

  ctx.fillText('龘j', 0, padding);

  const { width } = ctx.measureText(txt);
  const { top, bottom } = edge(
    ctx.getImageData(0, 0, canvas.width, canvas.height),
  );

  const baseline = padding;
  // console.log(top, bottom);
  const offsetY = top - baseline - 2;
  document.body.removeChild(canvas);
  return {
    width,
    height: bottom - top + 4,
    offsetY,
  };
};

export {
  // eslint-disable-next-line import/prefer-default-export
  measure,
};
