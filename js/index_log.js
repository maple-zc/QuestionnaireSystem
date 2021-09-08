$(document).ready(function () {
  // 渲染问卷列表
  render();
  $("#username").text(localStorage.getItem("id"));
  if (typeof $("#wrapper content ul").html() === "undefined") {
    $("#content .hint").show();
  }
  // 删除问卷
  $("#content").on("click", ".delete", function () {
    const $that = $(this);
    const index = $(this).parent().data("id");
    $.ajax({
      type: "post",
      url: "https://www.r-relight.com/questionnaire.Ques/delQues",
      data: {
        token: localStorage.getItem("token"),
        quesre_id: index,
      },
      success: function (res) {
        $that.parent().parent().remove();
      },
      error: function (err) {
        console.log(err);
      },
    });
  });
  // 发布问卷
  $("#content").on("click", ".publish", function () {
    if ($(this).siblings(".nopublish").css("display") === "block") {
      const index = $(this).parent().data("id");
      $.ajax({
        type: "post",
        url: "https://www.r-relight.com/questionnaire.Ques/publishQues",
        data: {
          token: localStorage.getItem("token"),
          quesre_id: index,
          quesre_state: 1,
        },
        success: function (res) {
          console.log("published:", res);
          alert("发布成功！");
        },
        error: function (err) {
          console.log(err);
        },
      });
      $(this).siblings(".nopublish").hide();
      $(this).siblings(".published").show();
    } else if ($(this).siblings(".published").css("display") === "block") {
      alert("请不要重复发布！");
    } else if ($(this).siblings(".completed").css("display") === "block") {
      alert("问卷已结束！");
    }
  });
  // 结束发布
  $("#content").on("click", ".stop", function () {
    if ($(this).siblings(".published").css("display") === "block") {
      let index = $(this).parent().data("id");
      $.ajax({
        type: "post",
        url: "https://www.r-relight.com/questionnaire.Ques/publishQues",
        data: {
          token: localStorage.getItem("token"),
          quesre_id: index,
          quesre_state: 2,
        },
        success: function (res) {
          console.log("completed:", res);
          alert("问卷发布已结束！");
        },
        error: function (err) {
          console.log(err);
        },
      });
      $(this).siblings(".published").hide();
      $(this).siblings(".completed").show();
    } else if ($(this).siblings(".nopublish").css("display") === "block") {
      alert("问卷未发布！");
    } else if ($(this).siblings(".completed").css("display") === "block") {
      alert("请不要重复结束！");
    }
  });
  // 点击按钮生成链接
  let linkIndex;
  let title;
  $("#content").on("click", ".link", function () {
    linkIndex = $(this).parent().siblings("p").data("id");
    title = $(this).siblings("a").text();
    var res = /^[\u4e00-\u9fa5]+$/;
    // if (!res.test(quesTitle)) {
    title = encodeURI(encodeURI(title));
    // }
  });
  var clipboard = new Clipboard("#content .link", {
    text: function () {
      return (
        "https://www.r-relight.com/QuestionnaireSystem/answer/answer.html?quesre_id=" +
        // "file:///F:/code/.vscode/finalQS/answer/answer.html?quesre_id=" +
        linkIndex +
        "&title=" +
        title
      );
    },
  });
  clipboard.on("success", function (e) {
    alert("复制成功");
  });

  clipboard.on("error", function (e) {
    console.log(e);
  });
  function render() {
    $.ajax({
      type: "post",
      url: "https://www.r-relight.com/questionnaire.Ques/getQues",
      data: {
        token: localStorage.getItem("token"),
      },
      dataType: "json",
      crossDomain: true,
      success: function (res) {
        if (res.errno === 0) {
          const quesList = res.data;
          for (let i = quesList.length - 1; i >= 0; i--) {
            $("#content .hint").hide();
            $("#wrapper #content ul").append(
              getQues(quesList[i].quesre_name, quesList[i].quesre_id)
            );
            switch (quesList[i].quesre_state) {
              case 0:
                $("#wrapper #content ul li")
                  .eq(quesList.length - 1 - i)
                  .find(".nopublish")
                  .show();
                break;
              case 1:
                $("#wrapper #content ul li")
                  .eq(quesList.length - 1 - i)
                  .find(".published")
                  .show();
                break;
              case 2:
                $("#wrapper #content ul li")
                  .eq(quesList.length - 1 - i)
                  .find(".completed")
                  .show();
                break;
              default:
                break;
            }
          }
        }
      },
      error: function (err) {
        console.log(err);
      },
    });
  }
  function getQues(title, id) {
    const titleURL = encodeURI(encodeURI(title));
    const href =
      "https://www.r-relight.com/QuestionnaireSystem/answer/answer.html?quesre_id=" +
      // "file:///F:/code/.vscode/finalQS/answer/answer.html?quesre_id=" +
      id +
      "&title=" +
      titleURL;
    const analysisHref =
      "https://www.r-relight.com/QuestionnaireSystem/analysis/analysis.html?quesre_id=" +
      // "file:///F:/code/.vscode/finalQS/analysis/analysis.html?quesre_id=" +
      id;
    return (
      "<li>" +
      '<div class="upper">' +
      '<a href="' +
      href +
      '" class="name" title="问卷3 name">' +
      title +
      "</a>" +
      '<button class="link">点击生成链接</button>' +
      "</div>" +
      '<p data-id="' +
      id +
      '">' +
      '<span class="delete">-删除</span>' +
      '<span class="publish">+发布</span>' +
      '<span class="stop">结束发布</span>' +
      '<span class="nopublish" style="display: none;">未发布</span>' +
      '<span class="published publishedColor" style="display: none;">已发布</span>' +
      '<span class="completed" style="color: dodgerblue;display: none;">已完成 </span>' +
      '<a href="' +
      analysisHref +
      '"><span class="analysis">统计结果</span></a>' +
      "</p>" +
      "</li>"
    );
  }
  // 取url参数
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }
});
