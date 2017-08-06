<template>
    <div v-loading="loading">
        <div v-if="isLoaded" class="left-6">
            <el-form class="edit-form" :model="form" ref="form" label-position="right" label-width="100px">
                <el-form-item prop="imageUrl" label="图书封面">
                    <el-upload v-loading="imageLoading" class="picture-uploader" name="picture" action="/api/wiki/books/image" accept="image/jpeg, image/jpg, image/png" :show-file-list="false" :multiple="false" :before-upload="beforePictureUpload" :on-success="handlePictureSuccess" :on-error="handlePictureError" :http-request="handlePictureUpload">
                        <img v-if="form.imageUrlRaw" :src="form.imageUrlRaw" class="picture">
                        <i v-else class="el-icon-plus picture-uploader-icon"></i>
                    </el-upload>
                    <div class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                </el-form-item>
                <el-form-item prop="title" label="书名" :rules="requiredValidator">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item prop="isbn" label="ISBN" :rules="isEdit ? {} : isbnValidator">
                    <el-input :disabled="$route.path == '/edit'" v-model="form.isbn" placeholder="ISBN不能与系统已有记录重复"></el-input>
                </el-form-item>
                <el-form-item prop="callNumber" label="索书号">
                    <el-input v-model="form.callNumber" placeholder="如: TP373.1"></el-input>
                </el-form-item>
                <el-form-item prop="classNumber" label="分类号">
                    <el-input v-model="form.classNumber" placeholder="请填写中图分类号，如: A11"></el-input>
                </el-form-item>
                <el-form-item prop="author" label="作者">
                    <el-input v-model="form.author" placeholder="如: [英]J.K.罗琳。多个作者用'/'分隔"></el-input>
                </el-form-item>
                <el-form-item prop="translator" label="译者">
                    <el-input v-model="form.translator" placeholder="如: 李建新。多个译者用'/'分隔"></el-input>
                </el-form-item>
                <el-form-item prop="language" label="语种">
                    <el-input v-model="form.language" placeholder="如: 汉语"></el-input>
                </el-form-item>
                <el-form-item prop="price" label="定价">
                    <el-input v-model="form.price" placeholder="如: 39.80"></el-input>
                </el-form-item>
                <el-form-item prop="publisher" label="出版社">
                    <el-input v-model="form.publisher" placeholder="如: 人民教育出版社"></el-input>
                </el-form-item>
                <el-form-item prop="pubdate" label="出版日期" class="form-item-date-picker">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.pubdateRaw" @change="datePickerChange"></el-date-picker>
                </el-form-item>
                <el-form-item prop="page" label="页数" :rules="pageValidator">
                    <el-input v-model="form.page"></el-input>
                </el-form-item>
                <el-form-item prop="authorIntroduction" label="作者简介">
                    <el-input v-model="form.authorIntroduction" type="textarea" :rows="3"></el-input>
                </el-form-item>
                <el-form-item prop="translatorIntroduction" label="译者简介">
                    <el-input v-model="form.translatorIntroduction" type="textarea" :rows="3"></el-input>
                </el-form-item>
                <el-form-item prop="summary" label="内容简介">
                    <el-input v-model="form.summary" type="textarea" :rows="3"></el-input>
                </el-form-item>
                <el-form-item prop="catalog" label="目录">
                    <el-input v-model="form.catalog" type="textarea" :rows="3"></el-input>
                </el-form-item>
                <el-form-item prop="preview" label="试读">
                    <el-input v-model="form.preview" type="textarea" :rows="3"></el-input>
                </el-form-item>
                <el-form-item class="is-required" v-if="isEdit" prop="editSummary" label="编辑摘要" :rules="isEdit? requiredValidator : {}">
                    <el-input ref="editSummaryInput" v-model="form.editSummary" placeholder="简要描述你所作出的修改"></el-input>
                    <div>
                        <el-tag v-for="item in tags" type="primary" @click.native="selectTag(item.value)">{{item.label}}</el-tag>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div v-if="isLoaded" class="right-4">
            <el-card>
                <div style="margin-bottom: 10px">
                    <div><small>完成编辑后请先预览，确保没有错误后再提交。</small></div>
                </div>
                <el-button type="primary" @click="showPreview()">预览条目</el-button>
            </el-card>
        </div>
        <div class="clearfix"></div>
        <preview-dialog :book="form" ref="preview"></preview-dialog>
    </div>
