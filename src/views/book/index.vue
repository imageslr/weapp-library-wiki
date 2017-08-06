<template>
    <div v-loading="loading">
        <div class="left-6 book-detail">
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
                                <router-link :to="{ name: 'book', params: { id: item.bookId }}"><img :src="item.imageUrl" /></router-link>
                            </div>
                            <div>
                                <router-link :to="{ name: 'book', params: { id: item.bookId}}"> {{item.title}}</router-link>
                            </div>
                        </div>
                    </div>
                    <h2>包含这本书的书单</h2>
                    <div v-if="!book.relevantBooklists.length">暂无</div>
                    <div v-else>
                        <div v-for="item in book.relevantBooklists" class="relevant-booklist-item">
                            <div class="relevant-book-item__img-wrap">
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
                <template v-if="isLatestVersion">
                    <div><small>最后编辑时间：{{book.createTime}}</small></div>
                    <div><small>创建者：{{creator}}</small></div>
                </template>
                <template v-else>
                    <div><small>编辑时间：{{book.createTime}}</small></div>
                    <div><small>编辑者：{{book.editor}}</small></div>
                    <div><small>编辑摘要：{{book.editSummary}}</small></div>
                </template>
                <el-button style="margin-top: 10px;" type="primary" @click="navigateToEdit">编辑此版本</el-button>
                <el-button type='text' @click="historyDialogVisible = true">查看所有历史版本</el-button>
            </el-card>
        </div>
        <div class="clearfix"></div>
        <qr-dialog ref="qrDialog"></qr-dialog>
        <el-dialog title="所有历史版本" :visible.sync="historyDialogVisible">
            <el-table :data="book.versions" :row-class-name="tableRowClassName" @row-click="navigateToVersion">
                <el-table-column prop="version" label="#" width="50px">
                </el-table-column>
                <el-table-column prop="createTime" label="编辑时间" width="140px" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="editor" label="编辑者" width="120px" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="summary" label="编辑摘要" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" width="80px">
                    <template scope="scope">
                        <el-button type="text" @click="navigateToVersion(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
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
                versions: [],
            },
            loading: true,
            historyDialogVisible: false,

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
        }
    },
    computed: {
        isLatestVersion() {
            return this.$route.query.version === undefined;
        },
        creator() {
            if (!this.book.versions.length) return undefined;

            return this.book.versions[this.book.versions.length - 1].editor;
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
        tableRowClassName: function(row, index) {
            if (this.book.version == row.version) {
                return 'info-row';
            }
            return '';
        },
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
        navigateToEdit: function() {
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
        navigateToVersion: function(row) {
            this.$router.push({
                name: 'book',
                params: { id: this.$route.params.id },
                query: {version: row.version}
            });
        }
    }
}
</script>
<style>
.el-table .info-row {
    background: #edf7ff;
}

.el-table tr:hover {
    cursor: pointer;
}
</style>