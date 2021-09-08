/* 
    登录界面
*/
$(function () {
  let id = "",
    password = "";
  const $idErr = $("#idErr");
  const $pwdErr = $("#pwdErr");
  $("#user_id").change(function () {
    id = this.value;
  });
  $("#user_id").click(function () {
    $idErr.hide();
  });
  $("#user_pass").change(function () {
    password = this.value;
  });
  $("#user_pass").click(function () {
    $pwdErr.hide();
  });
  $("#submit").click(function () {
    if (checkEmpty()) {
      $.ajax({
        type: "post",
        url: "https://www.r-relight.com/questionnaire.Ques/getLogin",
        data: {
          user_name: id,
          user_pswd: password,
        },
        dataType: "json",
        crossDomain: true,
        success: function (res) {
          if (res.errno === 0) {
            // 若登录成功,则后端返回一个token,将token存入localStorage,方便后续请求使用
            const data = res.data;
            localStorage.setItem("token", data.token);
            localStorage.setItem("id", id);
            if (
              localStorage.getItem("ansHref") == 0 ||
              localStorage.getItem("ansHref") == null
            ) {
              $(location).attr("href", "../index_log.html");
            } else {
              const href = localStorage.getItem("ansHref");
              localStorage.setItem("ansHref", 0);
              $(location).attr("href", href);
            }
          } else if (res.errno === 2) {
            $idErr
              .text(function () {
                return res.errmsg;
              })
              .show();
          } else if (res.errno === 4) {
            $pwdErr
              .text(function () {
                return res.errmsg;
              })
              .show();
          } else if (res.errno === 5) {
            $.ajax({
              type: "post",
              url: "https://www.r-relight.com/questionnaire.Ques/sendEmail",
              data: {
                user_name: id,
              },
              dataType: "json",
              crossDomain: true,
              success: function (res) {
                if (res.errno !== 0) {
                  alert(res.errmsg);
                }
              },
              err: function (err) {
                console.log(err);
              },
            });
            alert("未激活邮箱，已重新发送验证邮件！");
          }
        },
        error: function (err) {
          console.log(err);
        },
      });
    }
  });
  // 检查用户名和密码是否输入为空
  function checkEmpty() {
    let jud = 1;
    if (id === "") {
      $idErr.text("输入内容为空").show();
      jud = 0;
    }
    if (password === "") {
      $pwdErr.text("输入内容为空").show();
      jud = 0;
    }
    return jud;
  }
});
