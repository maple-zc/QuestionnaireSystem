/* 
    答题界面
*/
$(function () {
  // 将问卷地址保存在localStorage中
  localStorage.setItem("ansHref", window.location.search);
  // 若用户已登录,则token值有效
  // 若无效则跳转到登录界面,重新登录
  checkToken();
  const id = getQueryString("quesre_id");
  const title = decodeURI(getQueryString("title"));
  const answerList = [];
  render();
  $("#username").text(localStorage.getItem("id"));
  $("#save").click(function () {
    collect();
    $.ajax({
      type: "post",
      url: "https://www.r-relight.com/questionnaire.Ques/uploadAns",
      data: {
        token: localStorage.getItem("token"),
        answers: answerList,
      },
      success: function (res) {
        if (res.errno === 0) {
          $("#save").css("background-color", "#eee");
          $("#save").attr("disabled", true);
          alert("问卷已提交！");
        } else {
          alert(res.errmsg);
        }
      },
      error: function (err) {
        console.log(err);
      },
    });
  });
  // 将问卷内容渲染到界面上
  function render() {
    $.ajax({
      type: "post",
      url: "https://www.r-relight.com/questionnaire.Ques/getQuesDetail",
      data: {
        quesre_id: id,
      },
      dataType: "json",
      crossDomain: true,
      success: function (res) {
        if (res.errno === 0) {
          console.log(res);
          const data = res.data;
          $("#btn").before(getTitle());
          for (let i = 0; i < data.length; i++) {
            const ques = data[i];
            switch (ques.qtype) {
              case 1:
                $("#btn").before(
                  getSingle(ques.question_text, ques.question_id, ques.qtype)
                );
                for (let j = 0; j < ques.options.length; j++) {
                  $("#preview .question")
                    .eq(i)
                    .find(".single-option")
                    .append(
                      getSingleOption(
                        ques.question_id,
                        ques.options[j].option_text,
                        ques.options[j].option_id
                      )
                    );
                }
                break;
              case 2:
                $("#btn").before(
                  getMultiple(ques.question_text, ques.question_id, ques.qtype)
                );
                for (let j = 0; j < ques.options.length; j++) {
                  $("#preview .question")
                    .eq(i)
                    .find(".multiple-option")
                    .append(
                      getMultipleOption(
                        ques.question_id,
                        ques.options[j].option_text,
                        ques.options[j].option_id
                      )
                    );
                }
                break;
              case 3:
                $("#btn").before(
                  getFilling(ques.question_text, ques.question_id, ques.qtype)
                );
                break;
              default:
                break;
            }
          }
        } else if (res.errno === 4) {
          alert("问卷已结束！");
        } else {
          alert(res.errmsg);
        }
      },
      error: function (err) {
        console.log(err);
      },
    });
  }
  // 渲染标题
  function getTitle() {
    return '<div class="pre-title">' + "<h2>" + title + "</h2>" + "</div>";
  }
  // 渲染单选题
  function getSingle(quesTitle, id, type) {
    return (
      '<div id="' +
      id +
      '" class="question" data-type="' +
      type +
      '">' +
      '<div class="head-title" contenteditable="false">' +
      quesTitle +
      "</div>" +
      '<div class="content">' +
      '<div class="single-option"></div>' +
      "</div>" +
      "</div>"
    );
  }
  // 渲染单选题选项
  function getSingleOption(text, option, id) {
    return (
      '<div id="' +
      id +
      '" class="option">' +
      '<input type="radio" name="' +
      text +
      '" value="' +
      option +
      '">' +
      '<p style="margin-left:5px" contenteditable="false">' +
      option +
      "</p>" +
      "</div>"
    );
  }
  // 渲染多选题
  function getMultiple(quesTitle, id, type) {
    return (
      '<div id="' +
      id +
      '" class="question" data-type="' +
      type +
      '">' +
      '<div class="head-title" contenteditable="false">' +
      quesTitle +
      "</div>" +
      '<div class="content">' +
      '<div class="multiple-option"></div>' +
      "</div>" +
      "</div>"
    );
  }
  // 渲染多选题选项
  function getMultipleOption(text, option, id) {
    return (
      '<div id="' +
      id +
      '" class="option">' +
      '<input type="checkbox" name="' +
      text +
      '" value="' +
      option +
      '">' +
      '<p style="margin-left:5px" contenteditable="false">' +
      option +
      "</p>" +
      "</div>"
    );
  }
  // 渲染问答题
  function getFilling(quesTitle, id, type) {
    return (
      '<div id="' +
      id +
      '" class="question" data-type="' +
      type +
      '">' +
      '<div class="head-title" contenteditable="false">' +
      quesTitle +
      "</div>" +
      '<div class="content">' +
      '<textarea name="filling" placeholder="输入答案..."></textarea>' +
      "</div>"
    );
  }
  // 获取url参数值
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }
  // 检查token是否有效
  function checkToken() {
    $.ajax({
      type: "post",
      url: "https://www.r-relight.com/questionnaire.Ques/verifyToken",
      data: {
        token: localStorage.getItem("token"),
      },
      dataType: "json",
      crossDomain: true,
      success: function (res) {
        if (res.errno === 0) {
          return true;
        } else {
          $(location).attr("href", "../login/login.html");
        }
      },
      error: function (err) {
        console.log(err);
      },
    });
  }
  // 保存用户回答内容
  function collect() {
    const len = $("#preview").find(".question").length;
    for (let i = 0; i < len; i++) {
      const answer = {};
      const $curQues = $("#preview .question").eq(i);
      answer.question_id = Number($curQues.attr("id"));
      const type = $curQues.data("type");
      answer.qtype = type;
      switch (type) {
        case 1:
          const id = $curQues.find("input:checked").parent().attr("id");
          answer.options = [];
          const option = {};
          option.option_id = Number(id);
          answer.options.push(option);
          answerList.push(answer);
          break;
        case 2:
          answer.options = [];
          $($curQues)
            .find("input:checked")
            .parent()
            .each(function () {
              const id = $(this).attr("id");
              const option = {};
              option.option_id = Number(id);
              answer.options.push(option);
            });
          answerList.push(answer);
          break;
        case 3:
          answer.answer_text = $curQues.find("textarea").val();
          answerList.push(answer);
          break;
        default:
          break;
      }
    }
  }
});
