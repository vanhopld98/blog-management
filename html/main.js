let URL = "http://localhost:8080/blogs";
let page = 0;
let count = 0;
let totalPage = 0;

getAll();


function clear() {
    $("#author").val("")
    $("#title").val("")
    $("#content").val("")
}

function getAll() {
    $.ajax({
        url: URL,
        type: 'GET',
        success: function (data) {
            let content = '<thead>\n ' +
                '<tr>\n' +
                '<th scope="col">Id</th>\n' +
                '<th scope="col">Author</th>\n' +
                '<th scope="col">Title</th>\n' +
                '<th scope="col">Content</th>\n' +
                '<th scope="col">Action</th>\n' +
                '</tr>' +
                '</thead>';
            for (let i = 0; i < data.content.length; i++) {
                content += getBlog(data.content[i])
            }
            totalPage = data.totalPages;
            $("#countPage").html(page + 1)
            $("#list").html(content);
        }
    })
}

function getBlog(blog) {
    return `
                <tr>
                    <th scope="row">${blog.id}</th>
                    <td>${blog.author}</td>
                    <td>${blog.title}</td>
                    <td>${blog.content}</td>
                    <td>
                        <button onclick="showEdit(${blog.id})" class="btn btn-primary">Update</button>
                        <button onclick="showDelete(${blog.id})" class="btn btn-outline-danger">Delete</button></td>
                </tr>`
}

function searchBlog() {
    let name = $("#form1").val();
    $.ajax({

        url: `${URL}?q=${name}`,
        type: 'GET',
        data: name,
        success: function (data) {

            let content = '<thead>\n ' +
                '<tr>\n' +
                '<th scope="col">Id</th>\n' +
                '<th scope="col">Author</th>\n' +
                '<th scope="col">Title</th>\n' +
                '<th scope="col">Content</th>\n' +
                '<th scope="col">Action</th>\n' +
                '</tr>' +
                '</thead>';
            for (let i = 0; i < data.content.length; i++) {
                content += getBlog(data.content[i])
            }


            $("#list").html(content);
        }
    })
}

function showEdit(id) {
    var myModal = new bootstrap.Modal(document.getElementById('updateModal'));
    myModal.show();
    $.ajax({
        url: URL + `/` + id,
        type: 'GET',
        success: function (data) {
            $("#blogAuthor").val(data.author)
            $("#blogTitle").val(data.title)
            $("#blogContent").val(data.content)
            $('#updateBlog').click(function () {
                update(id)
            });
        }
    })
}

function createBlog() {
    let author = $('#author').val();
    let title = $('#title').val();
    let content = $('#content').val();
    let newBlog = {
        author: author,
        title: title,
        content: content
    };

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        url: URL,
        data: JSON.stringify(newBlog),
        success: function () {
            getAll();
            clear();
        }
    });
    event.preventDefault();
}

function update(id) {
    let author = $("#blogAuthor").val();
    let title = $("#blogTitle").val();
    let content = $("#blogContent").val();
    let blogUpdate = {
        id: id,
        author: author,
        title: title,
        content: content
    };

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "PUT",
        url: URL + `/` + id,
        data: JSON.stringify(blogUpdate),
        success: getAll
    });
}

function showDelete(id) {
    let myModal = new bootstrap.Modal(document.getElementById('deleteBlog'));
    myModal.show();
    $.ajax({
        url: URL + `/` + id,
        type: 'GET',
        success: function (data) {
            $("#titleBlogDelete").html(data.title)
            $('#confirmDelete').click(function () {
                remove(id)
            });
        }
    });
}

function remove(id) {
    $.ajax({
        type: "DELETE",
        url: URL + `/${id}`,
        success: getAll
    });
}

function nextPage() {
    page++
    if(page === totalPage - 1 ) {
        $('#next-btn').prop('disabled', true);
    }
    $("#countPage").html(page + 1)
    $.ajax({
        type: "GET",
        url: URL + `?page=${page}`,
        success: function (data) {
            let content = '<thead>\n ' +
                '<tr>\n' +
                '<th scope="col">Id</th>\n' +
                '<th scope="col">Author</th>\n' +
                '<th scope="col">Title</th>\n' +
                '<th scope="col">Content</th>\n' +
                '<th scope="col">Action</th>\n' +
                '</tr>' +
                '</thead>';
            for (let i = 0; i < data.content.length; i++) {
                content += getBlog(data.content[i])
            }
            $("#list").html(content);
        }
    });
}

function previousPage() {
    if (page > 0) {
        page--;
        $("#next-btn").show();
    }
    if (page === 1) {
        $("#pre-btn").hide();
    }
    $("#countPage").html(page + 1)
    $.ajax({
        type: "GET",
        url: URL + `?page=${page}`,
        success: function (data) {
            let content = '<thead>\n ' +
                '<tr>\n' +
                '<th scope="col">Id</th>\n' +
                '<th scope="col">Author</th>\n' +
                '<th scope="col">Title</th>\n' +
                '<th scope="col">Content</th>\n' +
                '<th scope="col">Action</th>\n' +
                '</tr>' +
                '</thead>';
            for (let i = 0; i < data.content.length; i++) {
                content += getBlog(data.content[i])
            }
            $("#list").html(content);
        }
    });
}

$(document).ready(function () {
    $("#form1").keypress(function (event) {
        if (event.keyCode === 13) {
            $("#search").click();
        }
    });
    $(function () {
        $('#next-btn').onkeyup(function () {
            if (page === totalPage -1 ) {
                $('#next-btn').prop('disabled', true);
            } else {
                $('.enableOnInput').prop('disabled', false);
            }
        });
    });
})