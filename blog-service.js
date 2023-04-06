const Sequelize = require("sequelize");
const { gte } = Sequelize.Op;

var sequelize = new Sequelize('zszzpygk', 'zszzpygk', 'rLxXxaXBB6kms0DuxYf7DMp2NRyF1hGn', {
    host: 'isilo.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

sequelize.authenticate().then(function () {
    console.log('Connection has been established successfully.');
})
    .catch(function (err) {
        console.error('Unable to connect to the database:', err);
    });


var Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
});

var Category = sequelize.define('Category', {
    category: Sequelize.STRING
});
Post.belongsTo(Category, { foreignKey: 'category' });


function initialize() {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function () {
            resolve()
        }).catch(function (err) {
            console.error(err);
            reject('unable to sync to DB')
        });
    })
}

function getAllPosts() {
    return new Promise((resolve, reject) => {
        Post.findAll().then(function (data) {
            resolve(data)
        }).catch(function (err) {
            console.error(err);
            reject('no results returned')
        });
    });
}

function getPublishedPosts() {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: { published: true }
        }).then(function (data) {
            resolve(data)
        }).catch(function (err) {
            console.error(err);
            reject('no results returned')
        });
    });
}

function getCategories() {
    return new Promise((resolve, reject) => {
        Category.findAll().then(function (data) {
            resolve(data)
        }).catch(function (err) {
            console.error(err);
            reject('no results returned')
        });
    });
}

function addPost(postData) {
    postData.published = (postData.published) ? true : false;
    for (var key in postData) {
        if (postData[key] === "")
            postData[key] = null;
    }
    postData.postDate = new Date();

    return new Promise((resolve, reject) => {
        Post.create(postData).then(function () {
            resolve()
        }).catch(function (err) {
            console.error(err);
            reject('unable to create post')
        })
    });
}

function addCategory(categoryData) {
    for (var key in categoryData) {
        if (categoryData[key] === "")
            categoryData[key] = null;
    }
    return new Promise((resolve, reject) => {
        Category.create(categoryData).then(function () {
            resolve()
        }).catch(function (err) {
            console.error(err);
            reject('unable to create category')
        })
    });
}

function getPostsByCategory(category_id) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: { category: category_id }
        }).then(function (data) {
            resolve(data)
        }).catch(function (err) {
            console.error(err);
            reject('no results returned')
        });
    });
}

function getPostsByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                postDate: { [gte]: new Date(minDateStr) }
            }
        }).then(function (data) {
            resolve(data)
        }).catch(function (err) {
            console.error(err);
            reject('no results returned')
        });
    });
}

function getPostById(id) {
    return new Promise((resolve, reject) => {
        Post.findAll({ where: { id: id } }).then(function (data) {
            resolve(data[0]);
        }).catch(function (err) {
            console.error(err);
            reject('no results returned')
        });
    });
}

function getPublishedPostsByCategory(category) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true,
                category: category
            }
        }).then(function (data) {
            resolve(data)
        }).catch(function (err) {
            console.error(err);
            reject('no results returned')
        });
    });
}

function deleteCategoryById(id) {
    return new Promise((resolve, reject) => {
        Category.destroy({ where: { id: id } })
            .then(function () {
                resolve("destroyed")
            }).catch(function (err) {
                console.error(err)
                reject("unable to delete category")
            })
    });
}

function deletePostById(id) {
    return new Promise((resolve, reject) => {
        Post.destroy({ where: { id: id } })
            .then(function () {
                resolve("destroyed")
            }).catch(function (err) {
                console.error(err)
                reject("unable to delete post")
            })
    });
}


module.exports = {
    initialize, getAllPosts, getPublishedPosts, getCategories, addPost, getPostsByCategory, getPostsByMinDate, getPostById, getPublishedPostsByCategory,
    addCategory, deleteCategoryById, deletePostById
};