<template>
    <div class="container">
        <div id="particles-js"></div>
        <h1>每个人的图书百科</h1>
        <el-tabs>
            <el-tab-pane label="基本介绍">
                <h3>什么是维基</h3>
                <p>维基（Wiki）是一种用来构建自由内容、公开编辑的网络百科协作项目的技术，它使得包括您在内的所有人都可以简单地使用网页浏览器浏览查看和修改其中的内容。</p>
                <h3>图书WIKI系统简介</h3>
                <p>此系统基于Wiki技术构建，主要提供<span @click="$refs.qrDialog.show()">“无微不至”的借阅伴侣</span>所使用的图书信息的协作管理功能。您可通过多种方式<a @click="showLogin()">登录</a>系统。</p>
                <p>您可使用搜索功能搜索并查看某本图书的详细信息，在登录后可以创建或编辑某本图书的详细信息。在一些情况下为了避免扰乱或者破坏可能会限制编辑功能。</p>
                <p>任何人都可以成为图书条目的作者，作者的昵称将永久显示在该条目页中以示感激。也可在遵守协议并标示来源后直接复制、使用以及发布这些内容。</p>
            </el-tab-pane>
            <el-tab-pane label="使用说明">
                <h3>1. 搜索图书</h3>
                <p>在页面顶部的搜索框内输入搜索关键字，按下回车，搜索相关图书的信息</p>
                <h3>2. 查看图书信息</h3>
                <p>点击搜索结果中的图书链接，即可查看该图书的详细信息。</p>
                <p>默认展示当前最新版本的图书信息，您可选择查看其他历史版本。</p>
                <h3>3. 创建/编辑图书信息</h3>
                <p>您可以改正图书信息里的错别字、补充新资料或者删除冗余的内容。</p>
                <p>您也可以创建新的图书条目。系统以ISBN作为图书的唯一标识，已存在的图书不可重复创建。</p>
                <h3>4. 预览结果，提交修改</h3>
                <p>完成修改后，点击页面内的“预览”按钮可预览整体效果。确认无误后点击“提交”。</p>
                <p>每次提交前，请为本次提交设置一个简短清晰的编辑描述，以便其他人能够知道您作出了什么修改。</p>
                <h3>5. 查看最新版本</h3>
                <p>完成提交后，您编辑的内容将成为该条目的最新版本。</p>
                <h3>6. 其他</h3>
                <p>点击左上角“图书WIKI系统”，可返回主页。</p>
            </el-tab-pane>
            <el-tab-pane label="百科理念">
                <h3>真实</h3>
                <p>任何人都可以编辑图书百科，但是所有的更改都应该有据可依。您应尽量引用可供查证和权威性的资料，以使条目的内容更加可靠。</p>
                <h3>客观</h3>
                <p>您必须按照客观的立场来撰写条目，不应带有任何个人好恶倾向。</p>
                <h3>负责</h3>
                <p>您编辑的每字每句都能被所有用户看到，因此所有的修改都应该对整个条目负责。</p>
            </el-tab-pane>
            <el-tab-pane label="百科术语">
                <h3>条目</h3>
                <p>每本图书对应于一个图书条目，该条目记录了这本图书的详细信息，这些信息可以有多个不同的版本。</p>
                <h3>版本</h3>
                <p>每个图书信息最初都会创建为一个初始版本；当图书信息被修改后，旧的内容不会消失，而是保存为一个历史版本。用户可浏览不同的版本的图书信息。</p>
            </el-tab-pane>
        </el-tabs>
        <qr-dialog ref="qrDialog"></qr-dialog>
    </div>
</template>
<script>
import 'particles.js/particles';
import qrDialog from '../../components/QRDialog.vue';
const particlesJS = window.particlesJS;
export default {
    components: {
        qrDialog
    },
    data() {
        return {
            particlesCfg: {
                "particles": {
                    "number": {
                        "value": 88,
                        "density": {
                            "enable": true,
                            "value_area": 700
                        }
                    },
                    "color": {
                        "value": ["#aa73ff", "#f8c210", "#83d238", "#33b1f8"]
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 15
                        }
                    },
                    "opacity": {
                        "value": 0.5,
                        "random": false,
                        "anim": {
                            "enable": false,
                            "speed": 1.5,
                            "opacity_min": 0.15,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 2.5,
                        "random": false,
                        "anim": {
                            "enable": true,
                            "speed": 2,
                            "size_min": 0.15,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 110,
                        "color": "#33b1f8",
                        "opacity": 0.25,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 1.6,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": false,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": false,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 100,
                            "line_linked": {
                                "opacity": 0.8
                            }
                        },
                        "bubble": {
                            "distance": 400,
                            "size": 40,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        },
                        "push": {
                            "particles_nb": 4
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            }
        };
    },
    mounted() {
        particlesJS("particles-js", this.particlesCfg);
    },
    methods: {
        showLogin() {
            if (!this.$store.getters.token) {
                this.$emit('showLogin')
            }
        }
    }
}
</script>
<style scoped>
canvas {
    display: block;
    vertical-align: bottom;
}

#particles-js {
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #323840;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
}

.container>h1 {
    font-size: 30px;
    text-align: center;
}
</style>
<style>
.el-tabs {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 600px;
}

.el-tabs span,
.el-tabs a {
    color: #20a0ff;
    cursor: pointer;
}

.el-tabs p {
    margin-top: 0;
    margin-bottom: 8px;
}


.el-tabs__header {
    width: 100%;
}

.el-tabs__nav {
    position: relative;
    left: 50%;
    margin-left: -176px;
    width: 352px;
}

.el-tabs__item {
    color: #ddd;
}

.el-tabs__item:hover {
    color: #fff;
}

.el-tabs__item.is-active:hover {
    color: #20a0ff;
}
</style>