class Observer {

  /**
   * 
   * @param {data数据} data 
   */
  constructor(data) {
    this.walk(data);
  };

  walk(data) {
    if (Object.prototype.toString.call(data).indexOf('Object') === -1) {
      return;
    };

    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
    })
  };

  /**
   * 
   * @param {遍历的对象} obj 
   * @param {对象中的键值} key 
   * @param {对象的值} val 
   */
  defineReactive(obj, key, val) {

    /** 因为set方法调用是在其它地方，this指向的并不少observer，需要缓存this **/
    const self = this;

    /** 如果传入的是一个对象，需要继续遍历，添加get和set **/
    this.walk(val);

    /** 实例化Dep，收集依赖，并发送通知 **/
    const dep = new Dep();

    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        console.log('defineReactive', val)

        /** 判断是否是在实例Watcher中调用的依赖收集 **/
        Dep.target && dep.addSub(Dep.target);

        /** 直接使用val，而不是obj[key]，防止死循环调用get **/
        return val;
      },
      set(newValue) {
        console.log('defineReactive', newValue)
        if (newValue === val) {
          return;
        };

        val = newValue;

        /** 如果设置的值是对象，需要添加get和set **/
        self.walk(newValue)

        /** 数据更新了，发送通知视图更新 **/
        dep.notify();
      }
    })
  }
}