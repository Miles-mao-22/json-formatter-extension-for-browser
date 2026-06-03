const jsonInput = document.getElementById("jsonInput");
const jsonOutput = document.getElementById("jsonOutput");
const errorMsg = document.getElementById("errorMsg");

const formatBtn = document.getElementById("formatBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");

formatBtn.addEventListener("click", () => {
  const text = jsonInput.value.trim();

  errorMsg.textContent = "";
  jsonOutput.textContent = "";
  jsonInput.classList.remove("error");

  if (!text) {
    errorMsg.textContent = "请输入 JSON 字符串";
    jsonInput.classList.add("error");
    return;
  }

  try {
    const obj = JSON.parse(text);

    const formatted = JSON.stringify(obj, null, 2);

    jsonOutput.textContent = formatted;
    jsonInput.value = formatted;
  } catch (e) {
    jsonInput.classList.add("error");

    const position = getErrorPosition(e.message);
    if (position !== null) {
      const lineColumn = getLineAndColumn(text, position);

      errorMsg.textContent =
        `JSON 语法错误：${e.message}\n` +
        `错误位置：第 ${lineColumn.line} 行，第 ${lineColumn.column} 列`;
    } else {
      errorMsg.textContent = `JSON 语法错误：${e.message}`;
    }
  }
});

clearBtn.addEventListener("click", () => {
  jsonInput.value = "";
  jsonOutput.textContent = "";
  errorMsg.textContent = "";
  jsonInput.classList.remove("error");
});

copyBtn.addEventListener("click", async () => {
  const text = jsonOutput.textContent;

  if (!text) {
    errorMsg.textContent = "没有可复制的整理结果";
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    errorMsg.style.color = "green";
    errorMsg.textContent = "已复制到剪贴板";

    setTimeout(() => {
      errorMsg.style.color = "red";
      errorMsg.textContent = "";
    }, 1500);
  } catch (e) {
    errorMsg.style.color = "red";
    errorMsg.textContent = "复制失败";
  }
});

function getErrorPosition(message) {
  const match = message.match(/position (\d+)/);
  return match ? Number(match[1]) : null;
}

function getLineAndColumn(text, position) {
  const lines = text.slice(0, position).split("\n");

  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1
  };
}