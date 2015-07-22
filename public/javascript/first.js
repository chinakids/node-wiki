$(function(){
  //预设正则
  var reg ={
    "*":/[\w\W]+/, //不为空
    "*6-16":/^[\w\W]{6,16}$/, //6-16位任意字符
    "s":/^[\u4E00-\u9FA5\uf900-\ufa2d\u002f\w\.\s]{1,}$/, //不包含特殊字符包含'/'
    "s6-18":/^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{6,18}$/, //不包含特殊字符的6-18位任意
    "e":/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/  //邮箱
  }

  //设置数据库(偷个懒不验证了,部署的人都要使坏我也没办法....)
  $('#addDb button[name=submit]').click(function(){
    var dbFrom = {
      dbPort : $('#addDb input[name=dbPort]').val(),
      dbIp: $('#addDb input[name=dbIp]').val(),
      dbName:$('#addDb input[name=dbName]').val(),
      dbUsername:$('#addDb input[name=dbUsername]').val(),
      dbPassword:$('#addDb input[name=dbPassword]').val()
    }
    var status = true;
    if(status){
      $.post('./addDb',dbFrom,function(data){
        if(!(data.status==1)){
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
              window.location.href = data.url;
            });
          },2000)
        }
      })
    }
  })

  //管理员注册
  var registerFromTwo = {
    name : false,
    email: false,
    password:false
  }
  $('#register input[name=name]').blur(function(){
    if(!(reg['*'].test($(this).val()))){
      $(this).parent('.form-group').addClass('has-error');
      $(this).val('').attr('placeholder','用户名不可为空');
      registerFromTwo.name =false;
    }else{
      $(this).parent('.form-group').removeClass('has-error');
      $(this).attr('placeholder','姓名');
      registerFromTwo.name =$(this).val();
    }
  })
  $('#register input[name=email]').blur(function(){
    if(!(reg['e'].test($(this).val()))){
      $(this).parent('.form-group').addClass('has-error');
      $(this).val('').attr('placeholder','请输入正确的邮箱地址');
      registerFromTwo.email =false;
    }else{
      $(this).parent('.form-group').removeClass('has-error');
      $(this).attr('placeholder','邮箱');
      registerFromTwo.email =$(this).val();
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
      registerFromTwo.password =false;
    }else{
      $(this).parent('.form-group').removeClass('has-error');
      $(this).attr('placeholder','再次输入密码');
      registerFromTwo.password = $(this).val();
    }
  })
  $('#register button[name=submit]').click(function(){
    for(var key in registerFromTwo){
       if(registerFromTwo[key] === false){
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
    var status = true;
    if(status){
      $.post('./addAdmin',registerFromTwo,function(data){
        if(!(data.status==1)){
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
              window.location.href =  data.url;
            });
          },2000)
        }
      })
    }
  })
})