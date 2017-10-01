const $ = require("jquery");
const easing = require("jquery.easing");

window.onunload = function(){};

const g = {
  isSp:function(){ return ( g.winW() <= g.point )? true : false ; },// SP or PC
  winW:function(){ return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; },
  winH:function(){ return $( window ).height(); },
  winT:function(){ return $( window ).scrollTop(); },
  point: 768
}

const _ua = ((u) => {
  return {
    Tablet:(u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1)
      || u.indexOf("ipad") != -1
      || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
      || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
      || u.indexOf("kindle") != -1
      || u.indexOf("silk") != -1
      || u.indexOf("playbook") != -1,
    Mobile:(u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
      || u.indexOf("iphone") != -1
      || u.indexOf("ipod") != -1
      || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
      || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
      || u.indexOf("blackberry") != -1
  }
})(window.navigator.userAgent.toLowerCase());

let Common = function(){};

Common = {

  //スムーススクロール
  smoothScroll : () => {

    $('a[href^="#"]').click(() => {
      $('html,body').animate({ scrollTop:
      $($(this).attr('href')).offset().top }, '600','easeInCubic');
      return false;
    });

  }

}

$(() => {

  if( _ua.Mobile || _ua.Tablet ){}

  Common.smoothScroll();

});
