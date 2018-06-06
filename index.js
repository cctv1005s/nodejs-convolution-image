const px = require('pixels');
const _ = require('lodash');
const kernel = require('./kernel');

let image = px.read('./images/img1.jpg', Float64Array);

const {
  height,
  width,
  data,
  type
} = image;

const arrayData = [];
// 从Float64Array => Arrary
data.forEach(item => {
  arrayData.push(item);
});

const pixels = _.chunk(arrayData, 4);

/**
 * get width * height matrix
 */
const matrix = _.chunk(pixels, width);

const zeros = [];

for (let i = 0; i < width; i++) {
  zeros.push([0, 0, 0, 1]);
}

// 矩阵开头插入一行0像素
matrix.unshift(_.cloneDeep(zeros));
// 矩阵末尾插入一行0像素
matrix.push(_.cloneDeep(zeros));

matrix.forEach(item => {
  item.push([0, 0, 0, 1]);
  item.unshift([0, 0, 0, 1]);
});

// 获得一个全为0的矩阵
const getMatrix = (...agrs) => {
  let matrix = 0;
  while (agrs.length) {
    const length = agrs.pop();
    const temp = [];
    for (let i = 0; i < length; i++) {
      temp.push(_.cloneDeep(matrix));
    }
    matrix = temp;
  }
  return matrix;
};

/**
 * 使用一个卷积核来卷积图像
 *
 * @param {Array} image 待卷积图像
 * @param {Arrary} kernel 卷积核
 */
const convolution = (image, kernel) => {
  const width = image[0].length - 2;
  const height = image.length - 2;
  const newImage = getMatrix(width, height, 4);
  /**
   * 两个矩阵块相乘
   * @param {*} kernel 卷积核
   * @param {*} matrix 图像矩阵
   * @param {*} x 当前位置x
   * @param {*} y 当前位置y
   */
  const calc = (kernel, matrix, x, y) => {
    let sum = 0;
    const length = kernel.length;
    for (let k = 0; k < length; k++) {
      for (let i = 0; i < length; i++)
        for (let j = 0; j < 3; j++) {
          sum += (kernel[length - i - 1][length - j - 1] * matrix[x + i + -1][y + j + -1][k]);
        }
      newImage[x - 1][y - 1][k] = Math.abs(sum || 0);
    }
    newImage[x - 1][y - 1][3] = matrix[x][y][3];
  };

  // 开始卷积图像
  for (let i = 1; i < width + 1; i++) {
    for (let j = 1; j < height + 1; j++) {
      calc(kernel, image, i, j);
    }
  }
  return newImage;
};

Object.keys(kernel).forEach(item => {
  const k = kernel[item];
  const newImage = convolution(matrix, k);
  const cresult = _.flattenDeep(newImage);
  const cimage = new Float64Array(width * height * 4);

  for (let i = 0; i < width * height * 4; i++) {
    cimage[i] = cresult[i];
  }

  px.write(`./output/img1_${item}.jpg`, {
    height: height,
    width: width,
    type: type,
    data: cimage
  });

  console.log(`success ==> ./output/img1_${item}.jpg`);
});
