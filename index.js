const px = require('pixels');
const _ = require('lodash');

let image = px.read('./images/img1.jpg', Float64Array);

const {
  height,
  width,
  data,
  type
} = image;


const arrayData = [];
data.forEach(item => {
  arrayData.push(item);
})

const pixels = _.chunk(arrayData, 4);

/**
 * get width * height matrix
 */
const matrix = _.chunk(pixels, width);
const zeros = [];
for(let i = 0;i < width; i++){
  zeros.push([0, 0, 0, 1]);
}
matrix.unshift(zeros);
matrix.push(zeros);

matrix.forEach(item => {
  item.push([0, 0, 0, 1]);
  item.unshift([0, 0, 0, 1]);
});

// 图像锐化 sharpening
const sharp = [
  [-1, -1, -1],
  [-1, 9, -1],
  [-1, -1, -1]
];

const getMatrix = (width, height, depth) => {
  let matrix = [];
  for (let i = 0; i < height; i++) {
    let m = [];
    for (let j = 0; j < width; j++) {
      let de = [];
      for (let d = 0; d < depth; d++) {
        de.push(0);
      }
      m.push(de);
    }
    matrix.push(m);
  }
  return matrix;
};

const newImage = getMatrix(width, height, 4);

const convolution = (kernel, matrix, x, y) => {
  let sum = 0;

  for (let k = 0; k < 3; k++) {
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) {
        sum += (sharp[i][j] * matrix[x + i + -1][y + j + -1][k]);
      }
    newImage[x - 1][y - 1][k] = Math.abs(sum || 0);
  }
  newImage[x - 1][y - 1][3] = matrix[x][y][3];
}

// 开始卷积图像
for (let i = 1; i < width + 1; i++) {
  for (let j = 1; j < height + 1; j++) {
    convolution(sharp, matrix, i, j);
  }
}

const ni = _.flattenDeep(newImage);

const nf = new Float64Array(width * height * 4);

for(let i = 0; i < width * height * 4; i++){
  nf[i] = ni[i];
}


// fs.writeFileSync('./log/out.json', JSON.stringify(nf, null, 2));

px.write('./output/img1.jpg', {
  height: height,
  width: width,
  type: type,
  data: nf
});