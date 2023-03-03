

<script setup>
import "xterm/css/xterm.css";
import { debounce } from 'lodash'
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";


const route = useRoute();
const sshId = ref(route.params.sshId)

let term = null
let websocket = null
let rows = 40
let cols = 135
let SetOut = false
let isKey = false
let first = true

const props = defineProps({
    terminalDetail: Object,
    type: String
});

const fitAddon = new FitAddon();

const initTerm = () => {
    term = new Terminal({
        rendererType: "webgl ", //渲染类型
        rows: rows, //行数
        cols: cols,// 设置之后会输入多行之后覆盖现象
        convertEol: true, //启用时，光标将设置为下一行的开头
        fontSize: 14, //字体大小
        disableStdin: false, //是否应禁用输入。
        cursorStyle: "block", //光标样式
        cursorBlink: true, //光标闪烁
        scrollback: 4294967295, //这里的需求是不覆盖原来已经打印出来的信息。但是xterm并没有对应的选项 所以设置一个超大值来防止覆盖
        tabStopWidth: 4,
        theme: {
            foreground: "yellow", //字体
            background: "#060101", //背景色
            cursor: "help" //设置光标
        }
    });
    const attachAddon = new AttachAddon(websocket);
    term.loadAddon(attachAddon);
    term.loadAddon(fitAddon);
    term.open(document.getElementById("terminal"));
    term.focus();
    let _this = this;
    //限制和后端交互，只有输入回车键才显示结果
    term.prompt = () => {
        term.write("\r\n$ ");
    };
    term.prompt();
        // 不能初始化的时候fit,需要等terminal准备就绪,可以设置延时操作
        setTimeout(() => {
        fitAddon.fit();
    }, 5)
    function runFakeTerminal(_this) {
        if (term._initialized) {
            return;
        }
        // 初始化
        term._initialized = true;
        term.writeln();//控制台初始化报错处
        term.prompt();
        // / **
        //     *添加事件监听器，用于按下键时的事件。事件值包含
        //     *将在data事件以及DOM事件中发送的字符串
        //     *触发了它。
        //     * @返回一个IDisposable停止监听。
        //  * /
        //   / ** 更新：xterm 4.x（新增）
        //  *为数据事件触发时添加事件侦听器。发生这种情况
        //  *用户输入或粘贴到终端时的示例。事件值
        //  *是`string`结果的结果，在典型的设置中，应该通过
        //  *到支持pty。
        //  * @返回一个IDisposable停止监听。
        //  * /
        // 支持输入与粘贴方法
        term.onData(function (key) {
            let order = {
                Data: key,
                Op: "stdin",
            };
            onSend(order);
        });
        _this.term = term;
    }
    runFakeTerminal(_this);
}

//webShell主题
const initSocket = () => {
    const WebSocketUrl = import.meta.env.VITE_WS_URL + "/ssh/" + sshId.value
    websocket = new WebSocket(WebSocketUrl);
    // 连接成功
    websocket.onopen = socketOnOpen

    // 连接成功
    websocket.onmessage = socketOnMessage

    // 连接错误
    websocket.onerror = socketOnError

    // 连接关闭的回调
    websocket.onclose = socketOnClose
}
//webshell链接成功之后操作
const socketOnOpen = () => {
    console.log("websocket连接成功")
    initTerm()
    resizeRemoteTerminal()
}

//webshell链接成功之后操作
const socketOnMessage = (Message) => {
    // 首次接收消息,发送给后端，进行同步适配
    if (first === true) {
        first = false;
        resizeRemoteTerminal();
    }
}
// 发送给后端,调整后端终端大小,和前端保持一致,不然前端只是范围变大了,命令还是会换行
const resizeRemoteTerminal = () => {
    const { cols, rows } = term
    if (isWsOpen()) {
        onSend({
            Op: 'resize',
            Cols: cols,
            Rows: rows,
        })
    }
}
const fitTerm = () => {
    fitAddon.fit();
}
// 是否连接中0 1 2 3 
const isWsOpen = () => {
    const readyState = websocket && websocket.readyState;
    return readyState === 1
}
const onTerminalResize = () => {
    window.addEventListener("resize", onResize);
}
const removeResizeListener = () => {
    window.removeEventListener("resize", onResize);
}
//监听类型变化，重置term
watch(() => props.type, () => {
    first = true;
    websocket = null;
    initSocket();
    // 重置
    term.reset();
})

const onResize = debounce(() => fitTerm(), 800);


//webshell关闭之后操作
const socketOnClose = () => {
    console.log("close socket");
}
//webshell错误信息
const socketOnError = () => {
    console.log("socket 链接失败");
}
//特殊处理
const onSend = (data) => {
    websocket.send(JSON.stringify(data));
}

onMounted(() => {
    initSocket();
    onTerminalResize();
})

onUnmounted(() => {
    websocket.close()
    removeResizeListener();
})
</script>

<template>
    <section>
        <div id="log" style="margin:10px auto;">
            <div class="console" id="terminal"></div>
        </div>
    </section>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
    font-weight: normal;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
