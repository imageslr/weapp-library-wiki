<template>
    <div>
        <div class="left-6" v-loading="loading">
            <template v-if="book">
                <h1>{{ book.title }}</h1>
                <div class="basic-info-wrap">
                    <div class="basic-info-picture">
                        <a :href="book.imageUrl" target="blank"><img :src="book.imageUrl" /></a>
                    </div>
                    <div class="basic-info">
                        <div v-for="item in basicKeys">
                            <span class="basic-info__key">{{item.name}}: </span> {{book[item.key] ? book[item.key] : '暂无'}}
                        </div>
                    </div>
                    <template v-for="item in extendKeys">
                        <h2>{{item.name}}</h2>
                        <div>{{book[item.key] ? book[item.key] : '暂无'}}</div>
                    </template>
                    <h2>相关图书</h2>
                    <div v-if="!book.relevantBooks.length">暂无</div>
                    <div v-else class="relevant-book">
                        <div v-for="item in book.relevantBooks" class="relevant-book-item">
                            <div class="relevant-book-item__img-wrap">
                                <!-- 添加t参数以保证触发create钩子 -->
                                <router-link :to="{ name: 'book', params: { id: item.bookId }, query: { t: Date.now() } }"><img :src="item.imageUrl" /></router-link>
                            </div>
                            <div>
                                <router-link :to="{ name: 'book', params: { id: item.bookId},
                                query: {t: Date.now() } }"> {{item.title}}</router-link>
                            </div>
                        </div>
                    </div>
                    <h2>包含这本书的书单</h2>
                    <div v-if="!book.relevantBooklists.length">暂无</div>
                    <div v-else>
                        <div v-for="item in book.relevantBooklists" class="relevant-booklist-item">
                            <div class="relevant-book-item__img-wrap">
                                <!-- 添加t参数以保证触发create钩子 -->
                                <img :src="item.imageUrl" @click="$refs.qrDialog.show()"/>
                            </div>
                            <div @click="$refs.qrDialog.show()"><a>{{item.title}}</a></div>
                        </div>
                    </div>
                </div>
            </template>
            <div v-if="!book && !loading" class="el-table__empty-block">
                <span class="el-table__empty-text">暂无数据</span>
            </div>
        </div>
        <div class="right-4">
            <el-card>
                <div v-if="book">
                    <div>当前页面版本：{{book.version}}</div>
                    <div>编辑者：{{book.editor}}</div>
                </div>
            </el-card>
        </div>
        <qr-dialog ref="qrDialog"></qr-dialog>
    </div>
</template>
<script>
import { getBookById } from '../../api/index.js';
import qrDialog from '../../components/QRDialog.vue';

export default {
    components: {
        qrDialog
    },
    data() {
        return {
            book: undefined,
            loading: true,

            basicKeys: [{
                name: "作者",
                key: "author"
            }, {
                name: "译者",
                key: "translator"
            }, {
                name: "出版社",
                key: "publisher"
            }, {
                name: "出版年",
                key: "pubdate"
            }, {
                name: "语种",
                key: "language"
            }, {
                name: "页数",
                key: "page"
            }, {
                name: "价格",
                key: "price"
            }, {
                name: "分类号",
                key: "classNumber"
            }, {
                name: "索书号",
                key: "callNumber"
            }, {
                name: "ISBN",
                key: "isbn"
            }],

            extendKeys: [{
                name: "内容简介",
                key: "summary"
            }, {
                name: "作者简介",
                key: "authorIntroduction"
            }, {
                name: "译者简介",
                key: "translatorIntroduction"
            }, {
                name: "目录",
                key: "catalog"
            }, {
                name: "导读",
                key: "preview"
            }]
        }
    },
    created() {
        this.fetchData();
    },
    watch: {
        '$route': function() {
            this.fetchData();
        }
    },
    methods: {
        fetchData: function() {
            this.loading = true;
            getBookById(this.$route.params.id).then(res => {
                this.book = res;
            }).finally(() => {
                this.loading = false;
            });
        }
    }
}
</script>
<style scoped>
.basic-info-wrap {
    overflow: hidden;
    color: #111;
    font-size: 14px;
}

.basic-info-picture {
    float: left;
    margin-right: 20px;
}

.basic-info {
    overflow: hidden;
}

.basic-info-picture img {
    height: 150px;
}

.basic-info__key {
    color: #666666;
}



h1 {
    word-wrap: break-word;
    display: block;
    font-size: 25px;
    font-weight: bold;
    color: #494949;
    margin: 0;
    padding: 0 0 15px 0;
    line-height: 1.1;
}

h2 {
    margin-top: 24px;
    margin-bottom: 3px;
    color: #494949;
    line-height: 150%;
    font-size: 20px;
}

.relevant-book {
    overflow: hidden;
}

.relevant-book-item {
    float: left;
    width: 20%;
    padding-right: 30px;
    margin: 15px 0;
    overflow: hidden;
    text-align: center;
}

.relevant-book-item__img-wrap {
    height: 130px;
    overflow: hidden;
}

.relevant-book-item__img-wrap img {
    max-width: 100%;
    max-height: 100%;
}

.relevant-booklist-item {
    float: left;
    width: 20%;
    padding-right: 30px;
    margin: 15px 0;
    overflow: hidden;
    text-align: center;
}

.relevant-booklist-item > div {
    cursor: pointer;
}
</style>