// 图像锐化
const sharp = [
  [-1, -1, -1],
  [-1, 9, -1],
  [-1, -1, -1]
];

// 高斯平滑
const gaussian = [
  [1 / 16, 2 / 16, 1 / 16],
  [2 / 16, 2 / 16, 2 / 16],
  [1 / 16, 2 / 16, 1 / 16],
];

// 梯度prewitt
const prewitt = [
  [-1, 0, 1],
  [-1, 0, 1],
  [-1, 0, 1],
];

// 梯度Laplacian
const laplacian = [
  [1, 1, 1],
  [1, -8, 1],
  [1, 1, 1],
];
module.exports = {
  sharp,
  gaussian,
  prewitt,
  laplacian
};
