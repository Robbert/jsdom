"use strict";

const NodeImpl = require("./Node-impl").implementation;

const NODE_TYPE = require("../node-type");

exports.implementation = class AttrImpl extends NodeImpl {
  constructor(_, privateData) {
    super(_, privateData);

    this._namespace = privateData.namespace !== undefined ? privateData.namespace : null;
    this._namespacePrefix = privateData.namespacePrefix !== undefined ? privateData.namespacePrefix : null;
    this._localName = privateData.localName;
    this._value = privateData.value !== undefined ? privateData.value : "";
    this._element = privateData.element !== undefined ? privateData.element : null;

    this.nodeType = NODE_TYPE.ATTRIBUTE_NODE;
    this.specified = true;
  }

  get namespaceURI() {
    return this._namespace;
  }

  get prefix() {
    return this._namespacePrefix;
  }

  get localName() {
    return this._localName;
  }

  get name() {
    // https://dom.spec.whatwg.org/#concept-attribute-qualified-name

    if (this._namespacePrefix === null) {
      return this._localName;
    }

    return this._namespacePrefix + ":" + this._localName;
  }

  // Delegate to name
  get nodeName() {
    return this.name;
  }

  get value() {
    return this._value;
  }
  set value(v) {
    if (this._element === null) {
      this._value = v;
    } else {
      this._changeAttributeImpl(this._element, v);
    }
  }

  // Delegate to value
  get nodeValue() {
    return this.value;
  }
  set nodeValue(v) {
    this.value = v;
  }

  // Delegate to value
  get textContent() {
    return this.value;
  }
  set textContent(v) {
    this.value = v;
  }

  get ownerElement() {
    return this._element;
  }

  _changeAttributeImpl(element, value) {
    // https://dom.spec.whatwg.org/#concept-element-attributes-change

    // TODO mutation observer stuff

    const oldValue = this._value;
    this._value = value;

    // Run jsdom hooks; roughly correspond to spec's "An attribute is set and an attribute is changed."
    element._attrModified(this.name, value, oldValue);
  }
};
