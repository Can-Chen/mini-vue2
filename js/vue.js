class Vue {
  constructor(options) {
    this.$options = options || {};
    this.$data = options.data || {};
    this.$el = typeof options.el === 'string' ?
      document.querySelector(options.el) :
      options.el;

    /** 把data中的成员转换成getter和setter 注入到实例中 **/
    this.proxyData(this.$data);

    /** 实例observer对象，监听数据变化 **/
    new Observer(this.$data);

    /** 实例Compiler对象 解析插值表达式和指令 **/
    new Compiler(this);
  };

  proxyData(data) {
    if (Object.prototype.toString.call(data).indexOf('Object') === -1) {
      return;
    };

    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          if (newValue === data[key]) return;

          data[key] = newValue;
        }
      })
    });
  }
};