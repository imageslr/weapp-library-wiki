<template>
    <div>
        <div class="left-6 book-detail" v-loading="loading">
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
                                <img :src="item.imageUrl" @click="$refs.qrDialog.show()" />
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
            <el-card style="margin-bottom: 20px;">
                <div><small>最后编辑时间：{{book.createTime}}</small></div>
                <div><small>编辑者：{{book.editor}}</small></div>
                <div style="margin-bottom: 10px;"><small>编辑摘要：{{book.editSummary}}</small></div>
                <el-button type="primary" @click="create">编辑此条目</el-button>
            </el-card>
            <el-card>
                <el-form label-position="top">
                    <el-form-item label="查看历史版本" style="margin-bottom: 0px;">
                        <el-select v-model="book.version" placeholder="请选择">
                            <el-popover v-for="item in versions" placement="right" width="250" trigger="hover">
                                <div>
                                    <div>编辑时间：{{item.createTime}}</div>
                                    <div>编辑者：{{item.editor}}</div>
                                    <div>编辑摘要：{{item.summary}}</div>
                                </div>
                                <router-link slot="reference" :to="{ name: 'book', params: { id: $route.params.id }, query: {version: item.version} }">
                                <el-option :label=" 'version: ' + item.version" :value="item.version" v-popover="'popover'+ item.version">
                                </el-option>
                                </router-link>
                            </el-popover>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <qr-dialog ref="qrDialog"></qr-dialog>
    </div>
</template>
<script>
import { getBookById } from '../../api/index.js';
import { checkLogin } from '../../utils/auth.js';
import qrDialog from '../../components/QRDialog.vue';

export default {
    components: {
        qrDialog
    },
    data() {
        return {
            book: {
                version: undefined,
                createTime: undefined,
                relevantBooks: [],
                relevantBooklists: [],
            },
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
                name: "出版日期",
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
            }],

            versions: [],
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
            getBookById(this.$route.params.id, this.$route.query.version).then(res => {
                this.book = res;
                this.versions = res.versions;
            }).catch((res) => {
                if (res.code == 404)
                    this.$router.replace({ path: '/404' });
            }).finally(() => {
                this.loading = false;
            });
        },
        create: function() {
            if (checkLogin(this)) {
                this.$router.push({
                    path: '/edit',
                    query: {
                        id: this.book.bookId,
                        version: this.$route.query.version
                    }
                });
            }
        },
        navigate: function(version) {
            this.$router.push({
                path: '/book/',
                params: { id: this.$route.params.id },
                query: { version: version }
            });
        }
    }
}
</script>