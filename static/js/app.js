'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//  pulsor.es6

/*
  Queue : 성능 개선형 Queue 구현체, (Array 아님)
*/
function Queue() {
  var a = [],
      b = 0;this.getLength = function () {
    return a.length - b;
  };this.isEmpty = function () {
    return 0 == a.length;
  };this.enqueue = function (b) {
    a.push(b);
  };this.dequeue = function () {
    if (0 != a.length) {
      var c = a[b];2 * ++b >= a.length && (a = a.slice(b), b = 0);return c;
    }
  };this.peek = function () {
    return 0 < a.length ? a[b] : void 0;
  };
};

/*
*/
(function () {
  var local_counter = 0;
  var is_server = false;

  //
  //  functions
  //
  var isVoid = function isVoid(v) {
    return v === 'undefined' || v === null;
  };
  var getKeyCount = function getKeyCount(o) {
    return Object.keys(o).length;
  };
  var clearArray = function clearArray(o) {
    o.length = 0;
  };
  var mapCounter = function mapCounter(map, field) {
    var v = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    map[field] = map[field] || 0;
    map[field] = map[field] + v;
    return map[field];
  };
  var isEmptyObject = function isEmptyObject(o) {
    return Object.keys(o).length === 0;
  };
  var hasKey = function hasKey(o, key) {
    var key_type = _typeof(o[key]);
    return key_type !== 'undefined' && key_type !== null;
  };

  /**
    is Server ?
  */
  function isServer() {
    return typeof window === 'undefined';
  }

  /**
    default PulsorUpter setting.
  */
  var newPulsorUpdater = null;
  /**
    set server Flag, Pulsor Updater.
  */
  function thisIsServer() {
    is_server = true;
    newPulsorUpdater = function newPulsorUpdater(param) {
      return new PulsorUpdater(param);
    };
    console.log('THIS IS SERVER:PULSOR');
  }
  /**
    set server Flag(=false), Pulsor Updater.
  */
  function thisIsBrowser() {
    is_server = false;
    newPulsorUpdater = function newPulsorUpdater(param) {
      return new PulsorViewUpdater(param);
    };
    console.log('THIS IS BROWSER:PULSOR');
  }

  /**
    set server Flag, Pulsor Updater.
  */
  if (isServer()) {
    thisIsServer();
  } else {
    thisIsBrowser();
  }

  //
  //  Pub/Sub
  //
  var subscriber_pool = [];
  var subscriber_seq = 0;

  var newSubscriberID = function newSubscriberID() {
    return (++subscriber_seq).toString();
  };

  //
  var pufp_buf = [];
  function push_updated_field_publisher(fsp) {
    pufp_buf.push(fsp);
  }
  function flush_updated_field_publisher() {
    pufp_buf.forEach(function (a) {
      a.flush();
    });
    clearArray(pufp_buf);
  }
  function confirm_ubuf() {
    console.log(ubuf);
  }

  /**
    Pulsor Updater
       aggregate, assemble updated fields for SERVER
  */

  var PulsorUpdater = function () {
    function PulsorUpdater(publisher) {
      _classCallCheck(this, PulsorUpdater);

      this._publisher = publisher;
      this._ubuf = [];
      this._instance = undefined;
      this._data = [];
      this._in_updating = false;
    }

    _createClass(PulsorUpdater, [{
      key: 'trySetFlushable',
      value: function trySetFlushable() {
        if (!this._in_updating) {
          push_updated_field_publisher(this._publisher);
          this._in_updating = true;
        };
      }
    }, {
      key: 'pushData',
      value: function pushData(obj, index, value) {
        if (this._instance !== obj) {
          this._instance = obj;
          this._data = [];
          this._ubuf.push(obj.getPubId());
          this._ubuf.push(this._data);
        }
        this._data.push(index);
        this._data.push(value);
      }
    }, {
      key: 'flush',
      value: function flush() {
        if (this._in_updating) {
          this._publisher.publishUp(this._ubuf, newPubSeq());
          this.clear();
          this._in_updating = false;
        }
      }
    }, {
      key: 'clear',
      value: function clear() {
        clearArray(this._ubuf);
        this._instance = null;
        clearArray(this._data);
        this._in_updating = false;
      }
    }, {
      key: 'Buffer',
      get: function get() {
        return this._ubuf;
      }
    }]);

    return PulsorUpdater;
  }();

  /**
    Pulsor Updater
       aggregate, assemble updated fields for BROWSER's View
  */


  var PulsorViewUpdater = function () {
    function PulsorViewUpdater(publisher) {
      _classCallCheck(this, PulsorViewUpdater);

      this._publisher = publisher;
      this._ubuf = [];
      this._instance = undefined;
      this._data = [];
      this._in_updating = false;
    }

    _createClass(PulsorViewUpdater, [{
      key: 'trySetFlushable',
      value: function trySetFlushable() {
        if (!this._in_updating) {
          push_updated_field_publisher(this._publisher);
          this._in_updating = true;
        };
      }
    }, {
      key: 'pushData',
      value: function pushData(obj, index, value) {
        if (this._instance !== obj) {
          this._instance = obj;
          this._data = [];
          this._ubuf.push(obj.getPubId());
          this._ubuf.push(this._data);
        }
        this._data.push(index);
        this._data.push(value);
      }
    }, {
      key: 'flush',
      value: function flush() {
        if (this._in_updating) {
          this._publisher.publishUp(this._ubuf, newPubSeq());
          this.clear();
          this._in_updating = false;
        }
      }
    }, {
      key: 'clear',
      value: function clear() {
        clearArray(this._ubuf);
        this._instance = null;
        clearArray(this._data);
        this._in_updating = false;
      }
    }, {
      key: 'Buffer',
      get: function get() {
        return this._ubuf;
      }
    }]);

    return PulsorViewUpdater;
  }();

  /**
    Subscriber
  */


  var Subscriber = function () {
    function Subscriber(consumer) {
      _classCallCheck(this, Subscriber);

      this._id = newSubscriberID();
      this._consumer = consumer;
      this._subscriptions = {};
      this._updater = newPulsorUpdater(this);
    }

    _createClass(Subscriber, [{
      key: 'setConsumer',
      value: function setConsumer(consumer) {
        this._consumer = consumer;
      }
    }, {
      key: 'incSubscription',
      value: function incSubscription(p) {
        var v = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

        var obj = this._subscriptions[p.PubNID];
        if (!obj) {
          obj = [p, 1];
          this._subscriptions[p.PubNID] = obj;
        } else obj[1] += v;
        return obj;
      }
    }, {
      key: 'addSubscription',
      value: function addSubscription(p) {
        this.incSubscription(p);
      }
    }, {
      key: 'deleteSubscription',
      value: function deleteSubscription(p) {
        var obj = this.incSubscription(p, -1);
        if (obj[1] < 1) {
          delete this._subscriptions[p.PubNID];
        }
      }
    }, {
      key: 'subscribe',
      value: function subscribe(p) {
        if (!hasKey(this._subscriptions, p.PubNID)) {
          p.subscribe(this);
          return true;
        } else {
          this.incSubscription(p);
          return false;
        }
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe(p) {
        if (hasKey(this._subscriptions, p.PubNID)) {
          var obj = this.incSubscription(p, -1);
          if (obj[1] < 1) {
            p.unsubscribe(this);
          }
          return true;
        }
        return false;
      }
    }, {
      key: 'subscriptionCount',
      value: function subscriptionCount(p) {
        var obj = this._subscriptions[p.PubNID];
        if (obj) {
          return obj[1];
        }
        return 0;
      }
    }, {
      key: 'obsolete',
      value: function obsolete() {
        var _this = this;

        this._consumer = null;
        var arr = [];
        for (var k in this._subscriptions) {
          arr.push(this._subscriptions[k]);
        }
        arr.forEach(function (a) {
          a[0].unsubscribe(_this);
        });
        this._subscriptions = {};
      }
    }, {
      key: 'dispose',
      value: function dispose() {
        this.obsolete();
        subscriber_pool.push(this);
      }
    }, {
      key: 'consume',
      value: function consume(data) {
        if (this._consumer) {
          this._consumer.emit(data);
        }
      }
    }, {
      key: 'emit',
      value: function emit(data) {
        this.consume(data);
      }
    }, {
      key: 'onPublish',
      value: function onPublish(data, seq) {
        this.consume(data);
      }
    }, {
      key: 'pushPartial',
      value: function pushPartial(obj, index, value) {
        if (this._consumer) {
          // this._consumer.pushPartial(obj,index,value);
          this._updater.pushData(obj, index, value);
          this._updater.trySetFlushable();
        }
      }
    }, {
      key: 'flush',
      value: function flush() {
        this._updater.flush();
      }
    }, {
      key: 'publishUp',
      value: function publishUp(buf, seq) {
        this.consume(buf);
      }
    }, {
      key: 'SubsID',
      get: function get() {
        return this._id;
      }
    }], [{
      key: 'instance',
      value: function instance(consumer, fn) {
        var subs = void 0;
        if (subscriber_pool.length > 0) {
          subs = subscriber_pool.pop();
          subs.setConsumer(consumer);
        } else {
          subs = new Subscriber(consumer);
        }
        if (fn) fn(consumer, subs);
        return subs;
      }
    }]);

    return Subscriber;
  }();

  var publisher_seq = 0;
  function newPublisherID() {
    return (++publisher_seq).toString();
  }
  var pub_seq = 0;
  function newPubSeq() {
    return pub_seq++;
  }

  /**
    Publisher
  */

  var Publisher = function () {
    function Publisher() {
      _classCallCheck(this, Publisher);

      // this._parents = {};
      this._pub_nid = newPublisherID();
      this._seq = 0;
    }

    _createClass(Publisher, [{
      key: 'getPubId',
      value: function getPubId() {
        return this._pub_nid.toString();
      }
    }, {
      key: 'linkParent',
      value: function linkParent(parent) {
        if (!this._parents) this._parents = {};
        this._parents[parent] = parent;
      }
    }, {
      key: 'unlinkParent',
      value: function unlinkParent(parent) {
        delete this._parents[parent];
      }
    }, {
      key: 'getParents',
      value: function getParents() {
        return this._parents;
      }
    }, {
      key: 'subscribe',
      value: function subscribe(s) {
        if (!this._subscribers) {
          this._subscribers = {};
        };
        this._subscribers[s.SubsID] = s;
        s.addSubscription(this);
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe(s) {
        s.deleteSubscription(this);
        delete this._subscribers[s.SubsID];
      }
    }, {
      key: 'hasSubscribers',
      value: function hasSubscribers() {
        return this._subscribers && !isEmptyObject(this._subscribers);
      }
    }, {
      key: 'getSubscribers',
      value: function getSubscribers() {
        return this._subscribers;
      }
      // setOnUpdate(fn) {this.onUpdate = fn;}
      /**
      */

    }, {
      key: 'onUpdate',
      value: function onUpdate(data) {
        return true;
      }
      /**
        update-Up: update processing hierarchical iterate until Updated false or has no-parents.
      */

    }, {
      key: 'updateUp',
      value: function updateUp(data) {
        var res = this.onUpdate(data);
        if (!res) return false;
        if (this._parents) {
          if (getKeyCount(this._parents) > 0) {
            for (var k in this._parents) {
              this._parents[k].updateUp(data);
            }
            return true;
          } else return false;
        }
      }
    }, {
      key: 'onPublish',
      value: function onPublish(data, seq) {
        for (var k in this._subscribers) {
          var s = this._subscribers[k];
          s.consume(data);
        }
        return true;
      }
    }, {
      key: 'publishUp',
      value: function publishUp(data, seq) {
        if (this._seq === seq) return false;
        this._seq = seq;
        var res = this.onPublish(data, seq);
        if (!res) return false;
        var parents = this._parents;
        if (parents) {
          if (getKeyCount(parents) > 0) {
            for (var k in parents) {
              parents[k].publishUp(data, seq);
              // res = parents[k].publishUp(data,seq);
              // if (!res) return false;
            }
            return true;
          } else return false;
        }
      }
    }, {
      key: 'PubNID',
      get: function get() {
        return this._pub_nid;
      }
    }]);

    return Publisher;
  }();

  /**
    Field-Set Publisher
  */


  var FieldSetPublisher = function (_Publisher) {
    _inherits(FieldSetPublisher, _Publisher);

    function FieldSetPublisher() {
      _classCallCheck(this, FieldSetPublisher);

      var _this2 = _possibleConstructorReturn(this, (FieldSetPublisher.__proto__ || Object.getPrototypeOf(FieldSetPublisher)).call(this));

      _this2._updater = newPulsorUpdater(_this2);
      _this2._in_update_buffer = false;
      return _this2;
    }

    _createClass(FieldSetPublisher, [{
      key: 'onUpdate',
      value: function onUpdate(data) {
        //  data maybe FieldInstance ...
        var fi = void 0;
        if (data.getNid() > -1) {
          if (data.getNid() > 0) {
            fi = data.getNid();
          }
        } else {
          fi = data.getName();
        }
        if (fi) {
          this._updater.pushData(this, fi, data.get());
        }
        this._updater.trySetFlushable();
        return false;
      }
    }, {
      key: 'flush',
      value: function flush() {
        this._updater.flush();
      }
    }]);

    return FieldSetPublisher;
  }(Publisher);

  /**
    Pulsor Field : 항목 메타 객체
  */


  var PulsorField = function (_Publisher2) {
    _inherits(PulsorField, _Publisher2);

    function PulsorField(name) {
      var nid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

      _classCallCheck(this, PulsorField);

      var _this3 = _possibleConstructorReturn(this, (PulsorField.__proto__ || Object.getPrototypeOf(PulsorField)).call(this));

      _this3._name = name;
      _this3._nid = nid;
      return _this3;
    }

    _createClass(PulsorField, [{
      key: 'getNid',
      value: function getNid() {
        return this._nid;
      }
    }, {
      key: 'getName',
      value: function getName() {
        return this._name;
      }
    }, {
      key: 'Name',
      get: function get() {
        return this._name;
      }
    }, {
      key: 'NID',
      get: function get() {
        return this._nid;
      },
      set: function set(v) {
        this._nid = v;
      }
    }]);

    return PulsorField;
  }(Publisher);

  /**
    Pulsor Field Instance : 실객체의 항목 인스턴스. 여기에 개별 구독 정보가 있다.
  */


  var PulsorFieldInstance = function (_Publisher3) {
    _inherits(PulsorFieldInstance, _Publisher3);

    function PulsorFieldInstance(mi, field) {
      _classCallCheck(this, PulsorFieldInstance);

      var _this4 = _possibleConstructorReturn(this, (PulsorFieldInstance.__proto__ || Object.getPrototypeOf(PulsorFieldInstance)).call(this));

      _this4._mi = mi;
      _this4._field = field;
      _this4._value = null;
      return _this4;
    }

    _createClass(PulsorFieldInstance, [{
      key: 'getName',
      value: function getName() {
        return this._field.Name;
      }
    }, {
      key: 'getNid',
      value: function getNid() {
        return this._field.NID;
      }
    }, {
      key: 'getFieldID',
      value: function getFieldID() {
        if (this._field.NID > -1) {
          return this._field.NID;
        }
        return this._field.Name;
      }
    }, {
      key: 'get',
      value: function get() {
        return this._value;
      }
    }, {
      key: 'set',
      value: function set(value) {
        var affected = false;
        if (this._value !== value) {
          this._value = value;
          affected = true;
          this.updateUp(this);
        }
        return affected;
      }
    }, {
      key: 'onUpdate',
      value: function onUpdate(data) {
        if (this.hasSubscribers()) {
          var subs = this.getSubscribers();
          for (var k in subs) {
            var s = subs[k];
            // console.log(this._mi.getPubId(),this.getFieldID(),this.get());
            s.pushPartial(this._mi, this.getFieldID(), this.get());
          }
        }
        return true;
      }
    }]);

    return PulsorFieldInstance;
  }(Publisher);

  /**
    Field Set Schema : preset. 구독단위로도 작용하고, 저장단위로도 작용한다. 2nd 인덱스를 두어 테이블에 series 로 저장이 가능하다.
      change_only : 변경된 항목만 실시간 전송된다.
  */


  var PulsorFieldSet = function (_FieldSetPublisher) {
    _inherits(PulsorFieldSet, _FieldSetPublisher);

    function PulsorFieldSet() {
      _classCallCheck(this, PulsorFieldSet);

      var _this5 = _possibleConstructorReturn(this, (PulsorFieldSet.__proto__ || Object.getPrototypeOf(PulsorFieldSet)).call(this));

      _this5._model = null; //  model schema
      _this5._change_only = true; //  change only flag
      _this5._fields = {};
      return _this5;
    }

    _createClass(PulsorFieldSet, [{
      key: 'isChangeOnly',
      value: function isChangeOnly() {
        return this._change_only;
      }
    }, {
      key: 'setChangeOnly',
      value: function setChangeOnly(v) {
        this._change_only = v;
      }
    }, {
      key: 'addField',
      value: function addField(name) {
        var field = this._model.field(name);
        field.linkParent(this);
        this._fields[name] = field;
      }
    }, {
      key: 'makeSnapshot',
      value: function makeSnapshot() {
        var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'push';

        var json = {};
        for (var k in this._fields) {
          var fi = this._fields[k];
          json[fi.getName()] = fi.get();
        }
        var obj = { jsonrpc: '2.0', method: method, params: json };
        return obj;
      }
    }, {
      key: 'instance',
      value: function instance(model_instance) {
        this._mi = model_instance;
        return PulsorFieldSetInstance(this);
      }
    }]);

    return PulsorFieldSet;
  }(FieldSetPublisher);

  /**
    Field Set Instance : 필드셋의 실제 인스턴스. 여기에 개별 구독 정보가 있다.
  */


  var PulsorFieldSetInstance = function (_FieldSetPublisher2) {
    _inherits(PulsorFieldSetInstance, _FieldSetPublisher2);

    function PulsorFieldSetInstance(field_set) {
      _classCallCheck(this, PulsorFieldSetInstance);

      var _this6 = _possibleConstructorReturn(this, (PulsorFieldSetInstance.__proto__ || Object.getPrototypeOf(PulsorFieldSetInstance)).call(this));

      _this6._field_set = field_set;
      return _this6;
    }

    _createClass(PulsorFieldSetInstance, [{
      key: 'onUpdate',
      value: function onUpdate(data) {
        if (this._field_set.isChangeOnly()) {
          _get(PulsorFieldSetInstance.prototype.__proto__ || Object.getPrototypeOf(PulsorFieldSetInstance.prototype), 'onUpdate', this).call(this, data);
        } else {
          this.trySetFlushable();
        }
        return false;
      }
    }, {
      key: 'flush',
      value: function flush() {
        if (this._in_update_buffer) {
          var data = void 0;
          if (this._field_set.isChangeOnly()) {
            // data = this._ubuf;
            data = this._updater.Buffer;
            this.publishUp(data, newPubSeq());
            // clearArray(this._ubuf);
            this._updater.clear();
          } else {
            data = this._field_set.makeSnapshot();
            this.publishUp(data, newPubSeq());
          }
          this._in_update_buffer = false;
        }
      }
    }]);

    return PulsorFieldSetInstance;
  }(FieldSetPublisher);

  /**
    Pulsor Model : 모델 메타 객체.
  */


  var PulsorModel = function (_FieldSetPublisher3) {
    _inherits(PulsorModel, _FieldSetPublisher3);

    function PulsorModel(name) {
      _classCallCheck(this, PulsorModel);

      var _this7 = _possibleConstructorReturn(this, (PulsorModel.__proto__ || Object.getPrototypeOf(PulsorModel)).call(this));

      _this7._name = name;
      _this7._fields = {};
      _this7._nfields = [];
      _this7.addField('id', {
        nid: 0
      });
      _this7._instances = {};
      return _this7;
    }

    _createClass(PulsorModel, [{
      key: 'getName',
      value: function getName() {
        return this._name;
      }
      // getPubID() {return 'Model.'+this.getName();}

    }, {
      key: 'addField',
      value: function addField(name) {
        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var field = new PulsorField(name);
        field.linkParent(this);
        var nid = opt.nid;
        if (isVoid(nid)) {
          nid = -1;
        };
        if (nid > -1) {
          field.NID = nid;
          this._nfields[nid] = field;
        }
        this._fields[name] = field;
        return field;
      }
    }, {
      key: 'fieldCount',
      value: function fieldCount() {
        return Object.keys(this._fields).length;
      }
    }, {
      key: 'field',
      value: function field(name) {
        return this._fields[name];
      }
    }, {
      key: 'fieldN',
      value: function fieldN(nid) {
        return this._nfields[nid];
      }
    }, {
      key: 'instance',
      value: function instance() {
        return new PulsorModelInstance(this);
      }
    }, {
      key: 'registerInstance',
      value: function registerInstance(obj) {
        this._instances[obj.getID()] = obj;
        return true;
      }
    }, {
      key: 'deregisterInstance',
      value: function deregisterInstance(obj) {
        delete this._instances[obj.getID()];
        return true;
      }
    }, {
      key: 'findInstance',
      value: function findInstance(id) {
        return this._instances[id];
      }
    }, {
      key: 'gocInstance',
      value: function gocInstance(id) {
        var obj = this.findInstance(id);
        if (!obj) {
          obj = this.instance();
          obj.set('id', id);
          this.registerInstance(obj);
        }
        return obj;
      }
    }]);

    return PulsorModel;
  }(FieldSetPublisher);

  /**
    Pulsor Model Instance : 실제 객체. PulsorModel 을 메타로 가진다.
  */


  var PulsorModelInstance = function (_FieldSetPublisher4) {
    _inherits(PulsorModelInstance, _FieldSetPublisher4);

    function PulsorModelInstance(model) {
      _classCallCheck(this, PulsorModelInstance);

      var _this8 = _possibleConstructorReturn(this, (PulsorModelInstance.__proto__ || Object.getPrototypeOf(PulsorModelInstance)).call(this, model.getName()));

      _this8._model = model;
      _this8._fields = {};
      _this8._nfields = [];
      return _this8;
    }

    _createClass(PulsorModelInstance, [{
      key: 'getModel',
      value: function getModel() {
        return this._model;
      }
    }, {
      key: 'getModelName',
      value: function getModelName() {
        return this._model.getName();
      }
      // getPubID() {return this._model.getName()+'.'+this.getN(0);}

    }, {
      key: 'getID',
      value: function getID() {
        return this.getN(0);
      }
    }, {
      key: 'getPubId',
      value: function getPubId() {
        return [this._model.getName(), this.getN(0)];
      }
    }, {
      key: 'register',
      value: function register() {
        this._model.registerInstance(this);
      }
    }, {
      key: 'deregister',
      value: function deregister() {
        this._model.deregisterInstance(this);
      }
    }, {
      key: 'addField0',
      value: function addField0(field) {
        var fi = new PulsorFieldInstance(this, field);
        fi.linkParent(this);
        if (field.NID > -1) {
          this._nfields[field.NID] = fi;
        }
        this._fields[field.Name] = fi;
        return fi;
      }
    }, {
      key: 'addField',
      value: function addField(name) {
        var field = this._model.field(name);
        if (!field) {
          field = this._model.addField(name);
        }
        return this.addField0(field);
      }
    }, {
      key: 'addFieldN',
      value: function addFieldN(nid) {
        var field = this._model.fieldN(nid);
        if (field) {
          return this.addField0(field);
        }
        return null;
      }
    }, {
      key: 'getField',
      value: function getField(name) {
        return this._fields[name];
      }
    }, {
      key: 'getFieldN',
      value: function getFieldN(nid) {
        return this._nfields[index];
      }
    }, {
      key: 'gocField',
      value: function gocField(name) {
        var fi = this._fields[name];
        if (!fi) {
          fi = this.addField(name);
        }
        return fi;
      }
    }, {
      key: 'get',
      value: function get(name) {
        var fi = this._fields[name];
        if (fi) {
          return fi.get();
        }
        return null;
      }
    }, {
      key: 'set',
      value: function set(name, value) {
        var fi = this._fields[name];
        if (!fi) {
          fi = this.addField(name);
        }
        if (fi) return fi.set(value);else return false;
      }
    }, {
      key: 'getN',
      value: function getN(index) {
        var fi = this._nfields[index];
        if (fi) {
          return fi.get();
        }
        return null;
      }
    }, {
      key: 'setN',
      value: function setN(index, value) {
        var fi = this._nfields[index];
        if (!fi) {
          fi = this.addFieldN(index);
        }
        if (fi) return fi.set(value);else return false;
      }
    }, {
      key: 'purge',
      value: function purge() {
        //
      }
    }]);

    return PulsorModelInstance;
  }(FieldSetPublisher);

  /**
    Pulsor Singleton : 전역 Pulsor 객체
  */


  var Pulsor = function () {
    //  Constructor
    function Pulsor() {
      var _this9 = this;

      _classCallCheck(this, Pulsor);

      local_counter++;
      this._models = {};
      this._schemas = {};
      this._action_q = new Queue();
      if (!isServer()) {
        setInterval(function () {
          _this9.fetchAction();
        }, 100);
      };
    }

    _createClass(Pulsor, [{
      key: 'getLocalCounter',
      value: function getLocalCounter() {
        return local_counter;
      }

      //  Find Model

    }, {
      key: 'findModel',
      value: function findModel(name) {
        return this._models[name];
      }

      //  Get or Create Model

    }, {
      key: 'gocModel',
      value: function gocModel(name) {
        var model = this._models[name];
        if (!model) {
          model = new PulsorModel(name);
          this._models[name] = model;
        }
        return model;
      }

      /**
        define model
      */

    }, {
      key: 'define',
      value: function define(name) {
        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        //  set Model Name
        var model = this.gocModel(name);
        //  set Fields Definition
        opt.fields = opt.fields || [];
        opt.fields.forEach(function (field_opt) {
          switch (typeof field_opt === 'undefined' ? 'undefined' : _typeof(field_opt)) {
            case 'string':
              model.addField(field_opt, {});
              break;
            case 'object':
              if (field_opt instanceof Array) {
                model.addField(field_opt[0], field_opt[1]);
              } else {
                model.addField(field_opt.name, field_opt);
              }
              break;
          } //  switch (typeof field_opt)
        });
        return model;
      }
      //  Get Instance

    }, {
      key: 'getInstance',
      value: function getInstance(model_name, id) {
        var model = findModel(model_name);
        if (model) {
          return model.findInstance(id);
        }
        return null;
      }
      //  Get or Create Instance

    }, {
      key: 'gocInstance',
      value: function gocInstance(model_name, id) {
        var model = gocModel(model_name);
        if (model) {
          return model.gocInstance(id);
        }
        return null;
      }
    }, {
      key: 'getUpdateBuffer',
      value: function getUpdateBuffer() {
        return ubuf;
      }
    }, {
      key: 'confirmUpdateBuffer',
      value: function confirmUpdateBuffer() {
        confirm_ubuf();
      }
      //  Create New Subscriber

    }, {
      key: 'newSubscriber',
      value: function newSubscriber(consumer, fn) {
        return Subscriber.instance(consumer, fn);
      }
    }, {
      key: 'flushAll',
      value: function flushAll() {
        flush_updated_field_publisher();
      }
    }, {
      key: 'subscribe',
      value: function subscribe(model, id, fields) {
        console.log('Pulsor Subscribed');
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe(model, id, fields) {
        console.log('Pulsor Unsubscribed');
      }
    }, {
      key: 'mount',
      value: function mount(model, id, fields) {
        console.log('Pulsor Mounted Model(' + model + '), ID(' + id + ')');
      }
    }, {
      key: 'unmount',
      value: function unmount(model, id, fields) {
        console.log('Pulsor Unmounted');
      }
    }, {
      key: 'throwAction',
      value: function throwAction(cmd) {
        // let action = new PulsorAction(cmd);
        this._action_q.enqueue(cmd);
      }
    }, {
      key: 'action',
      value: function action(cmd) {
        this.throwAction(cmd);
      }
    }, {
      key: 'fetchAction',
      value: function fetchAction() {
        // console.log('fetch action');
        var item = this._action_q.dequeue();
        while (item) {
          // item.act();
          this.doAction(item);
          item = this._action_q.dequeue();
        }
      }
    }, {
      key: 'doAction',
      value: function doAction(item) {
        var cmd = item[0];
        var id_part = void 0,
            values = void 0,
            cb = void 0,
            params = void 0,
            topic = void 0;
        switch (cmd) {
          case 'U':
            //  Update Object
            id_part = item[1]; //  ['user','anonymous']
            values = item[2]; //  ['name','anonymous','email':'anonymous@gmail.com']
            cb = item[3]; //  (m)=>{}
            break;
          case 'D':
            //  Delete Object
            id_part = item[1];
            cb = item[2];
            break;
          case 'B':
            //  Broadcast
            topic = item[1]; //  'm.mcounter.io'
            params = item[2]; //  {'age':21,email:'anonymous@gmail.com'}
            cb = item[3];
            break;
          default:
            break;
        }
      }
    }]);

    return Pulsor;
  }();

  var pulsor = new Pulsor();
  pulsor.PulsorFieldSet = PulsorFieldSet;
  pulsor.PulsorFieldSetInstance = PulsorFieldSetInstance;

  if (typeof window === 'undefined') {
    module.exports = pulsor;
  } else {
    window.Pulsor = pulsor;
  }
})();

/**
  is array ?
*/
function isArray(o) {
  if (Array.isArray) return Array.isArray(o);else {
    return o instanceof Array;
  }
}

/**
  is empty object ?
*/
function isEmptyObject(o) {
  return Object.keys(o).length === 0;
};

/**
  string.format
*/
if (!String.prototype.format) {
  String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
};

/**
  for jQuery DOM remove event hooking
*/
(function ($) {
  $.event.special.destroyed = {
    remove: function remove(o) {
      if (o.handler) {
        o.handler();
      }
    }
  };
})(jQuery);

//  prepare System JS
//  let System = global.System;
//    System.js 를 위한 준비단계, 서버 컴포넌트의 기본 경로를 설정한다.
System.config({
  baseURL: '/comp'
});

/**
  원격 js 로드 함수.
*/
function library(fname, cname) {
  System.import(a + '.js').then(function (m) {
    console.log('library loaded ', fname, cname);
  }, console.error.bind(console));
};

/**
  replace dom with html
    remove all child nodes
*/
function replaceDomWith(dom) {
  var new_html = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var tdom = $("#" + dom);
  tdom.empty();
  tdom[0].innerHTML = new_html;
  return tdom;
};

/**
  place Component.
    컴포넌트 배치 함수. 주요하게 사용될 것.
    컴포넌트명에 해당하는 partial_js 파일을 서버로부터 적재하고, 배치,실행한다.
*/
function placeComponent(dom, a, opt) {
  var fname = a;
  var comp_name = 'default';
  if (isArray(a)) {
    // console.log("it is ARRAY");
    fname = a[0];comp_name = a[1];
  };
  System.import(fname + '.js').then(function (m) {
    // console.log('loaded ',fname,comp_name,m[comp_name]);
    console.log('loaded ', fname, comp_name);
    if (dom) {
      var tdom = document.getElementById(dom);
      var comp = React.createElement(m[comp_name], opt);
      $('#' + dom).bind('destroyed', function () {
        ReactDOM.unmountComponentAtNode(document.getElementById(dom));
      });
      ReactDOM.render(comp, tdom);
    }
  }, console.error.bind(console));
};

/**
  Pop Over DOM
*/
function popOver(dom) {
  alert(dom);
};

/**
  Query Partial Contents
*/
function queryPartial(dom, sub_path) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var path = '/qry/' + sub_path;
  $.post(path, data, function (ret, textStatus, jqXHR) {
    console.log(ret);
    console.log(dom);
    if (dom) {
      if (opt.dom_pre) {
        opt.dom_pre(ret);
      }
      // var tdom = document.getElementById(dom);
      replaceDomWith(dom, ret.html);
      if (opt.dom_post) {
        opt.dom_post(ret);
      }
    };
    if (opt.on_success) {
      opt.on_success(ret);
    }
  });
}

/**
*/
function postPartial(dom, sub_path) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var path = sub_path;
  $.post(path, data, function (ret, textStatus, jqXHR) {
    console.log(ret);
    console.log(dom);
    if (dom) {
      if (opt.dom_pre) {
        opt.dom_pre(ret);
      }
      var tdom = document.getElementById(dom);
      tdom.innerHTML = ret.html;
      if (opt.dom_post) {
        opt.dom_post(ret);
      }
    };
    if (opt.on_success) {
      opt.on_success(ret);
    }
  });
}

/**
  {dom: DOMID, html: HTML STRINGS, data: JS DATA}
*/
function redrawDoms(doms, opt) {
  doms.forEach(function (a) {
    if (opt.dom_pre) {
      opt.dom_pre(a.data);
    }
    var tdom = document.getElementById(a.dom);
    tdom.innerHTML = a.html;
    if (opt.dom_post) {
      opt.dom_post(a.data);
    }
  });
};

/**
  fetch DOM re-draw
*/
function fetchDom(dom, method) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var path = '/fetchdom';
  var buffer = { doms: [] };
  buffer.doms.push([dom, method, data]);
  $.post(path, buffer, function (ret, textStatus, jqXHR) {
    console.log(ret);
    ret.doms = ret.doms || [];
    redrawDoms(ret.doms);
    if (opt.on_success) {
      opt.on_success(ret);
    }
  });
}

