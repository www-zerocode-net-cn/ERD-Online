/*import PDFDocument from 'pdfkit';
import fs from 'fs';*/

/*const generateIndex = () => {

};*/

export const generatepdf = (dataSource, images, path, callBack) => {
  /*const doc = new PDFDocument({bufferPages: true});
  doc.pipe(fs.createWriteStream('C:/Users/liuqiang/Desktop/test/output.pdf'));
  let fontPath = '';
  if (process.env.NODE_ENV === 'development') {
    fontPath = 'public/fonts/font.otf';
  } else {
    fontPath = 'fonts/font.otf';
  }
  doc.ref('1111');
  doc.font(fontPath)
    .fontSize(15)
    .text('你好啊!', 100, 100);
  doc.addPage()
    .fontSize(25)
    .text('Here is some vector graphics...', 100, 100);

  doc.save()
    .moveTo(100, 150)
    .lineTo(100, 250)
    .lineTo(200, 250)
    .fill('#FF3300');

  doc.scale(0.6)
    .translate(470, -380)
    .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
    .fill('red', 'even-odd')
    .restore();

  doc.addPage()
    .image('C:/Users/liuqiang/Desktop/test/GUAT-担保-image.png', 0, 15, 'width: 300')
    .text('Proportional to width', 0, 0);

  const range = doc.bufferedPageRange();

  for (let i = range.start; i < range.count; i += 1) {
    doc.switchToPage(i);
    doc.text(`当前页${i + 1}`);
  }

  doc.flushPages();
  doc.end();
  generateIndex();
  callBack && callBack();
  console.log('====');*/
  callBack && callBack();
};
