/* exported cookies, misc */

$.ajaxSetup({cache: false});

/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 *
 * jQuery.browser.mobile will be true if the browser is a mobile device
 *
 **/

(function (a) {
  (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
})(navigator.userAgent || navigator.vendor || window.opera);

/**
 * Useful class to manage cookies without importing anything too heavy
 * Defines set, get and delete and is accessible everywhere via the 'cookies' global
 * @author mortrevere, 2018
 */
const cookies = {
  /**
   * Save a value in a cookie
   * @param {string} name
   * @param {string} value
   * @param {number | undefined} days
   * @param {string} path
   */
  set: function (name, value, days = undefined, path = '/') {
    const expires = !days ? undefined : new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)};${expires ? `expires=${expires};` : ''}path=${path}`;
  },
  /**
   * Get a value from a cookie
   * @param {string} name
   * @return {string} value from cookie or empty if not found
   */
  get: function (name) {
    return document.cookie.split('; ').reduce(function (r, v) {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
  },
  /**
   * Delete a cookie
   * @param {string} name
   * @param {string} path
   */
  delete: function (name, path = '/') {
    this.set(name, '', -1, path);
  },
  /**
   * Clear all cookies
   */
  clear: function () {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }
};

const misc = {
  /**
   * Calculate entropy of given binary
   * @param {string} data - only 1 and 0
   * @param {number} size - chunk size to read
   * @return {number} calculated entropy
   */
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
  /**
   * Binary value of integer
   * @param {number} dec
   * @param {number} length
   * @return {string} binary value
   */
  tobin: (dec, length) => misc.pad('0', (dec >>> 0).toString(2), length),
  //random
  /**
   * Random integer between min (included) and max (excluded)
   * @param {number} min - (max if only one argument)
   * @param {number} [max]
   * @return {number}
   */
  randint: function (min, max) {
    if (!max) {
      max = min;
      min = 0;
    }
    return Math.floor(Math.random() * (max - min) + min);
  },
  /**
   * Get a random lowercase char
   * @return {string}
   */
  randchar: () => String.fromCharCode(misc.randint(97, 123)),
  /**
   * Get a random item from an array
   * @param {Array} array
   * @return {*}
   */
  randitem: (array) => array[misc.randint(0, array.length)],
  /**
   * Generate a random number with probability chances
   * @param {number[]} array - array of chances (sum should be 1)
   * @return {number}
   */
  randchances: function (array) {
    const v = Math.random();
    let i = 0;
    let s = 0;
    while (s < v && i < array.length)
      s += array[i++];
    return i - 1;
  },
  //string utils
  /**
   * Multiply a string n times
   * @param {string} string
   * @param {number} times
   * @return {string}
   */
  times: (string, times) => new Array(times + 1).join(string),
  /**
   * Add same char to right of string until size is enough
   * @param {string} char
   * @param {string} string
   * @param {number} size
   * @return {string}
   */
  pad: (char, string, size) => (misc.times(char, size) + string).substr(-size),
  /**
   * Add same char to left of string until size is enough
   * @param {string} char
   * @param {string} string
   * @param {number} size
   * @return {string}
   */
  padLeft: (char, string, size) => (string + misc.times(char, size)).substr(0, size),
  /**
   * Format a number to the US standard
   * @param {number} n
   * @return {string}
   */
  formatNumber: (n) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: n >= 1000 ? 0 : 2,
      maximumFractionDigits: n >= 1000 ? 0 : 2
    }).format(n),
  /**
   * Compare version strings and check if version is greater than reference
   * @param {string} ref
   * @param {string} ver
   * @return {boolean}
   */
  compareVersions: function (ref, ver) {
    if (ref === ver)
      return true;
    if (!ref)
      return false;
    let refa, vera;
    try {
      refa = ref.split('\.').map(x => parseInt(x));
      vera = ver.split('\.').map(x => parseInt(x));
    } catch (u) {
      return false;
    }
    for (let i = 0; i < refa.length; i++)
      if (!vera[i] || vera[i] < refa[i])
        return false;
    return true;
  },
  /**
   * Sum of numeric array
   * @param {number[]} array
   * @return {number}
   */
  sum: (array) => array.reduce((s, k) => s + k, 0)
};