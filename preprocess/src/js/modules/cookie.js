const Cookies = {
  cookieBlock: document.getElementById('cookies'),
  cookieCloseButton: document.getElementById('cookies-close'),

  init: function() {

    this.checkCookie('liaigre_cookie');
    this.cookieCloseButton.addEventListener('click', () => this.cookieClose());
  },

  checkCookie: function(name) {
    if (this.getCookie(name) === null) {
        this.cookieBlock.classList.add('open');
    }
  },

  setCookie: function(name, value) {
    let today   = new Date(),
        expires = new Date();
    expires.setTime(today.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + expires.toGMTString() + ';path=/';
  },

  getCookie: function(name) {
    let regex = new RegExp('(?:; )?' + name + '=([^;]*);?');

    if (regex.test(document.cookie)) {
      return decodeURIComponent(RegExp['$1']);
    } else {
      return null;
    }
  },

  cookieClose: function() {
    this.setCookie('liaigre_cookie', true);
    this.cookieBlock.classList.remove('open');
  }
};

export default Cookies;
