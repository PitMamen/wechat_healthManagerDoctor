export class BellContext {
  constructor() {
    this.context = wx.createInnerAudioContext();
    this.context.loop = true;
    this.context.onError((res) => {
      this.handleError(res.errCode);
    });
  }
  setBellSrc(filePath) {
    const fs = wx.getFileSystemManager();
    try {
      fs.readFileSync(filePath, 'utf8', 0);
    } catch (e) {
    }
    this.context.src = filePath;
  }
  play() {
    this.context.play();
  }
  stop() {
    this.context.stop();
  }
  handleError(code) {
    let errMsg = '';
    switch (code) {
      case 10001:
        errMsg = '系统错误';
        break;
      case 10002:
        errMsg = '网络错误';
        break;
      case 10003:
        errMsg = '文件错误';
        break;
      case 10004:
        errMsg = '格式错误';
        break;
      default:
        errMsg = '未知错误';
        break;
    }
  }
  destroyInstance() {
    this.context.destroy();
  }
}
