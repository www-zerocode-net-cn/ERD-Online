
# Zustand 使用介绍

简单介绍zustand在erd中的使用方法


## 新增一个store

- file -> new file -> zustand

- 输入文件名，大写字母开头




## Usage/Examples

```javascript
import create from "zustand";

// 类型：对象、函数两者都适用，但是 type 可以用于基础类型、联合类型、元祖。
// 同名合并：interface 支持，type 不支持。
// 计算属性：type 支持, interface 不支持。
// 总的来说，公共的用 interface 实现，不能用 interface 实现的再用 type 实现。主要是一个项目最好保持一致。

type actions = {}

export type TestState = {
  dispatch: actions
};


const useTestStore = create<TestState>(
  (set, get) => ({
    dispatch: {},
  })
);

export default useTestStore;

```

- 初始默认值如果在页面被引用，且控制页面刷新，不能初始为 undefined，否则页面会无限刷新
- 控制页面刷新的变量，需要在引用的页面赋值默认值，比如：dbVersion: state.dbVersion || '0.0.0'


