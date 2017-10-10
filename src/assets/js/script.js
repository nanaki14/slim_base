const $ = require("jquery");
const easing = require("jquery.easing");
//common
const point = require("./_point");
const ua = require("./_ua");


let Common = function(){};

$(() => {

    if( _ua.Mobile || _ua.Tablet ){}

    Common.smoothScroll();

  });

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