</template>
<script>
import { requiredValidator } from '../../utils/validate.js';
import { formatDate } from '../../utils/utils.js';
import { search, getBookById } from '../../api/index.js';
import previewDialog from './components/PreviewDialog.vue';
export default {
    components: {
        previewDialog
    },
    data: function() {
        return {
            form: {
                imageUrl: undefined,
                imageUrlRaw: undefined,
                title: undefined,
                isbn: undefined,
                callNumber: undefined,
                classNumber: undefined,
                author: undefined,
                translator: undefined,
                price: undefined,
                publisher: undefined,
                pubdate: undefined,
                pubdateRaw: undefined,
                page: undefined,
                authorIntroduction: undefined,
                translatorIntroduction: undefined,
                summary: undefined,
                catalog: undefined,
                preview: undefined,
                editSummary: ''
            },
            formRaw: {}, // 最初的数据，用于判断表单是否修改过
            loading: false,
            imageLoading: false,

            tags: [{
                label: "修改内容",
                value: "修改内容："
            }, {
                label: "修正笔误",
                value: "修正笔误 "
            }, {
                label: "版本回退",
                value: "回退至早前的版本-原因："
            }, {
                label: "增加内容",
                value: "增加内容："
            }, {
                label: "删除内容",
                value: "删除内容："
            }],

            requiredValidator: requiredValidator(),
            isbnValidator: [requiredValidator(), {
                trigger: 'change',
                validator: (rule, value, callback) => {
                    search({
                        type: 'isbn',
                        keyword: value
                    }).then(res => {
                        if (res.total) {
                            callback(new Error('ISBN已存在'));
                        } else {
                            callback();
                        }
                    }).catch(() => {
                        callback();
                    })
                }
            }],
            pageValidator: {
                trigger: 'blur',
                validator: (rule, value, callback) => {
                    if (value && isNaN(value)) {
                        callback(new Error('请输入一个整数'));
                    } else {
                        callback();
                    }
                }
            }
        }
    },
    computed: {
        isEdit() {
            return this.$route.path == '/edit';
        },
        isLoaded(){
            return !this.isEdit || this.isEdit && this.form.isbn;
        }
    },
    created() {
        if (this.$route.path == '/edit') {
            if (!this.$route.query.id)
                this.$router.replace({ path: '/404' });

            this.loading = true;
            getBookById(this.$route.query.id, this.$route.query.version).then((res) => {
                if(res.isLocked) {
                    this.$message.error("该条目被锁定，无法编辑");
                    return;
                }
                Object.keys(this.form).forEach(key => {
                    if (key != 'editSummary')
                        this.form[key] = res[key];
                });
                this.form.imageUrlRaw = res.imageUrl;
                this.formRaw = Object.assign({}, this.form); // 复制初始数据，用于检测是否有修改
            }).catch((res) => {
                if (res.code == 404) {
                    this.$router.replace({ path: '/404' });
                }
            }).finally(() => {
                this.loading = false
            });
        }
    },
    methods: {
        isChanged() {
            var changed = false;
            Object.keys(this.form).forEach(key => {
                if(key != 'editSummary' && this.form[key] != this.formRaw[key]) {
                    changed = true;
                }
            });
            return changed;
        },
        datePickerChange(e) {
            this.form.pubdate = formatDate(e);
        },
        selectTag(value) {
            this.form.editSummary += value;
            this.$refs.editSummaryInput.$el.children[0].focus(); // 获取焦点
        },
        showPreview() {
            this.$refs.preview.show();
        },
        beforePictureUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG/PNG 格式');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB');
            }
            if (isJPG && isLt2M) {
                this.imageLoading = true;
                return true;
            } else {
                return false;
            }
        },
        handlePictureUpload(option) {
            // 重写自定义上传方法

            var getError = function(action, option, xhr) {
                let msg;
                if (xhr.response) {
                    msg = `${xhr.status} ${xhr.response.error || xhr.response}`;
                } else if (xhr.responseText) {
                    msg = `${xhr.status} ${xhr.responseText}`;
                } else {
                    msg = `fail to post ${action} ${xhr.status}`;
                }

                const err = new Error(msg);
                err.status = xhr.status;
                err.method = 'post';
                err.url = action;
                return err;
            }

            var getBody = function(xhr) {
                const text = xhr.responseText || xhr.response;
                if (!text) {
                    return text;
                }

                try {
                    return JSON.parse(text);
                } catch (e) {
                    return text;
                }
            }

            if (typeof XMLHttpRequest === 'undefined') {
                return;
            }

            const xhr = new XMLHttpRequest();
            const action = option.action;

            if (xhr.upload) {
                xhr.upload.onprogress = function progress(e) {
                    if (e.total > 0) {
                        e.percent = e.loaded / e.total * 100;
                    }
                    option.onProgress(e);
                };
            }

            const formData = new FormData();

            if (option.data) {
                Object.keys(option.data).map(key => {
                    formData.append(key, option.data[key]);
                });
            }

            formData.append(option.filename, option.file);

            xhr.onerror = function error(e) {
                option.onError(e);
            };

            xhr.onload = function onload() {
                // 这里作了修改
                if (xhr.status < 200 || xhr.status >= 300 || getBody(xhr).code != 200) {
                    return option.onError(getError(action, option, xhr));
                }

                option.onSuccess(getBody(xhr));
            };

            xhr.open('post', action, true);

            if (option.withCredentials && 'withCredentials' in xhr) {
                xhr.withCredentials = true;
            }

            const headers = option.headers || {};

            for (let item in headers) {
                if (headers.hasOwnProperty(item) && headers[item] !== null) {
                    xhr.setRequestHeader(item, headers[item]);
                }
            }
            xhr.send(formData);
            return xhr;
        },
        handlePictureSuccess(res, file) {
            this.imageLoading = false;
            this.form.imageUrl = res.data;
            this.form.imageUrlRaw = URL.createObjectURL(file.raw);
        },
        handlePictureError() {
            this.imageLoading = false;
            this.$message.error('上传图片失败');
        },
    }
}
</script>
<style scoped>
.el-tag+.el-tag {
    margin-left: 10px;
}

.el-tag {
    cursor: pointer;
}

.el-tag:hover {
    background-color: rgba(20, 160, 255, .3);
}
</style>
<style>
.edit-form .el-input,
.edit-form .el-date-editor.el-input {
    width: 300px;
}

.edit-form textarea {
    width: 100%;
}

.picture-uploader {
    width: 178px;
    height: 178px;
}

.picture-uploader .el-upload {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
}

.picture-uploader .el-upload:hover {
    border-color: #20a0ff;
}

.picture-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.picture {
    max-width: 100%;
    max-height: 100%;
    display: block;
}
</style>