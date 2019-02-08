/* exported cookies, misc */

/**
 * Useful class to manage cookies without importing anything too heavy
 * Defines set, get and delete and is accessible everywhere via the 'cookies' global
 * @author mortrevere, 2018
 */
const cookies = {
  set: function (name, value, days, path) {
    if (days === undefined)
      days = 7;
    if (path === undefined)
      path = '/';

    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path;
  },
  get: function (name) {
    return document.cookie.split('; ').reduce(function (r, v) {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
  },
  delete: function (name, path) {
    if (path === undefined)
      path = '/';
    this.set(name, '', -1, path);
  },
  clear: function () {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }
};

const misc = {
  entropy: function (data, size) {
    if (data.length < size)
      return 0;
    const p = {};
    for (let i = 0; i < data.length; i += size) {
      const subd = data.substr(i, size);
      p[subd] = (p[subd] || 0) + 1;
    }

    let e = 0;
    const dataSize = Math.floor(data.length / size);
    Object.keys(p).forEach(function (key) {
      const pi = p[key] / dataSize;
      e -= pi * Math.log2(pi);
    });

    return e;
  },
  //random
  randint: function (min, max) {
    if (!max) {
      max = min;
      min = 0;
    }
    return Math.floor(Math.random() * (max - min) + min);
  },
  randchar: function () {
    return String.fromCharCode(misc.randint(97, 123));
  },
  randitem: function (array) {
    return array[misc.randint(0, array.length)];
  },
  //string utils
  times: function (string, times) {
    let o = '';
    for (let i = 0; i < times; i++)
      o += string;
    return o;
  },
  pad: function (char, string, size) {
    return (misc.times(char, size) + string).substr(-size);
  },
  formatNumber: function (n) {
    return new Intl.NumberFormat('en-US', {minimumFractionDigits: 3, maximumFractionDigits: 3}).format(n);
  }
};