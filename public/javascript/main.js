$(function() {
  //初始化高亮
  var modelist = ace.require('ace/ext/modelist').modesByName;
  var highlight = ace.require('ace/ext/static_highlight');
  $('pre > code').each(function() { // code highlight
    var code = $(this);
    var language = (code.attr('class') || 'lang-javascript').substring(
      5).toLowerCase();
    if (modelist[language] == undefined) {
      language = 'javascript';
    }
    highlight(code[0], {
        mode: 'ace/mode/' + language,
        theme: 'ace/theme/github',
        startLineNumber: 1,
        showGutter: false,
        trim: true,
      },
      function(highlighted) {}
    );
  });
  //图例支持初始化
  mermaid.ganttConfig = { // Configuration for Gantt diagrams
    numberSectionStyles: 4,
    axisFormatter: [
      ["%I:%M", function(d) { // Within a day
        return d.getHours();
      }],
      ["w. %U", function(d) { // Monday a week
        return d.getDay() == 1;
      }],
      ["%a %d", function(d) { // Day within a week (not monday)
        return d.getDay() && d.getDate() != 1;
      }],
      ["%b %d", function(d) { // within a month
        return d.getDate() != 1;
      }],
      ["%m-%y", function(d) { // Month
        return d.getMonth();
      }]
    ]
  };
  mermaid.init();

  //菜单滚动
  var boxtop = $('.fix-menu').css('top'),
    time;

  function setMenu() {
    var top = $(window).scrollTop();
    $('.fix-menu').animate({
      'top': parseInt(boxtop) + parseInt(top) - 100
    }, 300)
  }
  setMenu();
  $(window).scroll(function() {
      clearTimeout(time);
      time = setTimeout(function() {
        setMenu();
      }, 300)
    })
    //目录滚动
  $('a[name=menu]').click(function() {
    var point = $(this).attr('data-href'),
      top = $(point).offset().top;
    $("body,html").animate({
      scrollTop: parseInt(top) - 20
    }, 300, function() {
      //console.log(1);
      setMenu();
    });
  });
  //目录展开
  $('.fix-menu .title').click(function() {
      $(this).next().slideToggle(300);
    })
    //侧目录初始化
  if (window.location.href.indexOf('/doc?') != -1) {
    var qs = location.search.split('?')[1].split('=')[1].split('/'),
      length = qs.length;
    for (var key = 0; key < length; key++) {
      $('a[title=' + decodeURI(qs[key]) + ']').parent('li').addClass(
        'active');
    }
  } else {
    $('.sidebar-menu').find('.treeview').eq(0).addClass('active');
  }

})
