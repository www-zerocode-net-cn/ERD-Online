export const changeArrayPosition = (array = [], index1 = 0, index2 = 0) => {
  // 数组交换位置
  const data1 = array[index1];
  const data2 = array[index2];
  if (data1 && data2) {
    return array.map((data, index) => {
      if (index1 === index) {
        return data2;
      } else if (index2 === index) {
        return data1;
      }
      return data;
    });
  }
  return array;
};

export const moveArrayPosition = (array = [], moveIndex = 0, toIndex = 0) => {
  // 数组移动位置
  const data1 = array[moveIndex];
  const data2 = array[toIndex];
  if (data1 && data2) {
    const tempArray = [...array];
    // 先将移动的项删除
    tempArray.splice(moveIndex, 1);
    // 将移动的项放置
    tempArray.splice(toIndex, 0, data1);
    return tempArray;
  }
  return array;
};

export const moveArrayPositionByFuc = (array = [], fromFuc, toIndex) => {
  // 数组插入位置
  if (fromFuc) {
    const fromIndex = array.findIndex(fromFuc);
    //const toIndex = array.findIndex(toFuc);
    return moveArrayPosition(array, fromIndex, toIndex);
  }
  return array;
};
