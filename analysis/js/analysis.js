/* 
    问卷结果分析界面
*/
$(function () {
  const quesId = Number(getQueryString("quesre_id"));
  $("#username").text(localStorage.getItem("id"));

  // post请求,通过form表单将下载请求发送给后端
  const downloadURL =
    "https://www.r-relight.com/questionnaire.Ques/downloadAns";
  const form = $("<form>");
  form.attr("style", "display: none");
  form.attr("target", "");
  form.attr("method", "post");
  form.attr("action", downloadURL);
  const input1 = $("<input>");
  input1.attr("type", "hidden");
  input1.attr("name", "token");
  input1.attr("value", localStorage.getItem("token"));
  form.append(input1);
  const input2 = $("<input>");
  input2.attr("type", "hidden");
  input2.attr("name", "quesre_id");
  input2.attr("value", quesId);
  form.append(input2);

  $("body").append(form);
  $("#download").click(function () {
    form.submit();
  });
  render();
  // 柱状图和饼状图转换
  $("#results").on("click", ".pie", function () {
    $(this).parent().parent().find(".barChart").hide();
    $(this).parent().parent().find(".pieChart").show();
  });
  $("#results").on("click", ".bar", function () {
    $(this).parent().parent().find(".pieChart").hide();
    $(this).parent().parent().find(".barChart").show();
  });
  function render() {
    $.ajax({
      type: "post",
      url: "https://www.r-relight.com/questionnaire.Ques/getAns",
      data: {
        token: localStorage.getItem("token"),
        quesre_id: quesId,
      },
      dataType: "json",
      crossDomain: true,
      success: function (res) {
        if (res.errno === 0) {
          console.log(res);
          const data = res.data;
          const len = data.length;
          for (let i = 0; i < len; i++) {
            const ques = data[i];
            switch (ques.qtype) {
              case 1:
                let optionsSingle = [];
                let optionNumSingle = [];
                $("#results").append(
                  getOptionTitle(ques.question_text, ques.option_sum)
                );
                const curQuesSingle = $("#results .question").eq(i);
                for (let j = 0; j < ques.answers.length; j++) {
                  const answer = ques.answers[j];
                  curQuesSingle
                    .find(".peoplenum")
                    .before(
                      getOption(
                        answer.option_text,
                        answer.option_sum,
                        answer.option_ratio
                      )
                    );
                  optionsSingle.push(answer.option_text);
                  optionNumSingle.push(answer.option_sum);
                }
                getPie(
                  curQuesSingle.find(".pieChart").eq(0).get(0),
                  optionsSingle,
                  optionNumSingle
                );
                getBar(
                  curQuesSingle.find(".barChart").eq(0).get(0),
                  optionsSingle,
                  optionNumSingle
                );
                break;
              case 2:
                let optionsMul = [];
                let optionNumMul = [];
                $("#results").append(
                  getOptionTitle(ques.question_text, ques.option_sum)
                );
                const curQuesMul = $("#results .question").eq(i);
                for (let j = 0; j < ques.answers.length; j++) {
                  const answer = ques.answers[j];
                  curQuesMul
                    .find(".peoplenum")
                    .before(
                      getOption(
                        answer.option_text,
                        answer.option_sum,
                        answer.option_ratio
                      )
                    );
                  optionsMul.push(answer.option_text);
                  optionNumMul.push(answer.option_sum);
                }
                getPie(
                  curQuesMul.find(".pieChart").eq(0).get(0),
                  optionsMul,
                  optionNumMul
                );
                getBar(
                  curQuesMul.find(".barChart").eq(0).get(0),
                  optionsMul,
                  optionNumMul
                );
                break;
              case 3:
                $("#results").append(
                  getFilling(ques.question_text, ques.answers.length)
                );
                for (let j = 0; j < ques.answers.length; j++) {
                  const answer = ques.answers[j];
                  const curQues = $("#results .question").eq(i);
                  curQues
                    .find(".text-list")
                    .append(getText(answer.answer_text, j + 1));
                }
                break;
              default:
                break;
            }
          }
        } else {
          alert(res.errmsg);
        }
      },
      errno: function (err) {
        console.log(err);
      },
    });
  }
  // 获取题目框架(单选/多选)
  function getOptionTitle(title, total) {
    return (
      '<div id="question1" class="question">' +
      "<h4>" +
      title +
      "</h4>" +
      '<table class="text" border="1">' +
      '<tr class="table-title">' +
      '<td class="col1">选项</td>' +
      '<td class="col2">小计</td>' +
      '<td class="col3">比例</td>' +
      "</tr>" +
      '<tr class="peoplenum">' +
      '<td class="col1">本题有效填写人数</td>' +
      '<td class="col2">' +
      total +
      "</td>" +
      '<td class="col3"></td>' +
      "</tr>" +
      "</table>" +
      '<div class="btn">' +
      '<button class="pie">饼状图</button>' +
      '<button class="bar">柱状图</button>' +
      "</div>" +
      '<div class="canva">' +
      '<div class="barChart" style="display:none"></div>' +
      '<div class="pieChart"></div>' +
      "</div>" +
      "</div>"
    );
  }
  // 获取题目选项
  function getOption(text, sum, scale) {
    return (
      '<tr class="option1">' +
      '<td class="col1 option-text">' +
      text +
      "</td>" +
      '<td class="col2 number">' +
      sum +
      "</td>" +
      '<td class="col3 scale">' +
      scale +
      "</td>" +
      "</tr>"
    );
  }
  // 获取题目框架(问答)
  function getFilling(title, total) {
    return (
      '<div id="question3" class="question">' +
      "<h4>" +
      title +
      "</h4>" +
      '<table class="text" border="1">' +
      '<tr class="table-title">' +
      '<td colspan="2" style="padding:0;">回答列表</td>' +
      "</tr>" +
      '<tr style="height:140px"> ' +
      '<td colspan="2" style="padding:0;">' +
      '<div style="overflow-y: scroll; height: 140px; margin-top:-21px; margin-bottom: -22px;">' +
      "<table " +
      'class="text text-list" ' +
      'border="1" ' +
      'style="margin-top:-1px;margin-bottom: -22px;margin-left: -1px;">' +
      "<tr></tr>" +
      "</table>" +
      "</div>" +
      "</td>" +
      "</tr>" +
      '<tr class="peoplenum">' +
      '<td style="width: 50%">本题有效填写人数</td>' +
      "<td>" +
      total +
      "</td>" +
      "</tr>" +
      "</table>" +
      "</div>"
    );
  }
  // 获取回答内容
  function getText(text, index) {
    return (
      '<tr class="option1" style="text-align: left;">' +
      '<td style="width:5%;text-align:center;padding:0">' +
      index +
      "</td>" +
      "<td>" +
      text +
      "</td>" +
      "</tr>"
    );
  }
  // 获取柱状图
  function getBar(barChart, options, optionNum) {
    let optionDatas = [];
    for (let i = 0; i < options.length; i++) {
      let optionData = {};
      optionData.value = optionNum[i];
      optionData.name = options[i];
      optionDatas.push(optionData);
    }
    let myChart = echarts.init(barChart);
    let option = {
      // tooltip: {
      //   //触发类型；轴触发，axis则鼠标hover到一条柱状图显示全部数据，item则鼠标hover到折线点显示相应数据，
      //   trigger: "axis",
      //   axisPointer: {
      //     //坐标轴指示器，坐标轴触发有效，
      //     type: "cross", //默认为line，line直线，cross十字准星，shadow阴影
      //     crossStyle: {
      //       color: "#fff",
      //     },
      //   },
      // },
      // legend: {
      //   data: ["人数"],
      // },
      //X轴内容
      xAxis: [
        {
          type: "category",
          show: true,
          data: options,
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "人数",
          interval: 1,
        },
      ],
      series: [
        {
          name: "人数",
          type: "bar",
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = [
                  "#C1232B",
                  "#B5C334",
                  "#FCCE10",
                  "#E87C25",
                  "#27727B",
                  "#FE8463",
                  "#9BCA63",
                  "#FAD860",
                  "#F3A43B",
                  "#60C0DD",
                  "#D7504B",
                  "#C6E579",
                  "#F4E001",
                  "#F0805A",
                  "#26C0C0",
                ];
                return colorList[params.dataIndex];
              },
              label: {
                show: true,
                position: "top",
                formatter: "{c}",
              },
            },
          },
          data: optionNum,
        },
      ],
    };
    myChart.setOption(option);
  }
  // 获取饼状图
  function getPie(pieChart, options, optionNum) {
    let optionDatas = [];
    for (let i = 0; i < options.length; i++) {
      let optionData = {};
      optionData.value = optionNum[i];
      optionData.name = options[i];
      optionDatas.push(optionData);
    }
    let myChart = echarts.init(pieChart);
    let option = {
      legend: {
        data: options,
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      series: [
        {
          name: "选项",
          type: "pie",
          radius: "55%",
          data: optionDatas,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    myChart.setOption(option);
  }
  // 取url参数
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }
});
