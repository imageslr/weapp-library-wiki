<template>
    <div class="wrap">
        <div style="width: 60%">
            <div v-loading="loading">
                <template v-if="books.length">
                    <div class="text-smaller">
                        搜索结果{{start + 1}} - {{end}} 共{{total}}
                    </div>
                    <div v-for="book in books" class="book-item">
                        <div class="book-item-picture">
                            <router-link :to="{ name: 'book', params: { id: book.id }}"><img :src="book.imageUrl" /></router-link>
                        </div>
                        <div class="book-item-info">
                            <div>
                                <router-link :to="{ name: 'book', params: { id: book.id }}" class="book-item-info__title"> {{ book.title }} </router-link>
                            </div>
                            <div>作者：{{book.author}}</div>
                            <div>出版社：{{book.publisher}}</div>
                            <div>出版时间：{{book.pubdate}}</div>
                            <div>ISBN：{{book.isbn}}</div>
                        </div>
                    </div>
                    <el-pagination layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page.sync="currentPage" @current-change="fetchData">
                    </el-pagination>
                </template>
                <div v-if="!books.length && !loading" class="el-table__empty-block">
                    <span class="el-table__empty-text">暂无数据</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { search } from '../../api/index.js';

export default {
    data() {
        return {
            books: [],
            total: 0,
            pageSize: 10,
            currentPage: 1,
            loading: true,
        }
    },
    computed: {
        start: function() {
            return (this.currentPage - 1) * this.pageSize;
        },
        end: function() {
            return (this.start + this.pageSize > this.total) ? this.total : this.start + this.pageSize;
        }
    },
    created() {
        this.fetchData(1);
    },
    watch: {
        '$route': function() {
            console.log(this.$route.query);
            if (this.currentPage == 1)
                this.fetchData(1);
            else
                this.currentPage = 1;
        }
    },
    methods: {
        fetchData: function(page) {
            this.books = [];
            this.loading = true;

            const params = {
                start: this.start,
                count: this.pageSize,
                type: this.$route.query.type,
                keyword: this.$route.query.keyword
            };
            search(params).then(res => {
                this.books = res.subjects;
                this.total = res.total;
            }).finally(() => {
                this.loading = false;
            });
        },
        navigate: function(row, event) {
            console.log(row);
            console.log(event);
        }
    }
}
</script>
<style scoped>
.wrap {
    width: 950px;
    margin: 0 auto;
}

.text-smaller {
    margin-bottom: 5px;
    text-align: right;
    color: #5e6d82;
    font-size: 13px;
}

.book-item {
    padding: 20px 0 10px;
    overflow: hidden;
    border-top: 1px dashed #ddd;
    color: #5e6d82;
    font-size: 14px;
}

.book-item-picture {
    float: left;
    margin-right: 20px;
}

.book-item-picture img {
    width: 90px;
}

.book-item-info {
    overflow: hidden;
}

.book-item-info>div {
    margin-bottom: 6px;
}

.book-item-info__title {
    font-size: 16px;
}

.el-pagination {
    margin-top: 20px;
    text-align: center;
}
</style>