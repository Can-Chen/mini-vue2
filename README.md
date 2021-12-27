# mini-vue2
模拟实现vue2版本的数据双向绑定

### 了解vue2的响应式和双向绑定原理

#### vue

* 记录传入的配置，设置$el/$data
* 把data成员添加到Vue实例中
* 实例化Observer实现数据响应式处理（数据劫持）
* 实例化Compiler处理指令和插值表达式

#### observer

* 数据劫持
  * 把data中所有属性添加getter/setter方法
  * 把data中属性为Object类型或有更深层次嵌套的Object类型都添加下getter/setter方法
  * 如果给data中属性赋值为Object类型，需要添加上getter/setter方法
* 添加Dep和Watcher的依赖关系
* 发送数据更新通知（数据更新 --> 视图更新）

#### watcher

* 实例化往Dep中添加指向自身的指针
* 当数据变化dep通知所有Watcher实例更新视图

#### dep

* 收集依赖、添加观察者者
* 通知所有观察者

#### compiler

* 编译模版，解析指令和插值表达式
* 页面的渲染
* 数据变化后重新渲染
* 视图更新 --> 数据更新
