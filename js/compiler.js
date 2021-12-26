class Compiler {

  /**
   * 
   * @param {当前vue实例} vm 
   */
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.compile(this.el);
  };

  /**
   * 
   * @param {当前vue应用的根节点} el 
   */
  compile(el) {
    const childNodes = el.childNodes;

    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        this.compileText(node);
      } else if (this.isElementNode(node)) {
        this.compileElement(node);
      };

      /** 判断该节点是否存在子节点 **/
      if (node.childNodes && node.childNodes.length) {
        this.compile(node);
      };
    });
  };

  /**
   * 
   * @param {当前dom} node 
   */
  compileText(node) {

    /** 匹配 {{  }} **/
    const reg = /\{\{(.+?)\}\}/;
    const value = node.textContent;

    if (reg.test(value)) {
      const key = RegExp.$1.trim();

      node.textContent = value.replace(reg, this.vm[key]);

      new Watcher(this.vm, key, newValue => {
        node.textContent = newValue;
      })
    }
  };

  /**
   * 
   * @param {当前dom} node 
   */
  compileElement(node) {

    /** 遍历节点所有的属性 **/
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        this.update(node, attr.value, attrName.substr(2));
      }
    })
  };

  /**
   * 
   * @param {当前dom} node 
   * @param {指令的值  v-model="msg" --> msg} key 
   * @param {v-model --> model} attrName 
   */
  update(node, key, attrName) {
    /** 这样写的好处就是，当有新的指令时，不用侵入上层和本层方法进行修改 **/
    const updateFn = this[`${attrName}Updater`];

    /** 执行的updateFn内部方法的this指向update 所以需要bind一下指向compiler **/
    updateFn && updateFn.call(this, node, this.vm[key], key);
  }

  /**
   * 
   * @param {当前dom对象} node 
   * @param {data对象中属性对应的值} value 
   * @param {data对象中的属性} key 
   */
  textUpdater(node, value, key) {
    node.textContent = value;

    new Watcher(this.vm, key, newValue => {
      node.textContent = newValue;
    });
  };

  modelUpdater(node, value, key) {
    node.value = value;

    new Watcher(this.vm, key, newValue => {
      node.value = newValue;
    });

    /** 视图更新，数据更新 **/
    node.addEventListener('input', () => {
      this.vm[key] = node.value;
    })
  }

  /**
   * 
   * @param {传入dom上属性名称} attrName 
   * @returns {true | false}
   */
  isDirective(attrName) {
    return attrName.startsWith('v-');
  }

  /**
   * 
   * @param {当前传入的dom} node 
   * @returns {true | false}
   */
  isTextNode(node) {
    return node.nodeType === 3;
  };

  /**
   * 
   * @param {当前传入的dom} node
   * @returns {true | false} 
   */
  isElementNode(node) {
    return node.nodeType === 1;
  };
}