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

  setTimeout(function() {
    $('.fix-menu .title').trigger('click')
  }, 300)

  //侧目录初始化
  if (window.location.href.indexOf('/book?') != -1) {
    var qs = location.search.split('?')[1].split('=')[1].split('/'),
      length = qs.length;
    for (var key = 0; key < length; key++) {
      $('a[title="' + decodeURI(qs[key]) + '"]').addClass('active');
      $('a[title="' + decodeURI(qs[key]) + '"]').parent('li').addClass(
        'active');
    }
  } else {
    $('.sidebar-menu').find('.treeview').eq(0).addClass('active');
  }
  //滚动控件
  //console.log($(".fix-menu ul").height())
  if ($(".fix-menu ul").height() >= 500) {
    $(".fix-menu ul").slimScroll({
      height: '500px',
      alwaysVisible: true,
    });
  }

  //返回顶部
  var slideToTop = $("<div />");
  slideToTop.html('<i class="fa fa-chevron-up"></i>');
  slideToTop.css({
    'position': 'fixed',
    'bottom': '20px',
    'right': '25px',
    'width': '40px',
    'height': '40px',
    'color': '#eee',
    'font-size': '',
    'line-height': '40px',
    'text-align': 'center',
    'background-color': '#222d32',
    'cursor': 'pointer',
    'border-radius': '5px',
    'z-index': '99999',
    'opacity': '.7',
    'display': 'none'
  });
  slideToTop.on('mouseenter', function() {
    $(this).css('opacity', '1');
  });
  slideToTop.on('mouseout', function() {
    $(this).css('opacity', '.7');
  });
  $('.wrapper').append(slideToTop);
  $(window).scroll(function() {
    if ($(window).scrollTop() >= 150) {
      if (!$(slideToTop).is(':visible')) {
        $(slideToTop).fadeIn(500);
      }
    } else {
      $(slideToTop).fadeOut(500);
    }
  });
  $(slideToTop).click(function() {
    $("body").animate({
      scrollTop: 0
    }, 500);
  });

  //预设正则
  var reg ={
    "*":/[\w\W]+/, //不为空
    "*6-16":/^[\w\W]{6,16}$/, //6-16位任意字符
    "s6-18":/^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{6,18}$/, //不包含特殊字符的6-18位任意
    "e":/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/  //邮箱
  }
  //注册
  var registerFrom = {
    name : false,
    email: false,
    password:false,
    role:false
  }
  $('#register input[name=name]').blur(function(){
    if(!(reg['*'].test($(this).val()))){
      $(this).parent('.form-group').addClass('has-error');
      $(this).val('').attr('placeholder','用户名不可为空');
      registerFrom.name =false;
    }else{
      $(this).parent('.form-group').removeClass('has-error');
      $(this).attr('placeholder','姓名');
      registerFrom.name =$(this).val();
    }
  })
  $('#register input[name=email]').blur(function(){
    if(!(reg['e'].test($(this).val()))){
      $(this).parent('.form-group').addClass('has-error');
      $(this).val('').attr('placeholder','请输入正确的邮箱地址');
      registerFrom.email =false;
    }else{
      $(this).parent('.form-group').removeClass('has-error');
      $(this).attr('placeholder','邮箱');
      registerFrom.email =$(this).val();
    }
  })
  $('#register input[name=password]').blur(function(){
    if(!(reg['*6-16'].test($(this).val()))){
      $(this).parent('.form-group').addClass('has-error');
      $(this).val('').attr('placeholder','密码应当为6-18为任意字符');
    }else{
      $(this).parent('.form-group').removeClass('has-error');
      $(this).attr('placeholder','密码');
    }
  })
  $('#register input[name=repassword]').blur(function(){
    if($(this).val() != $('#register input[name=password]').val() || $(this).val() == ''){
      $(this).parent('.form-group').addClass('has-error');
      $(this).val('').attr('placeholder','两次密码输入不一致');
      registerFrom.password =false;
    }else{
      $(this).parent('.form-group').removeClass('has-error');
      $(this).attr('placeholder','再次输入密码');
      registerFrom.password = $(this).val();
    }
  })
  $('#register select[name=role]').blur(function(){
    //console.log($(this).val());
    if($(this).val() == -1 || $(this).val() == undefined || $(this).val() == null){
      $(this).parent('.form-group').addClass('has-error');
      registerFrom.role = false;
    }else{
      $(this).parent('.form-group').removeClass('has-error');
      registerFrom.role = $(this).val();
    }
  })
  $('#register button[name=submit]').click(function(){
    for(var key in registerFrom){
       if(registerFrom[key] == false){
         var html = '<div class="callout callout-danger"><p>请将信息填写完整</p></div>';
         $('#tip').append(html);
         setTimeout(function(){
           $('.callout').fadeOut(500,function(){
             $('.callout').remove();
           });
         },2000)
         return false;
       }
    }
    $.post('./register',registerFrom,function(data){
      if(data.status==0){
        var html = '<div class="callout callout-danger"><p>'+data.info+'</p></div>';
        $('#tip').append(html);
        setTimeout(function(){
          $('.callout').fadeOut(500,function(){
            $('.callout').remove();
          });
        },2000)
      }else{
        var html = '<div class="callout callout-success"><p>'+data.info+'</p></div>';
        $('#tip').append(html);
        setTimeout(function(){
          $('.callout').fadeOut(500,function(){
            $('.callout').remove();
            window.location.href = './login';
          });
        },2000)
      }
    })
  })
  //登陆
  var loginFrom = {
    email : false,
    password:false
  };
  $('#login input[name=email]').blur(function(){
    if(!(reg['e'].test($(this).val()))){
      $(this).parent('.form-group').addClass('has-error');
      $(this).val('').attr('placeholder','请输入正确的邮箱地址');
      loginFrom.email =false;
    }else{
      $(this).parent('.form-group').removeClass('has-error');
      $(this).attr('placeholder','邮箱');
      loginFrom.email =$(this).val();
    }
  })
  $('#login input[name=password]').blur(function(){
    if(!(reg['*6-16'].test($(this).val()))){
      $(this).parent('.form-group').addClass('has-error');
      $(this).val('').attr('placeholder','密码应当为6-18为任意字符');
      loginFrom.password = false;
    }else{
      $(this).parent('.form-group').removeClass('has-error');
      $(this).attr('placeholder','密码');
      loginFrom.password = $(this).val();
    }
  })
  $('#login button[name=submit]').click(function(){
    console.log(loginFrom);
    for(var key in loginFrom){
       if(loginFrom[key] == false){
         var html = '<div class="callout callout-danger"><p>请将信息填写完整</p></div>';
         $('#tip').append(html);
         setTimeout(function(){
           $('.callout').fadeOut(500,function(){
             $('.callout').remove();
           });
         },2000)
         return false;
       }
    }
    $.post('./login',loginFrom,function(data){
      if(data.status==0){
        var html = '<div class="callout callout-danger"><p>'+data.info+'</p></div>';
        $('#tip').append(html);
        setTimeout(function(){
          $('.callout').fadeOut(500,function(){
            $('.callout').remove();
          });
        },2000)
      }else{
        var html = '<div class="callout callout-success"><p>'+data.info+'</p></div>';
        $('#tip').append(html);
        setTimeout(function(){
          $('.callout').fadeOut(500,function(){
            $('.callout').remove();
            window.location.href = './../';
          });
        },2000)
      }
    })
  })
})
