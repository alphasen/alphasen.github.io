---
title: react源码解析
date: 2019年07月29日15:46:58
tags:
- 效率
- react
categories:
- 经验
---

## React.createElement

- jsx会被babel编译为React.createElement,所以React必须引入，否则编译后的代码将找不到React变量而报错

- `<App />`代表这ReactElement，App代表React Element

  ```javascript
  <div id='id'>1</div>
  // 编译后的代码
  React.createElement('div',{id:'id'},'1')
  // createElement接收三个参数 对照jsx可以知道三个参数的含义
  // jsx其实就是一个函数，在调用该jsx的时候就是执行了函数，返回一个ReactElement
  ```

  ```javascript
  // createElement的部分源码
  // self 为了以后正确的获取this
  self = config.__self === undefined ? null : config.__self;
  // 设置一些内部变量 filename,line number 等
  source = config.__source === undefined ? null : config.__source;
  for (propName in config) {
    if ( // RESERVED_PROPS剔除了key ref __self __source 属性，并将剩下的属性丢到props中
      hasOwnProperty.call(config, propName) &&
      !RESERVED_PROPS.hasOwnProperty(propName)
    ) {
      props[propName] = config[propName];
    }
  }
  
  // 判断children长度是否大于1，大于1的话组装children，并将children挂载到props上
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    if (__DEV__) {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }
  // 最后返回一个ReactElement对象
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
  // ReactElement 源码
  // 该函数源码很简单，就是创建了一个对象，添加了一个$$typeof字段，用以标识该对象的类型
  const ReactElement = function(type, key, ref, self, source, owner, props) {
    const element = {
      $$typeof: REACT_ELEMENT_TYPE,
      // Built-in properties that belong on the element
      type: type,
      key: key,
      ref: ref,
      props: props,
      // Record the component responsible for creating this element.
      _owner: owner,
    };
    return element
  }
  ```

## ReactBaseClasses

- 该文件包含两个基本组件Component和PureComponent

  ```javascript
  function Component(props, context, updater) {
    this.props = props;
    this.context = context;
    // ref 有好几个方式创建，字符串的不讲了，一般都是通过传入一个函数来给一个变量赋值 ref 的
    // ref={el => this.el = el} 回调函数形式
    // 当然还有种方式是通过 React.createRef 创建一个 ref 变量，然后这样使用 这种方式最推荐
    // this.el = React.createRef()
    // ref={this.el}
    // 关于 React.createRef 就阅读 ReactCreateRef.js 文件了
    this.refs = emptyObject; // emptyObject就是一个空对象{}
    // 如果你在组件中打印 this 的话，可能看到过 updater 这个属性
    // 有兴趣可以去看看 ReactNoopUpdateQueue 中的内容，虽然没几个 API，并且也基本没啥用，都是用来报警告的
    this.updater = updater || ReactNoopUpdateQueue;
  }
  
  Component.prototype.isReactComponent = {};
  
  // 我们在组件中调用 setState 其实就是调用到这里了
  // 用法不说了，如果不清楚的把上面的注释和相应的文档看一下就行
  // 一开始以为 setState 一大堆逻辑，结果就是调用了 updater 里的方法
  // 所以 updater 还是个蛮重要的东西
  Component.prototype.setState = function(partialState, callback) {
    // 从名字可以看出setState是有队列操作的
    this.updater.enqueueSetState(this, partialState, callback, 'setState');
  };
  
  // 这个 API 用的很好，不清楚作用的看文档吧
  Component.prototype.forceUpdate = function(callback) {
    this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
  };
  ```

  ```javascript
  // PureComponent 使用prototype继承方式继承了Component
  function PureComponent(props, context, updater) {
    this.props = props;
    this.context = context;
    // If a component has string refs, we will assign a different object later.
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }
  const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
  pureComponentPrototype.constructor = PureComponent;
  // Avoid an extra prototype jump for these methods.
  Object.assign(pureComponentPrototype, Component.prototype);
  // 通过这个变量区别下普通的 Component
  pureComponentPrototype.isPureReactComponent = true; 
  ```


## React.createRef

ref的创建方式有三种

1. 字符串的形式 `已标记为不推荐使用`

2. `ref={el=>this.divEle=el}`

3. React.createRef

   主要关注createRef

​	函数式组件中不能直接使用ref [文档]([https://react.docschina.org/docs/refs-and-the-dom.html#refs-%E4%B8%8E%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6](https://react.docschina.org/docs/refs-and-the-dom.html#refs-与函数式组件))，可以在props中传递ref，或者使用`forwardRef`

```javascript
// 内部实现很简单，如果我们想使用 ref，只需要取出其中的 current 对象即可
export function createRef(): RefObject {
  const refObject = {
    current: null,
  };
  return refObject;
}
// 函数式组件使用ref的方式
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
))

// 这个实现没啥好说的，就是让 render 函数多了 ref 这个参数
function forwardRef((props,ref)=>{
  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render,
  }
})
```



> https://juejin.im/post/5cbae9a8e51d456e2809fba3