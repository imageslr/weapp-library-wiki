<template>
    <el-dialog class="book-detail" title="预览" :visible.sync="dialogVisible">
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
            <el-button type="primary" @click="commit" :loading="btnLoading">{{text}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { addBookItem } from '../../../api/index.js';
export default {
    props: ['book'],
    data: function() {
        return {
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
        text(){
            return this.$route.path == '/edit' ? "创建新版本" : "创建条目";
        }
    },
    methods: {
        show() {
            this.dialogVisible = true;
        },
        commit() {
            this.btnLoading = true;
            this.$parent.$refs.form.validate((valid) => {
                if (!valid) {
                    this.$message.error("图书信息有误，请重新填写");
                    this.btnLoading = false;
                    return;
                } else {
                    addBookItem(this.$parent.form, this.$route.query.id).then((res) => {
                        this.$message.success(this.$route.path == 'edit' ? "创建新版本成功" : "创建条目成功");
                        this.$router.push({
                            name: 'book',
                            params: { id: res.bookId }
                        });
                    }).catch((res) => {
                        console.log(res.errmsg);
                    }).finally(() => {
                        this.btnLoading = false;
                    });
                }
            })
        }
    }
}
</script>