class Watcher {

  /**
   * 
   * @param {vue实例} vm 
   * @param {当前需要更新的属性} key 
   * @param {回掉函数} cb 
   */
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;

    /** 记录Watcher对象到Dep类中 **/
    Dep.target = this;

    /** 触发get方法，在get方法中收集依赖 **/
    this.oldValue = this.vm[key];

    /** 把target置为null，避免重复收集依赖 **/
    Dep.target = null;
  };

  update() {
    const newValue = this.vm[this.key];

    if (this.oldValue === newValue) {
      return
    };

    // 数据更新，更新视图
    this.cb(newValue);
  }
}