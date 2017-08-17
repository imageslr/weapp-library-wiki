<template>
    <el-dialog class="book-detail" title="预览" :visible.sync="dialogVisible" @close="popoverVisible = false">
        <h1>{{ book.title }}</h1>
        <div class="basic-info-wrap">
            <div class="basic-info-picture">
                <img :src="imageUrl" />
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
        </div>
        <div slot="footer" class="dialog-footer">
            <el-popover ref="confirmPopover" placement="top" width="200" v-model="popoverVisible" trigger="manual">
                <p>您提交的版本将成为该图书的最新版本并对所有人可见，确认提交吗？</p>
                <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="popoverVisible = false">取消</el-button>
                    <el-button type="text" size="mini" @click="commit">确定</el-button>
                </div>
            </el-popover>
            <el-button type="primary" v-popover:confirmPopover :loading="btnLoading" @click="check">{{text}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { addBookItem } from '../../../api/index.js';
export default {
    props: ['book'],
    data: function() {
        return {
            popoverVisible: false,

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

            dialogVisible: false,
            btnLoading: false
        }
    },
    computed: {
        imageUrl() {
            return this.book.imageUrlRaw ? this.book.imageUrlRaw : '/img/noPicture.jpg';
        },
        text() {
            return this.$route.path == '/edit' ? "创建新版本" : "创建条目";
        }
    },
    methods: {
        show() {
            this.dialogVisible = true;
        },
        check() {
            this.btnLoading = true;
            this.$parent.$refs.form.validate((valid) => {
                this.btnLoading = false;
                if (!valid) {
                    this.$message.error("图书信息有误，请重新填写");
                    return;
                } else {
                    this.popoverVisible = true;
                }
            });
        },
        commit() {
            this.btnLoading = true;
            this.popoverVisible = false;
            addBookItem(this.$parent.form, this.$route.query.id).then((res) => {
                this.$message.success(this.$route.path == '/edit' ? "创建新版本成功" : "创建条目成功");
                this.$router.replace({
                    name: 'book',
                    params: { id: res.bookId }
                });
            }).finally(() => {
                this.btnLoading = false;
            });
        }
    }
}
</script>