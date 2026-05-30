/**
 * 图片压缩工具
 *
 * 用 Canvas 将图片缩小并转为 JPEG base64，
 * 典型效果：3MB → ~50KB，适合 localStorage 存储
 */

const MAX_WIDTH = 800;    // 最大宽度（像素）
const MAX_HEIGHT = 800;   // 最大高度
const JPEG_QUALITY = 0.6; // JPEG 质量（0-1）

export function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        // 计算缩小后的尺寸
        let { width, height } = img;
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }
        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height;
          height = MAX_HEIGHT;
        }

        // 用 Canvas 绘制缩小后的图片
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);

        // 导出为 base64
        const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error("图片加载失败"));
      img.src = reader.result as string;
    };

    reader.onerror = () => reject(new Error("文件读取失败"));
    reader.readAsDataURL(file);
  });
}
