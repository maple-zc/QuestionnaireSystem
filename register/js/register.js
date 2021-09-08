/* 
    用户注册账号
*/
$(function () {
  let id, password, confirm, email;
  $("#email-addr").change(function () {
    email = this.value;
    checkEmail(email);
  });
  $("#user_id").change(function () {
    id = this.value;
    checkUsername(id);
  });
  $("#user_pass").change(function () {
    password = this.value;
    checkPwd(password);
  });
  $("#confirm").change(function () {
    confirm = this.value;
    checkConfirm(password, confirm);
  });
  $("#submit").click(function () {
    if (
      checkUsername(id) &&
      checkEmail(email) &&
      checkPwd(password) &&
      checkConfirm(password, confirm)
    ) {
      // 调用后端注册接口
      $.ajax({
        type: "post",
        url: "https://www.r-relight.com/questionnaire.Ques/getRegister",
        data: {
          user_name: id,
          user_pswd: password,
          user_email: email,
        },
        dataType: "json",
        crossDomain: true,
        success: function (res) {
          if (res.errno === 0) {
            $(location).attr("href", "../login/login.html");
          } else if (res.errno === 2) {
            $("#idErr").text("用户名已存在").css("color", "red").show();
            $("#user_id").css("borderColor", "red");
          } else if (res.errno === 4) {
            $("#emailErr").text("邮箱已使用").css("color", "red").show();
            $("#email-addr").css("borderColor", "red");
          }
        },
        error: function (err) {
          console.log(err);
        },
      });
    }
  });
  // 检查用户名格式是否正确
  function checkUsername(id) {
    const username = id;
    const $border = $("#user_id");
    const $err = $("#idErr");
    const usereg = /^[a-zA-Z]\w{6,}$/g;
    if (usereg.test(username)) {
      $err.text("格式正确").css("color", "rgb(0, 192, 0)").show();
      $border.css("borderColor", "rgb(0, 192, 0)");
      return true;
    } else {
      $err
        .text("用户名长度不能少于6个字符，且为英文字母开头")
        .css("color", "red")
        .show();
      $border.css("borderColor", "red");
      return false;
    }
  }
  // 检查邮箱格式是否正确
  function checkEmail(email) {
    const useremail = email;
    const $border = $("#email-addr");
    const $err = $("#emailErr");
    const usereg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (usereg.test(useremail)) {
      $err.text("格式正确").css("color", "rgb(0, 192, 0)").show();
      $border.css("borderColor", "rgb(0, 192, 0)");
      return true;
    } else {
      $err.text("邮箱格式不正确").css("color", "red").show();
      $border.css("borderColor", "red");
      return false;
    }
  }
  // 检查密码格式是否正确
  function checkPwd(pwd) {
    const userpwd = pwd;
    const $border = $("#user_pass");
    const $err = $("#pwdErr");
    const usereg = /^[0-9A-Za-z]{6,}$/g;
    if (usereg.test(userpwd)) {
      $err.text("格式正确").css("color", "rgb(0, 192, 0)").show();
      $border.css("borderColor", "rgb(0, 192, 0)");
      return true;
    } else {
      $err.text("密码必须为数字和字母且6位以上").css("color", "red").show();
      $border.css("borderColor", "red");
      return false;
    }
  }
  // 检查两次密码输入是否一致
  function checkConfirm(password, confirm) {
    const $border = $("#confirm");
    const $err = $("#confirmErr");
    if (password === confirm) {
      $err.text("两次密码一致").css("color", "rgb(0, 192, 0)").show();
      $border.css("borderColor", "rgb(0, 192, 0)");
      return true;
    } else {
      $err.text("两次密码不一致").css("color", "red").show();
      $border.css("borderColor", "red");
      return false;
    }
  }
});