/**
  Asynchronous Queries & Redraw DOM
    method:     query method name
    opt:        query options
    widgets:    draw with result

    return:
      method:   response method name

*/
function Qry(method, opt, widgets) {
  var path = '/aquery';
  var data = [method, opt, widgets];
  $.post(path, data, function (ret, textStatus, jqXHR) {});
};

//  client side JS
var cli_ws = void 0;
var dom_logger = void 0;

// let apple = (a)=>{
//   console.log('APPLE');
// };

var logStr = function logStr(eventStr, msg) {
  var log = '<div>' + eventStr + ': ' + msg + '</div>';
  if (dom_logger) {
    dom_logger.innerHTML += log;
  }
};

var setDomLogger = function setDomLogger(id) {
  dom_logger = document.getElementById(id);
};

var newWS = function newWS(addr) {
  addr = addr || 'localhost:8080';
  addr2 = 'ws://' + addr + '/ws/';
  cli_ws = new WebSocket(addr2);
  ws.onmessage = function (e) {
    logStr('Recieved', e.data);
  };
  ws.onclose = function (e) {
    logStr('Disconnected', e.code + '-' + e.type);
  };
  ws.onerror = function (e) {
    logStr('Error', e.data);
  };
};

// let print = console.log;

// print('app loaded');

console.log('APP LOADED');