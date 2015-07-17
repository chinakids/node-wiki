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
    "s":/^[\u4E00-\u9FA5\uf900-\ufa2d\u002f\w\.\s]{1,}$/, //不包含特殊字符包含'/'
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
  });
  $('.jq-edit').click(function(){
    var md = $(this).attr('data-md');
    dialog({
      url: '/edit/index.html?md='+md,
      width: parseInt($(window).width() * 0.95),
      height: parseInt($(window).height() * 0.9),
      zIndex: 100000,
      fixed: true,
      onremove: function () {
        window.location.reload();
      }
    })
    .showModal();
  })
  var treeArr = [];
  function getTreeArr(obj){
    for(var key in obj){
      treeArr.push(obj[key].path.split('/doc')[1]);
      console.log(obj[key].subNodes.length);
      if(obj[key].subNodes.length>0){
        getTreeArr(obj[key].subNodes);
      }
    }
  }
  getTreeArr(tree);//tree 在 common.jade 中初始化了
  var option = '';
  for(var key in treeArr){
    option += '<option value="'+treeArr[key]+'/">'+treeArr[key]+'/</option>';
  }
  var addHtml = '<div class="add-box">'
              +   '<h3><i class="fa fa-plus-square-o"></i>创建新文档<a href="javascript:;" class="btn-close"><i class="ar ar-cancel"></i></a></h3>'
              +   '<div class="form-group">'
              +       '<label>选择目录</label>'
              +       '<select class="form-control" id="choose-path"><option>/</option>'
              +       option
              +       '</select>'
              +     '</div>'
              +   '<div class="form-group">'
              +   '<label>输入文件目录以及文件名（例：`wiki规范/使用说明`或者`wiki使用守则`）</label>'
              +   '<div class="input-group">'
              +     '<span class="input-group-addon" id="init-path">/</span>'
              +     '<input id="in-path" type="text" class="form-control" placeholder="请输入文件名（可带目录）">'
              +     '<span class="input-group-addon">.md</span>'
              +   '</div>'
              +   '<p class="text-yellow" id="out-path">最终输出目录为：<b>/wiki规范/使用说明.md</b></p>'
              +   '</div>'
              +   '<div id="tip"></div>'
              +   '<p class="foot"><a href="javascript:;" class="btn btn-primary btn-ok">确定</a><a href="javascript:;" class="btn btn-default btn-close">取消</a></p>'
              + '</div>',
      addBox;
  $('.jq-add').click(function(){
    addBox = dialog({
      content:addHtml,
      width: 600,
      height: 'auto',
      zIndex: 100000,
      fixed: true,
      onremove: function () {
        //window.location.reload();
      }
    });
    addBox.showModal();
  })
  $(document).on('click','.add-box .btn-close',function(){
    addBox.close();
  })
  function outPath(){
    var out = $('#choose-path').val()  + $('#in-path').val() + '.md';
    $('#out-path b').text(out);
  }
  $(document).on('change','#choose-path',function() {
    var _this = $(this);
    $('#init-path').text(_this.val());
    outPath();
  });
  $(document).on('keyup','#in-path',function(){
    outPath();
  })
  $(document).on('blur','#in-path',function(){
    if(!(reg['s'].test($(this).val()))){
      $(this).parent().parent('.form-group').addClass('has-error');
      $(this).val('').attr('placeholder','不允许为空或者包含特殊字符');
    }else{
      $(this).parent().parent('.form-group').removeClass('has-error');
      $(this).attr('placeholder','请输入文件名（可带目录）');
    }
  })
  $(document).on('click','.add-box .btn-ok',function(){
    var out = $('#choose-path').val()  + $('#in-path').val();
    var obj = {
      file : out,
      newMenu:$('#in-path').val().indexOf('/')
    }
    if(!(reg['s'].test($('#in-path').val()))){
      $('#in-path').parent().parent('.form-group').addClass('has-error');
      $('#in-path').val('').attr('placeholder','不允许为空或者包含特殊字符');
      return false;
    }
    if(out.split('/').length>4){
      $('#in-path').parent().parent('.form-group').addClass('has-error');
      $('#in-path').val('').attr('placeholder','目录深度不能超过2级');
      return false;
    }
    if(out.split('/').length<=2){
      $('#in-path').parent().parent('.form-group').addClass('has-error');
      $('#in-path').val('').attr('placeholder','根目录只能创建文件夹');
      return false;
    }
    $.post('/api/addFile',obj,function(data){
      console.log(data);
      if(data.status==1){
        var html = '<div class="callout callout-success"><p>'+data.info+'</p></div>';
        $('#tip').append(html);
        setTimeout(function(){
          $('.callout').fadeOut(500,function(){
            $('.callout').remove();
            window.location.href = data.url;
          });
        },2000)
      }else{
        var html = '<div class="callout callout-danger"><p>'+data.info+'</p></div>';
        $('#tip').append(html);
        setTimeout(function(){
          $('.callout').fadeOut(500,function(){
            $('.callout').remove();
          });
        },2000)
      }
    })
  })
})
