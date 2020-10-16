export const compareStringVersion = (v1 = '', v2 = '') => {
  // 该方法会忽略参数中的非数字
  const checkVersion = (version1, version2, index, maxLength) => {
    let checkFlag = -1;
    const tempVersion1 = version1[index] || 0;
    const tempVersion2 = version2[index] || 0;
    if ((tempVersion1 === tempVersion2) && (index + 1 < maxLength)) {
      checkFlag = checkVersion(version1, version2, index + 1, maxLength);
    } else {
      checkFlag = tempVersion1 - tempVersion2;
    }
    return checkFlag;
  };
  // 1.将所有的数字取出放置到数组
  const version1 = v1.replace(/[a-zA-Z]/g, '').split('.').map(v => parseInt(v, 10));
  const version2 = v2.replace(/[a-zA-Z]/g, '').split('.').map(v => parseInt(v, 10));
  // 2.取位数最多的进行循环
  const maxLengthVersion = version1.length > version2.length ? version1 : version2;
  return checkVersion(version1, version2, 0, maxLengthVersion.length);
};
