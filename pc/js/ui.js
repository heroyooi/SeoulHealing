var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
var runToast = false;

$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results == null){
    return null;
  }
  else {
    return decodeURI(results[1]) || 0;
  }
}

var GUI = window.GUI || (function(){
  return {
    init: function(){
      GUI.baseUI($(document));

      AOS.init({ // https://github.com/michalsnik/aos#1-initialize-aos
        duration: 600,
        once: true,
      });
      
      if ($('#gnb').length) {
        GUI.gnbMenu();
      }
    },
    baseUI: function($this){
      var _ = $this;
      var $win = $(window);
      var $header = _.find('#header');
      var tabUI = _.find('.tab-base');
      var popupUI = _.find('.popup-wrap');
      var csPopupUI = _.find('.cs-popup-wrap');

      if (tabUI.length) {
        tabUI.each(function(){
          var target = $(this).find('li.on').find('a').attr('href');
          $(target).show();
        })
        tabUI.find('a').on('click', function(e){
          e.preventDefault();
          var target = $(this).attr('href');
          $(this).closest('li').addClass('on');
          $(this).closest('li').siblings().removeClass('on');
          $(target).show();
          $(target).siblings().hide();
        });
      }

      if (popupUI.length) {
        var posY = null;
        var magnificPopupConfiguration = function() {
          return {
            beforeOpen: function() {
              posY = window.pageYOffset;
              $('html').css('overflow', 'hidden');
              $('body').css({'position': 'fixed', 'top': -posY});
            },
            resize: function() {
              if ($('.fix-bottom').length) {
                var $coWrap = $('.fix-bottom .popup-wrap .con-wrap');
                if ($coWrap.hasClass('ws')) {
                  $coWrap.children('div').css('max-height', $win.height() - 202 + 'px');
                }
                if ($coWrap.outerHeight() > $win.height() / 3 * 2.3) {
                  $coWrap.addClass('ws');
                  $coWrap.children('div').css('max-height', $win.height() - 202 + 'px');
                }
              }
            },
            open: function() {},
            beforeClose: function() {
              $('html').css('overflow', '');
              $('body').css({'position': '', 'top': ''});
              window.scrollTo(0, posY);
            }
          }
        }
  
        //팝업 (공통) - jquery magnific 팝업
        _.find('.btn-base.disabled, .all-view.disabled, .add-mylist.disabled').on('click', function (e) { // 비활성화 버튼
          e.preventDefault();
        });
        _.find('.btn-popup-modal a').magnificPopup({
          type: 'inline',
          preloader: false,
          modal: false
        });
        $(document).on('click', '.b-mfp-close', function (e) {
          e.preventDefault();
          $.magnificPopup.close();
        });
        
        _.find('.btn-popup-anim-1:not(.disabled) a, a.btn-popup-anim-1:not(.disabled)').magnificPopup({
          type: 'inline',
          fixedContentPos: true,
          fixedBgPos: true,
          overflowY: 'auto',
          closeBtnInside: true,
          preloader: false,
          midClick: true,
          removalDelay: 300,
          mainClass: 'mfp-zin'
        });
        _.find('.btn-popup-anim-2:not(.disabled) a').magnificPopup({
          type: 'inline',
          fixedContentPos: false,
          fixedBgPos: true,
          overflowY: 'auto',
          closeBtnInside: true,
          preloader: false,
          midClick: true,
          removalDelay: 300,
          mainClass: 'mfp-slide-b'
        });
        _.find('.btn-popup-anim-3:not(.disabled) a, a.btn-popup-anim-3:not(.disabled)').magnificPopup({
          type: 'inline',
          fixedContentPos: true,
          fixedBgPos: true,
          overflowY: 'auto',
          closeBtnInside: true,
          preloader: false,
          midClick: true,
          removalDelay: 300,
          mainClass: 'fade-slideup fix-bottom',
          callbacks: magnificPopupConfiguration()
        });

		$('.popup-wrap').each(function(){
          if ($(this).data('width')) {
            $(this).css('width', $(this).data('width'));
          }
        });
      }

      if (csPopupUI.length) {
        csPopupUI.find('.mfp-close').on('click', function(){
          var target = $(this).closest('.cs-fullpage').attr('id');
          closeCSPopup();
          if (target === 'popup-find-address') $('.mfp-wrap').show(); // 2중 풀페이지 팝업 시
        });
        $('.cs-popup-dimm').on('click', function(){
          var target = $(this).next('.cs-popup-wrap').attr('id');
          if (target === 'popup-find-address') $('.mfp-wrap').show(); // 2중 풀페이지 팝업 시
          closeCSPopup();
        });

        resizeScrollFrame($win);
        
        $win.on('resize', function(){
          resizeScrollFrame($win);
        });
      }
    },
    gnbMenu: function(){
      var menu=1;
      var sub=1;
      
      function hide(){
        if(menu && sub){
          $("#gnb > li.on a").next().slideUp("fast");
          $("#gnb > li.on").removeClass("on");
        }
      }

      var dp1 = $('#gnb').data('dp1');
      var dp2 = $('#gnb').data('dp2');

      if (dp1) {
        $("#gnb > li").eq(dp1 - 1).addClass('active');
        if (dp2) {
          $("#gnb > li").eq(dp1 - 1).find('.submenu').find('li').eq(+dp2 - 1).addClass('active');
        }
      }

      $("#gnb > li > a").on("mouseenter",function(){
        $("#gnb > li.on a").next().slideUp("fast");
        $("#gnb > li.on").removeClass("on");

        $(this).closest('li').addClass("on");
        $(this).next().stop().slideDown("fast");
      })

      $("#gnb").mouseenter(function(){
        menu=0;
      });
      $("#gnb ul").mouseenter(function(){
        sub=0;
      });
      
      $("#gnb").mouseleave(function(){
        menu=1;
        setTimeout(hide, 500);
      });
      $("#gnb ul").mouseleave(function(){
        sub=1;
        setTimeout(hide, 500);
      });
    },
  }
}());

$(function(){
  GUI.init();
});