/* 
    用户新建问卷
*/
$(function () {
  let quesTitle = "";
  let quesList = [];
  // 增加题目，题型：单选、多选、问答
  $("#username").text(localStorage.getItem("id"));
  $("#single-zc").click(function () {
    checkEmpty();
    $("#quesInfo ol").append(getSingle());
  });
  $("#multiple-zc").click(function () {
    checkEmpty();
    $("#quesInfo ol").append(getMultiple());
  });
  $("#filling-zc").click(function () {
    checkEmpty();
    $("#quesInfo ol").append(getFilling());
  });
  // 增加选项
  $("#quesInfo").on("click", ".single-block .optionAdd", function () {
    $(this).parent().parent().find(".single-option").append(getSingleOption());
  });
  $("#quesInfo").on("click", ".multiple-block .optionAdd", function () {
    $(this)
      .parent()
      .parent()
      .find(".multiple-option")
      .append(getMultipleOption());
  });
  // 删除选项
  $("#quesInfo").on("click", ".deleteBtn", function () {
    $(this).parent().remove();
  });
  // 删除题目
  $("#quesInfo").on("click", ".problemDel", function () {
    $(this).parent().parent().parent().parent().remove();
  });
  // 保存题目信息
  $("#save").click(function () {
    quesList = [];
    save();
    $(this).attr("disabled", "true");
    $(this).css("background-color", "#eee");
  });
  // 获取单选题模板
  function getSingle() {
    return (
      '<li tabindex="1"  class="single-block"' +
      '">' +
      '<form action="">' +
      '<div class="head-title">' +
      '<span contenteditable="true" style="outline:none">输入题目</span>' +
      "</div>" +
      '<div class="content">' +
      '<div class="add">' +
      '<span class="problemDel">删除题目</span>' +
      '<span class="optionAdd">增加选项</span>' +
      "</div>" +
      '<div class="single-option">' +
      ' <div class="option">' +
      '<button class="deleteBtn">-</button>' +
      '  <input type="radio" name="single-opt" value="option1">' +
      '  <p contenteditable="true" style="outline:none">输入选项</p>' +
      " </div>" +
      ' <div class="option">' +
      '<button class="deleteBtn">-</button>' +
      '   <input type="radio" name="single-opt" value="option2">' +
      '   <p contenteditable="true" style="outline:none">输入选项</p>' +
      " </div>" +
      " </div>" +
      " </div>" +
      " </form>" +
      "</li>"
    );
  }
  // 获取多选题模板
  function getMultiple() {
    return (
      '<li tabindex="1" class="multiple-block"' +
      '">' +
      '<form action="">' +
      '<div class="head-title">' +
      '<span contenteditable="true" style="outline:none">输入题目</span>' +
      "</div>" +
      '<div class="content">' +
      '<div class="add">' +
      '<span class="problemDel">删除题目</span>' +
      '<span class="optionAdd">增加选项</span>' +
      "</div>" +
      '<div class="multiple-option">' +
      '<div class="option">' +
      '<button class="deleteBtn">-</button>' +
      '<input type="checkbox" name="multi-opt" value="option1">' +
      '<p contenteditable="true" style="outline:none">输入选项</p>' +
      "</div>" +
      '<div class="option">' +
      '<button class="deleteBtn">-</button>' +
      '<input type="checkbox" name="multi-opt" value="option2">' +
      '<p contenteditable="true" style="outline:none">输入选项</p>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<p style="margin-left: 30px;margin-bottom: 10px;margin-top: -10px;">（该题可以选择多个选项）</p>' +
      "</form>" +
      "</li>"
    );
  }
  // 获取问答题模板
  function getFilling() {
    return (
      '<li tabindex="1" class="filling-block"' +
      '">' +
      '<form action="">' +
      '<div class="head-title">' +
      '<span contenteditable="true" style="outline:none">输入题目</span>' +
      "</div>" +
      '<div class="content">' +
      '<div class="add">' +
      '<span class="problemDel">删除题目</span>' +
      "</div>" +
      '<textarea name="filling" placeholder="输入答案..."></textarea>' +
      "</div>" +
      "</form>" +
      "</li>"
    );
  }
  // 增加单选题选项
  function getSingleOption() {
    return (
      ' <div class="option">' +
      '<button class="deleteBtn">-</button>' +
      '  <input type="radio" name="single-opt" value="option1">' +
      '  <p contenteditable="true" style="outline:none">输入选项</p>' +
      " </div>"
    );
  }
  // 增加多选题选项
  function getMultipleOption() {
    return (
      '<div class="option">' +
      '<button class="deleteBtn">-</button>' +
      '<input type="checkbox" name="multi-opt" value="option2">' +
      '<p contenteditable="true" style="outline:none">输入选项</p>' +
      "</div>"
    );
  }
  // 检查问卷内容是否为空
  function checkEmpty() {
    if ($("#quesInfo ol").html() === "") {
      $("#hint").show();
    } else {
      $("#hint").hide();
    }
  }
  // 将问卷信息保存到服务器
  function save() {
    quesList = [];
    quesTitle = $("#quesInfo .ques-title input").val();
    $("#quesInfo ol li").each(function (index, value) {
      const type = $(value).attr("class");
      if (type === "single-block") {
        let ques = {};
        ques.qtype = 1;
        ques.question_text = $(value).find(".head-title span").text();
        ques.options = [];
        $(value)
          .find(".option")
          .each(function (index, value) {
            let option = {};
            option["option_text"] = $(value).find("p").text();
            ques.options.push(option);
          });
        quesList.push(ques);
      } else if (type === "multiple-block") {
        let ques = {};
        ques.qtype = 2;
        ques.question_text = $(value).find(".head-title span").text();
        ques.options = [];
        $(value)
          .find(".option")
          .each(function (index, value) {
            let option = {};
            option["option_text"] = $(value).find("p").text();
            ques.options.push(option);
          });
        quesList.push(ques);
      } else if (type === "filling-block") {
        let ques = {};
        ques.qtype = 3;
        ques.question_text = $(value).find(".head-title span").text();
        quesList.push(ques);
      }
      console.log(quesList);
    });

    $.ajax({
      type: "post",
      url: "https://www.r-relight.com/questionnaire.Ques/makeQues",
      data: {
        token: localStorage.getItem("token"),
        quesre_name: quesTitle,
        question: quesList,
      },
      dataType: "json",
      crossDomain: true,
      success: function (res) {
        alert("问卷创建成功！");
      },
      error: function (err) {
        console.log(err);
      },
    });
  }
});
